"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ResponsiveTimeFilter } from "@/components/transactions/ResponsiveTimeFilter";
import { TransactionsResponsiveFilter } from "@/components/transactions/TransactionsResponsiveFilter";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18n } from "@/lib/i18n/I18nProvider";
import {
  getApiLocale,
  getClientAppPreferences,
  getDateFnsLocale,
  getIntlLocale,
} from "@/lib/preferences/appPreferences";
import { useModalStore } from "@/stores/useModalStore";
import { toast } from "sonner";
import { DateRange } from "react-day-picker";
import { format, subDays } from "date-fns";
import { fetchCryptoTransactions } from "@/services/otc";
import { fetchPendingDepositDeclarations } from "@/services/crypto";
import { fetchFiatTransactions } from "@/services/fiat";
import { getSession } from "@/lib/api/session";
import { Transaction, CryptoTransaction } from "./deposit-withdraw/types";
import type { PendingDepositDeclaration } from "@/types/crypto";
import { TransactionsPageShell, TransactionsTableCard, TransactionsTableFooter } from "./TransactionsLayout";
import { resolveTimeRange, type SharedTimeFilterValue } from "./timeRange";
import { DepositWithdrawTabPanel } from "./deposit-withdraw/DepositWithdrawTabPanel";
import { mapCryptoTransactionsToRows, mapFiatTransactionsToRows } from "./deposit-withdraw/mappers";
import { MOCK_CRYPTO_TRANSACTIONS, MOCK_FIAT_TRANSACTIONS } from "./deposit-withdraw/mockData";
import { WalletNotification } from "@/components/wallet/WalletNotification";

// Types moved to ./deposit-withdraw/types.ts

// ⚠️ TEMPORARY DEMO FLAGS — when true the tabs show mock rows (see ./mockData).
// Set to false (and remove the mock blocks below) once the API returns real data.
const USE_CRYPTO_MOCK = true;
const USE_FIAT_MOCK = false;

