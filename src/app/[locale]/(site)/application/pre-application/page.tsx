import { notFound } from "next/navigation";
import { getApplicationTabs } from "@/data/application-tabs";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/config";
import { ApplicationOverview } from "@/components/application/ApplicationOverview";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function PreApplicationPage({ params }: Props) {
  const { locale } = await params;
  const effectiveLocale = (locale as Locale) ?? DEFAULT_LOCALE;
  const tabs = await getApplicationTabs(effectiveLocale);
  const current = tabs.find((item) => item.slug === "pre-application");
  if (!current) return notFound();

  return (
    <ApplicationOverview />
  );
}
