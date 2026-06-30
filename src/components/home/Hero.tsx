"use client";

import { ChevronRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Line, LineChart, ResponsiveContainer, Tooltip, YAxis } from "recharts";

import { PopularSkeletonRows } from "@/components/home/PopularSkeleton";
import { Button } from "@/components/ui/button";
import { CoinIcon } from "@/components/ui/CoinIcon";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { withLocale } from "@/lib/i18n/href";
import { useHomeMarketCoins } from "@/hooks/use-home-market-coins";
import { cn } from "@/lib/utils";
import type { MarketCoin } from "@/types/home";

const CHART_RECORD_COUNT = 30;

function createWavyChartData(start: number, end: number, amplitude: number) {
  return Array.from({ length: CHART_RECORD_COUNT }, (_, index) => {
    const progress = index / (CHART_RECORD_COUNT - 1);
    const trend = start + (end - start) * progress;
    const wave =
      index === CHART_RECORD_COUNT - 1
        ? 0
        : (Math.sin(index * 1.85) + Math.sin(index * 0.72) * 0.35) * amplitude;

    return { price: Number((trend + wave).toFixed(6)) };
  });
}

const risingChartData = createWavyChartData(186.15, 187.546, 0.55);
const fallingChartData = createWavyChartData(0.062598, 0.062129, 0.00024);

