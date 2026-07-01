"use client";

import { ChevronDown, Loader2 } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { NumericFormat } from "react-number-format";
import { toast } from "sonner";

import { CoinIcon } from "@/components/ui/CoinIcon";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { FORMAT_CONFIG } from "@/config/format";
import { getSession } from "@/lib/api/session";
import { withLocale } from "@/lib/i18n/href";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { D } from "@/lib/math/decimal";
import { createMarketOrder } from "@/services/otc";
import { fetchWalletAssets } from "@/services/wallet";
import { useExchangeInfoStore } from "@/stores/useExchangeInfoStore";
import { useTickerStore } from "@/stores/useTickerStore";
import type { IcrypexPair } from "@/types/icrypex";
import type { WalletSidebarAsset } from "@/types/wallet";

type Side = "buy" | "sell";

const FALLBACK_BTC_USDT_PAIR: IcrypexPair = {
  symbol: "BTCUSDT",
  base: "BTC",
  quote: "USDT",
  quantityPrecision: 8,
  pricePrecision: 2,
  totalPrecision: 2,
  commissionPrecision: 8,
  displayOrder: 0,
  status: "RUNNING",
  marketTypes: ["SPOT"],
  orderTypes: ["MARKET"],
};

function safeDecimal(value: string, precision: number) {
  try {
    return value ? D.parse(value, precision) : D.zero(precision);
  } catch {
    return D.zero(precision);
  }
}

