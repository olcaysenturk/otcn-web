"use client";

import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { NumericFormat } from "react-number-format";

import { CoinIcon } from "@/components/ui/CoinIcon";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { tradeLandingPairs } from "@/data/tradeLanding";
import { withLocale } from "@/lib/i18n/href";
import { useI18n } from "@/lib/i18n/I18nProvider";

type Side = "buy" | "sell";

function precisionForSymbol(symbol: string) {
  return symbol === "USDT" || symbol === "TRY" ? 2 : 8;
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
  const { t } = useI18n();
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "en";

  const [pairIndex, setPairIndex] = useState(0);
  const [side, setSide] = useState<Side>("buy");
  const [swapped, setSwapped] = useState(false);
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");

  const pair = tradeLandingPairs[pairIndex];
  const fromSymbol = swapped ? pair.quote : pair.base;
  const toSymbol = swapped ? pair.base : pair.quote;
  const fromPrecision = precisionForSymbol(fromSymbol);
  const toPrecision = precisionForSymbol(toSymbol);

  const baseOptions = useMemo(
    () => Array.from(new Set(tradeLandingPairs.map((item) => item.base))),
    [],
  );
  const quoteOptions = useMemo(
    () => Array.from(new Set(tradeLandingPairs.map((item) => item.quote))),
    [],
  );
  const fromOptions = swapped ? quoteOptions : baseOptions;
  const toOptions = swapped ? baseOptions : quoteOptions;

  const resetAmounts = () => {
    setFromAmount("");
    setToAmount("");
  };

  const handleFromChange = (symbol: string) => {
    const idx = tradeLandingPairs.findIndex((item) =>
      swapped ? item.quote === symbol : item.base === symbol,
    );
    if (idx >= 0) {
      setPairIndex(idx);
      resetAmounts();
    }
  };

  const handleToChange = (symbol: string) => {
    const idx = tradeLandingPairs.findIndex((item) =>
      swapped ? item.base === symbol : item.quote === symbol,
    );
    if (idx >= 0) {
      setPairIndex(idx);
      resetAmounts();
    }
  };

  const handleSubmit = () => {
    const slug = `${pair.base.toLowerCase()}-${pair.quote.toLowerCase()}`;
    router.push(withLocale(`/trade/easy/${slug}`, locale));
  };

  return (
    <section className="relative overflow-hidden rounded-[24px] border border-white/10 bg-black px-5 py-7 text-white lg:rounded-[36px] lg:px-10 lg:py-10">
      <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="relative h-[260px] overflow-hidden rounded-[20px] lg:h-[460px]">
          <Image
            src="/assets/bitanova/hero-liquid.jpg"
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
                  side === item ? "bg-white text-[#101515]" : "text-white/50 hover:text-white",
                ].join(" ")}
              >
                {t(`trade.${item}`)}
              </button>
            ))}
          </div>

          <div className="mt-5">
            
            <div className="flex items-center justify-between gap-3 rounded-[18px] bg-[#161b1b] px-4 py-3.5">
              <AssetPicker symbol={fromSymbol} options={fromOptions} onChange={handleFromChange} />
              <NumericFormat
                value={fromAmount}
                onValueChange={(values, sourceInfo) => {
                  if (!sourceInfo || sourceInfo.source === "event") setFromAmount(values.value);
                }}
                placeholder="0.00"
                decimalScale={fromPrecision}
                allowNegative={false}
                className="min-w-0 flex-1 bg-transparent text-right text-[15px] font-bold text-white outline-none placeholder:text-white/30"
              />
            </div>
          </div>

          <div className="relative my-[-7px] flex justify-center">
            <button
              type="button"
              onClick={() => {
                setSwapped((prev) => !prev);
                resetAmounts();
              }}
              aria-label="Swap"
              className="z-10 flex h-10 w-10 items-center justify-center rounded-full border-4 border-black bg-[#161b1b] transition hover:bg-[#1f2626]"
            >
              <Image src="/assets/icons/Swap-Vertical.svg" alt="" width={15} height={16} />
            </button>
          </div>

          <div>
           
            <div className="flex items-center justify-between gap-3 rounded-[18px] bg-[#161b1b] px-4 py-3.5">
              <AssetPicker symbol={toSymbol} options={toOptions} onChange={handleToChange} />
              <NumericFormat
                value={toAmount}
                onValueChange={(values, sourceInfo) => {
                  if (!sourceInfo || sourceInfo.source === "event") setToAmount(values.value);
                }}
                placeholder="0.00"
                decimalScale={toPrecision}
                allowNegative={false}
                className="min-w-0 flex-1 bg-transparent text-right text-[15px] font-bold text-white outline-none placeholder:text-white/30"
              />
            </div>
          </div>

          <p className="mt-5 text-center text-sm text-white/45">
            {t("trade.landing.hero.conversionRate")
              .replace("{base}", pair.base)
              .replace("{rate}", pair.rate)
              .replace("{quote}", pair.quote)}
          </p>

          <button
            type="button"
            onClick={handleSubmit}
            className="mt-5 flex h-14 w-full items-center justify-center rounded-full bg-[#C8FF00] text-base font-bold text-[#101515] transition hover:bg-[#B8EB00]"
          >
            {side === "buy"
              ? t("trade.buyAsset").replace("{asset}", toSymbol)
              : t("trade.sellAsset").replace("{asset}", fromSymbol)}
          </button>
        </div>
      </div>
    </section>
  );
}
