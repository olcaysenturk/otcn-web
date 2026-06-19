import { Metadata } from "next";
import { getLocalizedMetadata } from "@/lib/seo/metadata";
import { TradeForm } from "@/components/trade/TradeForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    alternates: getLocalizedMetadata("/trade", locale),
  };
}

export default function TradePage() {
  return <TradeForm />;
}