function AssetPicker({
  symbol,
  options,
  onChange,
}: {
  symbol: string;
  options: string[];
  onChange: (symbol: string) => void;
}) {
  return (
    <Select value={symbol} onValueChange={onChange}>
      <SelectTrigger className="h-11 w-auto min-w-[120px] gap-2 rounded-full border-0 bg-white/10 px-3.5 text-white shadow-none focus:ring-0 data-[size=default]:h-11 [&>svg]:hidden">
        <span className="flex items-center gap-2">
          <CoinIcon symbol={symbol} size={26} />
          <span className="text-[15px] font-bold text-white">{symbol}</span>
          <ChevronDown className="h-4 w-4 text-white/50" />
        </span>
      </SelectTrigger>
      <SelectContent className="max-h-72 rounded-2xl border-white/10 bg-[#161b1b] p-1.5 text-white">
        {options.map((item) => (
          <SelectItem key={item} value={item} className="rounded-xl py-2.5 focus:bg-white/10 focus:text-white">
            <span className="flex items-center gap-2.5">
              <CoinIcon symbol={item} size={24} />
              <span className="font-semibold">{item}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function TradeLandingHero() {
  const { t, locale } = useI18n();
  const router = useRouter();
  const params = useParams();
  const routeLocale = (params?.locale as string) || locale || "en";
  const exchangePairs = useExchangeInfoStore((state) => state.pairs);
  const tickers = useTickerStore((state) => state.tickers);
  const [side, setSide] = useState<Side>("buy");
  const [pairSymbol, setPairSymbol] = useState("BTCUSDT");
  const [inputAmount, setInputAmount] = useState("");
  const [outputAmount, setOutputAmount] = useState("");
  const [lastEditedAmount, setLastEditedAmount] = useState<"input" | "output">("input");
  const [walletAssets, setWalletAssets] = useState<WalletSidebarAsset[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pairs = useMemo(() => {
    const availablePairs = exchangePairs.filter(
      (pair) =>
        pair.status.toUpperCase() === "RUNNING" &&
        pair.marketTypes.some((type) => type.toUpperCase() === "SPOT") &&
        pair.orderTypes.some((type) => type.toUpperCase() === "MARKET"),
    );
    return availablePairs.length > 0 ? availablePairs : [FALLBACK_BTC_USDT_PAIR];
  }, [exchangePairs]);

  const pair =
    pairs.find((item) => item.symbol === pairSymbol) ??
    pairs.find((item) => item.symbol === "BTCUSDT") ??
    pairs[0];
  const ticker = tickers[pair.symbol];
  const price = side === "buy" ? ticker?.a : ticker?.b;
  const inputSymbol = side === "buy" ? pair.quote : pair.base;
  const outputSymbol = side === "buy" ? pair.base : pair.quote;
  const inputPrecision = side === "buy" ? pair.totalPrecision : pair.quantityPrecision;
  const outputPrecision = side === "buy" ? pair.quantityPrecision : pair.totalPrecision;
  const availableRaw =
    walletAssets.find((asset) => asset.symbol === inputSymbol)?.available ?? "0";

  const inputOptions = useMemo(
    () =>
      Array.from(
        new Set(pairs.map((item) => (side === "buy" ? item.quote : item.base))),
      ),
    [pairs, side],
  );
  const outputOptions = useMemo(
    () =>
      Array.from(
        new Set(pairs.map((item) => (side === "buy" ? item.base : item.quote))),
      ),
    [pairs, side],
  );

  useEffect(() => {
    if (pairs.some((item) => item.symbol === pairSymbol)) return;
    const defaultPair = pairs.find((item) => item.symbol === "BTCUSDT") ?? pairs[0];
    setPairSymbol(defaultPair.symbol);
  }, [pairSymbol, pairs]);

  useEffect(() => {
    let cancelled = false;
    fetchWalletAssets({ locale })
      .then((assets) => {
        if (!cancelled) setWalletAssets(assets);
      })
      .catch(() => {
        if (!cancelled) setWalletAssets([]);
      });
    return () => {
      cancelled = true;
    };
  }, [locale]);

  useEffect(() => {
    setInputAmount("");
    setOutputAmount("");
  }, [pair.symbol, side]);

  const calculateOutput = (value: string) => {
    if (!value || !price) return "";
    const input = safeDecimal(value, inputPrecision);
    const marketPrice = safeDecimal(price, pair.pricePrecision);
    if (marketPrice.isZero()) return "";
    return side === "buy"
      ? D.div(input, marketPrice, outputPrecision).str()
      : D.mul(input, marketPrice, outputPrecision).str();
  };

  const calculateInput = (value: string) => {
    if (!value || !price) return "";
    const output = safeDecimal(value, outputPrecision);
    const marketPrice = safeDecimal(price, pair.pricePrecision);
    if (marketPrice.isZero()) return "";
    return side === "buy"
      ? D.mul(output, marketPrice, inputPrecision).str()
      : D.div(output, marketPrice, inputPrecision).str();
  };

  useEffect(() => {
    if (lastEditedAmount === "input") {
      setOutputAmount(calculateOutput(inputAmount));
    } else {
      setInputAmount(calculateInput(outputAmount));
    }
    // Recalculate the opposite field when the live ask/bid price changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [price]);

  const selectPair = (symbol: string, position: "input" | "output") => {
    const nextPair = pairs.find((item) => {
      if (side === "buy") {
        return position === "input"
          ? item.quote === symbol && item.base === pair.base
          : item.base === symbol && item.quote === pair.quote;
      }
      return position === "input"
        ? item.base === symbol && item.quote === pair.quote
        : item.quote === symbol && item.base === pair.base;
    }) ?? pairs.find((item) =>
      side === "buy"
        ? position === "input"
          ? item.quote === symbol
          : item.base === symbol
        : position === "input"
          ? item.base === symbol
          : item.quote === symbol,
    );

    if (nextPair) setPairSymbol(nextPair.symbol);
  };

  const handleSubmit = async () => {
    const session = await getSession();
    if (!session?.authenticated) {
      router.push(withLocale("/auth/login", routeLocale));
      return;
    }

    const entered = safeDecimal(inputAmount, inputPrecision);
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
        quantity: side === "sell" ? inputAmount : "0",
        side: side === "buy" ? "BUY" : "SELL",
        symbol: pair.symbol,
        total: side === "buy" ? inputAmount : "0",
        triggerPrice: "0",
        type: "MARKET",
      });
      if (!response.ok || body?.hasError || body?.content?.ok === false) {
        toast.error(body?.message || t("trade.errors.generic"));
        return;
      }
      toast.success(t("trade.orderSuccess"));
      setInputAmount("");
      setOutputAmount("");
      const assets = await fetchWalletAssets({ locale });
      setWalletAssets(assets);
    } catch {
      toast.error(t("trade.errors.generic"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative overflow-hidden rounded-[24px] border border-white/10 bg-black px-5 py-7 text-white lg:rounded-[36px] lg:px-10 lg:py-10">
      <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="relative h-[260px] overflow-hidden rounded-[20px] lg:h-[460px]">
          <Image
            src="/assets/otcn/hero-liquid.jpg"
            alt=""
            fill
            priority
            sizes="(min-width: 1024px) 640px, 100vw"
            className="object-cover"
            aria-hidden="true"
          />
          <div className="absolute inset-x-3 bottom-3 rounded-[18px] bg-black/55 p-5 backdrop-blur-md lg:inset-x-5 lg:bottom-5 lg:p-7">
            <h2 className="text-[22px] font-black uppercase leading-tight text-white lg:text-[32px]">
              {t("trade.landing.hero.tagline")}
            </h2>
            <p className="mt-3 text-[13px] leading-6 text-white/70 lg:mt-4 lg:text-[15px]">
              {t("trade.landing.hero.descriptionLine1")}
              <br />
              {t("trade.landing.hero.descriptionLine2")}
            </p>
          </div>
        </div>

        <div>
          <div className="grid grid-cols-2 rounded-full bg-[#161b1b] p-1">
            {(["buy", "sell"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setSide(item)}
                className={[
                  "h-11 rounded-full text-[15px] font-bold transition-all",
                  side === item
                    ? item === "sell"
                      ? "bg-[#FF4D6D] text-white"
                      : "bg-white text-[#101515]"
                    : "text-white/50 hover:text-white",
                ].join(" ")}
              >
                {t(`trade.${item}`)}
              </button>
            ))}
          </div>

          <div className="mt-5">
            
            <div className="flex items-center justify-between gap-3 rounded-[18px] bg-[#161b1b] px-4 py-3.5">
              <AssetPicker
                symbol={inputSymbol}
                options={inputOptions}
                onChange={(symbol) => selectPair(symbol, "input")}
              />
              <NumericFormat
                value={inputAmount}
                onValueChange={(values, sourceInfo) => {
                  if (!sourceInfo || sourceInfo.source === "event") {
                    setLastEditedAmount("input");
                    setInputAmount(values.value);
                    setOutputAmount(calculateOutput(values.value));
                  }
                }}
                placeholder="0.00"
                thousandSeparator={FORMAT_CONFIG.thousandSeparator}
                decimalSeparator={FORMAT_CONFIG.fractionSeparator}
                allowedDecimalSeparators={[".", ","]}
                decimalScale={inputPrecision}
                allowNegative={false}
                valueIsNumericString
                className="min-w-0 flex-1 bg-transparent text-right text-[15px] font-bold text-white outline-none placeholder:text-white/30"
              />
            </div>
          </div>

          <div className="relative my-[-7px] flex justify-center">
            <button
              type="button"
              onClick={() => {
                setSide((currentSide) => (currentSide === "buy" ? "sell" : "buy"));
              }}
              aria-label="Swap"
              className="z-10 flex h-10 w-10 items-center justify-center rounded-full border-4 border-black bg-[#161b1b] transition hover:bg-[#1f2626]"
            >
              <Image src="/assets/icons/Swap-Vertical.svg" alt="" width={15} height={16} />
            </button>
          </div>

          <div>
           
            <div className="flex items-center justify-between gap-3 rounded-[18px] bg-[#161b1b] px-4 py-3.5">
              <AssetPicker
                symbol={outputSymbol}
                options={outputOptions}
                onChange={(symbol) => selectPair(symbol, "output")}
              />
              <NumericFormat
                value={outputAmount}
                onValueChange={(values, sourceInfo) => {
                  if (!sourceInfo || sourceInfo.source === "event") {
                    setLastEditedAmount("output");
                    setOutputAmount(values.value);
                    setInputAmount(calculateInput(values.value));
                  }
                }}
                placeholder="0.00"
                thousandSeparator={FORMAT_CONFIG.thousandSeparator}
                decimalSeparator={FORMAT_CONFIG.fractionSeparator}
                allowedDecimalSeparators={[".", ","]}
                decimalScale={outputPrecision}
                allowNegative={false}
                valueIsNumericString
                className="min-w-0 flex-1 bg-transparent text-right text-[15px] font-bold text-white outline-none placeholder:text-white/30"
              />
            </div>
          </div>

          <p className="mt-5 text-center text-sm text-white/45">
            {t("trade.landing.hero.conversionRate")
              .replace("{base}", pair.base)
              .replace(
                "{rate}",
                price
                  ? new Intl.NumberFormat(locale, {
                      maximumFractionDigits: pair.pricePrecision,
                    }).format(Number(price))
                  : "-",
              )
              .replace("{quote}", pair.quote)}
          </p>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !inputAmount || !price}
            className={[
              "mt-5 flex h-14 w-full items-center justify-center rounded-full text-base font-bold transition",
              side === "sell"
                ? "bg-[#FF4D6D] text-white hover:bg-[#E94361] disabled:bg-[#6B303B]"
                : "bg-[#C8FF00] text-[#101515] hover:bg-[#B8EB00] disabled:bg-[#596729]",
              "disabled:cursor-not-allowed disabled:text-white/45",
            ].join(" ")}
          >
            {isSubmitting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : side === "buy" ? (
              t("trade.buyAsset").replace("{asset}", pair.base)
            ) : (
              t("trade.sellAsset").replace("{asset}", pair.base)
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
