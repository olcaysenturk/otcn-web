import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import HomePage from "./[locale]/(site)/page";
import { DEFAULT_LOCALE } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/getMessages";
import { getHomeMetadata } from "@/lib/seo/homepage";

export default async function RootPage() {
  const locale = DEFAULT_LOCALE;
  const messages = await getMessages(locale, ["common", "auth"]);

  return (
    <AppShell locale={locale} messages={messages} requireAuth={false}>
      <HomePage params={Promise.resolve({ locale })} />
    </AppShell>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  return getHomeMetadata(DEFAULT_LOCALE);
}
