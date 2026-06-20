"use client";

import { ChevronRight, Copy } from "lucide-react";

import { DataTable, type DataTableColumn } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { CryptoTransactionsTabProps } from "./types";
import { TransactionStatusPill } from "./TransactionStatusPill";
import type { CryptoTransaction } from "./types";

function TwoLineSkeleton({ topW = "w-24", bottomW = "w-16" }: { topW?: string; bottomW?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Skeleton className={`h-4 ${topW} bg-white/10`} />
      <Skeleton className={`h-3 ${bottomW} bg-white/10`} />
    </div>
  );
}

const compactHash = (value: string, head = 6, tail = 6) => {
  if (!value) return "-";
  if (value.length <= head + tail + 3) return value;
  return `${value.slice(0, head)}...${value.slice(-tail)}`;
};

const hasValue = (value?: string) => Boolean(value && value.trim() && value.trim() !== "-");

export function CryptoTransactionsTab({
  rows,
  loading,
  t,
  copyWithToast,
  onDetailClick,
}: CryptoTransactionsTabProps) {
  const CopyCell = ({ value }: { value: string }) => (
    <span className="flex min-w-0 items-center gap-2">
      <span className="w-[120px] shrink-0 truncate">{compactHash(value)}</span>
      {hasValue(value) && (
        <button
          type="button"
          className="shrink-0 rounded p-1 text-[#788084] transition hover:bg-white/5 hover:text-[#F4F7F8]"
          onClick={() => copyWithToast(value)}
        >
          <Copy className="h-4 w-4" />
        </button>
      )}
    </span>
  );

  const columns: DataTableColumn<CryptoTransaction>[] = [
    {
      id: "asset",
      header: t("transactions.crypto.headers.asset"),
      width: "13%",
      cellClassName: "font-medium uppercase",
      skeleton: <Skeleton className="h-4 w-16 bg-white/10" />,
      cell: (row) => String(row.asset || "-").toUpperCase(),
    },
    {
      id: "date",
      header: t("transactions.table.headers.date"),
      width: "11%",
      skeleton: <TwoLineSkeleton bottomW="w-12" />,
      cell: (row) => {
        const [datePart, timePart] = row.date.split(" ");
        return (
          <div className="flex flex-col">
            <span className="font-medium text-[#F4F7F8]">{datePart}</span>
            <span className="text-[11px] text-[#788084]">{timePart}</span>
          </div>
        );
      },
    },
    {
      id: "amount",
      header: t("transactions.crypto.headers.amount"),
      width: "13%",
      skeleton: <TwoLineSkeleton />,
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-[#F4F7F8]">{row.amount}</span>
          <span className="text-[11px] text-[#788084]">{row.amountApprox ?? "≈ ₺0.00"}</span>
        </div>
      ),
    },
    {
      id: "fee",
      header: t("transactions.crypto.headers.fee"),
      width: "13%",
      skeleton: <Skeleton className="h-4 w-16 bg-white/10" />,
      cell: (row) => <span className="text-[#C5C9CC]">{row.fee ?? "-"}</span>,
    },
    {
      id: "status",
      header: t("transactions.table.headers.status"),
      width: "11%",
      skeleton: <Skeleton className="h-6 w-20 rounded-full bg-white/10" />,
      cell: (row) => <TransactionStatusPill status={row.status} t={t} />,
    },
    {
      id: "address",
      header: t("transactions.crypto.headers.address"),
      width: "17%",
      skeleton: <Skeleton className="h-4 w-32 bg-white/10" />,
      cell: (row) => <CopyCell value={row.address} />,
    },
    {
      id: "txid",
      header: t("transactions.crypto.headers.txid"),
      width: "16%",
      skeleton: <Skeleton className="h-4 w-32 bg-white/10" />,
      cell: (row) => <CopyCell value={row.txId} />,
    },
    {
      id: "action",
      header: "",
      width: "6%",
      align: "right",
      hideOnMobile: true,
      skeleton: (
        <div className="flex justify-end">
          <Skeleton className="h-9 w-9 rounded-full bg-white/10" />
        </div>
      ),
      cell: (row) => (
        <button
          type="button"
          onClick={() => onDetailClick(row)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#3A4043] text-[#788084] transition hover:border-[#C7F022] hover:text-[#C7F022]"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      ),
    },
  ];

  return (
    <DataTable<CryptoTransaction>
      columns={columns}
      data={rows}
      isLoading={loading}
      tableLayout="fixed"
      getRowId={(row) => row.id}
      rowClassName={() => "hover:[&>td]:bg-[#121516]"}
      empty={
        <EmptyState
          title={t("common.emptyState.title")}
          description={t("common.emptyState.description")}
        />
      }
    />
  );
}
