"use client";

import { useMemo } from "react";

import { buildMarketAssets } from "@/lib/market/buildMarketAssets";
import { parseFormattedNumber } from "@/lib/market/parseFormattedNumber";
import { useExchangeInfoStore } from "@/stores/useExchangeInfoStore";
import { useGlobalMarketStore } from "@/stores/useGlobalMarketStore";
import { useTickerStore } from "@/stores/useTickerStore";
import type { MarketAsset } from "@/types/market";
import type { MarketCoin, MarketTabKey } from "@/types/home";

const TAB_SIZE = 12;

function toCoin(asset: MarketAsset): MarketCoin {
  return {
    name: asset.name,
    symbol: asset.symbol,
    price: asset.price,
    change: asset.change24h,
  };
}

export function useHomeMarketCoins(): Record<MarketTabKey, MarketCoin[]> {
  const assets = useExchangeInfoStore((state) => state.assets);
  const pairs = useExchangeInfoStore((state) => state.pairs);
  const tickers = useTickerStore((state) => state.tickers);
  const marketAssets = useGlobalMarketStore((state) => state.assets);

  return useMemo(() => {
    const createdDateBySymbol = new Map(assets.map((asset) => [asset.symbol, asset.createdDate ?? 0]));
    const spotAssets = buildMarketAssets(assets, pairs, tickers, marketAssets).filter(
      (asset) => !asset.isPerpetual,
    );

    // Mirrors CoreWeb's markets.component.ts createTopLists(): only rising assets count as gainers.
    const gainers = spotAssets
      .filter((asset) => parseFormattedNumber(asset.change24h) > 0)
      .sort((a, b) => parseFormattedNumber(b.change24h) - parseFormattedNumber(a.change24h))
      .slice(0, TAB_SIZE)
      .map(toCoin);

    // CoreWeb's "Popular" list: sorted by 24h volume, descending.
    const mostVisited = [...spotAssets]
      .sort((a, b) => parseFormattedNumber(b.volume24h) - parseFormattedNumber(a.volume24h))
      .slice(0, TAB_SIZE)
      .map(toCoin);

    // CoreWeb's "New Listing" list: isNew assets sorted by createdDate, descending.
    const newListing = spotAssets
      .filter((asset) => asset.isNew)
      .sort((a, b) => createdDateBySymbol.get(b.symbol)! - createdDateBySymbol.get(a.symbol)!)
      .slice(0, TAB_SIZE)
      .map(toCoin);

    return { gainers, mostVisited, new: newListing };
  }, [assets, pairs, tickers, marketAssets]);
}
