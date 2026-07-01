"use client";

import { Button } from "@/components/ui/button";
import { useWalletAssets } from "@/hooks/use-wallet-assets";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { D } from "@/lib/math/decimal";
import { formatDecimalValue } from "@/lib/math/formatDecimal";
import { cn } from "@/lib/utils";
import { fetchPendingDepositDeclarations } from "@/services/crypto";
import { fetchDashboardTransactions } from "@/services/otc";
import { getApplicationDetail } from "@/services/application";
import { ApplicationStepper } from "@/components/application/ApplicationStepper";
import { getApplicationTabs } from "@/data/application-tabs";
import { useModalStore } from "@/stores/useModalStore";
import type { PendingDepositDeclaration } from "@/types/crypto";
import type { OtcOrderItem } from "@/types/otc";
import { withLocale } from "@/lib/i18n/href";
import { Bell, ChevronRight, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { WalletDonutCard } from "../wallet/WalletDonutCard";
import { WalletTotalCard } from "../wallet/WalletTotalCard";
import { DashboardSkeleton } from "./DashboardSkeleton";

type Notice = {
  icon: React.ReactNode;
  title: string;
  description: string;
  cta?: string;
  tone?: "warn" | "info";
  onClick?: () => void;
};

export function DashboardOverview() {
  const { t, locale } = useI18n();
  const openModal = useModalStore((state) => state.openModal);
  const router = useRouter();

  // Use the hook for wallet assets
  const { assets, isLoading: isWalletLoading } = useWalletAssets({ locale });

  const [isOrdersLoading, setIsOrdersLoading] = useState(true);
  const [walletTab, setWalletTab] = useState<"total" | "unit" | "category">("total");
  const [orders, setOrders] = useState<OtcOrderItem[]>([]);
  const [pendingDeclarations, setPendingDeclarations] = useState<PendingDepositDeclaration[]>([]);
  const [applicationStatus, setApplicationStatus] = useState<string | null>(null);
  const [isAppStatusLoading, setIsAppStatusLoading] = useState(true);
  const [tabLinks, setTabLinks] = useState<any[]>([]);

  useEffect(() => {
    const fetchTabs = async () => {
      const tabs = await getApplicationTabs(locale);
      setTabLinks(tabs.map(tab => ({ ...tab, href: withLocale(`/application/${tab.slug ?? tab.id}`, locale) })));
    };
    fetchTabs();
  }, [locale]);

  useEffect(() => {
    const fetchAppStatus = async () => {
      setIsAppStatusLoading(true);
      try {
        const appDetail = await getApplicationDetail();
        if (appDetail?.applications && appDetail.applications.length > 0) {
          setApplicationStatus(appDetail.applications[0].applicationStatus.toString());
        }
      } catch (err) {
        console.error("Failed to fetch application detail:", err);
      } finally {
        setIsAppStatusLoading(false);
      }
    };
    fetchAppStatus();
  }, []);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setIsOrdersLoading(true);
      try {
        const ordersData = await fetchDashboardTransactions(locale, { page: 1, limit: 3 });
        if (!cancelled) {
          setOrders(ordersData?.items ?? []);
        }
      } finally {
        if (!cancelled) setIsOrdersLoading(false);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [locale]);

  useEffect(() => {
    let cancelled = false;

    const loadPendingDeclarations = async () => {
      try {
        const list = await fetchPendingDepositDeclarations(locale);
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

    const onTransactionUpdated = () => {
      loadPendingDeclarations();
    };

    window.addEventListener("transaction-updated", onTransactionUpdated);
    return () => {
      cancelled = true;
      window.removeEventListener("transaction-updated", onTransactionUpdated);
    };
  }, [locale]);

  const isLoading = isWalletLoading || isOrdersLoading || isAppStatusLoading;

  const isEmptyState = assets.length === 0 || assets.length === 1;
  const hasTransactions = orders.length > 0;

  const iconBySymbol: Record<string, string> = {
    BTC: "/assets/coin-logo/BTC.svg",
    ETH: "/assets/coin-logo/ETH.svg",
    USDT: "/assets/coin-logo/USDT.svg",
    TRX: "/assets/coin-logo/TRX.svg",
    TRY: "/assets/coin-logo/TRY.svg",
  };
  const quoteSymbols = ["USDT", "TRY", "BTC", "ETH"];

  const splitSymbol = (symbol?: string) => {
    if (!symbol) return { base: "-", quote: "" };
    const match = quoteSymbols.find((quote) => symbol.endsWith(quote));
    if (!match) {
      return { base: symbol, quote: "" };
    }
    return { base: symbol.slice(0, -match.length), quote: match };
  };

  const formatDate = (raw: number | string | undefined) => {
    if (!raw) return "-";
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
        date = new Date(raw);
      }
    }

    if (Number.isNaN(date.getTime())) return "-";
    return new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const formatNumber = (raw: string | number | undefined, minDecimals = 2, maxDecimals = 8) => {
    if (raw === undefined || raw === null) return "-";
    const value = Number(raw);
    if (!Number.isFinite(value)) return String(raw);
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: minDecimals,
      maximumFractionDigits: maxDecimals,
    }).format(value);
  };

  const formatCurrency = (raw: string | number | undefined, currency?: string) => {
    const maxDecimals = currency === "TRY" ? 2 : 8;
    const formatted = formatNumber(raw, 2, maxDecimals);
    return currency ? `${formatted} ${currency}` : formatted;
  };

  const notices: Notice[] = [
    ...(pendingDeclarations.length > 0
      ? [{
        icon: <Bell className="h-5 w-5 text-[#7C3AED]" />,
        title: t("dashboard.notifications.0.title"),
        description: t("dashboard.notifications.0.description"),
        cta: t("dashboard.notifications.cta"),
        tone: "warn" as const,
        onClick: () => openModal("pending-transactions", { items: pendingDeclarations }),
      }]
      : []),
    {
      icon: <ShieldCheck className="h-5 w-5 text-[#7C3AED]" />,
      title: t("dashboard.notifications.2.title"),
      description: t("dashboard.notifications.2.description"),
      tone: "info",
    },
    {
      icon: <ShieldCheck className="h-5 w-5 text-[#7C3AED]" />,
      title: t("dashboard.notifications.3.title"),
      description: t("dashboard.notifications.3.description"),
      tone: "info",
    },
    {
      icon: <ShieldCheck className="h-5 w-5 text-[#7C3AED]" />,
      title: t("dashboard.notifications.4.title"),
      description: t("dashboard.notifications.4.description"),
      tone: "info",
    },
  ];

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 p-4 md:p-6 overflow-hidden max-w-full">
      {applicationStatus && Number(applicationStatus) < 6 && (
        <section className="rounded-xl border border-[#E8EDF3] bg-white p-4 md:p-6 w-full max-w-full overflow-hidden">
          <div className="hidden md:flex mb-0 items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl leading-8 font-medium text-[#0F121A]">{t("application.header.title")}</h2>
              <p className="mt-1 text-base leading-6 text-[#4F5C75]">
                {t("application.header.description")}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push(withLocale("/application/company-info", locale))}
              className="rounded-full border-[#0F121A] px-6 py-5 text-[#0F121A] flex items-center gap-2"
            >
              {t("modals.funds.continue")} <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="lg:mt-12 overflow-x-auto no-scrollbar lg:overflow-x-visible">
            <div className="lg:px-6">
              <ApplicationStepper tabs={tabLinks} />
            </div>
          </div>
        </section>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="min-w-0 space-y-6">
          {applicationStatus && Number(applicationStatus) < 6 ? (
            <SpecializedDashboardCards locale={locale} />
          ) : (
            <>
              <div className="rounded-[28px] border border-white/10 bg-[#1C2425] p-6">
                <h3 className="mb-5 text-lg font-semibold text-white">{t("dashboard.assets.title")}</h3>

                <div className="overflow-x-auto no-scrollbar">
                  <div className="inline-flex flex-nowrap rounded-full bg-white/5 p-1 whitespace-nowrap">
                    <button
                      className={[
                        "min-w-33 shrink-0 rounded-full px-6 py-2 text-xs font-semibold transition-all",
                        walletTab === "total"
                          ? "bg-[#0F1415] text-white"
                          : "text-gray-400 hover:text-white",
                      ].join(" ")}
                      onClick={() => setWalletTab("total")}
                    >
                      {t("wallet.totalBalance.title")}
                    </button>

                    <button
                      className={[
                        "min-w-33 shrink-0 rounded-full px-6 py-2 text-xs font-semibold transition-all",
                        walletTab === "unit"
                          ? "bg-[#0F1415] text-white"
                          : "text-gray-400 hover:text-white",
                      ].join(" ")}
                      onClick={() => setWalletTab("unit")}
                    >
                      {t("wallet.donut.assetUnit")}
                    </button>

                    <button
                      className={[
                        "min-w-[132px] shrink-0 rounded-full px-6 py-2 text-xs font-semibold transition-all",
                        walletTab === "category"
                          ? "bg-[#0F1415] text-white"
                          : "text-gray-400 hover:text-white",
                      ].join(" ")}
                      onClick={() => setWalletTab("category")}
                    >
                      {t("wallet.donut.assetCategory")}
                    </button>
                  </div>
                </div>

                <div className="mt-5">
                  {walletTab === "total" ? (
                    <WalletTotalCard isEmpty={isEmptyState} assets={assets} variant="lime" />
                  ) : (
                    <WalletDonutCard
                      activeTab={walletTab}
                      showTabs={false}
                      assets={assets}
                      isEmpty={isEmptyState}
                    />
                  )}
                </div>
              </div>

              {/* Operations / Transactions Section */}
              {hasTransactions ? (
                <div className="rounded-[28px] border border-white/10 bg-[#1C2425] p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-semibold text-white">{t("dashboard.operations.title")}</h3>
                  </div>
                  <div className="space-y-3">
                    {orders.map((order) => {
                      const { base, quote } = splitSymbol(order.symbol);
                      const isBuy = order.side === "0" || order.side === "BUY";
                      const icon = iconBySymbol[base] ?? "/assets/coin-logo/TRY.svg";
                      const pair = quote ? `${base} / ${quote}` : base;
                      const quantityValue = order.quantity ?? "0";
                      const priceValue = order.price ?? "0";
                      const totalValue = order.total ?? "0";
                      const amount = `${formatDecimalValue(D.parse(quantityValue), { minDecimals: 2 })} ${base}`;
                      const price = formatCurrency(priceValue, quote);
                      const precision = quote === "TRY" || quote === "USDT" ? 2 : 8;
                      const totalFormatted = formatDecimalValue(D.parse(totalValue, precision), { minDecimals: 2 });
                      const total = quote ? `${totalFormatted} ${quote}` : totalFormatted;

                      return (
                        <div key={order.id} className="rounded-4xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/[0.07]">
                          <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-3">
                              <div className="relative h-8 w-8 shrink-0">
                                <Image src={icon} alt={pair} fill className="object-contain" />
                              </div>
                              <div>
                                <h4 className="text-body-lg-medium text-white">{pair}</h4>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-body-xs-medium text-[#848E9C]">{formatDate(order.createdDate)}</span>
                              <span className={cn(
                                "rounded-full px-2.5 py-0.5 text-[11px] border font-medium",
                                isBuy ? "bg-emerald-50 text-emerald-500 border-emerald-100" : "bg-rose-50 text-rose-500 border-rose-100"
                              )}>
                                {isBuy ? t("dashboard.transactions.buy") : t("dashboard.transactions.sell")}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 items-end">
                            <div className="flex flex-col gap-1">
                              <span className="text-body-xs-medium text-[#848E9C]">{t("trade.amountLabel")}</span>
                              <span className="text-body-md-medium text-white">{amount}</span>
                            </div>
                            <div className="flex flex-col gap-1 text-center">
                              <span className="text-body-xs-medium text-[#848E9C]">{t("tradeOrders.table.headers.price")}</span>
                              <span className="text-body-md-medium text-white">{price}</span>
                            </div>
                            <div className="flex flex-col gap-1 text-right">
                              <span className="text-body-xs-medium text-[#848E9C]">{t("trade.totalLabel")}</span>
                              <span className="text-title-md text-white">{total}</span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : (
                <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#1C2425] p-8">
                  <div className="absolute inset-0 bg-[url('/assets/images/bg-wave.svg')] bg-cover bg-center opacity-10" />
                  <div className="relative z-10 w-full rounded-4xl bg-white/5 p-8">
                    <h3 className="mb-2 text-title-lg text-white">
                      {t("dashboard.operations.title")}
                    </h3>
                    <p className="text-body-md text-gray-400">
                      {t("dashboard.operations.description")}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Notifications Card */}
        <div className="rounded-[28px] border border-white/10 bg-[#1C2425] p-6">
          <h3 className="mb-2 text-lg font-semibold text-white">
            {t("dashboard.notifications.title")}
          </h3>
          <p className="mb-6 text-body-md text-gray-400">
            {t("dashboard.notifications.description")}
          </p>

          <div className="space-y-4">
            {notices.map((notice, idx) => (
              <div
                key={idx}
                className="flex flex-col items-start gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/[0.07] md:flex-row md:items-center"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#7C3AED]/20 text-[#A78BFA]">
                    {notice.icon}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-white">{notice.title}</h4>
                    <p className="max-w-sm text-body-xs text-gray-400">
                      {notice.description}
                    </p>
                  </div>
                </div>
                {notice.cta && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="shrink-0 self-end whitespace-nowrap rounded-full border border-white/30 px-4 py-2 text-body-xs text-white transition hover:bg-white/10 md:self-auto"
                    onClick={notice.onClick}
                  >
                    {notice.cta}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SpecializedDashboardCards({ locale }: { locale: string }) {
  const { t } = useI18n();
  const router = useRouter();

  const handleCompleteApplication = () => {
    router.push(withLocale("/application/company-info", locale));
  };

  const cards = [
    {
      title: t("dashboard.incomplete.assets.title"),
      description: t("dashboard.incomplete.assets.description"),
    },
    {
      title: t("dashboard.incomplete.transactions.title"),
      description: t("dashboard.incomplete.transactions.description"),
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-5xl bg-theme-bg p-4 md:p-6">
      {/* Background waves matching auth sidebar */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[url('/assets/images/bg-wave.svg')] bg-size-[140%_140%] bg-position-[center_135%] opacity-40 animate-wave-reveal" />

      <div className="relative z-10 space-y-6">
        {cards.map((card, idx) => (
          <div key={idx} className="relative overflow-hidden rounded-4xl bg-white/60 p-4 lg:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/40">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3 lg:gap-4">
                <h3 className="text-[18px] leading-[27px] font-medium text-gray-900">
                  {card.title}
                </h3>
                <p className="text-sm lg:text-base leading-[19px] lg:leading-6 text-gray-500 max-w-sm">
                  {card.description}
                </p>
              </div>
              <div className="flex justify-end mt-2">
                <Button
                  onClick={handleCompleteApplication}
                  className="rounded-full bg-linear-to-r from-[#8B5CF6] to-[#4C1D95] hover:opacity-95 transition-all px-5 py-5.5 !text-white shadow-lg shadow-purple-500/20"
                >
                  {t("dashboard.incomplete.cta")}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
