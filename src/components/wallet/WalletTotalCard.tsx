"use client";

import { useMemo, useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ValueChangeHighlight } from "@/components/ui/ValueChangeHighlight";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { useModalStore } from "@/stores/useModalStore";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { WalletSidebarAsset } from "@/types/wallet";

type WalletTotalCardProps = {
  isEmpty?: boolean;
  assets?: WalletSidebarAsset[];
  currency?: "TRY" | "USDT";
  onCurrencyChange?: (currency: "TRY" | "USDT") => void;
  variant?: "dark" | "lime";
};

export function WalletTotalCard({
  isEmpty = false,
  assets = [],
  currency,
  onCurrencyChange,
  variant = "dark",
}: WalletTotalCardProps) {
  const isLime = variant === "lime";
  const { t } = useI18n();
  const openModal = useModalStore((state) => state.openModal);
  const [internalCurrency, setInternalCurrency] = useState<"TRY" | "USDT">("TRY");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const activeCurrency = currency ?? internalCurrency;

  const updateCurrency = (next: "TRY" | "USDT") => {
    if (onCurrencyChange) {
      onCurrencyChange(next);
      return;
    }
    setInternalCurrency(next);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const totals = useMemo(() => {
    let available = 0;
    let inOrder = 0;
    let withdraw = 0;
    let total = 0;
    let totalBtc = 0;

    assets.forEach((asset) => {
      // Remove commas
      const normalizedAmount = asset.amount.toString().replace(/,/g, '');
      const amount = parseFloat(normalizedAmount);

      if (isNaN(amount) || amount === 0) return;

      let assetVal = 0;
      if (activeCurrency === "TRY") {
        assetVal = asset.fiatValue ?? 0;
      } else { // USDT
        assetVal = asset.usdtValue ?? 0;
      }

      totalBtc += asset.btcValue ?? 0;

      // Calculate breakdown based on proportion of total amount
      const ratio = assetVal / amount;

      const assetAvailable = parseFloat(asset.available.toString().replace(/,/g, '')) * ratio;
      const assetInOrder = parseFloat(asset.inOrder.toString().replace(/,/g, '')) * ratio;
      const assetWithdraw = parseFloat(asset.withdraw.toString().replace(/,/g, '')) * ratio;

      available += assetAvailable;
      inOrder += assetInOrder;
      withdraw += assetWithdraw;
      total += assetVal;
    });

    return {
      available,
      inOrder,
      withdraw,
      total,
      totalBtc
    };
  }, [assets, activeCurrency]);

  const formatValue = (value: number, decimals: number = 2) => {
    return value.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  };

  return (
    <div
      className={cn(
        "relative flex min-h-95 flex-col justify-between overflow-hidden rounded-5xl p-8",
        isLime ? "bg-primary text-[#0F1415]" : "bg-[#1a1b23] text-white",
      )}
    >
      {/* Background Gradient Effect - Optional approximation of the dark gradient/glow in image */}
      {!isLime && <div className="absolute right-0 top-0 h-full w-full bg-gradient-card" />}

      {/* Header */}
      <div className="relative z-10 order-2 flex flex-col gap-4 md:order-1 md:flex-row md:items-center md:justify-between">
        <h3 className={cn("text-title-sm hidden md:flex items-center", isLime ? "text-[#0F1415]/70" : "text-gray-200")}>
          <span>{t("wallet.totalBalance.title")}</span>
        </h3>
        <div className="flex w-full mt-5 md:mt-0 gap-3 md:w-auto md:justify-end">
          {isLime ? (
            <>
              <button
                type="button"
                className="h-10 min-w-20 flex-1 rounded-full bg-white px-4 text-body-xs-medium font-semibold text-[#0F1415] transition hover:bg-white/90 md:flex-none md:px-6"
                onClick={() => openModal("funds", { mode: "withdraw" })}
              >
                {t("wallet.totalBalance.withdraw")}
              </button>
              <button
                type="button"
                className="h-10 min-w-20 flex-1 rounded-full bg-[#0F1415] px-4 text-body-xs-medium font-semibold text-white transition hover:bg-[#0F1415]/85 md:flex-none md:px-6"
                onClick={() => openModal("funds", { mode: "deposit" })}
              >
                {t("wallet.totalBalance.deposit")}
              </button>
            </>
          ) : (
            <>
              <Button
                variant="glow-destructive"
                className="h-10 min-w-20 flex-1 px-4 text-body-xs-medium md:flex-none md:px-6"
                onClick={() => openModal("funds", { mode: "withdraw" })}
              >
                {t("wallet.actions.withdraw")}
              </Button>
              <Button
                variant="glow"
                className="h-10 min-w-20 flex-1 px-4 text-body-xs-medium md:flex-none md:px-6"
                onClick={() => openModal("funds", { mode: "deposit" })}
              >
                {t("wallet.actions.deposit")}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Main Balance */}
      <div className="relative z-30 order-1 md:mt-2 md:order-2">
        <div className="flex items-baseline gap-2">
          <h1 className={cn("text-2xl md:text-[42px] leading-tight font-medium tracking-tight", isLime ? "text-[#0F1415]" : "text-white")}>
            <ValueChangeHighlight
              value={isEmpty ? 0 : totals.total}
              className={isLime ? "text-[#0F1415]" : "text-white"}
              upClassName="text-emerald-400"
              downClassName="text-rose-400"
            >
              {formatValue(isEmpty ? 0 : totals.total)}
            </ValueChangeHighlight>
          </h1>

          <div className="relative" ref={ref}>
            <button
              onClick={() => setOpen(!open)}
              className={cn(
                "flex items-center gap-2 text-title-lg transition-colors",
                isLime ? "text-[#0F1415]/70 hover:text-[#0F1415]" : "text-gray-400 hover:text-white",
              )}
            >
              {activeCurrency}
              {open ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </button>
            {open && (
              <div className="absolute left-0 mt-2 w-28 rounded-xl border border-white/10 bg-[#1a1b23] py-2 shadow-xl ring-1 ring-black/5 z-50">
                {["TRY", "USDT"].map((curr) => (
                  <button
                    key={curr}
                    onClick={() => {
                      updateCurrency(curr as "TRY" | "USDT");
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between px-4 py-2 transition-colors hover:bg-white/5 ${activeCurrency === curr ? "text-body-md-medium text-white" : "text-body-md text-gray-400"}`}
                  >
                    {curr}
                    {activeCurrency === curr && <span className="ml-2 text-green-400">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <p className={cn("mt-2 text-body-xs", isLime ? "text-[#0F1415]/70" : "text-gray-400")}>
          {isEmpty ? "≈ 0.00000000 BTC" : `≈ ${formatValue(totals.totalBtc, 8)} BTC`}
        </p>
      </div>

      {/* Footer Info Cards */}
      <div
        className={cn(
          "relative z-10 order-3 mt-8 grid w-full grid-cols-2 gap-4 rounded-2xl p-5 md:grid-cols-3 md:rounded-3xl [&>*:first-child]:col-span-2 md:[&>*:first-child]:col-span-1",
          !isLime && "bg-white/10",
        )}
      >
        {[
          {
            label: t("wallet.totalBalance.available"),
            value: `${formatValue(isEmpty ? 0 : totals.available)} ${activeCurrency}`,
          },
          {
            label: t("wallet.totalBalance.locked"),
            value: `${formatValue(isEmpty ? 0 : totals.inOrder)} ${activeCurrency}`,
          },
          {
            label: t("wallet.totalBalance.withdrawing"),
            value: `${formatValue(isEmpty ? 0 : totals.withdraw)} ${activeCurrency}`,
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className={cn(
              "flex flex-col justify-center rounded-2xl md:rounded-3xl p-3 md:p-4 shadow-sm transition-transform hover:scale-[1.02]",
              isLime ? "bg-[#0F1415] text-white" : "bg-white text-gray-900",
            )}
          >
            <p className="text-body-lg md:text-title-md">{item.value}</p>
            <p className={cn("text-body-xs-medium md:text-body-xs-medium", isLime ? "text-gray-400" : "text-gray-500")}>{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
