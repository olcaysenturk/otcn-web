const DEFAULT_PAIR_SLUGS = ["btc-usdt", "eth-usdt"];
const DEFAULT_SITE_URL = "https://www.otcn.com";
const SITE_BASE_CANDIDATES = [
  process.env.NEXT_PUBLIC_SITE_URL,
  DEFAULT_SITE_URL,
].filter((value): value is string => Boolean(value && value.trim()));

const API_BASE_CANDIDATES = [
  process.env.NEXT_PUBLIC_API_BASE,
  process.env.API_BASE_URL,
  process.env.API_BASE,
  process.env.NEXT_PUBLIC_API_BASE_URL,
  ...SITE_BASE_CANDIDATES,
].filter((value): value is string => Boolean(value && value.trim()));

function normalizePairSlug(value: string): string | null {
  const slug = value.trim().toLowerCase();
  if (!slug) return null;
  return /^[a-z0-9]+-[a-z0-9]+$/.test(slug) ? slug : null;
}

function getFallbackPairSlugs() {
  const envPairs = process.env.SITEMAP_TRADE_PAIRS;
  const rawValues = envPairs ? envPairs.split(",") : DEFAULT_PAIR_SLUGS;
  const normalized = rawValues
    .map((value) => normalizePairSlug(value))
    .filter((value): value is string => Boolean(value));

  if (normalized.length > 0) {
    return Array.from(new Set(normalized));
  }

  return DEFAULT_PAIR_SLUGS;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function extractPairSlug(pair: unknown): string | null {
  if (typeof pair === "string") {
    return normalizePairSlug(pair.replace(/[_/]/g, "-"));
  }

  if (!isObject(pair)) return null;

  const base = pair.base;
  const quote = pair.quote;
  if (typeof base === "string" && typeof quote === "string") {
    return normalizePairSlug(`${base}-${quote}`);
  }

  const symbolLikeValues = [pair.symbol, pair.value, pair.pair, pair.name];
  for (const symbolLike of symbolLikeValues) {
    if (typeof symbolLike !== "string") continue;
    const normalized = normalizePairSlug(symbolLike.replace(/[_/]/g, "-"));
    if (normalized) return normalized;
  }

  return null;
}

function collectPairLists(payload: unknown): unknown[][] {
  const roots: unknown[] = [payload];
  const first = isObject(payload) ? payload : null;
  if (first) {
    roots.push(first.data, first.payload, first.result);
    if (isObject(first.data)) {
      roots.push(first.data.data, first.data.payload, first.data.result);
    }
  }

  return roots
    .filter((value): value is Record<string, unknown> => isObject(value))
    .map((value) => value.pairs)
    .filter((pairs): pairs is unknown[] => Array.isArray(pairs));
}

function extractPairSlugsFromPayload(payload: unknown): string[] {
  const pairLists = collectPairLists(payload);

  for (const pairs of pairLists) {
    if (!Array.isArray(pairs) || pairs.length === 0) continue;

    const slugs = pairs
      .map((pair) => extractPairSlug(pair))
      .filter((slug): slug is string => Boolean(slug));

    if (slugs.length > 0) {
      return Array.from(new Set(slugs));
    }
  }

  return [];
}

async function fetchPairSlugsFromApi(): Promise<string[]> {
  if (API_BASE_CANDIDATES.length === 0) return [];

  const uniqueCandidates = Array.from(new Set(API_BASE_CANDIDATES.map((value) => value.trim())));

  for (const candidate of uniqueCandidates) {
    try {
      const apiBase = candidate.replace(/\/$/, "");
      const res = await fetch(`${apiBase}/v3/exchange/otc/info`, {
        headers: {
          Accept: "application/json",
          "Accept-Language": "en",
        },
        cache: "no-store",
      });

      if (!res.ok) continue;

      const data = (await res.json().catch(() => null)) as unknown;
      const slugs = extractPairSlugsFromPayload(data);
      if (slugs.length > 0) {
        return Array.from(new Set(slugs));
      }
    } catch {
      continue;
    }
  }

  return [];
}

export async function getTradeInternalPathsForSitemap() {
  const fromApi = await fetchPairSlugsFromApi();
  const pairSlugs = fromApi.length > 0 ? fromApi : getFallbackPairSlugs();

  return pairSlugs.map((slug) => `/trade/${slug}`);
}
