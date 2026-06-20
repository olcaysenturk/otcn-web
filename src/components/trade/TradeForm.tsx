"use client";

import { useCallback, useEffect, useState } from "react";
import { TradeOrderForm } from "@/components/trade/TradeOrderForm";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { fetchOtcInfo } from "@/services/otc";
import type { UiPair } from "@/types/otc";
import { useParams } from "next/navigation";
import { withLocale } from "@/lib/i18n/href";

export function TradeForm() {
  const { t, locale } = useI18n();
  const params = useParams();
  const pairParam = (params?.pair as string | undefined) ?? "";
  const [walletRefreshKey, setWalletRefreshKey] = useState(0);
  const [pairs, setPairs] = useState<UiPair[]>([]);
  const [loading, setLoading] = useState(true);
  const [pair, setPair] = useState<UiPair | null>(null);

  const toPairSlug = (p: UiPair) => `${p.base.toLowerCase()}-${p.quote.toLowerCase()}`;
  const toPairSymbolFromParam = (slug: string) => slug.replace(/-/g, "").toUpperCase();
  const tradeBasePath = withLocale("/trade/easy", locale);
  const updateTradeUrl = useCallback((nextPair: UiPair) => {
    if (typeof window === "undefined") return;
    const nextPath = `${tradeBasePath}/${toPairSlug(nextPair)}`;
    const currentPath = `${window.location.pathname}${window.location.search}`;
    if (currentPath === nextPath) return;
    window.history.replaceState(window.history.state, "", nextPath);
  }, [tradeBasePath]);

  useEffect(() => {
    let cancelled = false;

    const loadInfo = async () => {
      try {
        const info = await fetchOtcInfo(locale);
        if (cancelled) return;

        if (info && info.pairs.length > 0) {
          const mappedPairs = info.pairs.map((p) => {
            const baseAsset = info.assets.find((a) => a.symbol === p.base);
            return {
              value: p.symbol,
              base: p.base,
              quote: p.quote,
              baseName: baseAsset?.name || p.base,
            };
          });
          setPairs(mappedPairs);
          setPair(mappedPairs[0]);
        }
      } catch (e) {
        console.error("Failed to fetch OTC info:", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadInfo();

    return () => {
      cancelled = true;
    };
  }, [locale]);

  useEffect(() => {
    if (pairs.length === 0) return;

    const symbolFromParam = pairParam ? toPairSymbolFromParam(pairParam) : "";
    const selectedPair =
      pairs.find((p) => p.value.toUpperCase() === symbolFromParam) ?? pairs[0];

    setPair(selectedPair);

    if (!pairParam || !pairs.some((p) => p.value.toUpperCase() === symbolFromParam)) {
      updateTradeUrl(selectedPair);
    }
  }, [pairParam, pairs, updateTradeUrl]);

  if (loading || !pair) {
    return (
      <div className="min-h-[720px] animate-pulse rounded-[32px] bg-[#222B2C] p-5 md:p-10">
        <div className="h-8 w-44 rounded-full bg-white/10" />
        <div className="mt-3 h-5 w-80 max-w-full rounded-full bg-white/10" />
        <div className="mx-auto mt-12 h-[560px] max-w-[640px] rounded-[32px] bg-white/10" />
      </div>
    );
  }

  return (
    <section className="min-h-[720px] animate-in fade-in rounded-[32px] bg-[#222B2C] px-4 py-7 duration-500 sm:px-7 md:rounded-[44px] md:px-10 md:py-10">
      <div>
        <h1 className="text-[28px] font-medium leading-tight text-white md:text-[32px]">
          {t("trade.title")}
        </h1>
        <p className="mt-2 max-w-[620px] text-[15px] leading-6 text-[#9CA7A8] md:text-base">
          {t("trade.subtitle")}
        </p>
      </div>

      <div className="mx-auto mt-8 w-full max-w-[620px] md:mt-10">
        <TradeOrderForm
          pair={pair}
          pairs={pairs}
          onPairChange={(nextPair) => {
            setPair(nextPair);
            updateTradeUrl(nextPair);
          }}
          onOrderCreated={() => {
            setWalletRefreshKey((prev) => prev + 1);
          }}
          walletRefreshKey={walletRefreshKey}
        />
      </div>
    </section>
  );
}
