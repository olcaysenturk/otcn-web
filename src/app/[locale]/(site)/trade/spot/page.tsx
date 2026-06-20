import { redirect } from "next/navigation";
import { withLocale } from "@/lib/i18n/href";

export default async function TradeSpotPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(withLocale("/trade/spot/btc", locale));
}
