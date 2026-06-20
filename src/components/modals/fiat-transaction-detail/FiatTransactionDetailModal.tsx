"use client";

import type { Transaction } from "@/components/transactions/deposit-withdraw/types";
import { TransactionStatusPill } from "@/components/transactions/deposit-withdraw/TransactionStatusPill";
import { useI18n } from "@/lib/i18n/I18nProvider";

import { DetailRow, TransactionDetailShell } from "../transaction-detail/TransactionDetailShell";

type FiatTransactionDetailModalProps = {
  transaction?: Transaction;
};

export function FiatTransactionDetailModal({ transaction }: FiatTransactionDetailModalProps) {
  const { t } = useI18n();
  const tx = transaction;

  const display = (value?: string) => (value && value.trim() ? value : "-");

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
          <DetailRow label={t("transactions.filters.currency.label")} value={display(tx.currency) === "-" ? "TRY" : display(tx.currency)} />
          <DetailRow label={t("transactions.table.headers.amount")} value={display(tx.amount)} />
          <DetailRow label={t("transactions.table.headers.bank")} value={display(tx.bank)} />
          <DetailRow label={t("transactions.table.detail.id")} value={display(tx.id)} />
          <DetailRow label={t("transactions.table.detail.iban")} value={display(tx.iban)} />
          <DetailRow label={t("transactions.table.detail.description")} value={display(tx.description)} />
        </>
      )}
    </TransactionDetailShell>
  );
}
