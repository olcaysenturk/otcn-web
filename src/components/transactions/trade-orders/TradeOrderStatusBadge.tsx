"use client";

import { useI18n } from "@/lib/i18n/I18nProvider";
import { cn } from "@/lib/utils";

type TradeOrderStatus = "open" | "filled" | "canceled" | "partialFilled" | "transmissionError" | "unknown";
type TradeOrderStatusVariant = "table" | "detail";

const STATUS_LABEL_KEY: Record<Exclude<TradeOrderStatus, "unknown">, string> = {
  open: "tradeOrders.status.openOrder",
  filled: "tradeOrders.status.filledOrder",
  canceled: "tradeOrders.status.canceledOrder",
  partialFilled: "tradeOrders.status.partiallyFilledOrder",
  transmissionError: "tradeOrders.status.transmissionError",
};

const TABLE_STATUS_CLASS: Record<Exclude<TradeOrderStatus, "unknown">, string> = {
  open: "bg-blue-100 text-blue-600",
  filled: "bg-emerald-100 text-emerald-600",
  canceled: "bg-rose-100 text-rose-500",
  partialFilled: "bg-amber-100 text-amber-700",
  transmissionError: "bg-rose-100 text-rose-700",
};

const DETAIL_STATUS_CLASS: Record<Exclude<TradeOrderStatus, "unknown">, string> = {
  open: "bg-blue-50 text-blue-600 border-blue-300",
  filled: "bg-emerald-50 text-emerald-600 border-emerald-400",
  canceled: "bg-rose-50 text-rose-500 border-rose-300",
  partialFilled: "bg-amber-50 text-amber-700 border-amber-300",
  transmissionError: "bg-rose-50 text-rose-700 border-rose-300",
};

export function normalizeTradeOrderStatus(status?: string | number): TradeOrderStatus {
  const raw = String(status ?? "").toLowerCase();
  const compact = raw.replace(/[\s_-]/g, "");

  if (raw === "0" || compact === "openorder" || compact === "open") return "open";
  if (raw === "1" || compact === "filledorder" || compact === "filled") return "filled";
  if (raw === "2" || compact === "canceledorder" || compact === "cancelledorder" || compact === "canceled" || compact === "cancelled") return "canceled";
  if (raw === "3" || compact === "partialfilledorder" || compact === "partialfilled") return "partialFilled";
  if (raw === "9" || compact === "transmissionerror") return "transmissionError";

  return "unknown";
}

type TradeOrderStatusBadgeProps = {
  status?: string | number;
  variant?: TradeOrderStatusVariant;
  className?: string;
};

export function TradeOrderStatusBadge({ status, variant = "table", className }: TradeOrderStatusBadgeProps) {
  const { t } = useI18n();
  const normalized = normalizeTradeOrderStatus(status);

  if (normalized === "unknown") {
    return <span className={cn("text-sm text-slate-500", className)}>{status ?? "-"}</span>;
  }

  const label = t(STATUS_LABEL_KEY[normalized]);
  if (variant === "detail") {
    return (
      <span className={cn("inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold", DETAIL_STATUS_CLASS[normalized], className)}>
        {label}
      </span>
    );
  }

  return (
    <span className={cn("inline-flex rounded-full px-2 py-1 text-xs font-medium", TABLE_STATUS_CLASS[normalized], className)}>
      {label}
    </span>
  );
}
