import type { IcrypexAsset, IcrypexMarketAsset, IcrypexPair, IcrypexTicker } from "@/types/icrypex";
import type { MarketAsset } from "@/types/market";

function compact(value: number) {
  if (!Number.isFinite(value)) return "0";
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 2 }).format(value);
}

function formatPrice(value: number, precision: number) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: Math.min(2, precision),
    maximumFractionDigits: precision,
  }).format(value);
}

export function buildMarketAssets(
  assets: IcrypexAsset[],
  pairs: IcrypexPair[],
  tickers: Record<string, IcrypexTicker>,
  marketAssets: Record<string, IcrypexMarketAsset>,
): MarketAsset[] {
  const assetBySymbol = new Map(assets.map((asset) => [asset.symbol, asset]));

  return pairs
    .filter((pair) => pair.quote === "USDT" && pair.status === "Running")
    .map((pair) => {
      const asset = assetBySymbol.get(pair.base);
      if (!asset || !asset.isEnabled) return null;

      const ticker = tickers[pair.symbol];
      const marketAsset = marketAssets[pair.base];
      const isPerpetual = pair.marketTypes.includes("PERPETUAL");

      const price = ticker ? Number.parseFloat(ticker.p) : 0;
      const changePercent = ticker ? Number.parseFloat(ticker.cp) : 0;
      const baseVolume = ticker ? Number.parseFloat(ticker.v) : 0;
      const quoteVolume = baseVolume * price;
      const marketCap = marketAsset ? Number.parseFloat(marketAsset.mc) : 0;
      const circulating = marketAsset ? Number.parseFloat(marketAsset.c) : 0;

      const item: MarketAsset = {
        id: pair.symbol,
        name: asset.name,
        symbol: asset.symbol,
        quote: pair.quote,
        categories: asset.categories ?? [],
        isNew: asset.isNew,
        isPerpetual,
        price: ticker ? `$${formatPrice(price, pair.pricePrecision)}` : "-",
        change24h: ticker ? `${changePercent >= 0 ? "+" : ""}${changePercent.toFixed(2)}%` : "-",
        marketCap: marketAsset ? `$${compact(marketCap)}` : "-",
        volume24h: ticker ? `$${compact(quoteVolume)}` : "-",
        volumeUnits: ticker ? compact(baseVolume) : "-",
        circulatingSupply: marketAsset ? `${compact(circulating)} ${asset.symbol}` : "-",
      };

      return item;
    })
    .filter((item): item is MarketAsset => item !== null);
}
