import { Metadata } from "next";
import { getLocalizedMetadata } from "@/lib/seo/metadata";
import { TradeLandingHero } from "@/components/trade/TradeLandingHero";
import { TradeGettingStarted } from "@/components/trade/TradeGettingStarted";
import { FAQSection } from "@/components/home/FAQSection";
import { MarketTabsShowcase } from "@/components/home/MarketTabsShowcase";
import { AnimatedSection } from "@/components/layout/AnimatedSection";
import { WhatIsCryptoSection } from "@/components/trade/WhatIsCryptoSection";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    alternates: getLocalizedMetadata("/trade/easy", locale),
  };
}

export default function TradeEasyPage() {
  return (
    <div className="space-y-7 pb-7">
      <AnimatedSection id="trade-hero">
        <TradeLandingHero />
      </AnimatedSection>
      <AnimatedSection id="trade-getting-started">
        <TradeGettingStarted />
      </AnimatedSection>
      <AnimatedSection id="trade-market-highlights">
        <MarketTabsShowcase />
      </AnimatedSection>
      <AnimatedSection id="trade-what-is-crypto">
        <WhatIsCryptoSection />
      </AnimatedSection>
      <AnimatedSection id="trade-faq">
        <FAQSection />
      </AnimatedSection>
    </div>
  );
}
