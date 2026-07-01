"use client";

import { CoinIcon } from "@/components/ui/CoinIcon";
import { useI18n } from "@/lib/i18n/I18nProvider";

export function WhatIsCryptoSection() {
  const { t } = useI18n();

  return (
    <section className="relative min-h-[310px] overflow-hidden rounded-[28px] border border-white/10 bg-[#0e0f10] px-7 py-10 text-white shadow-[0_2px_8px_0.3px_rgba(58,64,67,0.2)] md:px-12 md:py-14 lg:min-h-[310px] lg:px-[84px] lg:py-[78px]">
      <div className="relative z-10 grid gap-8 lg:grid-cols-[310px_minmax(0,1fr)] lg:gap-[78px]">
        <h2 className="max-w-[330px] text-[38px] font-semibold leading-[1.08] tracking-[-0.045em] text-white md:text-[46px]">
          {t("trade.landing.whatIsCrypto.title")}
        </h2>

        <div className="max-w-[780px] space-y-6 text-[14px] leading-[1.55] text-white/65 md:text-[15px]">
          <p>{t("trade.landing.whatIsCrypto.firstParagraph")}</p>
          <p>{t("trade.landing.whatIsCrypto.secondParagraph")}</p>
        </div>
      </div>

      <div
        className="pointer-events-none absolute -bottom-12 left-[-24px] h-20 w-20 rounded-full border border-[#263038] bg-[#111416] opacity-80"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-5 left-[82px] flex h-20 w-20 items-center justify-center rounded-full bg-[#3a260f]/85 opacity-70 md:left-[86px]"
        aria-hidden="true"
      >
        <CoinIcon symbol="BTC" size={48} className="opacity-35 grayscale" />
      </div>
      <div
        className="pointer-events-none absolute -bottom-9 left-[140px] flex h-[82px] w-[82px] items-center justify-center rounded-full bg-[#453612]/75 opacity-65 md:left-[138px]"
        aria-hidden="true"
      >
        <CoinIcon symbol="BNB" size={48} className="opacity-30 grayscale" />
      </div>
      <div
        className="pointer-events-none absolute -bottom-6 left-[258px] opacity-35 md:left-[266px]"
        aria-hidden="true"
      >
        <CoinIcon symbol="SOL" size={58} className="rounded-none" />
      </div>
    </section>
  );
}
