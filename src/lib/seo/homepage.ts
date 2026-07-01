import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n/config";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/getMessages";

const siteName = "Nextbit OTC";
const titleSuffix = "Nextbit OTC";
const fallbackDescription: Record<Locale, string> = {
  en: "Institutional OTC crypto trading by Nextbit OTC. Tailored pricing, fast settlement, and expert support for high-volume trades.",
  pt: "Negociação institucional de criptomoedas OTC pela Nextbit OTC. Preços personalizados, liquidação rápida e suporte especializado para operações de alto volume.",
  es: "Negociación institucional de criptomonedas OTC por Nextbit OTC. Precios personalizados, liquidación rápida y soporte experto para operaciones de gran volumen.",
  ru: "Институциональная OTC-торговля криптовалютой от Nextbit OTC. Индивидуальные цены, быстрый расчёт и экспертная поддержка для крупных операций.",
};
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const baseUrl = siteUrl.replace(/\/$/, "");

function getMessage(messages: Record<string, unknown>, key: string) {
  const direct = messages[key];
  if (direct !== undefined) return direct;

  const parts = key.split(".");
  let current: unknown = messages;

  for (const part of parts) {
    if (
      current &&
      typeof current === "object" &&
      part in (current as Record<string, unknown>)
    ) {
      current = (current as Record<string, unknown>)[part];
    } else {
      current = undefined;
      break;
    }
  }

  return current;
}

export function resolveLocale(locale: string): Locale {
  return (
    SUPPORTED_LOCALES.find((candidate) => candidate === locale) ??
    DEFAULT_LOCALE
  ) as Locale;
}

export function getHomeUrl(locale: Locale) {
  const pathname = locale === DEFAULT_LOCALE ? "/" : `/${locale}`;
  return `${baseUrl}${pathname}`;
}

export async function getHomeSeoCopy(locale: Locale) {
  const messages = await getMessages(locale, ["common"]);
  const heroTitle = getMessage(messages, "hero.title");
  const heroSubtitle = getMessage(messages, "hero.subtitle");

  const title =
    typeof heroTitle === "string"
      ? `${heroTitle} | ${titleSuffix}`
      : titleSuffix;
  const localizedDescription =
    fallbackDescription[locale] ?? fallbackDescription[DEFAULT_LOCALE];
  const description =
    typeof heroSubtitle === "string" && /otc/i.test(heroSubtitle)
      ? heroSubtitle
      : localizedDescription;

  return { title, description };
}

import { getLocalizedMetadata } from "./metadata";

export async function getHomeMetadata(locale: Locale): Promise<Metadata> {
  const { title, description } = await getHomeSeoCopy(locale);
  const url = getHomeUrl(locale);

  return {
    title,
    description,
    alternates: getLocalizedMetadata("/", locale),
    openGraph: {
      title,
      description,
      url,
      siteName,
      locale,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export async function getHomeStructuredData(locale: Locale) {
  const { description } = await getHomeSeoCopy(locale);
  const url = getHomeUrl(locale);
  const logo = `${baseUrl}/assets/otcn/logo.svg`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: siteName,
        url,
        logo,
      },
      {
        "@type": "WebSite",
        name: titleSuffix,
        url,
        description,
        inLanguage: locale,
      },
    ],
  };
}
