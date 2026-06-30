"use client";

import * as React from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  Low-level primitives                                                       */
/*  Dark, "card row" pattern: rows are spaced cards (border-separate) with     */
/*  rounded ends, a subtle border and a hover state. Use these directly when   */
/*  a screen needs full control; otherwise prefer <DataTable />.               */
/* -------------------------------------------------------------------------- */

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement> & { containerClassName?: string }
>(({ className, containerClassName, ...props }, ref) => (
  <div className={cn("w-full overflow-x-auto", containerClassName)}>
    <table
      ref={ref}
      className={cn(
        "w-full border-separate border-spacing-y-2 text-left text-sm",
        className,
      )}
      {...props}
    />
  </div>
));
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn(className)} {...props} />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn(className)} {...props} />
));
TableBody.displayName = "TableBody";

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "px-3 py-1 text-left text-[11px] font-medium text-[#788084]",
      className,
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement> & { interactive?: boolean; selected?: boolean }
>(({ className, interactive, selected, ...props }, ref) => (
  <tr
    ref={ref}
    data-selected={selected ? "" : undefined}
    className={cn(
      "group",
      // card styling lives on the cells because border-separate needs per-cell borders
      "[&>td]:h-[74px] [&>td]:border-y [&>td]:border-[#3A4043] [&>td]:bg-[#0E0F10] [&>td]:transition-colors",
      "[&>td:first-child]:rounded-l-[20px] [&>td:first-child]:border-l",
      "[&>td:last-child]:rounded-r-[20px] [&>td:last-child]:border-r",
      interactive && "cursor-pointer hover:[&>td]:bg-[#121516]",
      selected && "[&>td]:border-[#f54a14] [&>td]:bg-[#121516]",
      className,
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("px-3 align-middle text-[13px] text-[#F4F7F8]", className)}
    {...props}
  />
));
TableCell.displayName = "TableCell";

/* -------------------------------------------------------------------------- */
/*  Generic DataTable                                                          */
/* -------------------------------------------------------------------------- */

export type SortDirection = "asc" | "desc";

export interface SortState<K extends string = string> {
  key: K;
  direction: SortDirection;
}

export type ColumnAlign = "left" | "center" | "right";

export interface DataTableColumn<T, K extends string = string> {
  /** Stable id, also used as React key and default sort key. */
  id: string;
  /** Header label / node. */
  header: React.ReactNode;
  /** Cell renderer. */
  cell: (row: T, index: number) => React.ReactNode;
  align?: ColumnAlign;
  /** Fixed column width, e.g. "180px". */
  width?: string;
  minWidth?: string;
  /** Marks the column sortable; clicking the header calls onSortChange. */
  sortable?: boolean;
  /** Sort key passed to onSortChange. Defaults to `id`. */
  sortKey?: K;
  /** Node rendered next to the header (e.g. an info icon). */
  headerAddon?: React.ReactNode;
  /** Loading placeholder for this column's cell. Falls back to a generic bar. */
  skeleton?: React.ReactNode;
  /** Label used in the stacked mobile card. Falls back to `header` if string. */
  mobileLabel?: React.ReactNode;
  /** Hide this column in the stacked mobile card. */
  hideOnMobile?: boolean;
  headerClassName?: string;
  cellClassName?: string;
}

const alignClass: Record<ColumnAlign, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const alignFlex: Record<ColumnAlign, string> = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
};

export interface DataTableProps<T, K extends string = string> {
  columns: DataTableColumn<T, K>[];
  data: T[];
  /** Stable row id for keys / expansion / selection. */
  getRowId: (row: T, index: number) => string;

  /** Controlled sort indicator state. */
  sort?: SortState<K> | null;
  /** Called with the column's sortKey when a sortable header is clicked. */
  onSortChange?: (key: K) => void;

  onRowClick?: (row: T, index: number) => void;
  rowClassName?: (row: T, index: number) => string;
  selectedRowId?: string | null;

