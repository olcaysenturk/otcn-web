"use client";

import { ChevronRight } from "lucide-react";

import { DataTable, type DataTableColumn } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { TradeOrdersTabProps, type UiRow } from "./types";

function TwoLineSkeleton({ topW = "w-24", bottomW = "w-14" }: { topW?: string; bottomW?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Skeleton className={`h-4 ${topW} bg-white/10`} />
      <Skeleton className={`h-3 ${bottomW} bg-white/10`} />
    </div>
  );
}

export function TradeHistoryTab({ rows, loading, t, onDetailClick }: TradeOrdersTabProps) {
  const columns: DataTableColumn<UiRow>[] = [
    {
      id: "date",
      header: t("tradeOrders.table.headers.date"),
      width: "14%",
      skeleton: <TwoLineSkeleton bottomW="w-10" />,
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
      width: "14%",
      cellClassName: "font-medium",
      skeleton: <Skeleton className="h-4 w-20 bg-white/10" />,
      cell: (row) => row.pair,
    },
    {
      id: "side",
      header: t("tradeOrders.table.headers.side"),
      width: "13%",
      skeleton: <Skeleton className="h-4 w-12 bg-white/10" />,
      cell: (row) => (
        <span className={cn("font-medium", row.side === "buy" ? "text-[#27E9A6]" : "text-[#FF4D6D]")}>
          {t(`tradeOrders.side.${row.side}`)}
        </span>
      ),
    },
    {
      id: "filled",
      header: t("tradeOrders.table.headers.filled"),
      width: "13%",
      skeleton: <Skeleton className="h-4 w-12 bg-white/10" />,
      cell: (row) => row.amount,
    },
    {
      id: "price",
      header: t("tradeOrders.table.headers.price"),
      width: "14%",
      skeleton: <TwoLineSkeleton />,
      cell: (row) => (
        <div className="flex flex-col">
          <span className="text-[#F4F7F8]">{row.price}</span>
          <span className="text-[11px] text-[#788084]">≈ ₺0.00</span>
        </div>
      ),
    },
    {
      id: "fee",
      header: t("tradeOrders.table.headers.fee"),
      width: "14%",
      skeleton: <Skeleton className="h-4 w-16 bg-white/10" />,
      cell: (row) => <span className="text-[#C5C9CC]">{row.fee ?? "-"}</span>,
    },
    {
      id: "total",
      header: t("tradeOrders.table.headers.total"),
      width: "13%",
      skeleton: <TwoLineSkeleton />,
      cell: (row) => (
        <div className="flex flex-col">
          <span className="text-[#F4F7F8]">{row.total}</span>
          <span className="text-[11px] text-[#788084]">≈ ₺0.00</span>
        </div>
      ),
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
          onClick={() => onDetailClick(row)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#3A4043] text-[#788084] transition hover:border-[#f54a14] hover:text-[#f54a14]"
        >
          <ChevronRight className="h-4 w-4" />
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
