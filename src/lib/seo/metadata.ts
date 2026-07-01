import { Metadata } from "next";
import { getLocalizedPath } from "@/lib/i18n/navigation";
import { SUPPORTED_LOCALES } from "@/lib/i18n/config";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.otcn.com";

/**
 * Generates the alternates (canonical and hreflang) for a given internal path and current locale.
 */
export function getLocalizedMetadata(internalPath: string, locale: string): Metadata["alternates"] {
  const cleanBase = baseUrl.replace(/\/$/, "");
  
  // Get canonical URL for the current locale
  const canonical = cleanBase + getLocalizedPath(internalPath, locale);
  
  // Get hreflang alternates for all supported locales
  const languages = SUPPORTED_LOCALES.reduce((acc, loc) => {
    acc[loc] = cleanBase + getLocalizedPath(internalPath, loc);
    return acc;
  }, {} as Record<string, string>);

  // Optional: Add x-default if needed, usually pointing to the English or default locale
  // languages["x-default"] = cleanBase + getLocalizedPath(internalPath, DEFAULT_LOCALE);

  return {
    canonical,
    languages,
  };
}
