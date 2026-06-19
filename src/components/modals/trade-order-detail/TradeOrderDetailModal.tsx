"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";

import type { UiRow } from "@/components/transactions/trade-orders/types";
import { TradeOrderStatusBadge } from "@/components/transactions/trade-orders/TradeOrderStatusBadge";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { cn } from "@/lib/utils";
import { useModalStore } from "@/stores/useModalStore";

type TradeOrderDetailModalProps = {
  row?: UiRow;
  mode?: "orders" | "history";
};

export function TradeOrderDetailModal({ row, mode = "orders" }: TradeOrderDetailModalProps) {
  const { closeModal, isClosing } = useModalStore();
  const { t } = useI18n();

  const display = (value?: string | number) => {
    if (value === undefined || value === null) return "-";
    const str = String(value).trim();
    return str ? str : "-";
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
          <h3 className="text-base font-semibold leading-none">{t("tradeOrders.detailTitle")}</h3>
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
          {!row ? (
            <div className="pt-4 text-sm text-slate-500">{t("common.emptyState.description")}</div>
          ) : (
            <>
              {mode === "orders" && (
                <DetailRow
                  label={t("tradeOrders.table.headers.status")}
                  value={
                    <TradeOrderStatusBadge status={row.status} variant="detail" />
                  }
                />
              )}
              <DetailRow label={t("tradeOrders.table.headers.date")} value={`${display(row.date)} ${display(row.time)}`} />
              <DetailRow label={t("tradeOrders.table.headers.pair")} value={display(row.pair)} />
              {mode === "orders" && <DetailRow label={t("tradeOrders.table.headers.type")} value={display(row.type)} />}
              <DetailRow label={t("tradeOrders.table.headers.side")} value={t(`tradeOrders.side.${row.side}`)} />
              <DetailRow label={t("tradeOrders.table.headers.amount")} value={display(row.amount)} />
              <DetailRow label={t("tradeOrders.table.headers.filled")} value={mode === "orders" ? display(row.filledAmount) : display(row.amount)} />
              <DetailRow label={t("tradeOrders.table.headers.price")} value={display(row.price)} />
              {mode === "history" && <DetailRow label={t("tradeOrders.table.headers.fee")} value={"-"} />}
              <DetailRow label={t("tradeOrders.table.headers.total")} value={display(row.total)} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="grid grid-cols-[160px_1fr] items-center gap-4 border-b border-slate-200 py-4 last:border-b-0">
      <span className="text-sm text-slate-600">{label}</span>
      <div className="text-right text-sm font-medium text-slate-900">{value}</div>
    </div>
  );
}
