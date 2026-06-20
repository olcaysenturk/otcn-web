"use client";

import type { CryptoTransaction } from "@/components/transactions/deposit-withdraw/types";
import { TransactionStatusPill } from "@/components/transactions/deposit-withdraw/TransactionStatusPill";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { toast } from "sonner";

import { DetailRow, TransactionDetailShell } from "../transaction-detail/TransactionDetailShell";

type CryptoTransactionDetailModalProps = {
  transaction?: CryptoTransaction;
};

export function CryptoTransactionDetailModal({ transaction }: CryptoTransactionDetailModalProps) {
  const { t } = useI18n();
  const tx = transaction;

  const display = (value?: string) => (value && value.trim() ? value : "-");
  const compact = (value?: string, head = 6, tail = 6) => {
    const raw = value?.trim();
    if (!raw) return "-";
    if (raw.length <= head + tail + 3) return raw;
    return `${raw.slice(0, head)}...${raw.slice(-tail)}`;
  };
  const copy = (value?: string) => {
    const raw = value?.trim();
    if (!raw || raw === "-") return;
    navigator.clipboard?.writeText(raw).then(
      () => toast.success(t("toast.copied")),
      () => toast.error(t("toast.copied")),
    );
  };

  return (
    <TransactionDetailShell title={t("transactions.crypto.detailTitle")}>
      {!tx ? (
        <div className="pt-4 text-sm text-[#788084]">{t("common.emptyState.description")}</div>
      ) : (
        <>
          <DetailRow
            label={t("transactions.table.headers.status")}
            value={<TransactionStatusPill status={tx.status} t={t} />}
          />
          <DetailRow label={t("transactions.table.headers.date")} value={display(tx.date)} />
          <DetailRow
            label={t("transactions.table.headers.type")}
            value={tx.type === "withdraw" ? t("transactionTypes.withdraw") : t("transactionTypes.deposit")}
          />
          <DetailRow label={t("transactions.crypto.headers.asset")} value={display(tx.asset).toUpperCase()} />
          <DetailRow label={t("transactions.crypto.headers.network")} value={display(tx.network)} />
          <DetailRow label={t("transactions.crypto.headers.amount")} value={display(tx.amount)} />
          {tx.fee && <DetailRow label={t("transactions.crypto.headers.fee")} value={display(tx.fee)} />}
          <DetailRow
            label={t("transactions.crypto.headers.address")}
            value={compact(tx.address)}
            copyValue={tx.address}
            onCopy={copy}
          />
          <DetailRow
            label={t("transactions.crypto.headers.txid")}
            value={compact(tx.txId)}
            copyValue={tx.txId}
            onCopy={copy}
          />
          {tx.hasDeclaration && (
            <DetailRow
              label={t("transactions.crypto.declare")}
              value={
                <span className="inline-flex items-center rounded-full border border-[#27E9A6] bg-[rgba(39,233,166,0.1)] px-3 py-1 text-xs font-semibold text-[#27E9A6]">
                  {t("transactions.crypto.declared")}
                </span>
              }
            />
          )}
        </>
      )}
    </TransactionDetailShell>
  );
}
