export type MarketTrend = "positive" | "negative" | "neutral";

export type MarketPoint = {
  value: number;
};

export type MarketOverviewMetric = {
  id: string;
  titleKey: string;
  value: string;
  prefix?: string;
  suffix?: string;
  change?: string;
  trend?: MarketTrend;
  chartData?: MarketPoint[];
  kind: "chart" | "gauge" | "range";
  rangeLabels?: [string, string];
  rangeValue?: number;
  detailKey?: string;
};

export type MarketTickerItem = {
  symbol: string;
  price: string;
  change: string;
  chartData: MarketPoint[];
};

export type MarketAsset = {
  id: string;
  name: string;
  symbol: string;
  quote: string;
  categories: string[];
  isNew: boolean;
  isPerpetual: boolean;
  price: string;
  change24h: string;
  marketCap: string;
  volume24h: string;
  volumeUnits: string;
  circulatingSupply: string;
};

export type MarketTabKey = "cryptos" | "favorites" | "spots" | "futures";

export type MarketSortKey =
  | "price"
  | "change24h"
  | "marketCap"
  | "volume24h"
  | "circulatingSupply";

export type MarketOverviewCardProps = {
  metric: MarketOverviewMetric;
};

export type MarketTickerCardProps = {
  item: MarketTickerItem;
};

export type MarketFilterPanelProps = {
  activeTab: MarketTabKey;
  activeCategory: string | null;
  categories: string[];
  searchQuery: string;
  onTabChange: (tab: MarketTabKey) => void;
  onCategoryChange: (category: string | null) => void;
  onSearchChange: (query: string) => void;
};

export type MarketTableProps = {
  assets: MarketAsset[];
  favorites: Set<string>;
  sortKey?: MarketSortKey;
  sortDirection?: "asc" | "desc";
  onSort: (key: MarketSortKey) => void;
  onToggleFavorite: (symbol: string) => void;
};

export type MarketPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};
