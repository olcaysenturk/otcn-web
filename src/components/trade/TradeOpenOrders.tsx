"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Trash2 } from "lucide-react";

import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { EmptyState } from "@/components/ui/EmptyState";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useI18n } from "@/lib/i18n/I18nProvider";
import {
  getApiLocale,
  getClientAppPreferences,
  getIntlLocale,
} from "@/lib/preferences/appPreferences";
import { cn } from "@/lib/utils";
import { cancelAllOtcOrders, cancelOtcOrder, fetchDashboardTransactions } from "@/services/otc";
import type { OtcOrderItem, UiPair } from "@/types/otc";
import { toast } from "sonner";

function isBuySide(side: string | number | undefined) {
  const s = String(side).toLowerCase();
  return s === "0" || s === "buy";
}

const CLOSED_ORDER_STATUSES = new Set([
  "cancelled",
  "canceled",
  "completed",
  "filled",
  "done",
  "closed",
]);

const OPEN_ORDER_STATUSES = new Set([
  "pending",
  "processing",
  "open",
  "partial",
  "partial_filled",
  "0",
  "1",
]);

function isOpenOrder(order: OtcOrderItem) {
  const s = String(order.status ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
  const compactStatus = s.replaceAll("_", "");
  const quantity = Number(order.quantity);
  const leftQuantity = Number(order.leftQuantity);

  if (CLOSED_ORDER_STATUSES.has(s) || CLOSED_ORDER_STATUSES.has(compactStatus)) return false;
  if (OPEN_ORDER_STATUSES.has(s) || OPEN_ORDER_STATUSES.has(compactStatus)) return true;

  // Fallback for payloads without reliable status text.
  if (!Number.isNaN(quantity) && !Number.isNaN(leftQuantity) && quantity > 0) {
    return leftQuantity > 0;
  }

  return false;
}

const TRANSACTION_STATUS = {
  pending: 0,
  processing: 1,
} as const;

export function TradeOpenOrders({
  refreshKey,
  symbol,
  allPairs = [],
}: {
  refreshKey?: number;
  symbol?: string;
  allPairs?: UiPair[];
}) {
  const { t, locale } = useI18n();
  const appPreferences = useMemo(() => getClientAppPreferences(locale), [locale]);
  const apiLocale = getApiLocale(appPreferences);
  const intlLocale = getIntlLocale(appPreferences);
  const timeZone = appPreferences.timezone;
  const [openOrders, setOpenOrders] = useState<OtcOrderItem[]>([]);
  const [openOrdersLoading, setOpenOrdersLoading] = useState(false);
  const [confirmState, setConfirmState] = useState<
    { type: "single"; orderId: number } | { type: "all" } | null
  >(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sideFilter, setSideFilter] = useState<"all" | "buy" | "sell">("all");

  useEffect(() => {
    let cancelled = false;

    const loadOpenOrders = async () => {
      setOpenOrdersLoading(true);
      try {
        const processingRes = await fetchDashboardTransactions(apiLocale, {
          page: 1,
          limit: 200,
          status: TRANSACTION_STATUS.processing,
        });
        const pendingRes = await fetchDashboardTransactions(apiLocale, {
          page: 1,
          limit: 200,
          status: TRANSACTION_STATUS.pending,
        });
        if (!cancelled) {
          const mergedItems = [...(processingRes?.items ?? []), ...(pendingRes?.items ?? [])];
          const uniqueItems = mergedItems.filter(
            (order, index, arr) => arr.findIndex((x) => x.id === order.id) === index,
          );
          let items = uniqueItems.filter((order) => isOpenOrder(order));
          if (symbol) {
            items = items.filter((order) => order.symbol === symbol);
          }
          setOpenOrders(items);
        }
      } finally {
        if (!cancelled) setOpenOrdersLoading(false);
      }
    };

    loadOpenOrders();

    return () => {
      cancelled = true;
    };
  }, [apiLocale, refreshKey, symbol]);

  const handleCancelClick = (id: number) => {
    setConfirmState({ type: "single", orderId: id });
  };

  const handleCancelClose = () => {
    if (isCancelling) return;
    setConfirmState(null);
  };

  const handleConfirmCancel = async () => {
    if (!confirmState) return;
    setIsCancelling(true);
    try {
      if (confirmState.type === "single") {
        const res = await cancelOtcOrder(apiLocale, confirmState.orderId);
        if (res?.ok) {
          setOpenOrders((prev) =>
            prev.filter((order) => order.id !== confirmState.orderId),
          );
          toast.success(t("tradeOrders.cancelModal.cancelSuccess"));
        } else {
          toast.error(t("common.error"));
        }
      } else {
        const idsToCancel = filteredOrders
          .map((order) => order.id)
          .filter((id): id is number => typeof id === "number");
        if (idsToCancel.length === 0) return;

        const res = await cancelAllOtcOrders(apiLocale, idsToCancel);
        if (res?.ok) {
          setOpenOrders((prev) =>
            prev.filter((order) => typeof order.id !== "number" || !idsToCancel.includes(order.id)),
          );
        }
      }
    } finally {
      setIsCancelling(false);
      setConfirmState(null);
    }
  };

  const filteredOrders = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return openOrders.filter((order) => {
      const pairInfo = allPairs.find((p) => p.value === order.symbol);
      const base = (pairInfo?.base || order.symbol || "").toLowerCase();
      const quote = (pairInfo?.quote || "").toLowerCase();
      const symbolRaw = (order.symbol || "").toLowerCase();
      const pairText = `${base}/${quote}`.toLowerCase();

      const sideMatched =
        sideFilter === "all" ||
        (sideFilter === "buy" && isBuySide(order.side)) ||
        (sideFilter === "sell" && !isBuySide(order.side));

      const searchMatched =
        !q ||
        base.includes(q) ||
        quote.includes(q) ||
        symbolRaw.includes(q) ||
        pairText.includes(q);

      return sideMatched && searchMatched;
    });
  }, [allPairs, openOrders, searchQuery, sideFilter]);

  const formatDate = (raw: number | string | undefined) => {
    if (!raw) return { date: "-", time: "-" };
    let date: Date;

    if (typeof raw === "number") {
      const ts = raw < 1_000_000_000_000 ? raw * 1000 : raw;
      date = new Date(ts);
    } else {
      const numeric = Number(raw);
      if (!Number.isNaN(numeric)) {
        const ts = numeric < 1_000_000_000_000 ? numeric * 1000 : numeric;
        date = new Date(ts);
      } else {
        const rawText = raw.trim();
        const hasTimezone = /(?:Z|[+\-]\d{2}:\d{2})$/i.test(rawText);
        date = new Date(hasTimezone ? rawText : `${rawText}Z`);
      }
    }

    if (Number.isNaN(date.getTime())) return { date: "-", time: "-" };

    return {
      date: date.toLocaleDateString(intlLocale, { timeZone }),
      time: date.toLocaleTimeString(intlLocale, {
        hour: "2-digit",
        minute: "2-digit",
        timeZone,
      }),
    };
  };

  const formatNumber = (raw: string | number | undefined, minDecimals = 2, maxDecimals = 8) => {
    if (raw === undefined || raw === null) return "-";
    const value = Number(raw);
    if (!Number.isFinite(value)) return String(raw);
    return new Intl.NumberFormat(intlLocale, {
      minimumFractionDigits: minDecimals,
      maximumFractionDigits: maxDecimals,
    }).format(value);
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-[0_20px_60px_rgba(31,14,70,0.08)] md:rounded-4xl md:p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">{t("tradeOrders.openOrdersTitle")}</h2>
        <span className="text-sm text-slate-400">{filteredOrders.length}</span>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <div className="flex flex-1 w-full md:max-w-[300px] items-center gap-2 rounded-full border border-slate-100 bg-white px-4 py-2.5 text-sm text-slate-400">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("common.actions.search")}
            className="w-full bg-transparent text-sm text-slate-700 outline-none"
          />
        </div>
        <Select
          value={sideFilter}
          onValueChange={(value) => setSideFilter(value as "all" | "buy" | "sell")}
        >
          <SelectTrigger className="h-[42px] w-auto min-w-28 rounded-full border border-slate-100 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-none">
            <SelectValue placeholder={t("common.actions.filter")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("common.actions.filter")}</SelectItem>
            <SelectItem value="buy">{t("tradeOrders.side.buy")}</SelectItem>
            <SelectItem value="sell">{t("tradeOrders.side.sell")}</SelectItem>
          </SelectContent>
        </Select>
        <button
          type="button"
          onClick={() => setConfirmState({ type: "all" })}
          disabled={filteredOrders.length === 0 || isCancelling}
          className="ml-auto hidden text-sm font-semibold text-slate-500 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 md:block"
        >
          {t("tradeOrders.actions.clearAll")}
        </button>
      </div>

      <div className="mt-4 max-h-[800px] overflow-scroll ">
        {/* Desktop Header */}
        <div className="hidden md:grid grid-cols-8 items-center px-4 text-xs font-medium text-gray-steel">
          <span>{t("tradeOrders.table.headers.date")}</span>
          <span>{t("tradeOrders.table.headers.pair")}</span>
          <span>{t("tradeOrders.table.headers.side")}</span>
          <span>{t("tradeOrders.table.headers.amount")}</span>
          <span>{t("tradeOrders.table.headers.price")}</span>
          <span>{t("tradeOrders.table.headers.filled")}</span>
          <span className="text-right">{t("tradeOrders.table.headers.total")}</span>
          <span />
        </div>

        <div className="mt-3 max-h-130 space-y-3 md:overflow-y-auto pr-2">
          {filteredOrders.map((row) => {
            const pairInfo = allPairs.find((p) => p.value === row.symbol);
            const base = pairInfo?.base || row.symbol || "-";
            const quote = pairInfo?.quote || "";
            const created = formatDate(row.createdDate);
            const qty = Number(row.quantity);
            const leftQty = Number(row.leftQuantity);
            const filled = qty > 0 ? Math.max(0, qty - leftQty) : 0;
            const percent =
              qty > 0
                ? Math.max(0, Math.min(100, Math.round((filled / qty) * 100)))
                : 0;
            const sideLabel = isBuySide(row.side) ? t("tradeOrders.side.buy") : t("tradeOrders.side.sell");
            const sideColor = isBuySide(row.side) ? "text-emerald-600" : "text-rose-500";

            return (
              <div key={row.id}>
                {/* Desktop Row */}
                <div className="hidden md:grid grid-cols-8 items-center rounded-full border border-slate-200 bg-white px-4 py-4 text-xs text-slate-900">
                  <div className="flex flex-col">
                    <span className="font-medium">{created.date}</span>
                    <span className="text-xs text-slate-500">{created.time}</span>
                  </div>
                  <span className="font-medium">{base}/{quote}</span>
                  <span className={cn("font-medium", sideColor)}>{sideLabel}</span>
                  <span>{formatNumber(row.quantity, 2, 8)}</span>
                  <span>{formatNumber(row.price, 2, 8)}</span>
                  <div className="flex items-center gap-2">
                    <span>%{percent}</span>
                    <div className="h-2 w-10 rounded-full bg-slate-200">
                      <div className="h-2 rounded-full bg-violet-500" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                  <span className="text-right">{formatNumber(row.total, 2, 8)}</span>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        if (typeof row.id === "number") handleCancelClick(row.id);
                      }}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-rose-300 text-rose-500 hover:bg-rose-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Mobile Card */}
                <div className="grid md:hidden gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-xs text-slate-900 shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900">{created.date}</span>
                      <span className="text-xs text-slate-400">{created.time}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (typeof row.id === "number") handleCancelClick(row.id);
                      }}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-rose-100 bg-rose-50/30 text-rose-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-4 pt-1">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">{t("tradeOrders.table.headers.pair")}</span>
                      <span className="font-bold text-slate-900">{base}/{quote}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">{t("tradeOrders.table.headers.type")}</span>
                      <span className="font-bold text-slate-900">{t("tradeOrders.filters.typeOptions.limit")}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">{t("tradeOrders.table.headers.side")}</span>
                      <span className={cn("font-bold", sideColor)}>{sideLabel}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">{t("tradeOrders.table.headers.amount")}</span>
                      <span className="font-bold text-slate-900">{formatNumber(row.quantity, 2, 8)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">{t("tradeOrders.table.headers.price")}</span>
                      <span className="font-bold text-slate-900">{formatNumber(row.price, 2, 8)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">{t("tradeOrders.table.headers.filled")}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">%{percent}</span>
                        <div className="h-2 w-16 rounded-full bg-slate-100">
                          <div className="h-2 rounded-full bg-violet-500" style={{ width: `${percent}%` }} />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">{t("tradeOrders.table.headers.total")}</span>
                      <span className="font-bold text-slate-900">{formatNumber(row.total, 2, 8)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">{t("tradeOrders.table.headers.trigger")}</span>
                      <span className="font-bold text-slate-900">{formatNumber(row.price, 2, 8)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {!openOrdersLoading && filteredOrders.length === 0 && (
          <EmptyState
            title={t("common.emptyState.title")}
            description={t("common.emptyState.description")}
            className="mt-6"
          />
        )}
      </div>

      <ConfirmationModal
        isOpen={!!confirmState}
        title={
          confirmState?.type === "all"
            ? t("tradeOrders.cancelModal.clearAllTitle")
            : t("tradeOrders.cancelModal.title")
        }
        onClose={handleCancelClose}
        onConfirm={handleConfirmCancel}
        confirmText={
          isCancelling
            ? t("tradeOrders.cancelModal.processing")
            : confirmState?.type === "all"
              ? t("tradeOrders.cancelModal.clearAllConfirm")
              : t("tradeOrders.cancelModal.confirm")
        }
        cancelText={t("tradeOrders.cancelModal.cancel")}
        description={
          confirmState?.type === "all"
            ? t("tradeOrders.cancelModal.clearAllDescription")
            : t("tradeOrders.cancelModal.description")
        }
        isConfirmDisabled={isCancelling}
      />
    </div>
  );
}
