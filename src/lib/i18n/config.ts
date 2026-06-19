export const SUPPORTED_LOCALES = ["en", "pt", "es", "ru"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

const API_LOCALE_MAP: Record<Locale, string> = {
  en: "en-US",
  pt: "pt-BR",
  es: "es-ES",
  ru: "ru-RU",
};

export function getApiLocale(locale: string): string {
  return API_LOCALE_MAP[locale as Locale] ?? API_LOCALE_MAP[DEFAULT_LOCALE];
}
