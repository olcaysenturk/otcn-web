export type FiatTransactionItem = {
  id: number;
  rowNumber: number;
  transactionType: string;
  quantity: number;
  currency: string;
  exchangeProvider: string;
  userProvider: string;
  paymentServiceType: string;
  transactionId: number;
  createdDate: string;
  status: string;
};

export type FiatTransactionsResponse = {
  indexFrom: number;
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  items: FiatTransactionItem[];
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

export type FiatTransactionsFilter = {
  pageNumber?: number;
  pageSize?: number;
  from?: number; // timestamp
  to?: number;   // timestamp
  currency?: string;
  status?: string;
};

export type InitiateWithdrawToBankRequest = {
  iban: string,
  quantity: number,
  currency: string
}

export type InitiateWithdrawToBankResponse = {
  flowId: string,
  email: string,
  phone: string,
  isPhoneRequired: boolean,
  isEmailRequired: boolean,
  isAuthenticatorRequired: boolean
}
