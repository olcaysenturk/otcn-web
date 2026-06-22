"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

import { LightSection } from "@/components/home/LightSection";
import { MarketCoinRow } from "@/components/home/MarketCoinRow";
import { marketTabs } from "@/data/home";
import { useHomeMarketCoins } from "@/hooks/use-home-market-coins";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { cn } from "@/lib/utils";
import type { MarketTabKey } from "@/types/home";

export function MarketTabsShowcase() {
  const { t } = useI18n();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const [activeTab, setActiveTab] = useState<MarketTabKey>("gainers");
  const marketCoins = useHomeMarketCoins();
  const activeCoins = marketCoins[activeTab];
  const topCoins = activeCoins.slice(0, 6);
  const bottomCoins = activeCoins.slice(6, 12);

  return (
    <LightSection
      className="min-h-[196px] lg:min-h-[330px]"
      innerClassName="flex min-h-[168px] flex-col items-center justify-center px-0 py-6 lg:min-h-[290px] lg:px-5 lg:py-9"
    >
      <div className="inline-flex rounded-[10px] bg-[#252c2d] p-1 text-[11px] font-semibold text-white/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] lg:rounded-[12px] lg:text-sm">
        {marketTabs.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setActiveTab(item.key)}
            className={cn(
              "min-w-[72px] rounded-[8px] px-3 py-1.5 text-center transition-colors lg:min-w-[84px] lg:rounded-[10px] lg:px-4 lg:py-2",
              activeTab === item.key
                ? "bg-[#111515] text-white shadow-[0_6px_18px_rgba(0,0,0,0.2)]"
                : "text-white/55 hover:text-white",
            )}
            aria-pressed={activeTab === item.key}
          >
            {t(item.labelKey)}
          </button>
        ))}
      </div>

      <div className="mt-7 flex w-full max-w-[1050px] flex-col gap-3 [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)] lg:mt-10 lg:gap-4">
        <MarketCoinRow coins={topCoins} direction="right" locale={locale} />
        <MarketCoinRow coins={bottomCoins} direction="left" locale={locale} />
      </div>
    </LightSection>
  );
}
