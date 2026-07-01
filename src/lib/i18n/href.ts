import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from "./config";
import { ROUTE_MAP } from "./routes";

const localeSet = new Set(SUPPORTED_LOCALES);

export function withLocale(path: string, locale: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  // 1. Clean the path
  const [pathname, ...extra] = path.split(/(\?|#)/);
  const cleanPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  
  // 2. Check if already localized with a locale prefix
  const segments = cleanPath.split("/");
  const firstSegment = segments[1];
  
  let targetLocale = locale;
  let internalPath = cleanPath;

  if (firstSegment && localeSet.has(firstSegment as any)) {
      targetLocale = firstSegment;
      internalPath = "/" + segments.slice(2).join("/");
  }

  // 3. Map internal path to localized path if mapping exists
  const map = ROUTE_MAP[targetLocale];
  const localizedPath = (map && map[internalPath]) || internalPath;

  // 4. Return with locale prefix (always include prefix)
  const prefix = `/${targetLocale}`;
  const finalPath = `${prefix}${localizedPath}${extra.join("")}`;
  
  return finalPath || "/";
}
