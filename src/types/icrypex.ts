export type IcrypexAsset = {
  symbol: string;
  name: string;
  categories: string[];
  description?: string;
  type?: string;
  isEnabled: boolean;
  isNew: boolean;
  isWithdrawalEnabled?: boolean;
  isDepositEnabled?: boolean;
  precision: number;
  displayPrecision: number;
  minDeposit?: string;
  minWithdrawal?: string;
  updatedDate?: number;
  createdDate?: number;
};

export type IcrypexPair = {
  symbol: string;
  base: string;
  quote: string;
  minExchangeValue?: string;
  minPrice?: string;
  maxPrice?: string;
  quantityPrecision: number;
  pricePrecision: number;
  totalPrecision: number;
  commissionPrecision: number;
  displayOrder: number;
  status: string;
  marketTypes: string[];
  orderTypes: string[];
};

export type IcrypexExchangeInfo = {
  version?: string;
  assets: IcrypexAsset[];
  pairs: IcrypexPair[];
};

/** Live ticker pushed over the "tickers" websocket channel */
export type IcrypexTicker = {
  /** Pair symbol, e.g. BTCUSDT */
  ps: string;
  /** Base symbol */
  bs: string;
  /** Quote symbol */
  qs: string;
  /** Last price */
  p: string;
  /** Best ask */
  a: string;
  /** Best bid */
  b: string;
  /** 24h high */
  h: string;
  /** 24h low */
  l: string;
  /** Average */
  g: string;
  /** Change percentage */
  cp: string;
  /** Change quantity */
  cq: string;
  /** Volume */
  v: string;
};

/** Market cap / global data pushed over the "market" websocket channel */
export type IcrypexMarketAsset = {
  /** Symbol */
  s: string;
  /** Market cap */
  mc: string;
  /** Market cap rank */
  mcr: number;
  /** Global price */
  gp: string;
  /** Global volume */
  gv: string;
  /** Circulating quantity */
  c: string;
};
