import { ROUTE_MAP, REVERSE_MAP } from "./routes";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "./config";
import Link from "next/link";
import React from "react";

/**
 * Transforms an internal path (e.g., /wallet) to a localized path (e.g., /cuzdan)
 */
export function getLocalizedPath(internalPath: string, locale: string): string {
  const map = ROUTE_MAP[locale] || ROUTE_MAP[DEFAULT_LOCALE];

  // Handle paths with query params or hashes
  const [path, delimiter, extra] = internalPath.split(/(\?|#)/);
  const normalizedPath = path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;

  let localized = map[normalizedPath];

  if (!localized) {
    const matchedPrefix = Object.keys(map)
      .sort((a, b) => b.length - a.length)
      .find((key) => normalizedPath.startsWith(`${key}/`));

    if (matchedPrefix) {
      const suffix = normalizedPath.slice(matchedPrefix.length);
      localized = `${map[matchedPrefix]}${suffix}`;
    } else {
      localized = normalizedPath;
    }
  }

  const prefix = `/${locale}`;
  const finalPath = `${prefix}${localized}${delimiter || ""}${extra || ""}`;

  return finalPath || "/";
}

interface LocalizedLinkProps extends React.ComponentProps<typeof Link> {
  locale: string;
}

/**
 * A Link component that automatically localizes the href
 */
export const LocalizedLink = ({ href, locale, ...props }: LocalizedLinkProps) => {
  const hrefString =
    typeof href === "string"
      ? href
      : typeof href === "object" && href !== null && "pathname" in href
        ? href.pathname || ""
        : "";
  const localizedHref = getLocalizedPath(hrefString, locale);

  return <Link {...props} href={localizedHref} />;
};

/**
 * Changes the locale of a path while correctly mapping localized routes.
 * e.g. /tr/cuzdan -> /en/wallet
 */
export function switchLocalePath(pathname: string, nextLocale: string): string {
  if (!pathname || pathname === "/") {
    return `/${nextLocale}`;
  }

  // Use getInternalPath to find the core route
  const internalPath = getInternalPath(pathname);

  return getLocalizedPath(internalPath, nextLocale);
}

/**
 * Resolves a localized path back to its internal equivalent
 * e.g. /tr/cuzdan -> /wallet
 */
export function getInternalPath(pathname: string): string {
  if (!pathname || pathname === "/") return "/";

  const segments = pathname.split("/");
  const first = segments[1];

  // Check if first segment is a supported locale prefix
  const isLocalePrefix = (SUPPORTED_LOCALES as readonly string[]).includes(first);

  if (isLocalePrefix) {
    const locale = first;
    const rest = "/" + segments.slice(2).join("/");
    // Normalize: remove trailing slash for lookup
    const normalizedRest = rest.length > 1 && rest.endsWith("/") ? rest.slice(0, -1) : rest;
    const reverseMap = REVERSE_MAP[locale];
    const exact = reverseMap && reverseMap[normalizedRest];
    if (exact) return exact;

    if (reverseMap) {
      const matchedPrefix = Object.keys(reverseMap)
        .sort((a, b) => b.length - a.length)
        .find((key) => normalizedRest.startsWith(`${key}/`));

      if (matchedPrefix) {
        const suffix = normalizedRest.slice(matchedPrefix.length);
        return `${reverseMap[matchedPrefix]}${suffix}`;
      }
    }

    return normalizedRest;
  }

  // No locale prefix, assume default locale (TR)
  // Normalize: remove trailing slash for lookup
  const normalizedPath = pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  return (REVERSE_MAP[DEFAULT_LOCALE] && REVERSE_MAP[DEFAULT_LOCALE][normalizedPath]) || normalizedPath;
}
