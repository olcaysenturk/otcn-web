import { NextResponse } from "next/server";
import { ROUTE_MAP } from "@/lib/i18n/routes";
import { getLocalizedPath } from "@/lib/i18n/navigation";
import { SUPPORTED_LOCALES } from "@/lib/i18n/config";
import { getTradeInternalPathsForSitemap } from "@/lib/seo/sitemapTradePairs";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.otcn.com";
  const cleanBase = baseUrl.replace(/\/$/, "");
  // Using fixed date for consistency with user example or dynamic
  const lastMod = new Date().toISOString().split("T")[0];

  // Get unique internal routes keys from Default Locale
  const internalRoutes = Object.keys(ROUTE_MAP["tr"] || {});
  const tradePairRoutes = await getTradeInternalPathsForSitemap();
  const allRoutes = Array.from(new Set([...internalRoutes, ...tradePairRoutes]));

  if (!allRoutes.includes("/")) {
    allRoutes.unshift("/");
  }

  // Define supported locales for iteration
  const locales = SUPPORTED_LOCALES;

  const urls = allRoutes.flatMap((internalPath) => {
    // Determine the x-default URL (mapped to TR)
    const xDefaultHref = cleanBase + getLocalizedPath(internalPath, "tr");

    // Generate a <url> block for EACH locale version of this route
    return locales.map((currentLocale) => {
      const currentLoc = cleanBase + getLocalizedPath(internalPath, currentLocale);

      // Generate the xhtml:link lines for all locales + x-default
      // Note: User example shows links for tr, en, AND x-default
      const links = [
        ...locales.map(l => {
          const href = cleanBase + getLocalizedPath(internalPath, l);
          return `    <xhtml:link rel="alternate" hreflang="${l}" href="${href}"/>`;
        }),
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${xDefaultHref}"/>`
      ].join("\n");

      return `
  <url>
    <loc>${currentLoc}</loc>
${links}
    <lastmod>${lastMod}</lastmod>
  </url>`;
    });
  }).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
