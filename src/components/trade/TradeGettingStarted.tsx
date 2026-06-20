"use client";

import { LightSection } from "@/components/home/LightSection";
import { useI18n } from "@/lib/i18n/I18nProvider";

type Step = { title: string; description: string };

export function TradeGettingStarted() {
  const { t, get } = useI18n();
  const steps = (get("trade.landing.gettingStarted.steps") as Step[] | undefined) ?? [];

  return (
    <LightSection innerClassName="px-5 py-8 md:px-10 md:py-12">
      <h2 className="text-[26px] font-medium text-white md:text-[34px]">
        <span className="text-white/45">{t("trade.landing.gettingStarted.title")}</span>{" "}
        <span className="font-bold text-white">
          {t("trade.landing.gettingStarted.titleHighlight")}
        </span>
      </h2>

      <div className="relative mt-7 h-0.5 w-full bg-white/10 md:mt-10">
        <div className="absolute left-0 top-0 h-0.5 w-1/3 bg-[#C8FF00]" />
      </div>

      <div className="mt-7 grid gap-8 md:grid-cols-3 md:gap-0 md:divide-x md:divide-white/10">
        {steps.map((step, index) => (
          <div key={step.title} className="md:px-8 md:first:pl-0 md:last:pr-0">
            <span className="text-xs font-semibold text-white/40">
              {String(index + 1).padStart(2, "0")}.
            </span>
            <h3 className="mt-2 text-lg font-semibold text-white">{step.title}</h3>
            <p className="mt-3 text-sm leading-6 text-white/55">{step.description}</p>
          </div>
        ))}
      </div>
    </LightSection>
  );
}
