import type { MarketTab, PortfolioCoin } from "@/types/home";

export const marketTabs: MarketTab[] = [
  { key: "gainers", labelKey: "home.market.tabs.gainers" },
  { key: "mostVisited", labelKey: "home.market.tabs.mostVisited" },
  { key: "new", labelKey: "home.market.tabs.new" },
];

export const portfolioCoins: PortfolioCoin[] = [
  { name: "Bitcoin", symbol: "BTC", price: "$2907.56", change: "+0.29" },
  { name: "Chainlink", symbol: "LINK", price: "$2907.56", change: "-0.99" },
  { name: "Stacks", symbol: "STX", price: "$2907.56", change: "+0.29" },
  { name: "Polygon", symbol: "MATIC", price: "$2907.56", change: "+0.29" },
  { name: "Artrade", symbol: "ATR", price: "$2907.56", change: "-1.23" },
  { name: "Dogecoin", symbol: "DOGE", price: "$2907.56", change: "+0.29" },
  { name: "Solana", symbol: "SOL", price: "$2907.56", change: "-0.79" },
  { name: "Verida", symbol: "VDA", price: "$2907.56", change: "+0.29" },
];
