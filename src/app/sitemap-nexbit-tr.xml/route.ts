import { NextResponse } from "next/server";
import { ROUTE_MAP } from "@/lib/i18n/routes";
import { getLocalizedPath } from "@/lib/i18n/navigation";
import { getTradeInternalPathsForSitemap } from "@/lib/seo/sitemapTradePairs";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.nexbit.com";
  const cleanBase = baseUrl.replace(/\/$/, "");
  const lastMod = new Date().toISOString();

  // Get unique internal routes keys from Default Locale (assuming it covers all pages)
  const internalRoutes = Object.keys(ROUTE_MAP["tr"] || {});
  const tradePairRoutes = await getTradeInternalPathsForSitemap();
  const allRoutes = Array.from(new Set([...internalRoutes, ...tradePairRoutes]));

  // Ensure root is present if not in map
  if (!allRoutes.includes("/")) {
    allRoutes.unshift("/");
  }

  const urls = allRoutes.map((internalPath) => {
    const loc = cleanBase + getLocalizedPath(internalPath, "tr");
    return `
  <url>
    <loc>${loc}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${internalPath === "/" ? "1.0" : "0.8"}</priority>
  </url>`;
  }).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
