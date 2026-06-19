import { D } from "@/lib/math/decimal";
import { formatDecimalValue } from "@/lib/math/formatDecimal";
import type { PendingDepositDeclaration } from "@/types/crypto";
import { parseISO } from "date-fns";

import type { CryptoTransaction, Transaction } from "./types";
import { mapApiStatusToTransactionStatus } from "@/components/transactions/status";

function toNumericId(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
}

function toDeclarationFlag(item: Record<string, unknown>): boolean {
  if (
    item.cryptoDepositDeclarationDetail ||
    item.depositDeclarationDetail ||
    item.declarationDetail ||
    item.declaration ||
    item.declarationId ||
    item.declaration_id ||
    item.depositDeclarationId ||
    item.deposit_declaration_id
  ) {
    return true;
  }

  const raw =
    item.declarationStatus ??
    item.declaration_status ??
    item.declareStatus ??
    item.declare_status ??
    item.isDeclared ??
    item.is_declared ??
    item.hasDeclaration ??
    item.has_declaration;

  if (raw === undefined || raw === null) return false;
  if (typeof raw === "boolean") return raw;
  if (typeof raw === "number") return raw === 1;
  if (typeof raw === "string") {
    const normalized = raw.trim().toLowerCase();
    return ["1", "true", "declared", "submitted", "completed", "approved", "beyanverildi"].includes(normalized);
  }

  return false;
}

export function mapFiatTransactionsToRows(
  items: unknown[],
  intlLocale: string,
  timeZone: string,
): Transaction[] {
  return items.map((item) => {
    const row = (item ?? {}) as Record<string, unknown>;
    const transactionType = String(row.transactionType ?? "").toLowerCase();
    return {
      id: String(row.transactionId ?? ""),
      date: new Date(String(row.createdDate ?? "")).toLocaleString(intlLocale, { timeZone }),
      amount: formatDecimalValue(D.parse(String(row.quantity ?? "0")), { minDecimals: 2 }),
      status: mapApiStatusToTransactionStatus(row.status),
      type: (transactionType === "withdrawal" || transactionType === "withdraw" ? "withdraw" : "deposit") as "withdraw" | "deposit",
      bank: String(row.userProvider ?? row.exchangeProvider ?? "-"),
      bankAccount: String(row.userProvider ?? "-"),
      iban: String(row.iban ?? "-"),
      description: String(row.description ?? "-"),
    };
  });
}

export function mapCryptoTransactionsToRows(
  items: unknown[],
  pendingDeclarations: PendingDepositDeclaration[],
  intlLocale: string,
  timeZone: string,
): CryptoTransaction[] {
  const pendingById = new Map<number, PendingDepositDeclaration>();
  const pendingByTxHash = new Map<string, PendingDepositDeclaration>();
  const pendingByUniqueCode = new Map<string, PendingDepositDeclaration>();
  for (const pending of pendingDeclarations) {
    pendingById.set(pending.id, pending);
    if (pending.txHash) pendingByTxHash.set(String(pending.txHash).trim().toLowerCase(), pending);
    if (pending.uniqueCode) pendingByUniqueCode.set(String(pending.uniqueCode).trim().toLowerCase(), pending);
  }

  return items.map((item, index) => {
    const row = (item ?? {}) as Record<string, unknown>;
    const rawTxHash = String(row.tx_hash ?? row.txHash ?? "").trim();
    const rawUniqueCode = String(row.unique_code ?? row.uniqueCode ?? "").trim();
    const declared = toDeclarationFlag(row);
    const transactionType =
      (String(row.type ?? "").toLowerCase() === "withdrawal" || String(row.type ?? "").toLowerCase() === "withdraw"
        ? "withdraw"
        : "deposit") as "withdraw" | "deposit";

    const sourceTransactionId = toNumericId(
      row.depositTransactionId ??
      row.deposit_transaction_id ??
      row.transactionId ??
      row.transaction_id ??
      row.withdrawTransactionId ??
      row.withdraw_transaction_id ??
      row.id ??
      row.unique_code ??
      row.uniqueCode
    );
    const matchedPending =
      (sourceTransactionId ? pendingById.get(sourceTransactionId) : undefined) ||
      (rawTxHash ? pendingByTxHash.get(rawTxHash.toLowerCase()) : undefined) ||
      (rawUniqueCode ? pendingByUniqueCode.get(rawUniqueCode.toLowerCase()) : undefined);
    const needsDeclaration = transactionType === "deposit" && !declared && Boolean(matchedPending);

    const d = row.request_date ?? row.requestDate;
    let dateObj: Date;
    if (!d) {
      dateObj = new Date();
    } else if (typeof d === "number") {
      dateObj = new Date(d * 1000);
    } else {
      dateObj = new Date(String(d));
      if (isNaN(dateObj.getTime())) {
        dateObj = parseISO(String(d));
      }
    }
    const finalDate = isNaN(dateObj.getTime()) ? new Date() : dateObj;

    return {
      id: String(row.id ?? row.unique_code ?? row.uniqueCode ?? `crypto-${index}`),
      transactionId: sourceTransactionId ?? matchedPending?.id,
      hasDeclaration: declared,
      needsDeclaration,
      asset: String(row.asset_symbol ?? row.assetSymbol ?? "?"),
      network: String(row.network_name ?? row.networkName ?? "-"),
      date: finalDate.toLocaleString(intlLocale, { timeZone }),
      amount: formatDecimalValue(D.parse(String(row.quantity ?? "0")), { minDecimals: 2 }),
      status: mapApiStatusToTransactionStatus(row.status),
      address: String(row.destination ?? "-"),
      txId: rawTxHash,
      type: transactionType,
    };
  });
}
