import type { MarketOverviewMetric, MarketTickerItem } from "@/types/market";

const negativeChart = [
  { value: 15 },
  { value: 18 },
  { value: 22 },
  { value: 34 },
  { value: 39 },
  { value: 37 },
  { value: 34 },
  { value: 32 },
  { value: 29 },
  { value: 27 },
];

const positiveChart = [
  { value: 18 },
  { value: 20 },
  { value: 24 },
  { value: 31 },
  { value: 28 },
  { value: 36 },
  { value: 42 },
  { value: 45 },
  { value: 48 },
  { value: 51 },
];

export const marketOverviewMetrics: MarketOverviewMetric[] = [
  {
    id: "market-cap",
    titleKey: "marketPage.metrics.marketCap",
    prefix: "$",
    value: "2.58T",
    change: "-1.84%",
    trend: "negative",
    chartData: negativeChart,
    kind: "chart",
  },
  {
    id: "nxt10",
    titleKey: "marketPage.metrics.nxt10",
    prefix: "$",
    value: "157.41",
    change: "-2.2%",
    trend: "negative",
    chartData: negativeChart,
    kind: "chart",
  },
  {
    id: "fear-greed",
    titleKey: "marketPage.metrics.fearGreed",
    value: "14",
    detailKey: "marketPage.metrics.extremeFear",
    kind: "gauge",
    rangeValue: 14,
  },
  {
    id: "altcoin-season",
    titleKey: "marketPage.metrics.altcoinSeason",
    value: "34",
    suffix: "/ 100",
    kind: "range",
    rangeValue: 24,
    rangeLabels: ["marketPage.metrics.bitcoin", "marketPage.metrics.altcoin"],
  },
  {
    id: "average-rsi",
    titleKey: "marketPage.metrics.averageRsi",
    value: "44.33",
    kind: "range",
    rangeValue: 38,
    rangeLabels: ["marketPage.metrics.oversold", "marketPage.metrics.overbought"],
  },
];

export const marketTickerItems: MarketTickerItem[] = [
  { symbol: "BTC", price: "$2907.56", change: "+0.29", chartData: positiveChart },
  { symbol: "ETH", price: "$2907.56", change: "+0.29", chartData: positiveChart },
  { symbol: "BNB", price: "$2907.56", change: "+0.29", chartData: positiveChart },
  { symbol: "SOL", price: "$2907.56", change: "-0.29", chartData: negativeChart },
  { symbol: "XRP", price: "$2907.56", change: "+0.29", chartData: positiveChart },
];