  /** Expandable rows. */
  expandedRowId?: string | null;
  renderExpanded?: (row: T) => React.ReactNode;

  /** Loading state renders shimmer rows. */
  isLoading?: boolean;
  skeletonRows?: number;

  /** Empty state. */
  empty?: React.ReactNode;

  /** Minimum table width on desktop before horizontal scroll kicks in. */
  minWidth?: string;
  /**
   * "fixed" applies `table-fixed` so column widths come from the column defs
   * (not cell content). Use it with explicit column widths to keep the header
   * and rows perfectly aligned regardless of loading/data state.
   */
  tableLayout?: "auto" | "fixed";
  className?: string;
  containerClassName?: string;

  /** Override the default stacked mobile card per row. */
  renderMobileCard?: (row: T, index: number) => React.ReactNode;
  /** Hide the default mobile card layout (use when the page renders its own). */
  disableMobileCards?: boolean;
}

function SortIndicator({ active, direction }: { active: boolean; direction?: SortDirection }) {
  if (active && direction === "asc") return <ArrowUp className="h-3 w-3 text-[#f54a14]" />;
  if (active && direction === "desc") return <ArrowDown className="h-3 w-3 text-[#f54a14]" />;
  return <ArrowUpDown className="h-3 w-3" />;
}

export function DataTable<T, K extends string = string>({
  columns,
  data,
  getRowId,
  sort,
  onSortChange,
  onRowClick,
  rowClassName,
  selectedRowId,
  expandedRowId,
  renderExpanded,
  isLoading,
  skeletonRows = 6,
  empty,
  minWidth,
  tableLayout = "auto",
  className,
  containerClassName,
  renderMobileCard,
  disableMobileCards,
}: DataTableProps<T, K>) {
  const colCount = columns.length;
  const showEmpty = !isLoading && data.length === 0;

  const renderHeaderCell = (column: DataTableColumn<T, K>) => {
    const sortKey = (column.sortKey ?? column.id) as K;
    const isActive = !!sort && sort.key === sortKey;
    const content = (
      <span className={cn("inline-flex items-center gap-1", alignFlex[column.align ?? "left"])}>
        {column.header}
        {column.headerAddon}
        {column.sortable && <SortIndicator active={isActive} direction={sort?.direction} />}
      </span>
    );

    return (
      <TableHead
        key={column.id}
        style={{ width: column.width, minWidth: column.minWidth }}
        className={cn(alignClass[column.align ?? "left"], column.headerClassName)}
      >
        {column.sortable && onSortChange ? (
          <button
            type="button"
            onClick={() => onSortChange(sortKey)}
            className={cn(
              "flex w-full items-center gap-1 transition hover:text-[#F4F7F8]",
              alignFlex[column.align ?? "left"],
              isActive && "text-[#F4F7F8]",
            )}
          >
            {column.header}
            {column.headerAddon}
            <SortIndicator active={isActive} direction={sort?.direction} />
          </button>
        ) : (
          content
        )}
      </TableHead>
    );
  };

  /* ----------------------------- Desktop table ---------------------------- */
  const desktop = (
    <Table
      containerClassName={cn(disableMobileCards ? "" : "hidden md:block", containerClassName)}
      className={cn(tableLayout === "fixed" && "table-fixed", className)}
      style={minWidth ? { minWidth } : undefined}
    >
      <TableHeader>
        <tr>{columns.map(renderHeaderCell)}</tr>
      </TableHeader>
      <TableBody>
        {isLoading &&
          Array.from({ length: skeletonRows }).map((_, i) => (
            <TableRow key={`sk-${i}`}>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  className={cn(alignClass[column.align ?? "left"], column.cellClassName)}
                >
                  {column.skeleton ?? <Skeleton className="h-4 w-full max-w-[120px] bg-white/10" />}
                </TableCell>
              ))}
            </TableRow>
          ))}

        {!isLoading &&
          data.map((row, index) => {
            const id = getRowId(row, index);
            const isExpanded = expandedRowId === id;
            const hasDetail = isExpanded && !!renderExpanded;
            return (
              <React.Fragment key={id}>
                <TableRow
                  interactive={!!onRowClick}
                  selected={selectedRowId === id && !isExpanded}
                  onClick={onRowClick ? () => onRowClick(row, index) : undefined}
                  className={cn(
                    rowClassName?.(row, index),
                    // When a detail row follows, open the bottom of this row so the
                    // two share a single continuous border (see detail row below).
                    hasDetail &&
                      "[&>td]:border-[#f54a14] [&>td]:border-b-0 [&>td:first-child]:rounded-bl-none [&>td:last-child]:rounded-br-none",
                  )}
                >
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      className={cn(alignClass[column.align ?? "left"], column.cellClassName)}
                    >
                      {column.cell(row, index)}
                    </TableCell>
                  ))}
                </TableRow>
                {hasDetail && (
                  <tr>
                    <td colSpan={colCount} className="border-0 bg-transparent p-0">
                      {/* -mt-2 closes the border-spacing gap so this connects to the
                          row above, forming one card with a single lime border. */}
                      <div className="-mt-2 rounded-b-[20px] border border-t-0 border-[#f54a14] bg-[#0E0F10] px-3 py-4">
                        {renderExpanded(row)}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}

        {showEmpty && (
          <tr>
            <td colSpan={colCount} className="!border-0 !bg-transparent p-0">
              {empty}
            </td>
          </tr>
        )}
      </TableBody>
    </Table>
  );

  if (disableMobileCards) return desktop;

  /* ------------------------------ Mobile cards ---------------------------- */
  const mobileColumns = columns.filter((c) => !c.hideOnMobile);
  const mobile = (
    <div className="flex flex-col gap-2 md:hidden">
      {isLoading &&
        Array.from({ length: skeletonRows }).map((_, i) => (
          <div
            key={`msk-${i}`}
            className="flex flex-col gap-3 rounded-[20px] border border-[#3A4043] bg-[#0E0F10] p-4"
          >
            {mobileColumns.map((column) => (
              <div key={column.id} className="flex items-center justify-between gap-3">
                <Skeleton className="h-3 w-20 bg-white/10" />
                {column.skeleton ?? <Skeleton className="h-4 w-24 bg-white/10" />}
              </div>
            ))}
          </div>
        ))}

      {!isLoading &&
        data.map((row, index) => {
          const id = getRowId(row, index);
          if (renderMobileCard) {
            return <React.Fragment key={id}>{renderMobileCard(row, index)}</React.Fragment>;
          }
          const isExpanded = expandedRowId === id;
          return (
            <div
              key={id}
              onClick={onRowClick ? () => onRowClick(row, index) : undefined}
              className={cn(
                "rounded-[20px] border bg-[#0E0F10] p-4 transition-colors",
                isExpanded || selectedRowId === id ? "border-[#f54a14]" : "border-[#3A4043]",
                onRowClick && "cursor-pointer",
              )}
            >
              <div className="flex flex-col gap-3">
                {mobileColumns.map((column) => (
                  <div key={column.id} className="flex items-center justify-between gap-3">
                    <span className="text-[11px] font-medium text-[#788084]">
                      {column.mobileLabel ?? column.header}
                    </span>
                    <span className="text-right text-[13px] text-[#F4F7F8]">
                      {column.cell(row, index)}
                    </span>
                  </div>
                ))}
              </div>
              {isExpanded && renderExpanded && (
                <div className="mt-3 border-t border-[#3A4043] pt-3">{renderExpanded(row)}</div>
              )}
            </div>
          );
        })}

      {showEmpty && empty}
    </div>
  );

  return (
    <>
      {desktop}
      {mobile}
    </>
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
};
