import { enUS, es, ptBR, ru } from "date-fns/locale";
import type { Locale as DateFnsLocale } from "date-fns";
import type { Locale } from "./config";

const DATE_FNS_LOCALE_MAP: Record<Locale, DateFnsLocale> = {
  en: enUS,
  pt: ptBR,
  es,
  ru,
};

export function getDateFnsLocale(locale: string): DateFnsLocale {
  return DATE_FNS_LOCALE_MAP[locale as Locale] ?? enUS;
}
