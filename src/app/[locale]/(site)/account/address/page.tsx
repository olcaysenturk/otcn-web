"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ChevronDown, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/pagination";
import { DataTable, type DataTableColumn } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { getApiLocale } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { getCoinIconPath } from "@/lib/coinIcons";
import { useModalStore } from "@/stores/useModalStore";
import { deleteCryptoAddress, fetchCryptoAssets, getCryptoAddresses } from "@/services/crypto";
import type { CryptoAddress } from "@/types/crypto";

type AddressRow = {
  id?: number;
  coin: string;
  name: string;
  label: string;
  address: string;
  memo: string;
  network: string;
  icon: string;
};

const DEFAULT_PAGE_SIZE = 8;
const EMPTY_STATE_MOCK_ROWS: AddressRow[] = [
  { coin: "BNB", name: "BNB", label: "BEP20 Wallet", address: "0x3fA9...8D12", memo: "-", network: "BNB Smart Chain (BEP20)", icon: "/assets/coin-logo/BNB.svg" },
  { coin: "ETH", name: "ETH", label: "Main Wallet", address: "0xA21c...C53F", memo: "-", network: "Ethereum (ERC20)", icon: "/assets/coin-logo/ETH.svg" },
  { coin: "USDT", name: "USDT", label: "TRC20 Wallet", address: "TV9e...p4Km", memo: "-", network: "Tron (TRC20)", icon: "/assets/coin-logo/USDT.svg" },
  { coin: "TRX", name: "TRX", label: "TRON Wallet", address: "TAx8...mQp9", memo: "-", network: "Tron (TRC20)", icon: "/assets/coin-logo/TRX.svg" },
];

function toAddressRows(items: CryptoAddress[]): AddressRow[] {
  return items.map((item) => {
    const symbol = (item.assetSymbol || "").toUpperCase();
    return {
      id: item.id,
      coin: symbol || "-",
      name: symbol || "-",
      label: item.name || `${symbol || "-"} - ${item.networkName || "-"}`,
      address: item.address || "-",
      memo: "-",
      network: item.networkName || "-",
      icon: getCoinIconPath(symbol),
    };
  });
}

