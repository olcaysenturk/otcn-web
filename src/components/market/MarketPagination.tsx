"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import type { MarketPaginationProps } from "@/types/market";

export function MarketPagination({
  currentPage,
  totalPages,
  onPageChange,
}: MarketPaginationProps) {
  if (totalPages <= 1) return null;

  const visiblePages =
    totalPages <= 7
      ? Array.from({ length: totalPages }, (_, index) => index + 1)
      : [1, 2, 3, 4, 5, -1, totalPages];

  return (
    <nav className="ml-auto hidden items-center justify-center sm:flex" aria-label="Pagination">
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="flex h-8 w-8 items-center justify-center text-[#C5C9CC] disabled:cursor-not-allowed disabled:opacity-30"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {visiblePages.map((page, index) =>
        page === -1 ? (
          <span
            key={`ellipsis-${index}`}
            className="flex h-8 w-8 items-center justify-center text-xs text-[#C5C9CC]"
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={cn(
              "h-8 min-w-8 rounded-full px-2 text-xs text-[#F4F7F8]",
              currentPage === page && "bg-[#0B3D35] font-bold text-[#C7F022]",
            )}
          >
            {page}
          </button>
        ),
      )}
      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="flex h-8 w-8 items-center justify-center text-[#C5C9CC] disabled:cursor-not-allowed disabled:opacity-30"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
