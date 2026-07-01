"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ChevronDown, Info, Loader2, Plus } from "lucide-react";
import { NumericFormat } from "react-number-format";
import { toast } from "sonner";

import { CoinIcon } from "@/components/ui/CoinIcon";
import { FORMAT_CONFIG } from "@/config/format";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { D } from "@/lib/math/decimal";
import { formatDecimalFromString } from "@/lib/math/formatDecimal";
import { createMarketOrder } from "@/services/otc";
import { fetchWalletAssets } from "@/services/wallet";
import { useTickerStore } from "@/stores/useTickerStore";
import type { UiPair } from "@/types/otc";
import type { WalletSidebarAsset } from "@/types/wallet";

type Side = "buy" | "sell";

interface TradeOrderFormProps {
  pair: UiPair;
  pairs: UiPair[];
  onPairChange: (pair: UiPair) => void;
  onOrderCreated?: () => void;
  walletRefreshKey?: number;
}

function safeDecimal(value: string, precision: number) {
  try {
    return value ? D.parse(value, precision) : D.zero(precision);
  } catch {
    return D.zero(precision);
  }
}

function AssetSelect({
  value,
  pair,
  pairs,
  side,
  position,
  onChange,
}: {
  value: string;
  pair: UiPair;
  pairs: UiPair[];
  side: Side;
  position: "input" | "output";
  onChange: (pair: UiPair) => void;
}) {
  const selectsBase = (side === "buy" && position === "output") ||
    (side === "sell" && position === "input");

  const options = useMemo(() => {
    const symbols = selectsBase
      ? pairs.map((item) => item.base)
      : pairs.map((item) => item.quote);

    return Array.from(new Set(symbols))
      .map((symbol) => {
        const matchingCurrentPair = pairs.find(
          (item) =>
            (selectsBase ? item.base === symbol : item.quote === symbol) &&
            (selectsBase ? item.quote === pair.quote : item.base === pair.base),
        );
        return (
          matchingCurrentPair ??
          pairs.find((item) => (selectsBase ? item.base === symbol : item.quote === symbol))
        );
      })
      .filter((item): item is UiPair => Boolean(item));
  }, [pair.base, pair.quote, pairs, selectsBase]);

  return (
    <Select
      value={value}
      onValueChange={(symbol) => {
        const next = options.find((item) => (selectsBase ? item.base : item.quote) === symbol);
        if (next) onChange(next);
      }}
    >
      <SelectTrigger className="h-12 w-auto min-w-[126px] gap-2 rounded-full border-0 bg-[#F1F4F2] px-3.5 shadow-none focus:ring-0 data-[size=default]:h-12 [&>svg]:hidden">
        <span className="flex items-center gap-2">
          <CoinIcon symbol={value} size={28} />
          <span className="text-[15px] font-bold text-[#101515]">{value}</span>
          <ChevronDown className="h-4 w-4 text-[#697474]" />
        </span>
      </SelectTrigger>
      <SelectContent className="max-h-72 rounded-2xl border-[#E1E7E4] bg-white p-1.5">
        {options.map((item) => {
          const symbol = selectsBase ? item.base : item.quote;
          return (
            <SelectItem key={symbol} value={symbol} className="rounded-xl py-2.5">
              <span className="flex items-center gap-2.5">
                <CoinIcon symbol={symbol} size={26} />
                <span>
                  <span className="block font-semibold text-[#101515]">{symbol}</span>
                  {selectsBase && (
                    <span className="block text-xs text-[#788282]">{item.baseName}</span>
                  )}
                </span>
              </span>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}

export function TradeOrderForm({
  pair,
  pairs,
  onPairChange,
  onOrderCreated,
  walletRefreshKey = 0,
}: TradeOrderFormProps) {
  const { t, locale } = useI18n();
  const [side, setSide] = useState<Side>("buy");
  const [inputValue, setInputValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [walletAssets, setWalletAssets] = useState<WalletSidebarAsset[]>([]);
  const [walletLoading, setWalletLoading] = useState(true);
  const ticker = useTickerStore((state) => state.tickers[pair.value]);
  const priceRaw = side === "buy" ? ticker?.a : ticker?.b;
  const price = Number(priceRaw ?? 0);
  const isPriceLoading = !priceRaw;

  const basePrecision = pair.quantityPrecision;
  const quotePrecision = pair.totalPrecision;
  const inputSymbol = side === "buy" ? pair.quote : pair.base;
  const outputSymbol = side === "buy" ? pair.base : pair.quote;
  const inputPrecision = side === "buy" ? quotePrecision : basePrecision;
  const outputPrecision = side === "buy" ? basePrecision : quotePrecision;
  const selectedWalletAsset = walletAssets.find((asset) => asset.symbol === inputSymbol);
  const availableRaw = selectedWalletAsset?.available ?? "0";
  const available = formatDecimalFromString(availableRaw, inputPrecision, { minDecimals: 2 });

  const outputValue = useMemo(() => {
    if (!inputValue || !price) return "";
    const input = safeDecimal(inputValue, inputPrecision);
    const marketPrice = D.parse(String(price), pair.pricePrecision);
    if (marketPrice.isZero()) return "";
    return side === "buy"
      ? D.div(input, marketPrice, outputPrecision).str()
      : D.mul(input, marketPrice, outputPrecision).str();
  }, [inputPrecision, inputValue, outputPrecision, pair.pricePrecision, price, side]);

  useEffect(() => {
    setInputValue("");
  }, [pair.value, side]);

  useEffect(() => {
    let cancelled = false;
    const loadWallet = async () => {
      setWalletLoading(true);
      try {
        const assets = await fetchWalletAssets({ locale });
        if (!cancelled) setWalletAssets(assets);
      } catch {
        if (!cancelled) setWalletAssets([]);
      } finally {
        if (!cancelled) setWalletLoading(false);
      }
    };
    loadWallet();
    return () => {
      cancelled = true;
    };
  }, [locale, walletRefreshKey]);

  const useAllBalance = () => {
    setInputValue(availableRaw);
  };

  const handleSubmit = async () => {
    const entered = safeDecimal(inputValue, inputPrecision);
    const balance = safeDecimal(availableRaw, inputPrecision);

    if (entered.isZero() || !price) {
      toast.error(t("trade.errors.invalidAmount"));
      return;
    }
    if (entered.dgreater(balance)) {
      toast.error(t("trade.errors.insufficientBalance"));
      return;
    }

    setIsSubmitting(true);
    try {
      const { response, body } = await createMarketOrder(locale, {
        clientId: "web",
        price: "0",
        quantity: side === "sell" ? inputValue : "0",
        side: side === "buy" ? "BUY" : "SELL",
        symbol: pair.value,
        total: side === "buy" ? inputValue : "0",
        triggerPrice: "0",
        type: "MARKET",
      });

      if (!response.ok || body?.hasError || body?.content?.ok === false) {
        toast.error(body?.message || t("trade.errors.generic"));
        return;
      }

      toast.success(t("trade.orderSuccess"));
      setInputValue("");
      onOrderCreated?.();
    } catch {
      toast.error(t("trade.errors.generic"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-[28px] bg-white p-4 shadow-[0_24px_80px_rgba(0,0,0,0.18)] sm:p-6 md:rounded-[32px] md:p-8">
      {isSubmitting && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/70 backdrop-blur-sm">
          <Loader2 className="h-7 w-7 animate-spin text-[#1C2425]" />
        </div>
      )}

      <div className="grid grid-cols-2 rounded-full bg-[#F1F4F2] p-1">
        {(["buy", "sell"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setSide(item)}
            className={[
              "h-12 rounded-full text-[15px] font-bold transition-all",
              side === item
                ? item === "sell"
                  ? "bg-[#FF4D6D] text-white shadow-sm"
                  : "bg-[#1C2425] text-white shadow-sm"
                : "text-[#697474] hover:text-[#1C2425]",
            ].join(" ")}
          >
            {t(`trade.${item}`)}
          </button>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between rounded-2xl bg-[#F7F9F8] px-4 py-3.5">
        <span className="flex items-center gap-2 text-sm text-[#697474]">
          {t("trade.marketPrice")}
          <Info className="h-4 w-4" />
        </span>
        <span className="text-right text-[15px] font-bold text-[#1C2425]">
          {isPriceLoading ? (
            <span className="inline-block h-5 w-24 animate-pulse rounded bg-[#E3E8E5]" />
          ) : price ? (
            `≈ ${new Intl.NumberFormat(locale, {
              minimumFractionDigits: Math.min(2, quotePrecision),
              maximumFractionDigits: pair.pricePrecision,
            }).format(price)} ${pair.quote}`
          ) : (
            "-"
          )}
        </span>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between px-1">
          <label className="text-sm font-medium text-[#566161]">
            {side === "buy" ? t("trade.youPay") : t("trade.youSell")}
          </label>
          <button
            type="button"
            onClick={useAllBalance}
            className="text-xs font-medium text-[#697474] transition hover:text-[#1C2425]"
          >
            {t("trade.balance")}:{" "}
            <span className="font-bold text-[#1C2425]">
              {walletLoading ? "-" : available} {inputSymbol}
            </span>
          </button>
        </div>

        <div className="flex min-h-[86px] items-center gap-3 rounded-[20px] border border-[#DDE4E0] bg-white px-4 transition focus-within:border-[#9EAA00] focus-within:ring-2 focus-within:ring-[#C8FF00]/30">
          <NumericFormat
            value={inputValue}
            onValueChange={(values, sourceInfo) => {
              if (!sourceInfo || sourceInfo.source === "event") setInputValue(values.value);
            }}
            placeholder="0.00"
            thousandSeparator={FORMAT_CONFIG.thousandSeparator}
            decimalSeparator={FORMAT_CONFIG.fractionSeparator}
            allowedDecimalSeparators={[".", ","]}
            decimalScale={inputPrecision}
            allowNegative={false}
            valueIsNumericString
            className="min-w-0 flex-1 bg-transparent text-[26px] font-medium text-[#101515] outline-none placeholder:text-[#B7C0BC] md:text-[30px]"
          />
          <AssetSelect
            value={inputSymbol}
            pair={pair}
            pairs={pairs}
            side={side}
            position="input"
            onChange={onPairChange}
          />
        </div>
      </div>

      <div className="relative my-[-7px] flex justify-center">
        <span className="z-10 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-[#F1F4F2] text-[#697474]">
          <ArrowDown className="h-4 w-4" />
        </span>
      </div>

      <div>
        <label className="mb-2 block px-1 text-sm font-medium text-[#566161]">
          {side === "buy" ? t("trade.youReceive") : t("trade.youGet")}
        </label>
        <div className="flex min-h-[86px] items-center gap-3 rounded-[20px] bg-[#F7F9F8] px-4">
          <NumericFormat
            value={outputValue}
            displayType="text"
            thousandSeparator={FORMAT_CONFIG.thousandSeparator}
            decimalSeparator={FORMAT_CONFIG.fractionSeparator}
            decimalScale={outputPrecision}
            valueIsNumericString
            placeholder="0.00"
            renderText={(value) => (
              <span className="min-w-0 flex-1 truncate text-[26px] font-medium text-[#101515] md:text-[30px]">
                {value || "0.00"}
              </span>
            )}
          />
          <AssetSelect
            value={outputSymbol}
            pair={pair}
            pairs={pairs}
            side={side}
            position="output"
            onChange={onPairChange}
          />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between px-1 text-sm">
        <span className="text-[#697474]">{t("trade.feeLabel")}</span>
        <span className="font-semibold text-[#1C2425]">%4.5</span>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting || !inputValue || !price}
        className={[
          "mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-full px-5 text-base font-bold transition disabled:cursor-not-allowed disabled:bg-[#E7EBE8] disabled:text-[#9BA5A1]",
          side === "sell"
            ? "bg-[#FF4D6D] text-white hover:bg-[#E94361]"
            : "bg-[#C8FF00] text-[#101515] hover:bg-[#B8EB00]",
        ].join(" ")}
      >
        {side === "buy"
          ? t("trade.buyAsset").replace("{asset}", pair.base)
          : t("trade.sellAsset").replace("{asset}", pair.base)}
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
