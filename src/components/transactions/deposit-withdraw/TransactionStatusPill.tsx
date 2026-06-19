"use client";

import { cn } from "@/lib/utils";
import { getTransactionStatusClasses, getTransactionStatusTextKey, type UiTransactionStatus } from "@/components/transactions/status";

type TransactionStatusPillProps = {
  status: UiTransactionStatus;
  t: (key: string) => string;
  withMinWidth?: boolean;
};

export function TransactionStatusPill({ status, t, withMinWidth = false }: TransactionStatusPillProps) {
  return (
    <span className={cn(getTransactionStatusClasses(status, withMinWidth))}>
      {t(getTransactionStatusTextKey(status))}
    </span>
  );
}
