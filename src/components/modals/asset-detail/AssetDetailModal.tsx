"use client";

import { Button } from "@/components/ui/button";
import { getApiLocale } from "@/lib/i18n/config";
import { withLocale } from "@/lib/i18n/href";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { formatDecimalFromString } from "@/lib/math/formatDecimal";
import { cn } from "@/lib/utils";
import { fetchBalanceMovements } from "@/services/wallet";
import { useModalStore } from "@/stores/useModalStore";
import type { WalletBalanceMovement, WalletSidebarAsset } from "@/types/wallet";
import { ChevronDown, ChevronRight as ChevronLink, Info, X } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";


// Mock data for initial state or fallback (optional)
const initialAssetData = {
  name: "Bitcoin",
  symbol: "BTC",
  icon: "/assets/coin-logo/BTC.svg",
  balance: "0.3824",
  fiatBalance: "≈ ₺523.40",
  available: "0.2824",
  inOrder: "0.550 TRY",
  withdrawing: "0.450",
};

export function AssetDetailModal() {
  const { closeModal, data, isClosing, openModal, activeModal } = useModalStore();
  const { t } = useI18n();
  const router = useRouter();
  const params = useParams();
  const locale = String(params?.locale ?? "en");
  const asset = (data as { asset?: WalletSidebarAsset; displayCurrency?: "TRY" | "USDT" } | null)?.asset ?? initialAssetData;
  const displayCurrency = (data as { asset?: WalletSidebarAsset; displayCurrency?: "TRY" | "USDT" } | null)?.displayCurrency ?? "TRY";
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"all" | "deposit" | "withdraw" | "trade">("all");
  const [movements, setMovements] = useState<WalletBalanceMovement[]>([]);
  const [isLoadingMovements, setIsLoadingMovements] = useState(false);

  const displayAsset = {
    ...initialAssetData,
    ...asset,
    balance: (asset as WalletSidebarAsset)?.amount ?? initialAssetData.balance,
    fiatBalance: (asset as WalletSidebarAsset)?.fiat ?? initialAssetData.fiatBalance,
    available: (asset as WalletSidebarAsset)?.available ?? initialAssetData.available,
    inOrder: (asset as WalletSidebarAsset)?.inOrder ?? initialAssetData.inOrder,
    withdrawing: (asset as WalletSidebarAsset)?.withdraw ?? initialAssetData.withdrawing,
  };

  useEffect(() => {
    let isMounted = true;
    const loadMovements = async () => {
      // Avoid fetching if untriggered or invalid
      if (activeModal !== "asset-detail" || !displayAsset.symbol) return;

      setIsLoadingMovements(true);
      try {
        let apiFilter: 1 | 2 | 3 = 1;
        if (activeFilter === "deposit" || activeFilter === "withdraw") apiFilter = 2;
        if (activeFilter === "trade") apiFilter = 3;

        const count = (activeFilter === "deposit" || activeFilter === "withdraw") ? 20 : 5;

        const data = await fetchBalanceMovements(displayAsset.symbol, apiFilter, count);

        if (!isMounted) return;

        let filtered = data;
        if (activeFilter === "deposit") {
          filtered = data.filter((m) => {
            const normalized = `${m.transactionType || ""} ${m.walletType || ""} ${m.eventKey || ""}`.toLowerCase();
            return normalized.includes("deposit") || normalized.includes("yatır");
          });
        } else if (activeFilter === "withdraw") {
          filtered = data.filter((m) => {
            const normalized = `${m.transactionType || ""} ${m.walletType || ""} ${m.eventKey || ""}`.toLowerCase();
            return normalized.includes("withdraw") || normalized.includes("çek");
          });
        }

        setMovements(filtered.slice(0, 5));
      } catch (error) {
        console.error(error);
      } finally {
        if (isMounted) setIsLoadingMovements(false);
      }
    };

    loadMovements();

    return () => {
      isMounted = false;
    };
  }, [displayAsset.symbol, activeFilter, activeModal]);

  const formatValue = (value: string) => {
    // TODO: USDT precision is hardcoded to 2 for now. Make this dynamic/configurable later.
    const precision = (displayAsset.symbol === "TRY" || displayAsset.symbol === "USDT")
      ? 2
      : (asset as WalletSidebarAsset)?.asset?.displayPrecision;

    if (precision === undefined) return value;
    return formatDecimalFromString(value, precision, { minDecimals: 2 });
  };

  const displayFiatBalance = (() => {
    if (displayCurrency === "USDT") {
      if (displayAsset.symbol === "USDT") {
        return `≈ ${formatValue(displayAsset.balance)} USDT`;
      }

      return `≈ ${(asset as WalletSidebarAsset)?.usdtValue?.toLocaleString(
        getApiLocale(locale),
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        },
      ) ?? "0.00"} USDT`;
    }

    return displayAsset.fiatBalance;
  })();

  const filterOptions = [
    { value: "all", label: t("modals.assetDetail.filterAll") },
    { value: "deposit", label: t("transactionTypes.deposit") },
    { value: "withdraw", label: t("transactionTypes.withdraw") },
    { value: "trade", label: t("wallet.actions.trade") },
  ] as const;

  const handleGoToTransactions = () => {
    closeModal();
    window.setTimeout(() => {
      router.push(withLocale("/transaction/deposit-withdraw", locale));
    }, 150);
  };

  return (
    <div
      onClick={closeModal}
      className="absolute inset-0 z-20 flex items-start justify-center overflow-auto p-4 md:items-start md:pt-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "relative z-20 flex w-full h-full max-h-[95vh] max-w-130 flex-col overflow-hidden rounded-3xl rounded-b-20 shadow-2xl ring-1 ring-black/5 lg:ml-auto bg-gradient-modal",
          isClosing ? "animate-slide-out-to-right" : "animate-slide-in-from-right"
        )}>

        {/* Header - Matching PendingTransactionsModal */}
        <div className="relative flex items-center justify-between px-6 py-2 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative h-8 w-8 rounded-full bg-white/20 p-1">
              {typeof displayAsset.icon === "string" ? (
                <Image src={displayAsset.icon} alt={displayAsset.symbol} fill className="object-contain p-0.5" />
              ) : (
                displayAsset.icon
              )}
            </div>
            <div>
              <h3 className="text-base font-semibold">{displayAsset.name}</h3>
              <p className="text-xs text-white/80 font-medium">{displayAsset.symbol}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeModal}
            className="rounded-full p-2 text-white hover:bg-white/30 transition backdrop-blur-sm"
            aria-label="Kapat"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="h-full flex p-1 rounded-3xl">
          <div className="custom-scrollbar flex-1 overflow-y-auto bg-white rounded-2xl h-[calc(100%-56px)]">
            <div className="px-6 py-6">
              {/* Balance & Actions */}
              <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-[32px] font-bold text-gray-900 leading-tight">{formatValue(displayAsset.balance)}</h2>
                  <p className="text-base text-gray-500 font-medium">{displayFiatBalance}</p>
                </div>
                <div className="flex gap-2 lg:gap-3">
                  <Button
                    variant="outline"
                    size={"sm"}
                    onClick={() => openModal("funds", { mode: "deposit", asset: displayAsset.symbol, assetType: displayAsset.symbol === "TRY" ? "fiat" : "crypto" })} //TODO: Tab is hardcoded to crypto for now. Make this dynamic/configurable later.
                    className={cn(
                      "rounded-full h-9 px-4 border-gray-300 font-semibold text-[11px] shadow-none",
                      "text-gray-800 hover:bg-gray-50"
                    )}
                  >
                    {t("wallet.actions.deposit")}
                  </Button>
                  <Button
                    size={"sm"}
                    variant="outline"
                    onClick={() => openModal("funds", { mode: "withdraw", asset: displayAsset.symbol, assetType: displayAsset.symbol === "TRY" ? "fiat" : "crypto" })} //TODO: Tab is hardcoded to crypto for now. Make this dynamic/configurable later.
                    className={cn(
                      "rounded-full h-9 px-4 border-gray-300 font-semibold text-[11px] shadow-none",
                      "text-gray-800 hover:bg-gray-50"
                    )}
                  >
                    {t("wallet.actions.withdraw")}
                  </Button>
                  <Button
                    size={"sm"}
                    variant="outline"
                    onClick={() => {
                      closeModal();
                      router.push(withLocale("/trade/easy", locale));
                    }}
                    className={cn(
                      "rounded-full h-9 px-4 border-gray-300 font-semibold text-[11px] shadow-none",
                      "text-gray-800 hover:bg-gray-50"
                    )}
                  >
                    {t("wallet.actions.trade")}
                  </Button>
                </div>
              </div>

              {/* Status Cards */}
              <div className="grid grid-cols-3 gap-3 mb-8">

                <div className="p-px border-[#E8EDF3] rounded-2xl bg-[linear-gradient(40deg,rgba(232,237,243,1)_55%,rgba(159,119,247,1)_100%)]">
                  <div className="rounded-2xl bg-white p-4 text-left min-h-25">
                    <p className="text-xs md:text-base font-semibold text-gray-900 mb-1">{formatValue(displayAsset.available)} {displayAsset.symbol}</p>
                    <p className="text-[11px] text-gray-500 font-semibold">{t("modals.assetDetail.available")}</p>
                  </div>
                </div>
                <div className="p-px border-[#E8EDF3] rounded-2xl bg-[linear-gradient(40deg,rgba(232,237,243,1)_55%,rgba(159,119,247,1)_100%)]">
                  <div className="rounded-2xl bg-white p-4 text-left  min-h-25">
                    <p className="text-xs md:text-base font-semibold text-gray-900 mb-1">{formatValue(displayAsset.inOrder)} {displayAsset.symbol}</p>
                    <p className="text-[11px] text-gray-500 font-semibold">{t("modals.assetDetail.inOrder")}</p>
                  </div>
                </div>
                <div className="p-px border-[#E8EDF3] rounded-2xl bg-[linear-gradient(40deg,rgba(232,237,243,1)_55%,rgba(159,119,247,1)_100%)]">
                  <div className="rounded-2xl bg-white p-4 text-left  min-h-25">
                    <p className="text-xs md:text-base font-semibold text-gray-900 mb-1">{formatValue(displayAsset.withdrawing)} {displayAsset.symbol}</p>
                    <p className="text-[11px] text-gray-500 font-semibold">{t("modals.assetDetail.processing")}</p>
                  </div>
                </div>

              </div>

              {/* Transaction History */}
              <div className="rounded-3xl bg-white p-4 border border-border dark:bg-gray-900 mb-3">

                <div className="flex items-center justify-between mb-6 px-1">
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-title-md text-gray-900">{t("modals.assetDetail.historyTitle")}</h3>
                    <span className="text-body-sm text-gray-500">{t("modals.assetDetail.recentCount", { count: "5" })}</span>
                  </div>

                  <div className="relative">
                    <button
                      onClick={() => setIsFilterOpen((prev) => !prev)}
                      className="flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-body-xs-medium text-gray-700 hover:bg-gray-50 transition"
                      type="button"
                    >
                      {filterOptions.find((option) => option.value === activeFilter)?.label}
                      <ChevronDown className="h-3 w-3 text-gray-400" />
                    </button>
                    {isFilterOpen && (
                      <div className="absolute right-0 mt-2 w-44 rounded-xl border border-gray-100 bg-white p-1 shadow-lg z-10">
                        {filterOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              setActiveFilter(option.value);
                              setIsFilterOpen(false);
                            }}
                            className={cn(
                              "flex w-full items-center justify-between rounded-lg px-3 py-2 text-[11px] font-semibold text-gray-700 hover:bg-gray-50",
                              option.value === activeFilter ? "bg-gray-50 text-gray-900" : ""
                            )}
                            type="button"
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-6 mb-8">
                  {isLoadingMovements ? (
                    // Skeleton/Loading state
                    Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center justify-between py-1 animate-pulse">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-gray-100" />
                          <div className="space-y-1.5">
                            <div className="h-4 w-24 bg-gray-100 rounded" />
                            <div className="h-3 w-16 bg-gray-100 rounded" />
                          </div>
                        </div>
                        <div className="h-4 w-20 bg-gray-100 rounded" />
                      </div>
                    ))
                  ) : movements.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 text-sm">
                      {t("modals.assetDetail.noTransactions")}
                    </div>
                  ) : (
                    movements.map((tx, i) => {
                      // Determine type based on transactionType string
                      // This logic might need strict matching based on actual API enum values
                      const lowerType = (tx.transactionType || "").toLowerCase();
                      const lowerWalletType = (tx.walletType || "").toLowerCase();
                      const lowerEventKey = (tx.eventKey || "").toLowerCase();
                      const normalizedTypeText = `${lowerType} ${lowerWalletType} ${lowerEventKey}`;
                      const numericAmount = Number(tx.amount);
                      let mappedType: "deposit" | "withdraw" | "buy" | "sell" | null = null;

                      if (lowerWalletType.includes("trade") && !Number.isNaN(numericAmount) && numericAmount !== 0) {
                        mappedType = numericAmount < 0 ? "sell" : "buy";
                      } else if (normalizedTypeText.includes("withdraw") || normalizedTypeText.includes("çek")) mappedType = "withdraw";
                      else if (normalizedTypeText.includes("deposit") || normalizedTypeText.includes("yatır")) mappedType = "deposit";
                      else if (normalizedTypeText.includes("buy") || normalizedTypeText.includes("al")) mappedType = "buy";
                      else if (normalizedTypeText.includes("sell") || normalizedTypeText.includes("sat")) mappedType = "sell";

                      const iconSrcByType = {
                        withdraw: { iconSrc: "/icons/up-icon.svg" },
                        deposit: { iconSrc: "/icons/down-icon.svg" },
                        buy: { iconSrc: "/icons/plus-icon.svg" },
                        sell: { iconSrc: "/icons/minus-icon.svg" },
                      };
                      const iconSrc = mappedType ? iconSrcByType[mappedType].iconSrc : null;
                      const translatedTypeLabel = {
                        deposit: t("transactionTypes.deposit"),
                        withdraw: t("transactionTypes.withdraw"),
                        buy: t("transactionTypes.buy"),
                        sell: t("transactionTypes.sell"),
                      };
                      const typeLabel = mappedType
                        ? translatedTypeLabel[mappedType]
                        : (tx.walletType || tx.transactionType || "");
                      // Format date
                      const formattedDate = new Date(tx.createdDate).toLocaleString(getApiLocale(locale), {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      });

                      return (
                        <div key={i} className="group flex items-center justify-between py-1 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-[#ccc]/30 transition-transform">
                              {iconSrc ? (
                                <Image
                                  src={iconSrc}
                                  alt={`${mappedType} icon`}
                                  width={20}
                                  height={20}
                                />
                              ) : null}
                            </div>
                            <div>
                              <p className="text-body-lg-medium text-gray-900">{typeLabel}</p>
                              <p className="text-body-xs text-gray-400">{formattedDate}</p>
                            </div>
                          </div>
                          <div className="text-body-md-medium text-gray-900">
                            {tx.amount} {displayAsset.symbol}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>


              </div>

              {/* Footer Info */}
              <div className="flex items-center justify-between rounded-3xl bg-blue-50/50 p-5 px-6 border border-blue-500">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <Info className="h-5 w-5" />
                  </div>
                  <p className="max-w-[240px] text-body-xs text-gray-600 leading-normal">
                    {t("modals.assetDetail.footerLast5Info")}
                  </p>
                </div>
                <div className="shrink-0">
                  <Button
                    variant="outline"
                    className="h-10 rounded-full border-gray-900 bg-transparent px-5 text-body-sm-medium text-gray-900 hover:bg-gray-100"
                    onClick={handleGoToTransactions}
                  >
                    {t("modals.assetDetail.myTransactions")} <ChevronLink className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
