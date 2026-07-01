import { NextResponse, type NextRequest } from "next/server";
import { REVERSE_MAP, ROUTE_MAP } from "./lib/i18n/routes";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type Locale } from "./lib/i18n/config";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const segments = url.pathname.split("/");
  const first = segments[1];

  // 1. Determine locale and rest of the path
  let locale: string = DEFAULT_LOCALE;
  let rest = url.pathname;
  let hasPrefix = false;

  const isSupportedLocale = (value: string): value is Locale =>
    SUPPORTED_LOCALES.includes(value as Locale);

  if (isSupportedLocale(first)) {
    locale = first;
    rest = "/" + segments.slice(2).join("/");
    hasPrefix = true;
  }

  // 2. Redirect if missing locale prefix (enforce /tr/... for default locale)
  if (!hasPrefix) {
    const targetPath = rest === "/" ? "" : rest;
    const redirectUrl = new URL(`/${DEFAULT_LOCALE}${targetPath}${url.search}`, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // 3. Normalized path for lookup
  const normalizedRest = rest.length > 1 && rest.endsWith("/") ? rest.slice(0, -1) : rest;

  // 4. Resolve internal path (exact first, then prefix match for dynamic segments)
  const reverseMap = REVERSE_MAP[locale];
  let internalPath = reverseMap[normalizedRest];

  if (!internalPath) {
    const matchedPrefix = Object.keys(reverseMap)
      .sort((a, b) => b.length - a.length)
      .find((key) => normalizedRest.startsWith(`${key}/`));

    if (matchedPrefix) {
      const suffix = normalizedRest.slice(matchedPrefix.length);
      internalPath = `${reverseMap[matchedPrefix]}${suffix}`;
    }
  }

  // 5. Build rewritten path for Next.js routing
  // All requests should internally be rewritten to /[locale]/...
  const rewrittenPathname = internalPath
    ? `/${locale}${internalPath}`
    : `/${locale}${rest}`;

  // 6. Auth Protection Logic
  const token = request.cookies.get("access_token")?.value;
  const currentInternalPath = internalPath || normalizedRest;

  const isAuthRoute = currentInternalPath.startsWith("/auth");
  const isHome = currentInternalPath === "/" || currentInternalPath === "";
  const isPublicMarket =
    currentInternalPath === "/markets" ||
    currentInternalPath.startsWith("/markets/");
  const isPublicSpotDetail =
    currentInternalPath === "/trade/spot" ||
    currentInternalPath.startsWith("/trade/spot/");
  const hasRegistrationId = request.nextUrl.searchParams.has("user-registration-id");

  // TEMP DEV BYPASS — remove this line to restore auth protection
  const devAuthBypass = true;

  if (
    !devAuthBypass &&
    !token &&
    !isAuthRoute &&
    !isHome &&
    !isPublicMarket &&
    !isPublicSpotDetail &&
    !hasRegistrationId
  ) {
    // Redirect to localized login
    const loginInternalPath = "/auth/login";
    const loginLocalizedPath = ROUTE_MAP[locale][loginInternalPath];

    // If locale is default or not, we always use prefix now
    const prefix = `/${locale}`;
    const loginUrl = new URL(`${prefix}${loginLocalizedPath}`, request.url);

    loginUrl.searchParams.set("redirectTo", `${request.nextUrl.pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(loginUrl);
  }

  // 7. Perform Rewrite to internal Next.js path
  return NextResponse.rewrite(new URL(`${rewrittenPathname}${url.search}`, request.url));
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|sitemapindex-otcn.xml|sitemap-otcn-tr.xml|sitemap-otcn-en.xml|sitemap-otcn-hreflang.xml|assets|fonts|icons|images|globe.svg|file.svg|api).*)",
  ],
};
