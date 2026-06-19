import { parseISO } from "date-fns";

import { D } from "@/lib/math/decimal";
import { formatDecimalValue } from "@/lib/math/formatDecimal";
import type { OtcOrderItem } from "@/types/otc";

import type { UiRow } from "./types";

function parseOrderDate(value: unknown): Date {
  if (!value) return new Date();

  if (typeof value === "number") {
    const ts = value < 1_000_000_000_000 ? value * 1000 : value;
    const parsed = new Date(ts);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  }

  if (typeof value === "string") {
    const numeric = Number(value);
    if (!Number.isNaN(numeric)) {
      const ts = numeric < 1_000_000_000_000 ? numeric * 1000 : numeric;
      const parsed = new Date(ts);
      return isNaN(parsed.getTime()) ? new Date() : parsed;
    }

    const text = value.trim();
    const hasTimezone = /(?:Z|[+\-]\d{2}:\d{2})$/i.test(text);
    let parsed = parseISO(hasTimezone ? text : `${text}Z`);
    if (isNaN(parsed.getTime())) parsed = new Date(hasTimezone ? text : `${text}Z`);
    if (isNaN(parsed.getTime())) parsed = new Date(`${text}Z`);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  }

  const parsed = new Date(String(value));
  return isNaN(parsed.getTime()) ? new Date() : parsed;
}

export function mapOtcOrdersToUiRows(
  orders: OtcOrderItem[],
  intlLocale: string,
  timeZone: string,
): UiRow[] {
  const formatter = (value: string) => formatDecimalValue(D.parse(value), { minDecimals: 2 });

  return orders.map((row, idx) => {
    const created = parseOrderDate(row.createdDate ?? row.tradeDate);
    const qtyRaw = row.quantity ?? "0";
    const leftQtyRaw = row.leftQuantity ?? "0";
    const priceRaw = row.price ?? "0";
    const totalRaw = row.total ?? "0";
    const qty = D.parse(qtyRaw).num(8);
    const leftQty = D.parse(leftQtyRaw).num(8);
    const filled = qty > 0 ? Math.max(0, qty - leftQty) : 0;
    const percent = qty > 0 ? Math.max(0, Math.min(100, Math.round((filled / qty) * 100))) : 0;
    const sideRaw = row.side ?? row.orderSide;
    const sideIsBuy = String(sideRaw).toLowerCase() === "buy" || String(sideRaw) === "0";

    return {
      id: row.id ?? idx + 1,
      date: created.toLocaleDateString(intlLocale, { timeZone }),
      time: created.toLocaleTimeString(intlLocale, { hour: "2-digit", minute: "2-digit", timeZone }),
      pair: row.pairName || row.symbol || "-",
      type: row.type ? (row.type === "limit" ? "Limit" : "Market") : "-",
      side: sideIsBuy ? "buy" : "sell",
      amount: formatter(qtyRaw),
      price: formatter(priceRaw),
      filledAmount: formatter(filled.toString()),
      filledPercent: percent,
      total: formatter(totalRaw),
      trigger: "-",
      status: row.status,
    };
  });
}
