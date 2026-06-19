import { clientFetch } from "@/lib/api/clientFetch";
import { getApiBase } from "@/lib/api/getApiBase";
import { buildSearchParams } from "@/lib/api/utils";
import type { FiatTransactionsFilter, FiatTransactionsResponse } from "@/types/fiat";
import { InitiateWithdrawToBankRequest, InitiateWithdrawToBankResponse } from "@/types/fiat";

export async function fetchFiatTransactions(
  locale: string,
  accountId: number,
  filters: FiatTransactionsFilter = {}
) {
  const base = getApiBase();
  const searchParams = buildSearchParams(filters);

  const res = await clientFetch(`${base}/v3/fiat/transactions?${searchParams.toString()}`, {
    headers: {
      Accept: "*/*",
      "Accept-Language": locale,
      AccountId: accountId.toString(),
    },
  });

  if (!res?.ok) return null;
  return (await res.json().catch(() => null)) as FiatTransactionsResponse | null;
}

export async function initiateWithdrawToBank(form: InitiateWithdrawToBankRequest): Promise<InitiateWithdrawToBankResponse & { message: string }> {
  const base = getApiBase();
  return clientFetch<InitiateWithdrawToBankResponse & { message: string }>(`${base}/v3/fiat/withdrawal/bank-initiate`, {
    method: "POST",
    body: JSON.stringify(form),
    parseJson: true
  });
}

export async function completeWithdrawToBank(flowId: string) {
  const base = getApiBase();
  return clientFetch<{ ok: boolean }>(`${base}/v3/fiat/withdrawal/bank-complete`, {
    method: "POST",
    body: JSON.stringify({ flowId }),
  });
}