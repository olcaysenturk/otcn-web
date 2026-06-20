"use client";

import type { CryptoTransaction, Transaction } from "./types";
import { CryptoTransactionsTab } from "./CryptoTransactionsTab";
import { FiatTransactionsTab } from "./FiatTransactionsTab";

type DepositWithdrawTabPanelProps = {
  tab: "fiat" | "crypto";
  fiatLoading: boolean;
  fiatRows: Transaction[];
  cryptoLoading: boolean;
  cryptoRows: CryptoTransaction[];
  t: (key: string) => string;
  expanded: string | null;
  onExpand: (id: string | null) => void;
  copyWithToast: (value: string) => void;
  onDeclareClick: (mode: "withdraw" | "deposit", transactionId?: number) => void;
  onDetailClick: (transaction: CryptoTransaction) => void;
  onFiatDetailClick: (transaction: Transaction) => void;
};

export function DepositWithdrawTabPanel({
  tab,
  fiatLoading,
  fiatRows,
  cryptoLoading,
  cryptoRows,
  t,
  expanded,
  onExpand,
  copyWithToast,
  onDeclareClick,
  onDetailClick,
  onFiatDetailClick,
}: DepositWithdrawTabPanelProps) {
  if (tab === "fiat") {
    return (
      <FiatTransactionsTab
        rows={fiatRows}
        loading={fiatLoading}
        t={t}
        expanded={expanded}
        onExpand={onExpand}
        onDetailClick={onFiatDetailClick}
      />
    );
  }

  return (
    <CryptoTransactionsTab
      rows={cryptoRows}
      loading={cryptoLoading}
      t={t}
      copyWithToast={copyWithToast}
      onDeclareClick={onDeclareClick}
      onDetailClick={onDetailClick}
    />
  );
}
