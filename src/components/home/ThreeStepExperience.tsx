"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

import { LightSection } from "@/components/home/LightSection";
import { MarketCoinRow } from "@/components/home/MarketCoinRow";
import { marketMockData, marketTabs } from "@/data/home";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { cn } from "@/lib/utils";
import type { MarketTabKey } from "@/types/home";

export function ThreeStepExperience() {
  const { t } = useI18n();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const [activeTab, setActiveTab] = useState<MarketTabKey>("gainers");
  const activeCoins = marketMockData[activeTab];
  const topCoins = activeCoins.slice(0, 6);
  const bottomCoins = activeCoins.slice(6, 12);

  return (
    <div className="space-y-5">
      <LightSection className="min-h-[196px] lg:min-h-[330px]" innerClassName="flex min-h-[168px] flex-col items-center justify-center px-0 py-6 lg:min-h-[290px] lg:px-5 lg:py-9">
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

      <LightSection innerClassName="flex min-h-[214px] flex-col items-center justify-center px-5 text-center lg:min-h-[280px]">
        <h2 className="font-satoshi text-[32px] font-black leading-none text-transparent [-webkit-text-stroke:1px_rgba(200,255,0,0.55)] md:text-[72px]">
          {t("home.trade.title")}
        </h2>
        <p className="mt-4 text-[20px] font-semibold text-white md:mt-8 md:text-[36px]">
          {t("home.trade.subtitle")}
        </p>
        <div className="mt-7 flex flex-col items-center justify-center gap-2 text-[11px] font-semibold text-white/55 md:mt-16 md:flex-row md:flex-wrap md:gap-x-8 md:gap-y-4 md:text-sm">
          <span>{t("home.trade.points.trusted")}</span>
          <span className="hidden text-white/20 md:inline">|</span>
          <span>{t("home.trade.points.secure")}</span>
          <span className="hidden text-white/20 md:inline">|</span>
          <span>{t("home.trade.points.regulated")}</span>
          <span className="hidden text-white/20 md:inline">|</span>
          <span>{t("home.trade.points.support")}</span>
        </div>
      </LightSection>
    </div>
  );
}
