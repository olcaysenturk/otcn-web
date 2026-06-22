import { getIcrypexApiBase } from "@/lib/api/getIcrypexApiBase";
import type { IcrypexExchangeInfo } from "@/types/icrypex";

/**
 * Fetches exchange-wide asset/pair metadata from the Icrypex public API.
 * Must run server-side (Server Component / route handler) — the Icrypex API
 * does not return CORS headers for arbitrary browser origins.
 */
export async function fetchIcrypexExchangeInfo(): Promise<IcrypexExchangeInfo | null> {
  const base = getIcrypexApiBase();

  try {
    const res = await fetch(`${base}/v1/exchange/info`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;
    return (await res.json()) as IcrypexExchangeInfo;
  } catch (error) {
    console.error("Failed to fetch Icrypex exchange info:", error);
    return null;
  }
}
