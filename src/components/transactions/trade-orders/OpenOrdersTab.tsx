"use client";

import { Trash2 } from "lucide-react";

import { DataTable, type DataTableColumn } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { TradeOrdersTabProps, type UiRow } from "./types";

function TwoLineSkeleton() {
  return (
    <div className="flex flex-col gap-1.5">
      <Skeleton className="h-4 w-24 bg-white/10" />
      <Skeleton className="h-3 w-10 bg-white/10" />
    </div>
  );
}

export function OpenOrdersTab({ rows, loading, t, onCancelClick }: TradeOrdersTabProps) {
  const columns: DataTableColumn<UiRow>[] = [
    {
      id: "date",
      header: t("tradeOrders.table.headers.date"),
      width: "17%",
      skeleton: <TwoLineSkeleton />,
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-medium text-[#F4F7F8]">{row.date}</span>
          <span className="text-[11px] text-[#788084]">{row.time}</span>
        </div>
      ),
    },
    {
      id: "pair",
      header: t("tradeOrders.table.headers.pair"),
      width: "12%",
      cellClassName: "font-medium",
      skeleton: <Skeleton className="h-4 w-20 bg-white/10" />,
      cell: (row) => row.pair,
    },
    {
      id: "type",
      header: t("tradeOrders.table.headers.type"),
      width: "9%",
      skeleton: <Skeleton className="h-4 w-12 bg-white/10" />,
      cell: (row) => row.type,
    },
    {
      id: "side",
      header: t("tradeOrders.table.headers.side"),
      width: "9%",
      skeleton: <Skeleton className="h-4 w-12 bg-white/10" />,
      cell: (row) => (
        <span className={cn("font-medium", row.side === "buy" ? "text-[#27E9A6]" : "text-[#FF4D6D]")}>
          {t(`tradeOrders.side.${row.side}`)}
        </span>
      ),
    },
    {
      id: "amount",
      header: t("tradeOrders.table.headers.amount"),
      width: "12%",
      skeleton: <Skeleton className="h-4 w-16 bg-white/10" />,
      cell: (row) => row.amount,
    },
    {
      id: "price",
      header: t("tradeOrders.table.headers.price"),
      width: "12%",
      skeleton: <Skeleton className="h-4 w-16 bg-white/10" />,
      cell: (row) => row.price,
    },
    {
      id: "filled",
      header: t("tradeOrders.table.headers.filled"),
      width: "12%",
      skeleton: <Skeleton className="h-4 w-16 bg-white/10" />,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <span className="text-[#F4F7F8]">%{row.filledPercent}</span>
          <div className="h-2 w-12 rounded-full bg-[#3A4043]">
            <div className="h-2 rounded-full bg-[#C7F022]" style={{ width: `${row.filledPercent}%` }} />
          </div>
        </div>
      ),
    },
    {
      id: "total",
      header: t("tradeOrders.table.headers.total"),
      width: "12%",
      skeleton: <Skeleton className="h-4 w-16 bg-white/10" />,
      cell: (row) => row.total,
    },
    {
      id: "action",
      header: "",
      width: "5%",
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
          onClick={() => onCancelClick(row.id)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#FF4D6D]/40 text-[#FF4D6D] transition hover:bg-[#FF4D6D]/10"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      ),
    },
  ];

  return (
    <DataTable<UiRow>
      columns={columns}
      data={rows}
      isLoading={loading}
      skeletonRows={5}
      tableLayout="fixed"
      getRowId={(row, index) => `${row.id}-${index}`}
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