export function DepositWithdrawPage() {
  const { t, locale } = useI18n();
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = (searchParams.get("tab") as "fiat" | "crypto") || "fiat";
  const openModal = useModalStore((state) => state.openModal);
  const [tab, setTab] = useState<"fiat" | "crypto">(tabParam);
  // Tracks the tab we intend to be on, so the URL-sync effect below doesn't
  // revert an in-flight click while router.push() lags behind (the prod-only
  // "old-tab skeleton flash" bug).
  const tabRef = useRef<"fiat" | "crypto">(tabParam);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const today = useMemo(() => new Date(), []);
  const defaultFrom = useMemo(() => subDays(today, 2), [today]);
  const [timeFilter, setTimeFilter] = useState<SharedTimeFilterValue>("last30");
  const [appliedRange, setAppliedRange] = useState<DateRange | undefined>({
    from: defaultFrom,
    to: today,
  });
  const [draftRange, setDraftRange] = useState<DateRange | undefined>({
    from: defaultFrom,
    to: today,
  });

  // Fiat Data State
  const [fiatTransactions, setFiatTransactions] = useState<Transaction[]>([]);
  const [fiatLoading, setFiatLoading] = useState(true);
  const [fiatPage, setFiatPage] = useState(1);
  const [fiatTotalPages, setFiatTotalPages] = useState(1);
  const [fiatLimit, setFiatLimit] = useState(8);
  const [fiatCurrencyFilter, setFiatCurrencyFilter] = useState<string>("TRY");
  const [fiatStatusFilter, setFiatStatusFilter] = useState<string>(t("transactions.filters.status.default"));

  // Crypto Data State
  const [cryptoTransactions, setCryptoTransactions] = useState<CryptoTransaction[]>([]);
  const [cryptoLoading, setCryptoLoading] = useState(true);
  const [cryptoPage, setCryptoPage] = useState(1);
  const [cryptoTotalPages, setCryptoTotalPages] = useState(1);
  const [cryptoLimit, setCryptoLimit] = useState(8);
  const [cryptoTypeFilter, setCryptoTypeFilter] = useState<string>(t("transactions.filters.type.all"));
  const [cryptoStatusFilter, setCryptoStatusFilter] = useState<string>(t("transactions.filters.status.default"));
  const [cryptoAssetFilter, setCryptoAssetFilter] = useState<string>(t("transactions.filters.type.all"));
  const [cryptoRefreshTick, setCryptoRefreshTick] = useState(0);
  const [pendingDeclarations, setPendingDeclarations] = useState<PendingDepositDeclaration[]>([]);

  const rows = useMemo(() => (tab === "fiat" ? fiatTransactions : cryptoTransactions), [tab, fiatTransactions, cryptoTransactions]);
  const appPreferences = useMemo(() => getClientAppPreferences(locale), [locale]);
  const apiLocale = getApiLocale(appPreferences);
  const intlLocale = getIntlLocale(appPreferences);
  const timeZone = appPreferences.timezone;
  const dateFnsLocale = getDateFnsLocale(appPreferences);
  const formatRangeDate = (date: Date) => format(date, "P", { locale: dateFnsLocale });
  const rangeSummary =
    draftRange?.from && draftRange?.to
      ? `${formatRangeDate(draftRange.from)} - ${formatRangeDate(draftRange.to)}`
      : t("transactions.filters.time.customRange");
  const appliedFromTs = appliedRange?.from?.getTime();
  const appliedToTs = appliedRange?.to?.getTime();
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

    setFiatCurrencyFilter("TRY");
    setFiatStatusFilter(t("transactions.filters.status.default"));
    setFiatPage(1);

    setCryptoTypeFilter(t("transactions.filters.type.all"));
    setCryptoStatusFilter(t("transactions.filters.status.default"));
    setCryptoAssetFilter(t("transactions.filters.type.all"));
    setCryptoPage(1);

    setCryptoRefreshTick((prev) => prev + 1);
  }, [t, defaultFrom, today]);

  // Switch tab + loading atomically so the previous tab never flashes its
  // skeleton and the new tab goes straight to its own skeleton (no stale rows).
  const applyTab = useCallback((next: "fiat" | "crypto") => {
    tabRef.current = next;
    setTab(next);
    if (next === "crypto") {
      setCryptoLoading(true);
      setCryptoTransactions([]);
      setFiatLoading(false);
    } else {
      setFiatLoading(true);
      setFiatTransactions([]);
      setCryptoLoading(false);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only react to EXTERNAL url changes (back/forward). `tab` is intentionally not
  // a dependency: an internal click sets tabRef synchronously, so this effect
  // won't fire (and revert) while router.push()'s url update is still in flight.
  useEffect(() => {
    if (!mounted) return;
    if (tabParam !== tabRef.current) {
      resetFiltersToDefault();
      applyTab(tabParam);
    }
  }, [mounted, tabParam, resetFiltersToDefault, applyTab]);

  useEffect(() => {
    const onUpdated = () => setCryptoRefreshTick((prev) => prev + 1);
    window.addEventListener("transaction-updated", onUpdated);
    return () => window.removeEventListener("transaction-updated", onUpdated);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadPendingDeclarations = async () => {
      try {
        const list = await fetchPendingDepositDeclarations(apiLocale);
        if (!cancelled) {
          setPendingDeclarations(list ?? []);
        }
      } catch {
        if (!cancelled) {
          setPendingDeclarations([]);
        }
      }
    };

    loadPendingDeclarations();

    return () => {
      cancelled = true;
    };
  }, [apiLocale, cryptoRefreshTick]);

  const handleTabChange = (newTab: string) => {
    const typedTab = newTab === "crypto" ? "crypto" : "fiat";
    if (typedTab === tab) return;

    resetFiltersToDefault();
    applyTab(typedTab);

    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", typedTab);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Fetch FIAT Transactions
  useEffect(() => {
    let cancelled = false;

    const loadFiatData = async () => {
      if (tab !== "fiat") return;

      // ⚠️ TEMPORARY DEMO MOCK — shows the skeleton briefly, then mock FIAT rows.
      // Remove this block (and ./mockData) once the API returns real data.
      if (USE_FIAT_MOCK) {
        setFiatLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 900));
        if (!cancelled) {
          setFiatTransactions(MOCK_FIAT_TRANSACTIONS);
          setFiatTotalPages(1);
          setFiatLoading(false);
        }
        return;
      }

      setFiatLoading(true);
      try {
        const session = await getSession();
        const accountId = session?.accountIds?.[0];

        if (!accountId) {
          console.warn("No account ID found for FIAT transactions");
          return;
        }

        const res = await fetchFiatTransactions(apiLocale, accountId, {
          pageNumber: fiatPage,
          pageSize: fiatLimit,
          // from: fromTime, // Uncomment if API supports timestamp filtering
          currency: fiatCurrencyFilter !== t("transactions.filters.type.all") && fiatCurrencyFilter !== "all" ? fiatCurrencyFilter : undefined,
          status: fiatStatusFilter !== t("transactions.filters.status.default") && fiatStatusFilter !== "all" ? fiatStatusFilter : undefined,
        });

        if (!cancelled && res?.items) {
          const mapped: Transaction[] = mapFiatTransactionsToRows(res.items, intlLocale, timeZone);
          setFiatTransactions(mapped);
          setFiatTotalPages(res.totalPages || 1);
        } else if (!cancelled) {
          setFiatTransactions([]);
          setFiatTotalPages(1);
        }

      } catch (e) {
        console.error("Failed to fetch FIAT transactions", e);
      } finally {
        if (!cancelled) setFiatLoading(false);
      }
    };

    loadFiatData();

    return () => { cancelled = true; };
  }, [tab, apiLocale, intlLocale, timeZone, fiatPage, fiatLimit, fiatCurrencyFilter, fiatStatusFilter, t]);

  useEffect(() => {
    let cancelled = false;

    const loadCryptoData = async () => {
      if (tab !== "crypto") return;

      // ⚠️ TEMPORARY DEMO MOCK — shows the skeleton briefly, then mock crypto rows.
      // Remove this block (and ./mockData) once the API returns real data.
      if (USE_CRYPTO_MOCK) {
        setCryptoLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 900));
        if (!cancelled) {
          setCryptoTransactions(MOCK_CRYPTO_TRANSACTIONS);
          setCryptoTotalPages(1);
          setCryptoLoading(false);
        }
        return;
      }

      setCryptoLoading(true);
      try {
        const session = await getSession();
        const accountId = session?.accountIds?.[0];

        if (!accountId) {
          console.warn("No account ID found for Crypto transactions");
          return;
        }

        const { from, to } = resolveTimeRange({
          timeFilter,
          customFromTs: appliedFromTs,
          customToTs: appliedToTs,
        });

        // Type Map
        let type: string | undefined;
        if (cryptoTypeFilter === t("transactions.filters.type.deposit")) type = "Deposit";
        else if (cryptoTypeFilter === t("transactions.filters.type.withdraw")) type = "Withdrawal";

        // Status Map
        // Pending=0, Processing=1, Completed=2, Canceled=3, WaitingFee=4, ProcessingInQueue=10, 
        // AdminApproveWaiting=20, AdminCancel=50, WaitDeclaration=60, CompletedWithError=90
        let status: string | undefined;
        if (cryptoStatusFilter === t("transactions.filters.status.success")) status = "2"; // Completed
        else if (cryptoStatusFilter === t("transactions.filters.status.pending")) status = "0"; // Pending
        else if (cryptoStatusFilter === t("transactions.filters.status.processing")) status = "1"; // Processing

        // Asset Map
        let asset: string | undefined;
        // Check if filter is NOT "All"
        if (cryptoAssetFilter !== t("transactions.filters.type.all") && cryptoAssetFilter !== "all" && cryptoAssetFilter !== t("transactions.filters.status.default")) {
          asset = cryptoAssetFilter;
        }

        const res = await fetchCryptoTransactions(apiLocale, accountId, {
          page: cryptoPage,
          limit: cryptoLimit,
          from: Math.floor(from / 1000),
          to: Math.floor(to / 1000),
          type,
          status,
          asset
        });

        if (!cancelled && res?.items?.length) {
          const mapped: CryptoTransaction[] = mapCryptoTransactionsToRows(
            res.items,
            pendingDeclarations,
            intlLocale,
            timeZone,
          );
          setCryptoTransactions(mapped);
          setCryptoTotalPages(res.totalPages || 1);
        } else if (!cancelled) {
          setCryptoTransactions([]);
          setCryptoTotalPages(1);
        }
      } finally {
        if (!cancelled) setCryptoLoading(false);
      }
    };

    loadCryptoData();

    return () => { cancelled = true; };
  }, [tab, apiLocale, intlLocale, timeZone, cryptoPage, cryptoLimit, cryptoTypeFilter, cryptoStatusFilter, cryptoAssetFilter, timeFilter, appliedFromTs, appliedToTs, cryptoRefreshTick, pendingDeclarations, t]);

  const copyWithToast = (value: string) => {
    if (!value || !value.trim() || value.trim() === "-") {
      return;
    }

    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(value).then(
        () => toast.success(t("toast.copied")),
        () => toast.error(t("toast.copied")),
      );
    } else {
      toast.info(t("toast.copied"));
    }
  };

  // "custom" never arrives here — ResponsiveTimeFilter reveals the calendar
  // locally and applies via onApplyRange; draft sync is done via onCustomOpen.
  const handleTimeChange = (value: SharedTimeFilterValue) => {
    setTimeFilter(value);
  };

  const handleCancelRange = () => {
    setDraftRange(appliedRange);
    setTimeFilter("last30");
  };

  const handleApplyRange = () => {
    if (!draftRange?.from || !draftRange?.to) return;
    setAppliedRange(draftRange);
    setCryptoPage(1);
    setFiatPage(1);
    setCryptoRefreshTick((prev) => prev + 1);
    setTimeFilter("custom");
    // setRangeOpen(false);
  };

  const handleTypeChange = (val: string) => {
    // Fiat type not currently used/filtered or only single val
    if (tab === "crypto") setCryptoTypeFilter(val);
  };

  const handleStatusChange = (val: string) => {
    if (tab === "crypto") setCryptoStatusFilter(val);
    else setFiatStatusFilter(val);
  };

  const handleCurrencyOrAssetChange = (val: string) => {
    if (tab === "crypto") setCryptoAssetFilter(val);
    else setFiatCurrencyFilter(val);
  };



  return (
    <TransactionsPageShell
      title={t("transactions.title")}
      subtitle={t("transactions.subtitle")}
      toolbar={(
        <Tabs value={tab} onValueChange={handleTabChange} className="mb-3 w-auto">
          <TabsList animated className="h-auto w-auto gap-0.5 rounded-[14px] p-1">
            <TabsTrigger value="fiat" className="rounded-[12px] px-4 py-1.5 text-sm tracking-[-0.16px]">
              {t("transactions.tabs.fiat")}
            </TabsTrigger>
            <TabsTrigger value="crypto" className="rounded-[12px] px-4 py-1.5 text-sm tracking-[-0.16px]">
              {t("transactions.tabs.crypto")}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      )}
      className="shadow-none"
    >
      {pendingDeclarations.length > 0 && (
        <WalletNotification
          className="mb-3"
          pendingCount={pendingDeclarations.length}
          onAction={() => openModal("pending-transactions", { items: pendingDeclarations })}
        />
      )}

      <TransactionsTableCard
        filters={(
          <>
            <TransactionsResponsiveFilter
              label={t("transactions.filters.type.label")}
              value={tab === "crypto" ? cryptoTypeFilter : t("transactions.filters.type.all")}
              options={
                tab === "crypto"
                  ? [
                    { label: t("transactions.filters.type.deposit"), value: t("transactions.filters.type.deposit") },
                    { label: t("transactions.filters.type.withdraw"), value: t("transactions.filters.type.withdraw") },
                    { label: t("transactions.filters.type.all"), value: t("transactions.filters.type.all") },
                  ]
                  : [
                    { label: t("transactions.filters.type.all"), value: t("transactions.filters.type.all") },
                  ]
              }
              onValueChange={handleTypeChange}
              drawerTitle={t("transactions.filters.type.label")}
            />
            <ResponsiveTimeFilter
              label={t("transactions.filters.time.label")}
              value={timeFilter}
              onValueChange={handleTimeChange}
              draftRange={draftRange}
              onDraftRangeChange={setDraftRange}
              onApplyRange={handleApplyRange}
              onCancelRange={handleCancelRange}
              onCustomOpen={() => setDraftRange(appliedRange)}
              rangeSummary={rangeSummary}
              drawerTitle={t("transactions.filters.time.label")}
            />
            <TransactionsResponsiveFilter
              label={t("transactions.filters.status.label")}
              value={tab === "crypto" ? cryptoStatusFilter : fiatStatusFilter}
              options={[
                { label: t("transactions.filters.status.default"), value: t("transactions.filters.status.default") },
                { label: t("transactions.filters.status.success"), value: t("transactions.filters.status.success") },
                { label: t("transactions.filters.status.pending"), value: t("transactions.filters.status.pending") },
                { label: t("transactions.filters.status.processing"), value: t("transactions.filters.status.processing") },
              ]}
              onValueChange={handleStatusChange}
              drawerTitle={t("transactions.filters.status.label")}
            />
            <TransactionsResponsiveFilter
              label={tab === "crypto" ? t("transactions.crypto.headers.asset") : t("transactions.filters.currency.label")}
              value={tab === "crypto" ? cryptoAssetFilter : fiatCurrencyFilter}
              options={
                tab === "crypto" ? [
                  { label: t("transactions.filters.type.all"), value: t("transactions.filters.type.all") },
                  { label: "USDT", value: "USDT" },
                  { label: "USDC", value: "USDC" },
                  { label: "ETH", value: "ETH" },
                  { label: "BTC", value: "BTC" },
                ] : [
                  { label: t("transactions.filters.type.all"), value: t("transactions.filters.type.all") },
                  { label: "TRY", value: "TRY" },
                  { label: "USD", value: "USD" },
                  { label: "EUR", value: "EUR" },
                ]
              }
              onValueChange={handleCurrencyOrAssetChange}
              drawerTitle={t("transactions.filters.currency.label")}
            />
            <div className="ml-auto">
              <button
                type="button"
                className="inline-flex h-[38px] items-center rounded-[12px] border border-[#f54a14] px-4 text-sm font-semibold text-[#f54a14] transition-colors hover:bg-[#f54a14]/10"
                onClick={resetFiltersToDefault}
              >
                {t("common.actions.clearAll")}
              </button>
            </div>
          </>
        )}
        footer={rows.length > 0 ? (
          <TransactionsTableFooter
            pageSizeLabel={t("wallet.table.pagination.perPage")}
            pageSize={tab === "crypto" ? cryptoLimit : fiatLimit}
            onPageSizeChange={(nextLimit) => {
              if (tab === "crypto") {
                setCryptoLimit(nextLimit);
              } else {
                setFiatLimit(nextLimit);
              }
            }}
            pageSizeOptions={[8, 16]}
            currentPage={tab === "crypto" ? cryptoPage : fiatPage}
            totalPages={tab === "crypto" ? cryptoTotalPages : fiatTotalPages}
            onPageChange={tab === "crypto" ? setCryptoPage : setFiatPage}
            className="mt-auto pt-6 text-xs text-slate-600 dark:text-slate-300"
          />
        ) : undefined}
      >
          <DepositWithdrawTabPanel
            tab={tab}
            fiatLoading={fiatLoading}
            fiatRows={fiatTransactions}
            cryptoLoading={cryptoLoading}
            cryptoRows={cryptoTransactions}
            t={t}
            expanded={expanded}
            onExpand={setExpanded}
            copyWithToast={copyWithToast}
            onDeclareClick={(mode, transactionId) => openModal("declare-transaction", { mode, transactionId })}
            onDetailClick={(transaction) => openModal("crypto-transaction-detail", { transaction })}
            onFiatDetailClick={(transaction) => openModal("fiat-transaction-detail", { transaction })}
          />
      </TransactionsTableCard>
    </TransactionsPageShell>
  );
}
