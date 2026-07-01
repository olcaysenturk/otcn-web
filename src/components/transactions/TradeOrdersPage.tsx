"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ResponsiveTimeFilter } from "@/components/transactions/ResponsiveTimeFilter";
import { DateRange } from "react-day-picker";
import { format, subDays } from "date-fns";
import { useI18n } from "@/lib/i18n/I18nProvider";
import {
  getApiLocale,
  getClientAppPreferences,
  getDateFnsLocale,
  getIntlLocale,
} from "@/lib/preferences/appPreferences";
import { fetchDashboardTransactions, fetchOtcHistory, fetchOtcTrades } from "@/services/otc";
import { getSession } from "@/lib/api/session";
import type { OtcOrderItem } from "@/types/otc";
import { toast } from "sonner";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { cancelOtcOrder } from "@/services/otc";
import { cn } from "@/lib/utils";
import { useModalStore } from "@/stores/useModalStore";
import { TradeOrderStatusBadge } from "./trade-orders/TradeOrderStatusBadge";
import { UiRow } from "./trade-orders/types";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TransactionsPageShell, TransactionsTableCard, TransactionsTableFooter } from "./TransactionsLayout";
import { resolveTimeRange, type SharedTimeFilterValue } from "./timeRange";
import { TradeOrdersTabPanel } from "./trade-orders/TradeOrdersTabPanel";
import { mapOtcOrdersToUiRows } from "./trade-orders/mappers";
import { MOCK_TRADE_ROWS } from "./trade-orders/mockData";
import { TransactionsResponsiveFilter } from "./TransactionsResponsiveFilter";

// ⚠️ TEMPORARY DEMO FLAG — when true the tabs show mock rows (see ./trade-orders/mockData).
// Set to false (and remove the mock block below) once the API returns real data.
const USE_TRADE_MOCK = true;

const DEFAULT_PAGE_SIZE = 8;
const TRANSACTION_STATUS = {
  open: 0,
  filled: 1,
  canceled: 2,
  partialFilled: 3,
  transmissionError: 9,
} as const;

