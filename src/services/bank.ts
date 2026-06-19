import { clientFetch } from "@/lib/api/clientFetch";
import { getApiBase } from "@/lib/api/getApiBase";
import type { AddBankRequest, Bank, DepositBankItem, UserBank } from "@/types/bank";

export async function fetchDepositBanks(): Promise<DepositBankItem[]> {
  const base = getApiBase();
  const url = `${base}/v3/banks/deposit-banks`;

  const res = await clientFetch(url);

  if (!res?.ok) {
    return [];
  }

  return res.json();
}

export async function fetchBanks(): Promise<Bank[]> {
  const base = getApiBase();
  const url = `${base}/v3/banks`;

  const res = await clientFetch(url);

  if (!res?.ok) {
    return [];
  }

  return res.json();
}

export async function fetchUserBanks(): Promise<UserBank[]> {
  const base = getApiBase();
  const url = `${base}/v3/user-banks`;

  const res = await clientFetch(url);

  if (!res?.ok) {
    return [];
  }

  return res.json();
}

export async function addBank(bankData: AddBankRequest) {
  const base = getApiBase();
  const url = `${base}/v3/user-banks`;

  return clientFetch(url, {
    method: 'POST',
    body: JSON.stringify(bankData),
  });
}
