import { Metadata } from "next";
import { getLocalizedMetadata } from "@/lib/seo/metadata";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    alternates: getLocalizedMetadata("/dashboard", locale),
  };
}

export default function DashboardPage() {
  return <DashboardOverview />;
}
