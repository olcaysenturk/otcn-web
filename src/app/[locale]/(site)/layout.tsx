import { AppShell } from "@/components/layout/AppShell";
import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  type Locale,
} from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/getMessages";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export default async function SiteLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const resolved = await params;
  const locale = (
    SUPPORTED_LOCALES.find((candidate) => candidate === resolved.locale) ??
    DEFAULT_LOCALE
  ) as Locale;

  const messages = await getMessages(locale, ["common", "auth"]);

  return (
    <div className="min-h-screen bg-surface">
      <AppShell locale={locale} messages={messages}>
        {children}
      </AppShell>
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const resolved = await params;
  const locale = (
    SUPPORTED_LOCALES.find((candidate) => candidate === resolved.locale) ??
    DEFAULT_LOCALE
  );

  const canonical = locale === DEFAULT_LOCALE ? "/" : `/${locale}`;
  const languages = SUPPORTED_LOCALES.reduce<Record<string, string>>(
    (acc, loc) => {
      acc[loc] = loc === DEFAULT_LOCALE ? "/" : `/${loc}`;
      return acc;
    },
    {},
  );

  return {
    alternates: {
      canonical,
      languages,
    },
    other: {
      "content-language": locale,
    },
  };
}
