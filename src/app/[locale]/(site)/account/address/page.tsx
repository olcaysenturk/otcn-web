"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ChevronDown, Plus, Search, Trash2 } from "lucide-react";

import { AccountHeader } from "@/components/account/AccountHeader";
import { AccountTableSkeleton } from "@/components/account/AccountSkeleton";
import { AccountTabs } from "@/components/account/AccountTabs";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { PageCard } from "@/components/ui/page-card";
import { Pagination } from "@/components/ui/pagination";
import { ResponsivePageWrapper } from "@/components/ui/responsive-page-wrapper";
import { SearchInput } from "@/components/ui/search-input";
import { Skeleton } from "@/components/ui/skeleton";
import { withLocale } from "@/lib/i18n/href";
import { getApiLocale } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { getCoinIconPath } from "@/lib/coinIcons";
import { useModalStore } from "@/stores/useModalStore";
import { deleteCryptoAddress, fetchCryptoAssets, getCryptoAddresses } from "@/services/crypto";
import type { CryptoAddress } from "@/types/crypto";
import { toast } from "sonner";

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
  {
    coin: "BNB",
    name: "BNB",
    label: "BEP20 Wallet",
    address: "0x3fA9...8D12",
    memo: "-",
    network: "BNB Smart Chain (BEP20)",
    icon: "/assets/coin-logo/BNB.svg",
  },
  {
    coin: "ETH",
    name: "ETH",
    label: "Main Wallet",
    address: "0xA21c...C53F",
    memo: "-",
    network: "Ethereum (ERC20)",
    icon: "/assets/coin-logo/ETH.svg",
  },
  {
    coin: "USDT",
    name: "USDT",
    label: "TRC20 Wallet",
    address: "TV9e...p4Km",
    memo: "-",
    network: "Tron (TRC20)",
    icon: "/assets/coin-logo/USDT.svg",
  },
  {
    coin: "TRX",
    name: "TRX",
    label: "TRON Wallet",
    address: "TAx8...mQp9",
    memo: "-",
    network: "Tron (TRC20)",
    icon: "/assets/coin-logo/TRX.svg",
  },
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
  const [showMobileSearch, setShowMobileSearch] = useState(false);
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

      const responses = await Promise.allSettled(
        symbols.map((symbol) => getCryptoAddresses(symbol, apiLocale)),
      );

      const merged = responses.flatMap((response) =>
        response.status === "fulfilled" ? response.value : [],
      );

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

    return allAddresses.filter((addr) =>
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
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const searchResults = useMemo(
    () =>
      filteredAddresses.slice(0, 5).map((item) => ({
        name: item.name,
        symbol: item.coin,
      })),
    [filteredAddresses],
  );
  const isAddressBookEmpty = hasLoaded && !isLoading && allAddresses.length === 0;
  const hasNoSearchResult = hasLoaded && !isLoading && allAddresses.length > 0 && filteredAddresses.length === 0;
  const desktopRows = isAddressBookEmpty ? EMPTY_STATE_MOCK_ROWS : pageItems;

  const handleOpenAddAddress = () => openModal("add-crypto-address", { onSuccess: loadAddresses });

  const onConfirmDelete = async () => {
    if (!addressToDelete) return;

    setIsDeleting(true);
    try {
      let deleteId = addressToDelete.id;

      if (!deleteId) {
        const whitelistRows = await getCryptoAddresses(addressToDelete.coin, apiLocale);
        const match = whitelistRows.find((row) =>
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

  return (
    <PageCard>
      <ResponsivePageWrapper>
        <div className="mb-6 flex items-center gap-3 bg-[#0F1415] p-4 text-white lg:hidden">
          <Link href={withLocale("/account", locale)} className="rounded p-1 hover:bg-white/10">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <span className="text-lg font-semibold">{t("account.address.title")}</span>
        </div>

        <AccountHeader
          title={t("accountHeader.title")}
          description={t("accountHeader.description")}
        />

        <div className="hidden lg:block">
          <AccountTabs active="address" />
        </div>

        <div className="rounded-[32px] border border-white/10 bg-[#1C2425] p-6 lg:p-8">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex w-full items-center gap-4 lg:w-auto">
              {showMobileSearch ? (
                <div className="flex w-full items-center gap-3 animate-in fade-in zoom-in-95 duration-200">
                  <SearchInput
                    placeholder={t("account.address.searchPlaceholder")}
                    results={searchResults}
                    className="w-full"
                    onSearch={setSearchQuery}
                  />
                  <button
                    onClick={() => {
                      setShowMobileSearch(false);
                      setSearchQuery("");
                    }}
                    className="whitespace-nowrap text-sm font-medium text-white"
                  >
                    {t("account.address.cancel")}
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-lg font-semibold text-white">{t("account.address.safeTitle")}</h2>
                  <span className="text-sm text-gray-500 lg:hidden">
                    {t("account.address.resultCount", { count: String(filteredAddresses.length) })}
                  </span>
                </>
              )}
            </div>
            <button
              onClick={handleOpenAddAddress}
              className="hidden h-9 items-center gap-1.5 rounded-full border border-[#25B88A] px-4 text-sm font-semibold text-[#25B88A] transition-colors hover:bg-emerald-500/10 lg:flex"
            >
              <Plus className="h-4 w-4" />
              {t("account.address.empty.action")}
            </button>
          </div>

          <div className="mb-6 hidden lg:block">
            <SearchInput
              placeholder={t("account.address.searchPlaceholder")}
              results={searchResults}
              className="w-[500px]"
              onSearch={setSearchQuery}
            />
          </div>

          {!showMobileSearch && !isAddressBookEmpty && (
            <div className="mb-6 flex items-center gap-3 lg:hidden">
              <button
                onClick={() => setShowMobileSearch(true)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-300"
              >
                <Search className="h-5 w-5" />
              </button>
              <button
                onClick={handleOpenAddAddress}
                className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full border border-[#25B88A] bg-transparent px-4 text-sm font-semibold text-[#25B88A] transition-colors hover:bg-emerald-500/10"
              >
                <Plus className="h-4 w-4" />
                {t("account.address.empty.action")}
              </button>
            </div>
          )}

          {isLoading ? (
            <>
              <div className="space-y-4 lg:hidden">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div key={idx} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <div className="mb-6 flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full bg-white/10" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-28 bg-white/10" />
                          <Skeleton className="h-3 w-16 bg-white/10" />
                        </div>
                      </div>
                      <Skeleton className="h-8 w-8 rounded-full bg-white/10" />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-3 w-12 bg-white/10" />
                        <Skeleton className="h-4 w-32 bg-white/10" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-3 w-12 bg-white/10" />
                        <Skeleton className="h-4 w-40 bg-white/10" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-3 w-16 bg-white/10" />
                        <Skeleton className="h-4 w-20 bg-white/10" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="hidden lg:block">
                <AccountTableSkeleton />
              </div>
            </>
          ) : (
            <>
              <div className="space-y-4 lg:hidden">
                {isAddressBookEmpty ? (
                  <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4 min-h-[540px]">
                    <div className="space-y-4 opacity-45 blur-[1.5px] pointer-events-none select-none">
                      {EMPTY_STATE_MOCK_ROWS.map((addr, idx) => (
                        <div key={`${addr.coin}-${idx}`} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                          <div className="mb-6 flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-white/10">
                                <Image src={addr.icon} alt={addr.coin} width={40} height={40} className="h-full w-full object-cover" />
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-base font-semibold text-white">{addr.name}</span>
                                <span className="text-sm text-gray-500">({addr.coin})</span>
                              </div>
                            </div>
                            <div className="h-8 w-8 rounded-full border border-red-500/30" />
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-500">{t("account.address.columns.label")}</span>
                              <span className="text-right text-sm font-medium text-white">{addr.label}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-500">{t("account.address.columns.address")}</span>
                              <span className="max-w-[200px] truncate text-right font-mono text-sm font-medium text-white">{addr.address}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-500">{t("account.address.columns.tag")}</span>
                              <span className="text-right text-sm font-medium text-white">{addr.memo}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0F1415]/70 px-6 text-center backdrop-blur-[2px]">
                      <Image
                        src="/assets/images/auth-logo.png"
                        alt="OTCN"
                        width={64}
                        height={64}
                        className="mb-4 h-16 w-16"
                      />
                      <h3 className="text-xl font-bold text-white">{t("account.address.empty.title")}</h3>
                      <p className="mx-auto mt-2 max-w-[300px] text-lg leading-[1.35] text-gray-400">
                        {t("account.address.empty.description")}
                      </p>
                      <button
                        type="button"
                        onClick={handleOpenAddAddress}
                        className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-[#C8FF00] px-6 text-sm font-semibold text-[#0F1415] transition-opacity hover:opacity-90"
                      >
                        {t("account.address.empty.action")}
                      </button>
                    </div>
                  </div>
                ) : (
                  pageItems.map((addr, idx) => (
                    <div key={`${addr.id ?? addr.address}-${idx}`} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                      <div className="mb-6 flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-white/10">
                            <Image src={addr.icon} alt={addr.coin} width={40} height={40} className="h-full w-full object-cover" />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-base font-semibold text-white">{addr.name}</span>
                            <span className="text-sm text-gray-500">({addr.coin})</span>
                          </div>
                        </div>
                        <button
                          onClick={() => setAddressToDelete(addr)}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-red-500/30 text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">{t("account.address.columns.label")}</span>
                          <span className="text-right text-sm font-medium text-white">{addr.label}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">{t("account.address.columns.address")}</span>
                          <span className="max-w-[200px] truncate text-right font-mono text-sm font-medium text-white">{addr.address}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">{t("account.address.columns.tag")}</span>
                          <span className="text-right text-sm font-medium text-white">{addr.memo}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="relative hidden min-h-[400px] overflow-x-auto lg:block">
                <table className="w-full min-w-[800px] border-separate border-spacing-y-2">
                  <thead>
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-400">{t("account.address.columns.coin")}</th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-400">{t("account.address.columns.label")}</th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-400">{t("account.address.columns.address")}</th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-400">{t("account.address.columns.tag")}</th>
                      <th className="px-6 py-4 text-right" />
                    </tr>
                  </thead>
                  <tbody className={isAddressBookEmpty ? "space-y-2 opacity-40 blur-[1px]" : "space-y-2"}>
                    {desktopRows.map((addr, idx) => (
                      <tr key={`${addr.id ?? addr.address}-${idx}`} className="group rounded-3xl border border-white/10 bg-white/5">
                        <td className="whitespace-nowrap px-6 py-4 first:rounded-l-2xl">
                          <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/10">
                              <Image src={addr.icon} alt={addr.coin} width={40} height={40} className="h-full w-full object-cover" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-white">{addr.name}</span>
                              <span className="text-xs uppercase text-gray-500">{addr.coin}</span>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-white">{addr.label}</td>
                        <td className="whitespace-nowrap px-6 py-4 font-mono text-sm font-medium text-white">{addr.address}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-white">{addr.memo}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-right last:rounded-r-2xl">
                          <button
                            onClick={() => setAddressToDelete(addr)}
                            disabled={isAddressBookEmpty}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-red-500/30 text-red-400 transition-colors hover:bg-red-500/10"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {hasNoSearchResult && (
                  <div className="py-16 text-center text-sm text-gray-400">{t("account.address.noRecords")}</div>
                )}

                {isAddressBookEmpty && (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-[24px] bg-[#0F1415]/70 backdrop-blur-[2px]">
                    <div className="pointer-events-auto flex max-w-[420px] flex-col items-center text-center">
                      <Image
                        src="/assets/images/auth-logo.png"
                        alt="OTCN"
                        width={84}
                        height={84}
                        className="mb-5 h-[84px] w-[84px]"
                      />
                      <h3 className="text-2xl font-bold text-white">{t("account.address.empty.title")}</h3>
                      <p className="mt-3 text-lg text-gray-400">
                        {t("account.address.empty.description")}
                      </p>
                      <button
                        type="button"
                        onClick={handleOpenAddAddress}
                        className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-[#C8FF00] px-7 text-sm font-semibold text-[#0F1415] transition-opacity hover:opacity-90"
                      >
                        {t("account.address.empty.action")}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {!isAddressBookEmpty && (
            <div className="mt-8 flex flex-col items-center justify-between gap-4 px-2 md:flex-row">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>{t("account.address.perPage")}</span>
              <div className="relative">
                <select className="cursor-pointer appearance-none bg-transparent pr-6 font-medium text-white focus:outline-none">
                  <option className="bg-[#1C2425]">{DEFAULT_PAGE_SIZE}</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
            </div>
          )}
        </div>
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
      </ResponsivePageWrapper>
    </PageCard>
  );
}