function StatCard({
  title,
  caption,
  value,
  change,
  up,
}: {
  title: string;
  caption: string;
  value: string;
  change: string;
  up: boolean;
}) {
  const [isChartReady, setIsChartReady] = useState(false);
  const chartData = (up ? risingChartData : fallingChartData).slice(-CHART_RECORD_COUNT);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setIsChartReady(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="relative flex flex-1 flex-col justify-between gap-8 overflow-hidden rounded-[14px] border border-foreground/10 bg-card/40 p-6 backdrop-blur-sm">
      <p className="relative z-20 whitespace-pre-line font-sora text-[16px] font-bold leading-normal tracking-[-0.01em] text-foreground">
        {title}
      </p>
      <div
        aria-hidden="true"
        className={cn(
          "absolute right-5 top-4 z-10 h-23.25 w-21.5",
          up ? "text-success" : "text-destructive",
        )}
      >
        {isChartReady && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 4, right: 3, bottom: 4, left: 3 }}
              accessibilityLayer={false}
            >
              <YAxis hide domain={["dataMin", "dataMax"]} />
              <Line
                type="monotone"
                dataKey="price"
                stroke="currentColor"
                strokeWidth={2.25}
                dot={false}
                activeDot={{
                  r: 3,
                  strokeWidth: 0,
                  fill: up ? "#27E9A6" : "#FF4D6D",
                }}
                isAnimationActive
                animationBegin={100}
                animationDuration={1400}
                animationEasing="ease-out"
              />
              <Tooltip
                isAnimationActive={false}
                cursor={{
                  stroke: "currentColor",
                  strokeOpacity: 0.25,
                  strokeDasharray: "3 3",
                }}
                allowEscapeViewBox={{ x: true, y: true }}
                content={({ active, payload }) => {
                  const price = payload?.[0]?.value;
                  if (!active || price === undefined) return null;

                  return (
                    <div className="rounded-md border border-border bg-card px-2 py-1 shadow-lg">
                      <span className="whitespace-nowrap font-sora text-[10px] font-semibold text-foreground">
                        {String(price)}
                      </span>
                    </div>
                  );
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
      <div className="flex flex-col gap-3">
        <p className="font-sora text-[32px] font-semibold leading-tight tracking-[-0.005em] text-foreground">
          {value}
        </p>
        <div className="flex items-center gap-2.5">
          <span
            className={cn(
              "inline-flex items-center justify-center rounded-lg border bg-card px-2 py-1.5 text-[14px] font-medium",
              up ? "border-success/50 text-success" : "border-destructive/50 text-destructive",
            )}
          >
            {change}
          </span>
          <span className="font-sora text-[12px] font-semibold leading-none text-gray-steel">
            {caption}
          </span>
        </div>
      </div>
    </div>
  );
}

function ProvideText({ text }: { text: string }) {
  // Layered decorative text — primary, primary/24, primary outline.
  return (
    <div className="pointer-events-none relative hidden select-none font-sora font-extrabold leading-normal tracking-tighter lg:block">
      <span className="block text-[46px] text-primary">{text}</span>
      <span className="-mt-3 block text-[52px] text-primary/25">{text}</span>
      <span className="-mt-4 block text-[59px] text-transparent [-webkit-text-stroke:2.48px_rgba(245,74,20,0.19)]">
        {text}
      </span>
    </div>
  );
}

export function HeroSection() {
  const { t } = useI18n();
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  // Real "Popular" coins. The volume sort keeps reshuffling while data streams in
  // (e.g. BTC starts on top, then drops to 4th), so lock the order once it has been
  // identical for a couple of ticks; show a skeleton until then and keep prices live
  // afterwards so icons never jump on refresh.
  const market = useHomeMarketCoins();
  const [order, setOrder] = useState<MarketCoin[]>([]);
  const sigRef = useRef("");
  const stableRef = useRef(0);
  useEffect(() => {
    if (order.length) return;
    const top = market.mostVisited.slice(0, 7);
    if (top.length < 7) return;
    const sig = top.map((coin) => coin.symbol).join(",");
    if (sig === sigRef.current) {
      stableRef.current += 1;
      if (stableRef.current >= 2) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setOrder(top);
      }
    } else {
      sigRef.current = sig;
      stableRef.current = 0;
    }
  }, [market.mostVisited, order.length]);

  // Live price lookup (refreshes every tick), keyed by symbol.
  const liveBySymbol = useMemo(() => {
    const map = new Map<string, MarketCoin>();
    (Object.values(market) as MarketCoin[][]).forEach((list) =>
      list.forEach((coin) => map.set(coin.symbol, coin)),
    );
    return map;
  }, [market]);

  const popular = order.map((coin) => liveBySymbol.get(coin.symbol) ?? coin);

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-card bg-card px-6 py-16 lg:px-20 lg:py-30">
      {/* Background photo */}
      <Image
        src="/assets/otcn/hero-content-bg.png"
        alt=""
        aria-hidden
        fill
        priority
        sizes="100vw"
        className="pointer-events-none object-cover object-[70%_50%]"
      />
      <div className="pointer-events-none absolute inset-0 bg-card/40" />

      <div className="relative z-10 flex flex-col gap-20 xl:flex-row xl:items-stretch xl:gap-20">
        {/* Left */}
        <div className="flex flex-1 flex-col justify-between gap-14">
          <div className="flex flex-col gap-6">
            <h1 className="max-w-160 font-sora text-[32px] font-semibold leading-[1.3] tracking-tighter text-foreground lg:text-[48px] lg:leading-normal">
              {t("home.hero.title.line1")}{" "}
              <br className="hidden lg:block" />
              {t("home.hero.title.line2")} {t("home.hero.title.line3")}
            </h1>

            <div className="flex w-full max-w-120 items-center gap-2.5 rounded-2xl border border-border bg-card py-2 pl-5 pr-2">
              <input
                type="text"
                placeholder={t("home.hero.inputPlaceholder")}
                aria-label={t("home.hero.inputAriaLabel")}
                className="min-w-0 flex-1 bg-transparent font-sora text-[18px] font-semibold tracking-[-0.015em] text-foreground caret-primary outline-none placeholder:text-gray-steel"
              />
              <Button
                onClick={() => router.push(withLocale("/auth/register", locale))}
                className="h-auto shrink-0 rounded-[14px] px-5.5 py-3.75 text-[16px]"
              >
                {t("home.hero.startNow")}
                <ChevronRight className="size-5" />
              </Button>
            </div>
          </div>

          <ProvideText text={t("home.hero.provideText")} />
        </div>

        {/* Right */}
        <div className="flex flex-col gap-6 sm:flex-row xl:gap-6">
          <div className="flex w-full flex-col gap-6 sm:w-50">
            <StatCard
              title={t("home.hero.metrics.marketCap.title")}
              caption={t("home.hero.metrics.helper")}
              value="187.546"
              change="+0.75%"
              up
            />
            <StatCard
              title={t("home.hero.metrics.bitcoinDominance.title")}
              caption={t("home.hero.metrics.helper")}
              value="0.062129"
              change="-0.75%"
              up={false}
            />
          </div>

          {/* Popular */}
          <div className="flex w-full flex-col gap-8 rounded-[14px] border border-foreground/10 bg-card/40 p-6 backdrop-blur-sm sm:w-75.75">
            <p className="font-sora text-[16px] font-bold leading-normal tracking-[-0.01em] text-foreground">
              {t("home.hero.popular")}
            </p>
            {order.length === 0 ? (
              <PopularSkeletonRows />
            ) : (
              <div className="flex flex-col gap-1">
                {popular.map((row) => {
                  const up = !row.change.startsWith("-");
                  return (
                    <div
                      key={row.symbol}
                      className="flex h-16 items-center justify-between gap-2 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <CoinIcon symbol={row.symbol} size={44} />
                        <span className="font-sora text-[18px] font-semibold tracking-[-0.015em] text-foreground">
                          {row.symbol}
                        </span>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="font-sora text-[16px] font-semibold tracking-[-0.01em] text-foreground">
                          {row.price}
                        </span>
                        <span
                          className={cn(
                            "font-sora text-[12px] font-bold tracking-[-0.01em]",
                            up ? "text-success" : "text-destructive",
                          )}
                        >
                          {row.change}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
