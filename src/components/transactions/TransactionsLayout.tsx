"use client";

import type { ReactNode } from "react";

import { Pagination } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

type TransactionsPageShellProps = {
  title: ReactNode;
  subtitle: ReactNode;
  toolbar?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function TransactionsPageShell({
  title,
  subtitle,
  toolbar,
  children,
  className,
}: TransactionsPageShellProps) {
  return (
    <div
      className={cn(
        "min-h-[1000px] space-y-8 animate-in fade-in duration-500 rounded-4xl md:rounded-44 border border-[#1F2526] bg-[#0E0F10]/40 p-4 md:p-6",
        className,
      )}
    >
      <div className="flex flex-col gap-1">
        <h1 className="text-lg font-semibold text-[#F4F7F8]">{title}</h1>
        <p className="text-sm text-[#788084]">{subtitle}</p>
      </div>

      {toolbar}
      {children}
    </div>
  );
}

type TransactionsTableCardProps = {
  filters: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  minHeightClassName?: string;
  filtersClassName?: string;
};

export function TransactionsTableCard({
  filters,
  children,
  footer,
  minHeightClassName = "min-h-[800px]",
  filtersClassName,
}: TransactionsTableCardProps) {
  return (
    <div className={cn(minHeightClassName, "rounded-3xl border border-[#1F2526] bg-[#0E0F10] p-4 flex flex-col")}>
      <div
        className={cn(
          // Mobile: single horizontal scrollable row of filter pills.
          // md+: wrap onto multiple lines.
          "flex items-center gap-3 overflow-x-auto no-scrollbar [&>*]:shrink-0 md:flex-wrap md:overflow-x-visible",
          filtersClassName,
        )}
      >
        {filters}
      </div>
      <div className="mt-6 flex-1">{children}</div>
      {footer}
    </div>
  );
}

type TransactionsTableFooterProps = {
  pageSizeLabel: string;
  pageSize: number;
  onPageSizeChange: (value: number) => void;
  pageSizeOptions: number[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
};

export function TransactionsTableFooter({
  pageSizeLabel,
  pageSize,
  onPageSizeChange,
  pageSizeOptions,
  currentPage,
  totalPages,
  onPageChange,
  className,
}: TransactionsTableFooterProps) {
  return (
    <div className={cn("mt-6 flex items-center justify-between text-sm text-[#788084]", className)}>
      <div className="flex items-center gap-2">
        <span>{pageSizeLabel}</span>
        <Select value={String(pageSize)} onValueChange={(v) => onPageSizeChange(Number(v))}>
          <SelectTrigger className="h-9 min-w-[70px] rounded-full border border-[#3A4043] bg-[#0E0F10] px-3 text-sm font-medium text-[#F4F7F8] hover:border-[#5E666A]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="border-[#3A4043] bg-[#161A1B] text-[#F4F7F8]">
            {pageSizeOptions.map((size) => (
              <SelectItem key={size} value={String(size)} className="text-[#C5C9CC] focus:bg-white/5 focus:text-[#F4F7F8]">
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}
