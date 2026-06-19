"use client";

import { useCallback, useEffect, useState } from "react";
import { TradeOrderForm } from "@/components/trade/TradeOrderForm";
import { TradeOpenOrders } from "@/components/trade/TradeOpenOrders";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { fetchOtcInfo } from "@/services/otc";
import type { UiPair } from "@/types/otc";
import { useParams } from "next/navigation";
import { withLocale } from "@/lib/i18n/href";

export function TradeForm() {
  const { t, locale } = useI18n();
  const params = useParams();
  const pairParam = (params?.pair as string | undefined) ?? "";
  const [ordersRefreshKey, setOrdersRefreshKey] = useState(0);
  const [walletRefreshKey, setWalletRefreshKey] = useState(0);
  const [pairs, setPairs] = useState<UiPair[]>([]);
  const [loading, setLoading] = useState(true);
  const [pair, setPair] = useState<UiPair | null>(null);

  const toPairSlug = (p: UiPair) => `${p.base.toLowerCase()}-${p.quote.toLowerCase()}`;
  const toPairSymbolFromParam = (slug: string) => slug.replace(/-/g, "").toUpperCase();
  const tradeBasePath = withLocale("/trade", locale);
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
    return null;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 rounded-4xl md:rounded-44 bg-white p-4 md:p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-0">{t("trade.title")}</h1>
      <p className="text-base text-gray-500">{t("trade.subtitle")}</p>
      <div className="mt-6 grid gap-6 lg:grid-cols-[40%_1fr]">
        <TradeOrderForm
          pair={pair}
          pairs={pairs}
          onPairChange={(nextPair) => {
            setPair(nextPair);
            updateTradeUrl(nextPair);
          }}
          onOrderCreated={() => {
            setOrdersRefreshKey((prev) => prev + 1);
            setWalletRefreshKey((prev) => prev + 1);
          }}
          walletRefreshKey={walletRefreshKey}
        />
        <TradeOpenOrders
          refreshKey={ordersRefreshKey}
          symbol={pair.value}
          allPairs={pairs}
        />
      </div>
    </div>
  );
}
