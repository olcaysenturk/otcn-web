/**
 * Fetches current prices for the given symbols from the internal Binance proxy.
 * @param symbols Array of symbols to fetch (e.g. ["BTCUSDT", "ETHTRY"])
 * @returns A map of symbol to price (number)
 */
export async function fetchBinancePrices(symbols: string[]): Promise<Record<string, number>> {
  if (!symbols || symbols.length === 0) return {};

  const priceMap: Record<string, number> = {};
  
  try {
    const symbolsParam = JSON.stringify(symbols);
    // Use internal proxy to avoid CORS
    const res = await fetch(
      `/api/binance/ticker?symbols=${encodeURIComponent(symbolsParam)}`
    );

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        data.forEach((p: { symbol: string; price: string }) => {
          priceMap[p.symbol] = parseFloat(p.price);
        });
      }
    }
  } catch (err) {
    console.error("Failed to fetch Binance prices", err);
  }

  return priceMap;
}
