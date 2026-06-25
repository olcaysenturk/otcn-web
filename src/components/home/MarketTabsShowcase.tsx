"use client";

import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { LightSection } from "@/components/home/LightSection";
import { MarketCoinRow } from "@/components/home/MarketCoinRow";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { marketTabs } from "@/data/home";
import { useHomeMarketCoins } from "@/hooks/use-home-market-coins";
import { useI18n } from "@/lib/i18n/I18nProvider";
import type { MarketCoin, MarketTabKey } from "@/types/home";

export function MarketTabsShowcase() {
  const { t } = useI18n();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const [activeTab, setActiveTab] = useState<MarketTabKey>("gainers");
  const marketCoins = useHomeMarketCoins();

  // Freeze each tab's list the first time it has data. Live ticker updates keep
  // re-sorting the source lists, which would reorder cards mid-scroll; the
  // marquee should keep flowing with a stable set instead.
  const [frozen, setFrozen] = useState<Partial<Record<MarketTabKey, MarketCoin[]>>>({});
  useEffect(() => {
    // Snapshot once per tab; returns `prev` when nothing changed, so no loop.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFrozen((prev) => {
      let next = prev;
      (Object.keys(marketCoins) as MarketTabKey[]).forEach((tab) => {
        if (!next[tab] && marketCoins[tab]?.length) {
          if (next === prev) next = { ...prev };
          next[tab] = marketCoins[tab];
        }
      });
      return next;
    });
  }, [marketCoins]);

  // Live price lookup (refreshes every tick), keyed by symbol.
  const liveBySymbol = useMemo(() => {
    const map = new Map<string, MarketCoin>();
    (Object.values(marketCoins) as MarketCoin[][]).forEach((list) =>
      list.forEach((coin) => map.set(coin.symbol, coin)),
    );
    return map;
  }, [marketCoins]);

  // Frozen order keeps cards from reordering mid-scroll; prices stay live.
  const order = frozen[activeTab] ?? marketCoins[activeTab] ?? [];
  const activeCoins = order.map((coin) => liveBySymbol.get(coin.symbol) ?? coin);
  const topCoins = activeCoins.slice(0, 6);
  const bottomCoins = activeCoins.slice(6, 12);

  return (
    <LightSection
      className="min-h-45 lg:min-h-74"
      innerClassName="flex min-h-38 flex-col items-center justify-start px-6 py-16 lg:min-h-65 lg:px-20"
    >
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as MarketTabKey)}
        variant="segment"
        className="flex w-full flex-1 flex-col items-center"
      >
        {/* Tab bar pinned to the top — never shifts when a tab has fewer rows. */}
        <TabsList animated>
          {marketTabs.map((item) => (
            <TabsTrigger key={item.key} value={item.key}>
              {t(item.labelKey)}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Marquee strip centered in the remaining space; top scrolls left,
            bottom scrolls right. Narrow edge fade. */}
        <div className="mt-12 flex w-full max-w-280 flex-1 flex-col justify-center gap-4 mask-[linear-gradient(90deg,transparent,black_4%,black_96%,transparent)] lg:gap-4">
          <MarketCoinRow coins={topCoins} direction="left" locale={locale} />
          {bottomCoins.length > 0 && (
            <MarketCoinRow coins={bottomCoins} direction="right" locale={locale} />
          )}
        </div>
      </Tabs>
    </LightSection>
  );
}
