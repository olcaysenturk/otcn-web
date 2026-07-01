import { redirect } from "next/navigation";

type LegacyMarketRouteProps = {
  params: Promise<{ locale: string }>;
};

export default async function LegacyMarketRoute({
  params,
}: LegacyMarketRouteProps) {
  const { locale } = await params;

  redirect(`/${locale}/markets`);
}