export default function AccountAddressPage() {
  const { t, locale } = useI18n();
  const { openModal } = useModalStore();
  const apiLocale = getApiLocale(locale);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [allAddresses, setAllAddresses] = useState<AddressRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<AddressRow | null>(null);

  const loadAddresses = useCallback(async () => {
    setIsLoading(true);
    try {
      const assets = await fetchCryptoAssets(apiLocale);
      const symbols = Array.from(
        new Set(
          (assets ?? [])
            .map((asset) => asset.assetSymbol?.toUpperCase())
            .filter((symbol): symbol is string => Boolean(symbol)),
        ),
      );

      const responses = await Promise.allSettled(symbols.map((symbol) => getCryptoAddresses(symbol, apiLocale)));
      const merged = responses.flatMap((response) => (response.status === "fulfilled" ? response.value : []));

      const uniqueRows = Array.from(
        new Map(
          toAddressRows(merged).map((row) => [
            row.id ? `id-${row.id}` : `${row.coin}-${row.network}-${row.address}`.toLowerCase(),
            row,
          ]),
        ).values(),
      );

      setAllAddresses(uniqueRows);
    } catch (error) {
      console.error("Address list could not be loaded:", error);
      setAllAddresses([]);
    } finally {
      setIsLoading(false);
      setHasLoaded(true);
    }
  }, [apiLocale]);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  const filteredAddresses = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return allAddresses;
    return allAddresses.filter(
      (addr) =>
        addr.name.toLowerCase().includes(q) ||
        addr.coin.toLowerCase().includes(q) ||
        addr.network.toLowerCase().includes(q) ||
        addr.address.toLowerCase().includes(q),
    );
  }, [allAddresses, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredAddresses.length / DEFAULT_PAGE_SIZE));
  const pageStart = (currentPage - 1) * DEFAULT_PAGE_SIZE;
  const pageItems = filteredAddresses.slice(pageStart, pageStart + DEFAULT_PAGE_SIZE);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const isAddressBookEmpty = hasLoaded && !isLoading && allAddresses.length === 0;
  const tableData = isAddressBookEmpty ? EMPTY_STATE_MOCK_ROWS : pageItems;

  const handleOpenAddAddress = () => openModal("add-crypto-address", { onSuccess: loadAddresses });

  const onConfirmDelete = async () => {
    if (!addressToDelete) return;
    setIsDeleting(true);
    try {
      let deleteId = addressToDelete.id;
      if (!deleteId) {
        const whitelistRows = await getCryptoAddresses(addressToDelete.coin, apiLocale);
        const match = whitelistRows.find(
          (row) =>
            row.address?.trim().toLowerCase() === addressToDelete.address.trim().toLowerCase() &&
            row.networkName?.trim().toLowerCase() === addressToDelete.network.trim().toLowerCase(),
        );
        deleteId = match?.id;
      }
      if (!deleteId) {
        toast.error(t("common.error"));
        return;
      }
      const result = await deleteCryptoAddress(deleteId);
      if (result.success) {
        toast.success(t("common.success"));
        await loadAddresses();
      } else {
        toast.error(result.message || t("common.error"));
      }
    } catch {
      toast.error(t("common.error"));
    } finally {
      setIsDeleting(false);
      setAddressToDelete(null);
    }
  };

  const columns: DataTableColumn<AddressRow>[] = [
    {
      id: "coin",
      header: t("account.address.columns.coin"),
      width: "24%",
      skeleton: (
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-full bg-white/10" />
          <Skeleton className="h-4 w-20 bg-white/10" />
        </div>
      ),
      cell: (row) => (
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/10">
            <Image src={row.icon} alt={row.coin} width={32} height={32} className="h-full w-full object-cover" />
          </span>
          <span className="flex items-baseline gap-1">
            <span className="font-medium text-[#F4F7F8]">{row.name}</span>
            <span className="text-xs text-[#C5C9CC]">({row.coin})</span>
          </span>
        </div>
      ),
    },
    {
      id: "label",
      header: t("account.address.columns.label"),
      width: "22%",
      cellClassName: "text-[#F4F7F8]",
      skeleton: <Skeleton className="h-4 w-32 bg-white/10" />,
      cell: (row) => <span className="line-clamp-2">{row.label}</span>,
    },
    {
      id: "address",
      header: t("account.address.columns.address"),
      width: "28%",
      cellClassName: "text-[#F4F7F8]",
      skeleton: <Skeleton className="h-4 w-40 bg-white/10" />,
      cell: (row) => <span className="block truncate">{row.address}</span>,
    },
    {
      id: "memo",
      header: t("account.address.columns.tag"),
      width: "16%",
      cellClassName: "text-[#F4F7F8]",
      skeleton: <Skeleton className="h-4 w-16 bg-white/10" />,
      cell: (row) => row.memo,
    },
    {
      id: "action",
      header: "",
      width: "10%",
      align: "right",
      hideOnMobile: true,
      skeleton: (
        <div className="flex justify-end">
          <Skeleton className="h-9 w-9 rounded-full bg-white/10" />
        </div>
      ),
      cell: (row) => (
        <div className="flex justify-end">
          <button
            type="button"
            aria-label={t("account.bank.actions.delete")}
            onClick={() => setAddressToDelete(row)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#FF4D6D] text-[#FF4D6D] transition hover:bg-[#FF4D6D]/10"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="rounded-[22px] bg-[#0E0F10] p-6 shadow-[0px_2px_8px_0.3px_rgba(58,64,67,0.2)]">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-medium text-[#F4F7F8]">{t("account.address.safeTitle")}</h2>
        <button
          type="button"
          onClick={handleOpenAddAddress}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#27E9A6] px-4 py-2 text-xs font-bold text-[#27E9A6] transition hover:bg-[#27E9A6]/10"
        >
          <Plus className="h-4 w-4" />
          {t("account.address.add")}
        </button>
      </div>

      <div className="relative mt-4 w-full max-w-[500px]">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#5E666A]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t("account.address.searchPlaceholder")}
          className="h-10 w-full rounded-[24px] border border-[#3A4043] bg-[#0E0F10] pl-10 pr-3 text-sm text-[#F4F7F8] outline-none transition placeholder:text-[#5E666A] focus:border-[#5E666A]"
        />
      </div>

      <div className="relative mt-6">
        <div className={isAddressBookEmpty ? "pointer-events-none select-none opacity-40 blur-[3px]" : undefined}>
          <DataTable<AddressRow>
            columns={columns}
            data={tableData}
            isLoading={isLoading}
            skeletonRows={5}
            tableLayout="fixed"
            getRowId={(row, index) => (row.id ? `id-${row.id}` : `${row.coin}-${row.address}-${index}`)}
            rowClassName={() => "hover:[&>td]:bg-[#121516]"}
            empty={<EmptyState title={t("account.address.empty.title")} description={t("account.address.empty.description")} />}
          />
        </div>

        {isAddressBookEmpty && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
            <h3 className="text-2xl font-bold text-[#F4F7F8]">{t("account.address.empty.title")}</h3>
            <p className="mx-auto mt-2 max-w-[431px] text-lg text-[#C5C9CC]">{t("account.address.empty.description")}</p>
            <button
              type="button"
              onClick={handleOpenAddAddress}
              className="mt-4 inline-flex items-center gap-1.5 rounded-[14px] bg-[#C7F022] px-5 py-3 text-sm font-bold text-[#0E0F10] transition hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              {t("account.address.empty.action")}
            </button>
          </div>
        )}
      </div>

      {!isAddressBookEmpty && !isLoading && filteredAddresses.length > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-[#5E666A]">
            <span>{t("account.address.perPage")}</span>
            <span className="text-[#F4F7F8]">8</span>
            <ChevronDown className="h-4 w-4" />
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}

      <ConfirmationModal
        isOpen={!!addressToDelete}
        onClose={() => setAddressToDelete(null)}
        onConfirm={onConfirmDelete}
        title={t("account.address.deleteModal.title")}
        description={t("account.address.deleteModal.description")}
        confirmText={t("account.address.deleteModal.confirm")}
        cancelText={t("account.address.deleteModal.cancel")}
        isLoading={isDeleting}
      />
    </div>
  );
}
