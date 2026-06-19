"use client";

import type { ReactNode } from "react";
import type { UiRow } from "./types";
import { OpenOrdersTab } from "./OpenOrdersTab";
import { OrderHistoryTab } from "./OrderHistoryTab";
import { TradeHistoryTab } from "./TradeHistoryTab";
import { TransactionsTableSkeleton } from "../TransactionSkeleton";

type TradeOrdersTabPanelProps = {
  tab: "open" | "orders" | "history";
  loading: boolean;
  rows: UiRow[];
  t: (key: string) => string;
  getStatusBadge: (status?: string | number) => ReactNode;
  onCancelClick: (id: number) => void;
  onOrderDetailClick: (row: UiRow) => void;
  onTradeDetailClick: (row: UiRow) => void;
};

export function TradeOrdersTabPanel({
  tab,
  loading,
  rows,
  t,
  getStatusBadge,
  onCancelClick,
  onOrderDetailClick,
  onTradeDetailClick,
}: TradeOrdersTabPanelProps) {
  if (loading) {
    return <TransactionsTableSkeleton />;
  }

  if (tab === "open") {
    return (
      <OpenOrdersTab
        rows={rows}
        loading={loading}
        t={t}
        onCancelClick={onCancelClick}
        getStatusBadge={getStatusBadge}
        onDetailClick={() => { }}
      />
    );
  }

  if (tab === "orders") {
    return (
      <OrderHistoryTab
        rows={rows}
        loading={loading}
        t={t}
        onCancelClick={onCancelClick}
        getStatusBadge={getStatusBadge}
        onDetailClick={onOrderDetailClick}
      />
    );
  }

  return (
    <TradeHistoryTab
      rows={rows}
      loading={loading}
      t={t}
      onCancelClick={onCancelClick}
      getStatusBadge={getStatusBadge}
      onDetailClick={onTradeDetailClick}
    />
  );
}
