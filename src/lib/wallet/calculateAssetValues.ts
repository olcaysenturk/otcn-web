import type { WalletSidebarAsset } from "@/types/wallet";

export function calculateAssetValues(
  asset: WalletSidebarAsset,
  priceMap: Record<string, number>
) {
  // Remove commas if present
  const normalizedAmount = asset.amount.toString().replace(/,/g, "");
  const amount = parseFloat(normalizedAmount);

  if (isNaN(amount)) return { ...asset, fiatValue: 0, usdtValue: 0, btcValue: 0 };

  let tryVal = 0;
  let usdtVal = 0;
  let btcVal = 0;

  const usdtTryPrice = priceMap["USDTTRY"];
  const btcUsdtPrice = priceMap["BTCUSDT"];

  // Calculate TRY & USDT Value
  if (asset.symbol === "TRY") {
    tryVal = amount;
    if (usdtTryPrice) usdtVal = amount / usdtTryPrice;
  } else if (asset.symbol === "USDT") {
    usdtVal = amount;
    if (usdtTryPrice) tryVal = amount * usdtTryPrice;
  } else {
    // General Crypto
    // TRY Value
    const tryPrice = priceMap[`${asset.symbol.toUpperCase()}TRY`];
    // USDT Value
    const usdtPrice = priceMap[`${asset.symbol.toUpperCase()}USDT`];

    // Calculate USDT Value first (often reliable base)
    if (usdtPrice) {
      usdtVal = amount * usdtPrice;
    }

    // Calculate TRY Value
    if (tryPrice) {
      tryVal = amount * tryPrice;
    } else if (usdtVal > 0 && usdtTryPrice) {
      // Fallback: Derived from USDT
      tryVal = usdtVal * usdtTryPrice;
    }

    // Fallback for USDT if TRY exists but no USDT pair
    if (usdtVal === 0 && tryVal > 0 && usdtTryPrice) {
      usdtVal = tryVal / usdtTryPrice;
    }
  }

  // Calculate BTC Value
  if (btcUsdtPrice && usdtVal > 0) {
    btcVal = usdtVal / btcUsdtPrice;
  } else if (asset.symbol === "BTC") {
    btcVal = amount;
  }

  return {
    ...asset,
    fiat:
      tryVal > 0
        ? `≈ ₺${tryVal.toLocaleString("tr-TR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`
        : asset.fiat,
    fiatValue: tryVal,
    usdtValue: usdtVal,
    btcValue: btcVal,
  };
}
