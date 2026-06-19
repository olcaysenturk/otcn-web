import type { ReactNode } from "react";

export type StepCardProps = {
  number: string;
  title: string;
  description: string;
  status: boolean;
  imageSrc: string;
};

export type TrendTone = "positive" | "negative";

export type ChartPoint = {
  value: number;
};

export type HeroCoin = {
  symbol: string;
  price: string;
  change: string;
};

export type HeroMetric = {
  titleKey: string;
  value: string;
  change: string;
  tone: TrendTone;
  chartData: ChartPoint[];
  placementClassName: string;
  helperTextKey: string;
};

export type HeroCardVariant = "mobile" | "desktop";

export type MarketTabKey = "gainers" | "mostVisited" | "new";

export type MarketTab = {
  key: MarketTabKey;
  labelKey: string;
};

export type MarketCoin = {
  name: string;
  symbol: string;
  price: string;
  change: string;
};

export type PortfolioCoin = MarketCoin;

export type LightSectionProps = {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
};

export type HeroPopularCardProps = {
  coins: HeroCoin[];
  variant?: HeroCardVariant;
};

export type HeroMetricCardProps = HeroMetric & {
  variant?: HeroCardVariant;
};

export type MarketCoinCardProps = {
  coin: MarketCoin;
  href: string;
};

export type MarketCoinRowProps = {
  coins: MarketCoin[];
  direction: "left" | "right";
  locale: string;
};

export type PortfolioCoinCardProps = {
  coin: PortfolioCoin;
};
