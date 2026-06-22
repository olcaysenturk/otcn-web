import type { TradeLandingPair } from "@/types/trade";

export const tradeLandingPairs: TradeLandingPair[] = [
  { base: "BTC", quote: "USDT", baseRange: "0.0005 - 8.50", quoteRange: "45.00 - 765,000.00", rate: "90,000.00" },
  { base: "DASH", quote: "BTC", baseRange: "7.72224 - 700.000", quoteRange: "0.000002 - 0.18", rate: "0.00000025" },
  { base: "ETH", quote: "USDT", baseRange: "0.05 - 120.00", quoteRange: "150.00 - 360,000.00", rate: "3,000.00" },
  { base: "SOL", quote: "USDT", baseRange: "1.00 - 5,000.00", quoteRange: "140.00 - 700,000.00", rate: "140.00" },
];
