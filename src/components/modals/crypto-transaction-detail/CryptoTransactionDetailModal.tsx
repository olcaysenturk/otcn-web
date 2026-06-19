"use client";

import type { ReactNode } from "react";
import { Copy, X } from "lucide-react";

import type { CryptoTransaction } from "@/components/transactions/deposit-withdraw/types";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { cn } from "@/lib/utils";
import { useModalStore } from "@/stores/useModalStore";
import { toast } from "sonner";

type CryptoTransactionDetailModalProps = {
  transaction?: CryptoTransaction;
};

export function CryptoTransactionDetailModal({ transaction }: CryptoTransactionDetailModalProps) {
  const { closeModal, isClosing } = useModalStore();
  const { t } = useI18n();

  const tx = transaction;

  const statusLabel = (status?: CryptoTransaction["status"]) => {
    if (status === "success") return t("transactions.filters.status.success");
    if (status === "pending") return t("transactions.filters.status.pending");
    if (status === "failed") return t("transactions.filters.status.failed");
    return t("transactions.filters.status.processing");
  };

  const statusPillClass =
    tx?.status === "success"
      ? "bg-emerald-50 text-emerald-600 border-emerald-400"
      : tx?.status === "pending"
        ? "bg-amber-50 text-amber-600 border-amber-400"
        : tx?.status === "failed"
          ? "bg-red-50 text-red-600 border-red-400"
          : "bg-blue-50 text-blue-600 border-blue-400";

  const display = (value?: string) => (value && value.trim() ? value : "-");
  const compact = (value?: string, head = 6, tail = 6) => {
    const raw = value?.trim();
    if (!raw) return "-";
    if (raw.length <= head + tail + 3) return raw;
    return `${raw.slice(0, head)}...${raw.slice(-tail)}`;
  };
  const copy = (value?: string) => {
    const raw = value?.trim();
    if (!raw || raw === "-") return;
    navigator.clipboard?.writeText(raw).then(
      () => toast.success(t("toast.copied")),
      () => toast.error(t("toast.copied")),
    );
  };

  return (
    <div
      onClick={closeModal}
      className="absolute inset-0 z-20 flex items-start justify-center overflow-auto p-4 md:items-start md:pt-3"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "relative z-20 flex h-[96vh] w-full max-w-[560px] flex-col overflow-hidden rounded-[28px] bg-[#5A36B6] shadow-2xl ring-1 ring-black/5 lg:ml-auto",
          isClosing ? "animate-slide-out-to-right" : "animate-slide-in-from-right"
        )}
      >
        <div className="relative flex items-center justify-between px-6 py-5 text-white">
          <h3 className="text-base font-semibold leading-none">{t("transactions.crypto.detailTitle")}</h3>
          <button
            type="button"
            onClick={closeModal}
            className="rounded-full p-2 text-white hover:bg-white/20 transition"
            aria-label={t("common.close")}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="m-1 flex-1 rounded-[24px] bg-white px-6 py-3">
          {!tx ? (
            <div className="pt-4 text-sm text-slate-500">{t("common.emptyState.description")}</div>
          ) : (
            <>
              <DetailRow
                label={t("transactions.table.headers.status")}
                value={
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold",
                      statusPillClass
                    )}
                  >
                    {statusLabel(tx.status)}
                  </span>
                }
              />
              <DetailRow label={t("transactions.table.headers.date")} value={display(tx.date)} />
              <DetailRow label={t("transactions.crypto.headers.asset")} value={display(tx.asset).toUpperCase()} />
              <DetailRow label={t("transactions.crypto.headers.network")} value={display(tx.network)} />
              <DetailRow label={t("transactions.crypto.headers.amount")} value={display(tx.amount)} />
              <DetailRow
                label={t("transactions.crypto.headers.address")}
                value={compact(tx.address)}
                copyValue={tx.address}
                onCopy={copy}
              />
              <DetailRow
                label={t("transactions.crypto.headers.txid")}
                value={compact(tx.txId)}
                copyValue={tx.txId}
                onCopy={copy}
              />
              {tx.hasDeclaration && (
                <DetailRow
                  label={t("transactions.crypto.declare")}
                  value={
                    <span className="inline-flex items-center rounded-full border border-emerald-400 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      {t("transactions.crypto.declared")}
                    </span>
                  }
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
  copyValue,
  onCopy,
}: {
  label: string;
  value: ReactNode;
  copyValue?: string;
  onCopy?: (value?: string) => void;
}) {
  const canCopy = Boolean(copyValue && copyValue.trim() && copyValue.trim() !== "-");

  return (
    <div className="grid grid-cols-[160px_1fr] items-center gap-4 border-b border-slate-200 py-4 last:border-b-0">
      <span className="text-sm text-slate-600">{label}</span>
      <div className="flex items-center justify-end gap-2 text-right text-sm font-medium text-slate-900">
        <span>{value}</span>
        {canCopy && onCopy && (
          <button
            type="button"
            onClick={() => onCopy(copyValue)}
            className="rounded p-1 text-slate-500 hover:bg-slate-100"
            aria-label="copy"
          >
            <Copy className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
