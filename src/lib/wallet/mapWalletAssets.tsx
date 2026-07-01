import type { OtcAsset } from "@/types/otc";
import type { WalletApiItem, WalletSidebarAsset } from "@/types/wallet";
import { getCoinIconPath } from "@/lib/coinIcons";

export function mapWalletAssets(
  items: WalletApiItem[],
  assetsBySymbol?: Record<string, OtcAsset>
): WalletSidebarAsset[] {
  const mapped = items.map((item, index) => {
    const symbol = item.asset?.toUpperCase() || "UNKNOWN";
    const otcAsset = assetsBySymbol?.[symbol];
    const icon = otcAsset?.name
      ? getCoinIconPath(otcAsset.symbol)
      : "/assets/coin-logo/default.svg";
    const name = otcAsset?.name ?? symbol;
    const tryValue =
      item.tryValue && item.tryValue !== "0"
        ? `≈ ₺${item.tryValue}`
        : "≈ ₺0";

    return {
      id: `${symbol}-${index}`,
      icon,
      name,
      symbol,
      amount: item.total ?? "0",
      fiat: tryValue,
      fiatValue: Number.isFinite(Number(item.tryValue)) ? Number(item.tryValue) : 0,
      available: item.available ?? "0",
      inOrder: item.order ?? "0",
      withdraw: item.request ?? "0",
      asset: otcAsset ?? null,
    };
  });

  const hasTry = mapped.some((asset) => asset.symbol === "TRY");
  if (!hasTry) {
    const tryAsset = assetsBySymbol?.TRY;
    mapped.push({
      id: "TRY-0",
      icon: tryAsset?.name
        ? getCoinIconPath(tryAsset.symbol)
        : "/assets/coin-logo/TRY.svg",
      name: tryAsset?.name ?? "TRY",
      symbol: "TRY",
      amount: "0",
      fiat: "≈ ₺0",
      fiatValue: 0,
      available: "0",
      inOrder: "0",
      withdraw: "0",
      asset: tryAsset ?? null,
    });
  }

  return mapped;
}
