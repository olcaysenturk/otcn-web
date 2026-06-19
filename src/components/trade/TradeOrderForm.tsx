"use client";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { useI18n } from "@/lib/i18n/I18nProvider";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { TradeInput } from "@/components/trade/TradeInput";
import { TradePercentSelector } from "@/components/trade/TradePercentSelector";
import { createOtcOrder } from "@/services/otc";
import { getSession } from "@/lib/api/session";
import { fetchWalletAssets } from "@/services/wallet";
import type { WalletSidebarAsset } from "@/types/wallet";
import { UiPair } from "@/types/otc";
import { formatDecimalFromString } from "@/lib/math/formatDecimal";
import { D } from "@/lib/math/decimal";

function parseInput(value: string | number, precision: number) {
  try {
    if (!value) return D.zero(precision);
    const valStr = value.toString().replace(",", ".");

    if (valStr === "0") return D.zero(precision);

    const parsed = D.parse(valStr, precision);

    if (
      Number.isNaN(parsed.integer) ||
      Number.isNaN(parsed.decimal) ||
      typeof parsed.integer !== "number" ||
      typeof parsed.decimal !== "number"
    ) {
      console.warn("Parsed invalid decimal:", parsed);
      return D.zero(precision);
    }

    return parsed;
  } catch (e) {
    console.error("Error parsing input:", e);
    return D.zero(precision);
  }
}

function precisionFor(symbol: string, isQuote: boolean) {
  if (symbol === "TRY") return 2;
  if (symbol === "USDT") return 2;
  return isQuote ? 2 : 8;
}

interface TradeOrderFormProps {
  pair: UiPair;
  pairs: UiPair[];
  onPairChange: (pair: UiPair) => void;
  onOrderCreated?: () => void;
  walletRefreshKey?: number;
}