export function TradeOrdersPage() {
  const { t, locale } = useI18n();
  const searchParams = useSearchParams();
  const router = useRouter();
  const openModal = useModalStore((state) => state.openModal);

  const currentTab = searchParams.get("tab") as "open" | "orders" | "history" || "open";
  const tabParam = (searchParams.get("tab") as "open" | "orders" | "history") || "open";
  const appPreferences = useMemo(() => getClientAppPreferences(locale), [locale]);
  const apiLocale = getApiLocale(appPreferences);
  const intlLocale = getIntlLocale(appPreferences);
  const timeZone = appPreferences.timezone;
  const [tab, setTab] = useState<"open" | "orders" | "history">(currentTab);
  // See DepositWithdrawPage: keeps the URL-sync effect from reverting an
  // in-flight tab click while router.push() lags (prod-only skeleton flash).
  const tabRef = useRef<"open" | "orders" | "history">(currentTab);
  const [mounted, setMounted] = useState(false);
  const [orders, setOrders] = useState<OtcOrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelOrderId, setCancelOrderId] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const [timeFilter, setTimeFilter] = useState<SharedTimeFilterValue>("last30");
  const [baseFilter, setBaseFilter] = useState("all");
  const [quoteFilter, setQuoteFilter] = useState("all");
  const [currencyFilter, setCurrencyFilter] = useState("TRY");

  const today = useMemo(() => new Date(), []);
  const defaultFrom = useMemo(() => subDays(today, 2), [today]);

  const [appliedRange, setAppliedRange] = useState<DateRange | undefined>({
    from: defaultFrom,
    to: today,
  });
  const [draftRange, setDraftRange] = useState<DateRange | undefined>({
    from: defaultFrom,
    to: today,
  });
  const resetFiltersToDefault = useCallback(() => {
    setTimeFilter("last30");
    setAppliedRange({
      from: defaultFrom,
      to: today,
    });
    setDraftRange({
      from: defaultFrom,
      to: today,
    });
    setBaseFilter("all");
    setQuoteFilter("all");
    setCurrencyFilter("TRY");
    setPage(1);
    setRefreshKey((prev) => prev + 1);
  }, [defaultFrom, today]);
  const dateFnsLocale = getDateFnsLocale(appPreferences);
  const formatRangeDate = (date: Date) => format(date, "P", { locale: dateFnsLocale });
  const appliedFromTs = appliedRange?.from?.getTime();
  const appliedToTs = appliedRange?.to?.getTime();

  const rangeSummary =
    draftRange?.from && draftRange?.to
      ? `${formatRangeDate(draftRange.from)} - ${formatRangeDate(draftRange.to)}`
      : t("transactions.filters.time.customRange");

  const handleApplyRange = () => {
    if (!draftRange?.from || !draftRange?.to) return;
    setAppliedRange(draftRange);
    setPage(1);
    setRefreshKey((prev) => prev + 1);
    setTimeFilter("custom");
  };

  const handleCancelRange = () => {
    setDraftRange(appliedRange);
    setTimeFilter("last30");
  };

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      setLoading(true);

      // ⚠️ TEMPORARY DEMO MOCK — shows the skeleton briefly, then mock rows.
      // Remove this block (and ./trade-orders/mockData) once the API is wired.
      if (USE_TRADE_MOCK) {
        await new Promise((resolve) => setTimeout(resolve, 900));
        if (!cancelled) {
          setTotalPages(1);
          setLoading(false);
        }
        return;
      }

      try {
        const { from, to } = resolveTimeRange({
          timeFilter,
          customFromTs: appliedFromTs,
          customToTs: appliedToTs,
        });

        let effectiveStatus: number | "all" = "all";
        if (tab === "open") effectiveStatus = TRANSACTION_STATUS.open;

        const filters: Record<string, string | number> = {
          page: page,
          limit: pageSize,
          from: Math.floor(from / 1000),
          to: Math.floor(to / 1000),
          status: effectiveStatus,
          type: "all",
        };

        if (baseFilter !== "all") filters.asset = baseFilter;

        let res = null;
        if (tab === "history") {
          const session = await getSession();
          const accountId = session?.accountIds?.[0];

          if (!accountId) {
            console.warn("No account ID found for OTC trades");
            if (!cancelled) {
              setOrders([]);
              setTotalPages(1);
              setLoading(false);
            }
            return;
          }

          const tradesFilters = {
            pageNumber: page,
            pageSize: pageSize,
            dateFrom: Math.floor(from / 1000),
            dateTo: Math.floor(to / 1000),
            pairName: baseFilter !== "all" && quoteFilter !== "all" ? `${baseFilter}${quoteFilter}` : undefined,
            // orderSide: ... // add if we have a filter
          };
          res = await fetchOtcTrades(apiLocale, accountId, tradesFilters);
        } else if (tab === "orders") {
          // Construct symbol for otc history if both base and quote are selected
          let symbol = undefined;
          if (baseFilter !== "all" && quoteFilter !== "all") {
            symbol = `${baseFilter}${quoteFilter}`;
          }

          const historyFilters = {
            symbol,
            page: page,
            limit: pageSize,
            from: Math.floor(from / 1000),
            to: Math.floor(to / 1000),
            // orderSide: ... // add if we have a filter
          };
          res = await fetchOtcHistory(apiLocale, historyFilters);
        } else {
          // open orders
          res = await fetchDashboardTransactions(apiLocale, filters);
        }

        if (!cancelled) {
          setOrders(res?.items || []);
          setTotalPages(res?.totalPages || 1);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    if (mounted) {
      loadData();
    }

    return () => {
      cancelled = true;
    };
  }, [apiLocale, mounted, tab, timeFilter, appliedFromTs, appliedToTs, baseFilter, quoteFilter, currencyFilter, refreshKey, page, pageSize]);

  // Switch tab + loading atomically (clear old rows) so the new columns never
  // render against the previous tab's data.
  const applyTab = useCallback((next: "open" | "orders" | "history") => {
    tabRef.current = next;
    setTab(next);
    setLoading(true);
    setOrders([]);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only react to EXTERNAL url changes (back/forward); `tab` is not a dep so an
  // internal click can't be reverted while router.push()'s url update is in flight.
  useEffect(() => {
    if (!mounted) return;
    if (tabParam !== tabRef.current) {
      resetFiltersToDefault();
      applyTab(tabParam);
    }
  }, [mounted, tabParam, resetFiltersToDefault, applyTab]);

  const handleTabChange = (newTab: string) => {
    const typedTab = newTab === "orders" ? "orders" : newTab === "history" ? "history" : "open";
    if (typedTab === tab) return;
    resetFiltersToDefault();
    applyTab(typedTab);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", typedTab);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const rows = useMemo<UiRow[]>(() => {
    if (USE_TRADE_MOCK) return MOCK_TRADE_ROWS;
    return mapOtcOrdersToUiRows(orders, intlLocale, timeZone);
  }, [orders, intlLocale, timeZone]);

  const getStatusBadge = (status?: string | number) => {
    return <TradeOrderStatusBadge status={status} />;
  };

  const handleCancelClick = (id: number) => {
    setCancelOrderId(id);
  };

  const handleCloseModal = () => {
    setCancelOrderId(null);
  };

  const handleConfirmCancel = async () => {
    if (!cancelOrderId) return;

    setActionLoading(true);
    try {
      const res = await cancelOtcOrder(apiLocale, cancelOrderId);
      if (res) {
        toast.success(t("common.success"));
        setRefreshKey((prev) => prev + 1); // Trigger refresh
        // Optimistically remove from list? Maybe better to wait for refresh.
      } else {
        toast.error(t("common.error"));
      }
    } catch (error) {
      console.error(error);
      toast.error(t("common.error"));
    } finally {
      setActionLoading(false);
      setCancelOrderId(null);
    }
  };

  return (
    <TransactionsPageShell
      title={t("tradeOrders.title")}
      subtitle={t("tradeOrders.subtitle")}
      toolbar={(
        <Tabs value={tab} onValueChange={handleTabChange} className="mb-3 w-auto">
          <TabsList animated className="h-auto w-auto gap-0.5 rounded-[14px] p-1">
            <TabsTrigger value="open" className="rounded-[12px] px-4 py-1.5 text-sm tracking-[-0.16px]">
              {t("tradeOrders.tabs.open")}
            </TabsTrigger>
            <TabsTrigger value="orders" className="rounded-[12px] px-4 py-1.5 text-sm tracking-[-0.16px]">
              {t("tradeOrders.tabs.orders")}
            </TabsTrigger>
            <TabsTrigger value="history" className="rounded-[12px] px-4 py-1.5 text-sm tracking-[-0.16px]">
              {t("tradeOrders.tabs.history")}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      )}
    >
      <TransactionsTableCard
        filtersClassName={cn(loading && "pointer-events-none opacity-80")}
        filters={(
          <>
            <ResponsiveTimeFilter
              label={t("tradeOrders.filters.time")}
              value={timeFilter}
              onValueChange={(v) => {
                setTimeFilter(v);
                setPage(1);
              }}
              draftRange={draftRange}
              onDraftRangeChange={setDraftRange}
              onApplyRange={handleApplyRange}
              onCancelRange={handleCancelRange}
              onCustomOpen={() => setDraftRange(appliedRange)}
              rangeSummary={rangeSummary}
              drawerTitle={t("tradeOrders.filters.time")}
            />
            <TransactionsResponsiveFilter
              label={t("tradeOrders.filters.pair")}
              value={baseFilter === "all" && quoteFilter === "all" ? "all" : `${baseFilter}/${quoteFilter}`}
              options={[
                { label: t("tradeOrders.filters.typeOptions.all"), value: "all" },
                { label: "BTC/USDT", value: "BTC/USDT" },
                { label: "ETH/USDT", value: "ETH/USDT" },
              ]}
              onValueChange={(v) => {
                if (v === "all") {
                  setBaseFilter("all");
                  setQuoteFilter("all");
                } else {
                  const [b, q] = v.split("/");
                  setBaseFilter(b);
                  setQuoteFilter(q);
                }
                setPage(1);
              }}
              drawerTitle={t("tradeOrders.filters.pair")}
            />
            <TransactionsResponsiveFilter
              label={t("tradeOrders.filters.type")}
              value={tab}
              options={[
                { label: t("tradeOrders.tabs.open"), value: "open" },
                { label: t("tradeOrders.tabs.orders"), value: "orders" },
                { label: t("tradeOrders.tabs.history"), value: "history" },
              ]}
              onValueChange={(v) => {
                if (v === "open" || v === "orders" || v === "history") {
                  handleTabChange(v);
                }
              }}
              drawerTitle={t("tradeOrders.filters.type")}
            />
            <TransactionsResponsiveFilter
              label={t("tradeOrders.filters.currency")}
              value={currencyFilter}
              options={[
                { label: "TRY", value: "TRY" },
                { label: "USDT", value: "USDT" },
                { label: "EUR", value: "EUR" },
              ]}
              onValueChange={(v) => {
                setCurrencyFilter(v);
                setPage(1);
              }}
              drawerTitle={t("tradeOrders.filters.currency")}
            />

            <div className="ml-auto flex items-center gap-4 text-sm">
              <button
                type="button"
                className="inline-flex h-[38px] items-center rounded-[12px] border border-[#C7F022] px-4 text-sm font-semibold text-[#C7F022] transition-colors hover:bg-[#C7F022]/10"
                onClick={resetFiltersToDefault}
              >
                {t("tradeOrders.filters.actions.clearAll")}
              </button>
            </div>
          </>
        )}
        footer={!loading && rows.length > 0 ? (
          <TransactionsTableFooter
            pageSizeLabel={t("wallet.table.pagination.perPage")}
            pageSize={pageSize}
            onPageSizeChange={(nextSize) => {
              setPage(1);
              setPageSize(nextSize);
            }}
            pageSizeOptions={[8, 16, 32]}
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(nextPage) => {
              setPage(nextPage);
            }}
          />
        ) : undefined}
      >
          <TradeOrdersTabPanel
            tab={tab}
            loading={loading}
            rows={rows}
            t={t}
            getStatusBadge={getStatusBadge}
            onCancelClick={handleCancelClick}
            onOrderDetailClick={(row) => openModal("trade-order-detail", { row, mode: "orders" })}
            onTradeDetailClick={(row) => openModal("trade-order-detail", { row, mode: "history" })}
          />
      </TransactionsTableCard>

      <ConfirmationModal
        isOpen={!!cancelOrderId}
        onClose={handleCloseModal}
        onConfirm={handleConfirmCancel}
        title={t("tradeOrders.cancelModal.title")}
        description={t("tradeOrders.cancelModal.description")}
        confirmText={t("tradeOrders.cancelModal.confirm")}
        cancelText={t("tradeOrders.cancelModal.cancel")}
        isLoading={actionLoading}
      />
    </TransactionsPageShell>
  );
}
