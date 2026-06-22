"use client";

import { LightSection } from "@/components/home/LightSection";
import { MarketTabsShowcase } from "@/components/home/MarketTabsShowcase";
import { useI18n } from "@/lib/i18n/I18nProvider";

export function ThreeStepExperience() {
  const { t } = useI18n();

  return (
    <div className="space-y-5">
      <MarketTabsShowcase />

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
