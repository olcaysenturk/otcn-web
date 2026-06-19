import type {
  HeroCoin,
  HeroMetric,
  MarketCoin,
  MarketTab,
  MarketTabKey,
  PortfolioCoin,
} from "@/types/home";

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

export const marketMockData: Record<MarketTabKey, MarketCoin[]> = {
  gainers: [
    { name: "Aptos", symbol: "APT", price: "$2907.56", change: "+0.29" },
    { name: "Artrade", symbol: "ATR", price: "$2907.56", change: "+0.29" },
    { name: "Binance Coin", symbol: "BNB", price: "$2907.56", change: "+0.29" },
    { name: "Bitcoin", symbol: "BTC", price: "$87888.70", change: "+0.29" },
    { name: "Celestia", symbol: "TIA", price: "$2907.56", change: "+0.29" },
    { name: "Chainlink", symbol: "LINK", price: "$2907.56", change: "+0.29" },
    { name: "Dash", symbol: "DASH", price: "$2907.56", change: "+0.29" },
    { name: "Dogecoin", symbol: "DOGE", price: "$2907.56", change: "+0.29" },
    { name: "Ethereum", symbol: "ETH", price: "$2907.56", change: "+0.29" },
    { name: "Polygon", symbol: "MATIC", price: "$2907.56", change: "+0.29" },
    { name: "Solana", symbol: "SOL", price: "$2907.56", change: "+0.29" },
    { name: "Stacks", symbol: "STX", price: "$2907.56", change: "+0.29" },
  ],
  mostVisited: [
    { name: "Bitcoin", symbol: "BTC", price: "$87888.70", change: "-0.09%" },
    { name: "Ethereum", symbol: "ETH", price: "$2907.56", change: "+0.29" },
    { name: "Tether", symbol: "USDT", price: "$1.00", change: "+0.01" },
    { name: "Binance Coin", symbol: "BNB", price: "$642.16", change: "+0.18" },
    { name: "Solana", symbol: "SOL", price: "$139.42", change: "-0.29" },
    { name: "XRP", symbol: "XRP", price: "$2.16", change: "+0.08" },
    { name: "Tron", symbol: "TRX", price: "$0.27", change: "+0.12" },
    { name: "Polygon", symbol: "MATIC", price: "$0.62", change: "-0.14" },
    { name: "Chainlink", symbol: "LINK", price: "$14.09", change: "+0.21" },
    { name: "Dogecoin", symbol: "DOGE", price: "$0.18", change: "+0.19" },
    { name: "Aptos", symbol: "APT", price: "$7.42", change: "-0.11" },
    { name: "Dash", symbol: "DASH", price: "$28.91", change: "+0.07" },
  ],
  new: [
    { name: "Celestia", symbol: "TIA", price: "$4.17", change: "+0.29" },
    { name: "Artrade", symbol: "ATR", price: "$0.018", change: "+0.35" },
    { name: "Sui", symbol: "SUI", price: "$3.11", change: "+0.24" },
    { name: "Sei", symbol: "SEI", price: "$0.26", change: "-0.08" },
    { name: "Render", symbol: "RNDR", price: "$7.66", change: "+0.17" },
    { name: "Jito", symbol: "JTO", price: "$2.24", change: "+0.19" },
    { name: "Ondo", symbol: "ONDO", price: "$1.02", change: "-0.05" },
    { name: "Ethena", symbol: "ENA", price: "$0.42", change: "+0.13" },
    { name: "Wormhole", symbol: "W", price: "$0.19", change: "+0.11" },
    { name: "Mantle", symbol: "MNT", price: "$1.18", change: "+0.09" },
    { name: "Starknet", symbol: "STRK", price: "$0.31", change: "-0.12" },
    { name: "Dymension", symbol: "DYM", price: "$1.47", change: "+0.22" },
  ],
};

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
