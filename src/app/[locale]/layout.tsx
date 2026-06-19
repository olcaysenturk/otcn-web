import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  type Locale,
} from "@/lib/i18n/config";
import { getLocalizedPath } from "@/lib/i18n/navigation";

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}

import { getLocalizedMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const resolved = await params;
  const locale = (
    SUPPORTED_LOCALES.find((candidate) => candidate === resolved.locale) ??
    DEFAULT_LOCALE
  ) as Locale;

  return {
    alternates: getLocalizedMetadata("/", locale),
    other: {
      "content-language": locale,
    },
  };
}
