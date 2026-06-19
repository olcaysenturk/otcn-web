"use client";

import { useParams, useRouter } from "next/navigation";

import { LightSection } from "@/components/home/LightSection";
import { PortfolioCoinCard } from "@/components/home/PortfolioCoinCard";
import { portfolioCoins } from "@/data/home";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { withLocale } from "@/lib/i18n/href";

export function TestimonialsSection() {
  const { t } = useI18n();
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "en";

  return (
    <LightSection
      className="border border-white/10"
      innerClassName="grid min-h-[604px] gap-6 px-4 py-6 md:min-h-[450px] md:grid-cols-[0.95fr_1.15fr] md:items-center md:gap-10 md:px-[86px] md:py-[84px]"
    >
      <div>
        <h2 className="max-w-[520px] text-[24px] font-black leading-[0.98] tracking-normal text-white md:text-[45px]">
          {t("home.portfolio.title")}
        </h2>
        <p className="mt-5 max-w-[520px] text-[13px] font-medium leading-[1.45] text-white/62 md:mt-8 md:text-[16px] md:leading-[1.55]">
          {t("home.portfolio.description")}
        </p>
        <button
          type="button"
          onClick={() => router.push(withLocale("/auth/register", locale))}
          className="mt-7 hidden h-11 items-center justify-center rounded-[12px] bg-white px-6 text-sm font-black text-[#101414] transition hover:bg-[#C8FF00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 md:inline-flex"
        >
          {t("home.portfolio.cta")}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:justify-self-end md:gap-x-6 md:gap-y-6">
        {portfolioCoins.map((coin) => (
          <PortfolioCoinCard key={coin.symbol} coin={coin} />
        ))}
        <button
          type="button"
          onClick={() => router.push(withLocale("/auth/register", locale))}
          className="flex h-[118px] min-w-0 items-center justify-center whitespace-nowrap rounded-[12px] bg-white px-2 text-[11px] font-black text-[#101414] transition hover:bg-[#C8FF00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 md:hidden"
        >
          {t("home.portfolio.cta")}
        </button>
      </div>
    </LightSection>
  );
}
