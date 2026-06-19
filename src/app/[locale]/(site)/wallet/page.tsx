import { Metadata } from "next";
import { getLocalizedMetadata } from "@/lib/seo/metadata";
import { WalletOverview } from "@/components/wallet/WalletOverview";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    alternates: getLocalizedMetadata("/wallet", locale),
  };
}

export default function WalletPage() {
  return <WalletOverview />;
}