export function TradeOrderForm({ pair, pairs, onPairChange, onOrderCreated, walletRefreshKey = 0 }: TradeOrderFormProps) {
  const { t, locale } = useI18n();
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState("");
  const [total, setTotal] = useState("");
  const [percent, setPercent] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [walletAssets, setWalletAssets] = useState<WalletSidebarAsset[]>([]);
  const [walletLoading, setWalletLoading] = useState(true);

  const basePrecision = precisionFor(pair.base, false);
  const quotePrecision = precisionFor(pair.quote, true);
  const maxAssetSymbol = side === "buy" ? pair.quote : pair.base;
  const maxPrecision = maxAssetSymbol === pair.quote ? quotePrecision : basePrecision;

  const selectedWalletAsset = useMemo(
    () => walletAssets.find((asset) => asset.symbol === maxAssetSymbol),
    [walletAssets, maxAssetSymbol],
  );
  const maxAvailableRaw = selectedWalletAsset?.available ?? "0";
  const maxAvailable = formatDecimalFromString(maxAvailableRaw, maxPrecision, { minDecimals: 2 });
  const maxAvailableDecimal = D.parse(maxAvailableRaw, maxPrecision);
  const pairSymbol = `${pair.base}${pair.quote}`;


  useEffect(() => {
    let cancelled = false;

    const loadWallet = async () => {
      setWalletLoading(true);
      try {
        const data = await fetchWalletAssets({ locale });
        if (!cancelled) setWalletAssets(data);
      } finally {
        if (!cancelled) setWalletLoading(false);
      }
    };

    loadWallet();

    return () => {
      cancelled = true;
    };
  }, [locale, walletRefreshKey]);

  // Removed useEffect for synchronization

  const updateAmount = (rawTotal: string, rawPrice: string) => {
    if (!rawPrice || rawPrice === "0") return;
    const totalVal = parseInput(rawTotal, quotePrecision);
    const priceVal = parseInput(rawPrice, quotePrecision);

    if (priceVal.isZero()) return;

    const amountVal = D.div(totalVal, priceVal, basePrecision);
    // Use raw string for state to ensure NumericFormat handles it correctly
    setAmount(amountVal.str());
  };

  const updateTotal = (rawAmount: string, rawPrice: string) => {
    if (!rawPrice || !rawAmount) {
      setTotal("");
      return;
    }
    const amountVal = parseInput(rawAmount, basePrecision);
    const priceVal = parseInput(rawPrice, quotePrecision);
    const totalVal = D.mul(amountVal, priceVal, quotePrecision);
    setTotal(totalVal.str());
  };

  const handlePriceChange = (val: string) => {
    setPercent(null);
    setPrice(val);
    updateTotal(amount, val);
  };

  const handleAmountChange = (val: string) => {
    setPercent(null);
    setAmount(val);
    updateTotal(val, price);
  };

  const handleTotalChange = (val: string) => {
    setPercent(null);
    setTotal(val);
    updateAmount(val, price);
  };

  const handlePercentClick = (nextPercent: number) => {
    if (percent === nextPercent) {
      setPercent(null);
      return;
    }

    setPercent(nextPercent);
    const ratio = D.from(nextPercent / 100);
    const priceValue = parseInput(price, quotePrecision);

    if (side === "buy") {
      const nextTotal = D.mul(maxAvailableDecimal, ratio, quotePrecision);
      setTotal(nextTotal.str()); // Store raw string
      if (priceValue.dgreater(D.zero(quotePrecision))) {
        const amountValue = D.div(nextTotal, priceValue, basePrecision);
        setAmount(amountValue.str());
      }
      return;
    }

    const nextAmount = D.mul(maxAvailableDecimal, ratio, basePrecision);
    setAmount(nextAmount.str());
    if (priceValue.dgreater(D.zero(quotePrecision))) {
      const totalValue = D.mul(nextAmount, priceValue, quotePrecision);
      setTotal(totalValue.str());
    }
  };

  const handleSubmit = async () => {
    if (!price || !amount || !total) {
      toast.error(t("trade.errors.invalidAmount"));
      return;
    }

    const amountDecimal = parseInput(amount, basePrecision);
    const totalDecimal = parseInput(total, quotePrecision);
    const priceDecimal = parseInput(price, quotePrecision);

    if (amountDecimal.isZero() || totalDecimal.isZero() || priceDecimal.isZero()) {
      toast.error(t("trade.errors.invalidAmount"));
      return;
    }

    const exceedsAvailable =
      side === "buy"
        ? totalDecimal.dgreater(maxAvailableDecimal)
        : amountDecimal.dgreater(maxAvailableDecimal);

    if (exceedsAvailable) {
      toast.error(t("trade.errors.insufficientBalance"));
      return;
    }

    setIsSubmitting(true);

    try {
      const session = await getSession();
      const accountId = session?.accountIds?.[0];

      if (!accountId) {
        toast.error(t("trade.errors.generic"));
        setIsSubmitting(false);
        return;
      }

      const res = await createOtcOrder(locale, accountId, {
        symbol: pairSymbol,
        quantity: amount, // Sending raw string is fine
        side: side === "buy" ? "BUY" : "SELL",
        price: price,
      });

      if (!res?.ok) {
        const readApiErrorMessage = async (response: Response) => {
          try {
            const contentType = response.headers.get("content-type") || "";
            if (contentType.includes("application/json")) {
              const payload = (await response.json().catch(() => null)) as unknown;
              if (!payload) return "";
              if (typeof payload === "string") return payload;

              if (typeof payload === "object") {
                const payloadRecord = payload as Record<string, unknown>;
                if (typeof payloadRecord.message === "string") return payloadRecord.message;
                if (typeof payloadRecord.error === "string") return payloadRecord.error;
                if (typeof payloadRecord.detail === "string") return payloadRecord.detail;
                if (typeof payloadRecord.title === "string") return payloadRecord.title;

                if (Array.isArray(payloadRecord.errors) && typeof payloadRecord.errors[0] === "string") {
                  return payloadRecord.errors[0];
                }

                if (payloadRecord.errors && typeof payloadRecord.errors === "object") {
                  const errorsRecord = payloadRecord.errors as Record<string, unknown>;
                  const firstKey = Object.keys(errorsRecord)[0];
                  const firstValue = firstKey ? errorsRecord[firstKey] : null;

                  if (Array.isArray(firstValue) && typeof firstValue[0] === "string") return firstValue[0];
                  if (typeof firstValue === "string") return firstValue;
                }
              }

              return "";
            }
            return (await response.text().catch(() => "")).trim();
          } catch {
            return "";
          }
        };

        const mapOrderErrorMessage = (rawMessage: string, statusCode: number) => {
          const m = (rawMessage || "").toLowerCase();

          const isInsufficientBalance =
            m.includes("insufficient") ||
            m.includes("yetersiz") ||
            m.includes("balance") ||
            m.includes("bakiye");

          const isAmountTooLarge =
            statusCode === 413 ||
            (statusCode === 400 && m.includes("amount")) ||
            (statusCode === 422 && m.includes("amount")) ||
            m.includes("too large") ||
            m.includes("too big") ||
            m.includes("exceed") ||
            m.includes("maximum") ||
            m.includes("overflow");

          const isInvalidAmount =
            m.includes("minimum") ||
            m.includes("invalid") ||
            m.includes("precision") ||
            m.includes("format");

          if (isInsufficientBalance) return t("trade.errors.insufficientBalance");
          if (isAmountTooLarge) return t("trade.errors.amountTooLarge");
          if (isInvalidAmount) return t("trade.errors.invalidAmount");
          if (rawMessage) return rawMessage;
          return t("trade.errors.generic");
        };

        const apiError = await readApiErrorMessage(res);
        toast.error(mapOrderErrorMessage(apiError, res.status));
        return;
      }

      toast.success(t("trade.orderSuccess"));
      setAmount("");
      setPrice("");
      setTotal("");
      setPercent(null);
      onOrderCreated?.();
    } catch {
      toast.error(t("trade.errors.generic"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="relative rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-[0_20px_60px_rgba(31,14,70,0.08)] md:rounded-4xl md:p-6"
      aria-busy={isSubmitting}
    >
      {isSubmitting && (
        <div className="absolute inset-0 z-20 flex items-center justify-center rounded-3xl bg-white/50 backdrop-blur-[2px] md:rounded-4xl">
          <Loader2 className="h-6 w-6 animate-spin text-slate-900" />
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 rounded-full border border-slate-200 bg-white p-1 text-sm font-semibold text-gray-700">
        <button
          type="button"
          onClick={() => setSide("buy")}
          className={[
            "rounded-full py-2.5 transition",
            side === "buy"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-gray-600 hover:text-gray-900",
          ].join(" ")}
        >
          {t("trade.buy")}
        </button>
        <button
          type="button"
          onClick={() => setSide("sell")}
          className={[
            "rounded-full py-2.5 transition",
            side === "sell"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-gray-600 hover:text-gray-900",
          ].join(" ")}
        >
          {t("trade.sell")}
        </button>
      </div>

      <div className="mt-4 space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-700">{pair.base}/{pair.quote}</label>
          <Select
            value={pair.value}
            onValueChange={(val) => {
              const next = pairs.find((p) => p.value === val);
              if (next) onPairChange(next);
            }}
          >
            <SelectTrigger className="h-12 w-full rounded-xl border border-border bg-white px-4 text-left text-lg font-semibold text-gray-900 focus:ring-primary data-[size=default]:h-12">
              <div className="flex h-12 items-center">
                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-medium">{pair.base}/{pair.quote}</span>
                </div>
              </div>
            </SelectTrigger>
            <SelectContent className="bg-white text-gray-900">
              {pairs.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  <div className="flex flex-col leading-tight">
                    <span className="text-sm">{p.base}/{p.quote}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <TradeInput
            label={side === "buy" ? t("trade.buyPriceLabel") : t("trade.sellPriceLabel")}
            value={price}
            onValueChange={handlePriceChange}
            decimalScale={quotePrecision}
            className="w-full"
          />
        </div>

        <div className="space-y-1">
          <TradeInput
            label={t("trade.amountLabel")}
            value={amount}
            onValueChange={handleAmountChange}
            decimalScale={basePrecision}
            suffix={pair.base}
          />
        </div>

        <div className="space-y-1">
          <TradeInput
            label={t("trade.totalLabel")}
            value={total}
            onValueChange={handleTotalChange}
            decimalScale={quotePrecision}
            suffix={pair.quote}
          />
        </div>

        <TradePercentSelector value={percent} onChange={handlePercentClick} />

        <div className="flex items-center justify-between text-sm font-semibold text-gray-700">
          <span className="text-gray-500 font-normal">{t("wallet.totalBalance.available")}</span>
          <span>
            {walletLoading ? "-" : maxAvailable} {maxAssetSymbol}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-700">
          <span>{t("trade.feeLabel")}</span>
          <span className="font-semibold text-emerald-600">%4.5</span>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={[
            "mt-2 hidden w-full rounded-full py-3 text-sm font-semibold text-white transition disabled:opacity-60 md:block",
            "bg-linear-to-r from-[#8B5CF6] to-[#3B1F86]",
          ].join(" ")}
        >
          {side === "buy"
            ? `${pair.base} ${t("trade.buyCtaLabel")}`
            : `${pair.base} ${t("trade.sellCtaLabel")}`}
        </button>
      </div>

      <div className="sticky bottom-0 z-30 -mx-5 mt-4 bg-white/90 p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] shadow-[0_-12px_24px_rgba(15,23,42,0.08)] backdrop-blur md:hidden">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={[
            "flex w-full items-center justify-center rounded-full px-4 py-4 text-base font-semibold text-white transition disabled:opacity-60",
            "bg-linear-to-r from-[#8B5CF6] to-[#3B1F86]",
          ].join(" ")}
        >
          {side === "buy"
            ? `${pair.base} ${t("trade.buyCtaLabel")}`
            : `${pair.base} ${t("trade.sellCtaLabel")}`}
        </button>
      </div>
    </div>
  );
}
