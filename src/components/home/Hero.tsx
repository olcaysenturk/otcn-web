"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import { HeroMetricCard } from "@/components/home/HeroMetricCard";
import { HeroPopularCard } from "@/components/home/HeroPopularCard";
import { heroCoins, heroMetrics, mobileHeroCoins } from "@/data/home";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { withLocale } from "@/lib/i18n/href";

export function HeroSection() {
  const { t } = useI18n();
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "en";

  return (
    <section className="relative min-h-[642px] overflow-hidden rounded-[24px] border border-white/10 bg-black px-5 py-7 text-white lg:min-h-[640px] lg:rounded-[36px] lg:px-[60px] lg:py-[74px] xl:min-h-[760px]">
      <Image
        src="/assets/bitanova/hero-background.png"
        alt=""
        fill
        priority
        sizes="(min-width: 1024px) 1400px, 100vw"
        className="object-cover object-[61%_50%] lg:object-[65%_50%]"
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.95)_0%,rgba(0,0,0,0.82)_42%,rgba(0,0,0,0.24)_68%,rgba(0,0,0,0.04)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-black/[0.04]" />

      <div className="relative z-10 grid min-h-[586px] min-w-0 gap-0 lg:min-h-[560px] lg:grid-cols-[1.06fr_0.94fr] lg:gap-10 xl:min-h-[612px]">
        <div className="flex min-w-0 flex-col justify-center lg:justify-start lg:pt-[58px]">
          <h1 className="max-w-[660px] text-[20px] font-semibold leading-[1.32] tracking-normal text-white lg:text-[40px] lg:leading-[1.3] xl:text-[48px] xl:leading-[1.36]">
            {t("home.hero.title.line1")}
            <br />
            {t("home.hero.title.line2")}
            <br />
            {t("home.hero.title.line3")}
          </h1>

          <div className="relative mt-7 flex h-11 w-full max-w-[430px] items-center rounded-[13px] border border-white/15 bg-[#121717] p-1 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] lg:mt-[44px] lg:h-16 lg:p-1.5">
            <input
              aria-label={t("home.hero.inputAriaLabel")}
              placeholder={t("home.hero.inputPlaceholder")}
              className="min-w-0 flex-1 bg-transparent px-2.5 pr-[98px] text-[11px] font-medium text-white outline-none placeholder:text-white/30 lg:px-4 lg:pr-[132px] lg:text-[17px]"
            />
            <button
              type="button"
              onClick={() => router.push(withLocale("/auth/register", locale))}
              className="absolute right-1 top-1 inline-flex h-8 w-[98px] shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-[11px] bg-[#C8FF00] px-2 text-[10px] font-bold text-black transition hover:bg-[#B7EA00] lg:right-1.5 lg:top-1.5 lg:h-[52px] lg:w-auto lg:gap-2 lg:rounded-[12px] lg:px-6 lg:text-[15px]"
            >
              {t("home.hero.startNow")}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-[98px] hidden text-[34px] font-black leading-[0.95] text-[#C8FF00] md:text-[42px] lg:block lg:text-[50px]">
            {t("home.hero.provideText")}
            <div className="mt-4 text-[#C8FF00]/20">{t("home.hero.provideText")}</div>
            <div className="mt-3 text-transparent [-webkit-text-stroke:1px_rgba(200,255,0,0.28)]">
              {t("home.hero.provideText")}
            </div>
          </div>
        </div>

        <div className="mt-5 grid h-[290px] grid-cols-[112px_minmax(0,250px)] justify-between gap-2.5 lg:hidden">
          <div className="flex flex-col gap-2.5">
            {heroMetrics.map((metric) => (
              <HeroMetricCard key={metric.titleKey} {...metric} variant="mobile" />
            ))}
          </div>
          <HeroPopularCard coins={mobileHeroCoins} variant="mobile" />
        </div>

        <div className="relative mt-[30px] hidden h-[440px] w-[440px] justify-self-end lg:block xl:mt-[26px] xl:h-[528px] xl:w-[528px]">
          {heroMetrics.map((metric) => (
            <HeroMetricCard key={metric.titleKey} {...metric} variant="desktop" />
          ))}
          <HeroPopularCard coins={heroCoins} variant="desktop" />
        </div>

        <div className="mt-5 text-[25px] font-black leading-[0.95] text-[#C8FF00] lg:hidden">
          {t("home.hero.provideText")}
          <div className="mt-3 text-[#C8FF00]/20">{t("home.hero.provideText")}</div>
          <div className="mt-2 text-transparent [-webkit-text-stroke:1px_rgba(200,255,0,0.28)]">
            {t("home.hero.provideText")}
          </div>
        </div>
      </div>
    </section>
  );
}
