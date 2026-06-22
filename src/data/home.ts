import type { HeroCoin, HeroMetric, MarketTab, PortfolioCoin } from "@/types/home";

export const heroCoins: HeroCoin[] = [
  { symbol: "ETC", price: "$2907.56", change: "+0.29" },
  { symbol: "BTC", price: "$87888.70", change: "-0.09%" },
  { symbol: "USDT", price: "$2907.56", change: "+0.29" },
  { symbol: "SOL", price: "$2907.56", change: "+0.29" },
  { symbol: "XRP", price: "$2907.56", change: "+0.29" },
  { symbol: "STX", price: "$2907.56", change: "+0.29" },
];

export const mobileHeroCoins: HeroCoin[] = [
  { symbol: "BTC", price: "$136.522", change: "-0.09%" },
  { symbol: "ETH", price: "$136.522", change: "+0.29" },
  { symbol: "USDT", price: "$136.522", change: "-12.20%" },
  { symbol: "SOL", price: "$136.522", change: "-12.20%" },
  { symbol: "XRP", price: "$2907.56", change: "-12.20%" },
  { symbol: "STX", price: "$136.522", change: "+0.29" },
];

export const heroMetrics: HeroMetric[] = [
  {
    titleKey: "home.hero.metrics.marketCap.title",
    value: "187.546",
    change: "+0.75%",
    tone: "positive",
    placementClassName: "left-0 top-0",
    helperTextKey: "home.hero.metrics.helper",
    chartData: [
      { value: 36 },
      { value: 35 },
      { value: 31 },
      { value: 33 },
      { value: 48 },
      { value: 58 },
      { value: 57 },
      { value: 60 },
      { value: 61 },
      { value: 38 },
      { value: 28 },
    ],
  },
  {
    titleKey: "home.hero.metrics.bitcoinDominance.title",
    value: "0.062129",
    change: "-0.75%",
    tone: "negative",
    placementClassName: "bottom-0 left-0",
    helperTextKey: "home.hero.metrics.helper",
    chartData: [
      { value: 24 },
      { value: 26 },
      { value: 31 },
      { value: 32 },
      { value: 38 },
      { value: 55 },
      { value: 56 },
      { value: 52 },
      { value: 51 },
      { value: 45 },
      { value: 43 },
    ],
  },
];

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
