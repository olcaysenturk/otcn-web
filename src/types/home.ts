import type { ReactNode } from "react";

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
  href: string;
};
