import { clientFetch } from "@/lib/api/clientFetch";
import { getApiBase } from "@/lib/api/getApiBase";
import type { FetchWalletArgs, WalletApiItem, WalletSidebarAsset } from "@/types/wallet";
import type { OtcAsset } from "@/types/otc";
import { mapWalletAssets } from "@/lib/wallet/mapWalletAssets";
import { fetchOtcInfo } from "@/services/otc";

export async function fetchWallet({ locale, assetSymbol }: FetchWalletArgs) {
  const base = getApiBase();
  const params = new URLSearchParams();
  if (assetSymbol) {
    params.set("assetSymbol", assetSymbol);
  }

  const url = params.size ? `${base}/v3/wallet?${params}` : `${base}/v3/wallet`;

  return clientFetch(url, {
    headers: {
      Accept: "text/plain",
      "Accept-Language": locale,
    },
  });
}

export async function fetchWalletAssets(args: FetchWalletArgs): Promise<WalletSidebarAsset[]> {
  const [walletRes, otcInfo] = await Promise.all([
    fetchWallet(args),
    fetchOtcInfo(args.locale),
  ]);
  if (!walletRes?.ok) return [];

  const items = (await walletRes.json().catch(() => [])) as WalletApiItem[];
  const assetsBySymbol = otcInfo?.assets?.reduce<Record<string, OtcAsset>>((acc, asset) => {
    acc[asset.symbol.toUpperCase()] = asset;
    return acc;
  }, {});

  return mapWalletAssets(items, assetsBySymbol);
}

/**
 * Fetches the last balance movements (transactions) for a specific asset.
 * GET /v3/wallet/balance-movements
 */
export async function fetchBalanceMovements(
  assetSymbol: string,
  typeFilter: 1 | 2 | 3 = 1,
  rowCount: number = 5
): Promise<import("@/types/wallet").WalletBalanceMovement[]> {
  const base = getApiBase();
  const params = new URLSearchParams();
  params.set("assetSymbol", assetSymbol);
  params.set("typeFilter", typeFilter.toString());
  params.set("rowCount", rowCount.toString());

  const url = `${base}/v3/wallet/balance-movements?${params.toString()}`;

  const res = await clientFetch(url);

  if (!res?.ok) {
    return [];
  }

  try {
    const data = await res.json();
    return data?.summaries || [];
  } catch (error) {
    console.error("Failed to parse balance movements:", error);
    return [];
  }
}
