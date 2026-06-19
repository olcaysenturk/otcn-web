import { getDateFnsLocale as resolveDateFnsLocale } from "@/lib/i18n/dateFnsLocale";
import { getApiLocale as resolveApiLocale, SUPPORTED_LOCALES } from "@/lib/i18n/config";
import type { Locale } from "date-fns";

export type AppLanguage = "en" | "pt" | "es" | "ru";
export type AppCurrency = "TRY" | "USDT";
export type AppDateFormat = "en" | "pt" | "es" | "ru";
export type AppTimeZone = "UTC" | "Europe/Istanbul" | "America/New_York";

export type AppPreferences = {
  timezone: AppTimeZone;
  currency: AppCurrency;
  language: AppLanguage;
  dateFormat: AppDateFormat;
};

export const APP_PREFERENCES_COOKIE_KEY = "account_preferences";

function normalizeLanguage(locale: string): AppLanguage {
  return (SUPPORTED_LOCALES as readonly string[]).includes(locale)
    ? (locale as AppLanguage)
    : "en";
}

export function getDefaultAppPreferences(locale: string = "en"): AppPreferences {
  const language = normalizeLanguage(locale);
  return {
    timezone: "UTC",
    currency: "TRY",
    language,
    dateFormat: language,
  };
}

function parseCookieValue(raw?: string | null): Partial<AppPreferences> | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as Partial<AppPreferences> & { numberFormat?: AppDateFormat };
    if (!parsed || typeof parsed !== "object") return null;

    // Backward compatibility: `numberFormat` key from previous version.
    if (!parsed.dateFormat && parsed.numberFormat) {
      parsed.dateFormat = parsed.numberFormat;
    }

    // Legacy timezone migration.
    // Previous implementation stored UTC/IST/NY; project default is Europe/Istanbul.
    if ((parsed as { timezone?: string }).timezone === "IST") {
      parsed.timezone = "Europe/Istanbul";
    } else if ((parsed as { timezone?: string }).timezone === "NY") {
      parsed.timezone = "America/New_York";
    } else if ((parsed as { timezone?: string }).timezone === "UTC") {
      parsed.timezone = "Europe/Istanbul";
    }

    return parsed;
  } catch {
    return null;
  }
}

export function readAppPreferencesFromCookieString(
  cookieString: string,
  locale: string = "en",
): AppPreferences {
  const defaultPrefs = getDefaultAppPreferences(locale);
  const row = cookieString
    .split("; ")
    .find((entry) => entry.startsWith(`${APP_PREFERENCES_COOKIE_KEY}=`));
  if (!row) return defaultPrefs;
  const value = row.split("=").slice(1).join("=");
  const parsed = parseCookieValue(value);
  return { ...defaultPrefs, ...(parsed ?? {}) };
}

export function getClientAppPreferences(locale: string = "en"): AppPreferences {
  if (typeof document === "undefined") return getDefaultAppPreferences(locale);
  return readAppPreferencesFromCookieString(document.cookie, locale);
}

export function setClientAppPreferences(preferences: AppPreferences) {
  if (typeof document === "undefined") return;
  const encoded = encodeURIComponent(JSON.stringify(preferences));
  const maxAge = 60 * 60 * 24 * 365;
  document.cookie = `${APP_PREFERENCES_COOKIE_KEY}=${encoded}; path=/; max-age=${maxAge}; samesite=lax`;
}

export function getIntlLocale(preferences: AppPreferences): string {
  return resolveApiLocale(preferences.language);
}

export function getApiLocale(preferences: AppPreferences): string {
  return resolveApiLocale(preferences.language);
}

export function getDateFnsLocale(preferences: AppPreferences): Locale {
  return resolveDateFnsLocale(preferences.dateFormat);
}
