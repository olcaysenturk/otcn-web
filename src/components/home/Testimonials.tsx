"use client";

import { useParams, useRouter } from "next/navigation";

import { PortfolioCoinCard } from "@/components/home/PortfolioCoinCard";
import { Button } from "@/components/ui/button";
import { portfolioCoins } from "@/data/home";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { withLocale } from "@/lib/i18n/href";

export function TestimonialsSection() {
  const { t } = useI18n();
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "en";

  return (
    <section className="flex flex-col gap-12 rounded-[28px] bg-card p-8 shadow-card-dark lg:flex-row lg:gap-10 lg:p-20">
      {/* Left — copy + CTA */}
      <div className="flex flex-1 flex-col gap-6 lg:pr-25">
        <h2 className="font-sora text-[32px] font-bold leading-[1.1] tracking-tighter text-foreground lg:text-[44px]">
          {t("home.portfolio.title")}
        </h2>
        <p className="max-w-130 font-sora text-[16px] font-normal leading-normal tracking-[-0.01em] text-muted-foreground">
          {t("home.portfolio.description")}
        </p>
        <Button
          variant="secondary"
          onClick={() => router.push(withLocale("/auth/register", locale))}
          className="h-auto w-fit rounded-2xl px-5 py-3 text-[14px]"
        >
          {t("home.portfolio.cta")}
        </Button>
      </div>

      {/* Right — 4 cards per row on large. */}
      <div className="grid flex-1 grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {portfolioCoins.map((coin) => (
          <PortfolioCoinCard
            key={coin.symbol}
            coin={coin}
            href={withLocale(`/trade/spot/${coin.symbol.toLowerCase()}`, locale)}
          />
        ))}
      </div>
    </section>
  );
}
