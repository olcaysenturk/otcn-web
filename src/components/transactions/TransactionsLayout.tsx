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
        "min-h-[1000px] space-y-8 animate-in fade-in duration-500 rounded-4xl md:rounded-44 border border-slate-100 bg-slate-50/80 p-4 md:p-6 shadow-sm",
        className,
      )}
    >
      <div className="flex flex-col gap-1">
        <h1 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">{subtitle}</p>
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
    <div className={cn(minHeightClassName, "rounded-3xl border border-slate-200 bg-white/70 p-4 backdrop-blur-sm flex flex-col")}>
      <div className={cn("flex flex-wrap items-center gap-3", filtersClassName)}>{filters}</div>
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
    <div className={cn("mt-6 flex items-center justify-between text-sm text-slate-600", className)}>
      <div className="flex items-center gap-2">
        <span>{pageSizeLabel}</span>
        <Select value={String(pageSize)} onValueChange={(v) => onPageSizeChange(Number(v))}>
          <SelectTrigger className="h-9 min-w-[70px] rounded-full border border-slate-200 bg-white px-3 text-sm font-medium text-slate-800 shadow-sm hover:border-slate-300">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white text-slate-900">
            {pageSizeOptions.map((size) => (
              <SelectItem key={size} value={String(size)}>
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
