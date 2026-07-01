import { clientFetch } from "@/lib/api/clientFetch";
import { getApiBase } from "@/lib/api/getApiBase";
import { buildSearchParams } from "@/lib/api/utils";
import type { CreateDepositCryptoAddressResponse, CreateMarketOrderRequest, CreateOtcOrderRequest, CryptoWithdrawPayload, CryptoWithdrawResponse, DepositCryptoAddress, MarketOrderResponse, OtcHistoryFilter, OtcInfo, OtcOrdersResponse, OtcTradesFilter, OtcTransactionsFilter } from "@/types/otc";

export async function fetchOtcInfo(locale: string) {
  const base = getApiBase();
  const res = await clientFetch(`${base}/v3/exchange/otc/info`, {
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": locale,
    },
  });

  if (!res?.ok) return null;
  return (await res.json().catch(() => null)) as OtcInfo | null;
}

export async function createOtcOrder(locale: string, accountId: number, payload: CreateOtcOrderRequest) {
  const base = getApiBase();
  return clientFetch(`${base}/v3/otc/order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": locale,
      "AccountId": accountId.toString(),
    },
    body: JSON.stringify(payload),
  });
}

export async function createMarketOrder(locale: string, payload: CreateMarketOrderRequest) {
  const base = getApiBase();
  const res = await clientFetch(`${base}/v1/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": locale,
    },
    body: JSON.stringify(payload),
  });

  const body = (await res.json().catch(() => null)) as MarketOrderResponse | null;
  return { response: res, body };
}

export async function fetchDashboardTransactions(locale: string, filters: OtcTransactionsFilter = {}) {
  const base = getApiBase();
  const searchParams = buildSearchParams(filters);

  const res = await clientFetch(`${base}/v3/otc?${searchParams.toString()}`, {
    headers: {
      Accept: "*/*",
      "Accept-Language": locale,
    },
  });

  if (!res?.ok) return null;
  return (await res.json().catch(() => null)) as OtcOrdersResponse | null;
}

export async function fetchOtcHistory(locale: string, filters: OtcHistoryFilter = {}) {
  const base = getApiBase();
  const searchParams = buildSearchParams(filters);

  const res = await clientFetch(`${base}/v3/otc/history?${searchParams.toString()}`, {
    headers: {
      Accept: "*/*",
      "Accept-Language": locale,
    },
  });

  if (!res?.ok) return null;
  return (await res.json().catch(() => null)) as OtcOrdersResponse | null;
}

export async function fetchOtcTransactions(locale: string, filters: OtcTransactionsFilter = {}) {
  const base = getApiBase();
  const searchParams = buildSearchParams(filters);

  const res = await clientFetch(`${base}/v3/otc/transactions?${searchParams.toString()}`, {
    headers: {
      Accept: "*/*",
      "Accept-Language": locale,
    },
  });

  if (!res?.ok) return null;
  return (await res.json().catch(() => null)) as OtcOrdersResponse | null;
}

export async function cancelOtcOrder(locale: string, orderId: number) {
  const base = getApiBase();
  return clientFetch(`${base}/v3/otc/${orderId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": locale,
    },
  });
}

export async function cancelAllOtcOrders(locale: string, orderIds: number[]) {
  const base = getApiBase();
  return clientFetch(`${base}/v3/otc/cancel-all`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": locale,
    },
    body: JSON.stringify({ orders: orderIds }),
  });
}

export async function fetchCryptoTransactions(locale: string, accountId: number, filters: OtcTransactionsFilter = {}) {
  const base = getApiBase();
  const searchParams = buildSearchParams(filters);

  const res = await clientFetch(`${base}/v3/otc/crypto-transactions?${searchParams.toString()}`, {
    headers: {
      Accept: "*/*",
      "Accept-Language": locale,
      "AccountId": accountId.toString(),
    },
  });

  if (!res?.ok) return null;
  return (await res.json().catch(() => null)) as OtcOrdersResponse | null;
}

export async function fetchOtcOrdersBySymbol(locale: string, accountId: number, symbol: string, filters: OtcTransactionsFilter = {}) {
  const base = getApiBase();
  const searchParams = buildSearchParams(filters);

  const res = await clientFetch(`${base}/v3/otc/${symbol}?${searchParams.toString()}`, {
    headers: {
      Accept: "*/*",
      "Accept-Language": locale,
      "AccountId": accountId.toString(),
    },
  });

  if (!res?.ok) return null;
  return (await res.json().catch(() => null)) as OtcOrdersResponse | null;
}

export async function fetchOtcTrades(locale: string, accountId: number, filters: OtcTradesFilter = {}) {
  const base = getApiBase();
  const searchParams = buildSearchParams(filters);

  const res = await clientFetch(`${base}/v3/otc/trades?${searchParams.toString()}`, {
    headers: {
      Accept: "*/*",
      "Accept-Language": locale,
      "AccountId": accountId.toString(),
    },
  });

  if (!res?.ok) return null;
  return (await res.json().catch(() => null)) as OtcOrdersResponse | null;
}


export async function initiateWithdrawCrypto(payload: CryptoWithdrawPayload): Promise<CryptoWithdrawResponse & { message: string }> {
  const base = getApiBase();
  return clientFetch<CryptoWithdrawResponse & { message: string }>(`${base}/v3/otc/withdraw-initiate`, {
    method: "POST",
    body: JSON.stringify(payload),
    parseJson: true
  });
}

export async function withdrawCryptoComplete(flowId: string) {
  const base = getApiBase();
  const url = `${base}/v3/otc/withdraw-complete`;

  return clientFetch<{ code: number, message: string, isError: boolean }>(url, {
    method: "POST",
    body: JSON.stringify({ flowId }),
    parseJson: true
  });
}

export async function createDepositCryptoAddress(networkName: string) {
  const base = getApiBase();
  return clientFetch<CreateDepositCryptoAddressResponse>(`${base}/v3/otc/address`, {
    method: "POST",
    body: JSON.stringify({ networkName }),
    parseJson: true
  });
}

export async function fetchDepositCryptoAddress(asset?: string) {
  const base = getApiBase();
  const query = asset ? `?asset=${encodeURIComponent(asset)}` : "";
  return clientFetch<DepositCryptoAddress[]>(`${base}/v3/otc/address${query}`, {
    method: "GET",
    parseJson: true
  });
}
