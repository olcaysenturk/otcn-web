"use client";

import type { UiRow } from "@/components/transactions/trade-orders/types";
import { TradeOrderStatusBadge } from "@/components/transactions/trade-orders/TradeOrderStatusBadge";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { cn } from "@/lib/utils";

import { DetailRow, TransactionDetailShell } from "../transaction-detail/TransactionDetailShell";

type TradeOrderDetailModalProps = {
  row?: UiRow;
  mode?: "orders" | "history";
};

export function TradeOrderDetailModal({ row, mode = "orders" }: TradeOrderDetailModalProps) {
  const { t } = useI18n();

  const display = (value?: string | number) => {
    if (value === undefined || value === null) return "-";
    const str = String(value).trim();
    return str ? str : "-";
  };

  return (
    <TransactionDetailShell title={t("tradeOrders.detailTitle")}>
      {!row ? (
        <div className="pt-4 text-sm text-[#788084]">{t("common.emptyState.description")}</div>
      ) : (
        <>
          {mode === "orders" && (
            <DetailRow
              label={t("tradeOrders.table.headers.status")}
              value={<TradeOrderStatusBadge status={row.status} variant="detail" />}
            />
          )}
          <DetailRow label={t("tradeOrders.table.headers.date")} value={`${display(row.date)} ${display(row.time)}`} />
          <DetailRow label={t("tradeOrders.table.headers.pair")} value={display(row.pair)} />
          {mode === "orders" && (
            <DetailRow label={t("tradeOrders.table.headers.type")} value={display(row.type)} />
          )}
          <DetailRow
            label={t("tradeOrders.table.headers.side")}
            value={
              <span className={cn("font-medium", row.side === "buy" ? "text-[#27E9A6]" : "text-[#FF4D6D]")}>
                {t(`tradeOrders.side.${row.side}`)}
              </span>
            }
          />
          <DetailRow label={t("tradeOrders.table.headers.amount")} value={display(row.amount)} />
          <DetailRow
            label={t("tradeOrders.table.headers.filled")}
            value={mode === "orders" ? display(row.filledAmount) : display(row.amount)}
          />
          <DetailRow label={t("tradeOrders.table.headers.price")} value={display(row.price)} />
          {mode === "history" && (
            <DetailRow label={t("tradeOrders.table.headers.fee")} value={display(row.fee)} />
          )}
          <DetailRow label={t("tradeOrders.table.headers.total")} value={display(row.total)} />
        </>
      )}
    </TransactionDetailShell>
  );
}
