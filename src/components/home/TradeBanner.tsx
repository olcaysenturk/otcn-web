"use client";

import { useI18n } from "@/lib/i18n/I18nProvider";

export function TradeBannerSection() {
  const { t } = useI18n();

  const features = [
    t("home.tradeBanner.features.f1"),
    t("home.tradeBanner.features.f2"),
    t("home.tradeBanner.features.f3"),
    t("home.tradeBanner.features.f4"),
  ];

  return (
    <section className="flex flex-col items-center gap-12 rounded-[28px] bg-card px-6 py-16 text-center shadow-card-dark lg:gap-20 lg:p-20">
      <div className="flex flex-col items-center gap-2">
        {/* Outlined title — Sora ExtraBold, transparent fill + 2px primary stroke. */}
        <h2 className="text-center font-sora text-[40px] font-extrabold leading-none tracking-[-0.02em] text-transparent [-webkit-text-stroke:2px_hsl(var(--primary))] [paint-order:stroke] sm:text-[60px] lg:text-[84px]">
          {t("home.tradeBanner.title")}
        </h2>
        <p className="max-w-150.5 font-sora text-[26px] font-bold leading-[1.15] tracking-tighter text-foreground sm:text-[36px] lg:text-[44px]">
          {t("home.tradeBanner.subtitle")}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 lg:gap-6">
        {features.map((feature, index) => (
          <div key={feature} className="flex items-center gap-4 lg:gap-6">
            {index > 0 && (
              <span
                aria-hidden
                className="h-4.5 w-0.5 shrink-0 rounded-sm bg-border"
              />
            )}
            <span className="font-sora text-[16px] font-semibold tracking-[-0.015em] text-muted-foreground lg:text-[18px]">
              {feature}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
