export type OtcAsset = {
  symbol: string;
  name: string;
  categories: string[];
  description: string;
  type: string;
  isEnabled: boolean;
  isNew: boolean;
  isWithdrawalEnabled: boolean;
  isDepositEnabled: boolean;
  precision: number;
  displayPrecision: number;
  minDeposit: string;
  minWithdrawal: string;
  updatedDate: number;
  createdDate: number;
};

export type OtcPair = {
  symbol: string;
  base: string;
  quote: string;
  quantityPrecision: number;
  pricePrecision: number;
  totalPrecision: number;
  commissionPrecision: number;
  displayOrder: number;
};

export type UiPair = {
  value: string;
  base: string;
  quote: string;
  baseName: string;
};

export type OtcInfo = {
  version: string;
  assets: OtcAsset[];
  pairs: OtcPair[];
};

export type CreateOtcOrderRequest = {
  symbol: string;
  quantity: string;
  side: "BUY" | "SELL";
  price: string;
};

export type CreateMarketOrderRequest = {
  clientId: "web";
  price: "0";
  quantity: string;
  side: "BUY" | "SELL";
  symbol: string;
  total: string;
  triggerPrice: "0";
  type: "MARKET";
};

export type MarketOrderResult = {
  ok?: boolean;
  quantity?: string;
  leftQuantity?: string;
  matchedTotal?: string;
};

export type MarketOrderResponse = {
  content?: MarketOrderResult;
  message?: string;
  hasError?: boolean;
};

export type OtcOrderItem = {
  id?: number;
  symbol?: string;
  pairName?: string;
  tradeDate?: number | string;
  orderSide?: number | string;
  createdDate?: number | string;
  updatedDate?: number | string;
  price?: string;
  quantity?: string;
  leftQuantity?: string;
  total?: string;
  side?: string | number;
  status?: string | number;
  type?: string;
  tradeCount?: number;
};

export type OtcOrdersResponse = {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  indexFrom: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  items: OtcOrderItem[];
};

export type OtcTransactionsFilter = {
  page?: number;
  limit?: number;
  from?: number;
  to?: number;
  type?: string;
  asset?: string;
  status?: string | number;
};

export type OtcHistoryFilter = {
  symbol?: string;
  page?: number;
  limit?: number;
  orderSide?: "BUY" | "SELL";
  from?: number;
  to?: number;
};

export type OtcTradesFilter = {
  dateFrom?: number;
  dateTo?: number;
  pairName?: string;
  orderSide?: number; // BUY : 0 SELL : 1
  pageSize?: number;
  pageNumber?: number;
};


export type CreateDepositCryptoAddressResponse = {
  address: string;
};

export type DepositCryptoAddress = {
  id?: number;
  address: string;
  networkName: string;
  assetSymbol: string;
  memoTag?: string;
};

export type CryptoWithdrawPayload = {
  asset: string;
  quantity: number;
  address: string;
  memoTag?: string;
  network: string;
  assetSource: string;
  assetPurpose: string;
};

export type CryptoWithdrawResponse = {
  flowId: string;
  email: string;
  phone: string;
  isPhoneRequired: boolean;
  isEmailRequired: boolean;
  isAuthenticatorRequired: boolean;
};
