"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useI18n } from "@/lib/i18n/I18nProvider";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { EmptyState } from "@/components/ui/EmptyState";
import { SearchInput } from "@/components/ui/search-input";
import { DataTable, type DataTableColumn } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { formatIBAN } from "@/lib/utils/bank";
import { deleteUserBank, getUserBanks } from "@/services/account";
import { useModalStore } from "@/stores/useModalStore";
import { UserBank } from "@/types/bank";

export default function AccountBankPage() {
  const { t } = useI18n();
  const { openModal } = useModalStore();

  const [banks, setBanks] = useState<UserBank[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [bankToDelete, setBankToDelete] = useState<number | null>(null);

  const fetchBanks = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getUserBanks();
      setBanks(data);
    } catch (error) {
      console.error("Error fetching banks:", error);
      toast.error(t("common.error"));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchBanks();
  }, [fetchBanks]);

  const onConfirmDelete = async () => {
    if (!bankToDelete) return;
    setIsDeleting(true);
    try {
      const result = await deleteUserBank(bankToDelete);
      if (result.success) {
        toast.success(t("common.success"));
        fetchBanks();
      } else {
        toast.error(result.message || t("common.error"));
      }
    } catch {
      toast.error(t("common.error"));
    } finally {
      setIsDeleting(false);
      setBankToDelete(null);
    }
  };

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return banks;
    return banks.filter(
      (b) =>
        b.bankName?.toLowerCase().includes(q) ||
        b.label.toLowerCase().includes(q) ||
        b.iban?.toLowerCase().includes(q),
    );
  }, [banks, query]);

  const columns: DataTableColumn<UserBank>[] = [
    {
      id: "bank",
      header: t("account.bank.columns.bank"),
      width: "22%",
      skeleton: (
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-full bg-white/10" />
          <Skeleton className="h-4 w-24 bg-white/10" />
        </div>
      ),
      cell: (row) => (
        <div className="flex items-center gap-3">
          {row.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={row.logoUrl}
              alt={row.bankName || row.label}
              className="h-8 w-8 rounded-full border border-white/10 bg-white object-contain"
            />
          ) : (
            <span
              className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold uppercase text-white"
              style={{ backgroundColor: row.color || "#7C3AED" }}
            >
              {row.bankName?.[0] || row.label?.[0]}
            </span>
          )}
          <span className="font-medium text-[#F4F7F8]">{row.bankName || row.label}</span>
        </div>
      ),
    },
    {
      id: "accountName",
      header: t("account.bank.columns.accountName"),
      width: "30%",
      cellClassName: "text-[#C5C9CC]",
      skeleton: <Skeleton className="h-4 w-48 bg-white/10" />,
      cell: (row) => <span className="line-clamp-2">{row.label}</span>,
    },
    {
      id: "taxId",
      header: t("account.bank.columns.taxId"),
      width: "16%",
      cellClassName: "text-[#C5C9CC]",
      skeleton: <Skeleton className="h-4 w-24 bg-white/10" />,
      cell: (row) => row.taxId || "-",
    },
    {
      id: "iban",
      header: t("account.bank.columns.iban"),
      width: "19%",
      skeleton: <Skeleton className="h-4 w-32 bg-white/10" />,
      cell: (row) => <span className="text-[#F4F7F8]">{formatIBAN(row.iban)}</span>,
    },
    {
      id: "action",
      header: "",
      width: "13%",
      align: "right",
      hideOnMobile: true,
      skeleton: (
        <div className="flex justify-end gap-2">
          <Skeleton className="h-9 w-9 rounded-full bg-white/10" />
          <Skeleton className="h-9 w-9 rounded-full bg-white/10" />
        </div>
      ),
      cell: (row) => (
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            aria-label={t("account.bank.actions.delete")}
            onClick={() => setBankToDelete(row.id)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#FF4D6D] text-[#FF4D6D] transition hover:bg-[#FF4D6D]/10"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label={t("account.corporateInfo.edit")}
            onClick={() => openModal("add-bank-account", { bank: row, onSuccess: fetchBanks })}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#3A4043] text-[#F4F7F8] transition hover:border-[#f54a14] hover:text-[#f54a14]"
          >
            <Pencil className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="rounded-[22px] bg-[#0E0F10] p-6 shadow-[0px_2px_8px_0.3px_rgba(58,64,67,0.2)]">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-medium text-[#F4F7F8]">{t("account.bank.title")}</h2>
        <button
          type="button"
          onClick={() => openModal("add-bank-account", { onSuccess: fetchBanks })}
          className="inline-flex items-center gap-1.5 rounded-full border border-[#27E9A6] px-4 py-2 text-xs font-bold text-[#27E9A6] transition hover:bg-[#27E9A6]/10"
        >
          <Plus className="h-4 w-4" />
          {t("account.bank.add")}
        </button>
      </div>

      <SearchInput
        value={query}
        onValueChange={setQuery}
        placeholder={t("account.bank.search")}
        className="mt-4 max-w-[500px]"
      />

      <div className="mt-6">
        <DataTable<UserBank>
          columns={columns}
          data={rows}
          isLoading={isLoading}
          skeletonRows={5}
          tableLayout="fixed"
          getRowId={(row, index) => `${row.id}-${index}`}
          rowClassName={() => "hover:[&>td]:bg-[#121516]"}
          empty={
            <EmptyState
              title={t("account.bank.noData")}
              description={t("account.bank.noDataDescription")}
            />
          }
        />
      </div>

      <ConfirmationModal
        isOpen={!!bankToDelete}
        onClose={() => setBankToDelete(null)}
        onConfirm={onConfirmDelete}
        title={t("account.bank.deleteModal.title")}
        description={t("account.bank.deleteModal.description")}
        confirmText={t("account.bank.deleteModal.confirm")}
        cancelText={t("account.bank.deleteModal.cancel")}
        isLoading={isDeleting}
      />
    </div>
  );
}
