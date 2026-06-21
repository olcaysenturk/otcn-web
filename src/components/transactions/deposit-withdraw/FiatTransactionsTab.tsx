"use client";

import { ChevronDown, ChevronRight } from "lucide-react";

import { DataTable, type DataTableColumn } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { FiatTransactionsTabProps } from "./types";
import { TransactionStatusPill } from "./TransactionStatusPill";
import type { Transaction } from "./types";

function TwoLineSkeleton() {
  return (
    <div className="flex flex-col gap-1.5">
      <Skeleton className="h-4 w-24 bg-white/10" />
      <Skeleton className="h-3 w-12 bg-white/10" />
    </div>
  );
}

export function FiatTransactionsTab({ rows, loading, t, expanded, onExpand, onDetailClick }: FiatTransactionsTabProps) {
  const columns: DataTableColumn<Transaction>[] = [
    {
      id: "date",
      header: t("transactions.table.headers.date"),
      width: "22%",
      mobileLabel: t("transactions.table.headers.date"),
      skeleton: <TwoLineSkeleton />,
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
      id: "type",
      header: t("transactions.table.headers.type"),
      width: "18%",
      skeleton: <Skeleton className="h-4 w-24 bg-white/10" />,
      cell: (row) => (
        <span
          className={cn(
            "font-medium",
            row.type === "withdraw" ? "text-[#FF4D6D]" : "text-[#27E9A6]",
          )}
        >
          {row.type === "withdraw" ? t("transactionTypes.withdraw") : t("transactionTypes.deposit")}
        </span>
      ),
    },
    {
      id: "amount",
      header: t("transactions.table.headers.amount"),
      width: "18%",
      cellClassName: "whitespace-nowrap font-semibold",
      skeleton: <Skeleton className="h-4 w-28 bg-white/10" />,
      cell: (row) => row.amount,
    },
    {
      id: "status",
      header: t("transactions.table.headers.status"),
      width: "18%",
      skeleton: <Skeleton className="h-6 w-20 rounded-full bg-white/10" />,
      cell: (row) => <TransactionStatusPill status={row.status} t={t} />,
    },
    {
      id: "bank",
      header: t("transactions.table.headers.bank"),
      width: "18%",
      skeleton: <Skeleton className="h-4 w-28 bg-white/10" />,
      cell: (row) => {
        const isOpen = expanded === row.id;
        return (
          <button
            type="button"
            onClick={() => onExpand(isOpen ? null : row.id)}
            className={cn(
              "inline-flex items-center gap-2 rounded-md font-medium transition-colors",
              isOpen ? "text-[#C7F022]" : "text-[#F4F7F8] hover:text-[#C7F022]",
            )}
          >
            {row.bank}
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                isOpen ? "rotate-180 text-[#C7F022]" : "text-[#788084]",
              )}
            />
          </button>
        );
      },
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
      // Separate nav action (NOT the expand toggle) — opens the detail popup.
      cell: (row) => (
        <button
          type="button"
          onClick={() => onDetailClick(row)}
          aria-label={t("transactions.crypto.detailTitle")}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#3A4043] text-[#788084] transition hover:border-[#C7F022] hover:text-[#C7F022]"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      ),
    },
  ];

  return (
    <DataTable<Transaction>
      columns={columns}
      data={rows}
      isLoading={loading}
      skeletonRows={5}
      tableLayout="fixed"
      getRowId={(row) => row.id}
      expandedRowId={expanded}
      rowClassName={() => "hover:[&>td]:bg-[#121516]"}
      renderExpanded={(row) => (
        <div className="flex flex-col gap-3 text-sm">
          <DetailRow label={t("transactions.table.detail.id")} value={row.id} />
          <DetailRow label={t("transactions.table.detail.bankName")} value={row.bankAccount} />
          <DetailRow label={t("transactions.table.detail.iban")} value={row.iban} />
          <DetailRow label={t("transactions.table.detail.description")} value={row.description || "-"} />
        </div>
      )}
      empty={
        <EmptyState
          title={t("common.emptyState.title")}
          description={t("common.emptyState.description")}
        />
      }
    />
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="font-medium text-[#788084]">{label}</span>
      <span className="text-right font-medium text-[#F4F7F8] break-all">{value}</span>
    </div>
  );
}
