"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

export interface FilterPillProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value"> {
  /** Static descriptor shown before the divider, e.g. "İşlem Tipi". */
  label: string;
  /** Current selection shown after the divider, e.g. "Kripto Çekme". */
  value?: React.ReactNode;
  /** Hide the trailing chevron (e.g. for non-dropdown filters). */
  showChevron?: boolean;
}

/**
 * Reusable filter trigger pill — the closed state shared by every transaction
 * filter type (select, input, date, boolean, toggle). The dropdown/content that
 * opens on click is provided by the consumer; this component only renders the
 * pill. Pixel-matched to the otcn "Filters" design.
 */
export const FilterPill = React.forwardRef<HTMLButtonElement, FilterPillProps>(
  ({ label, value, showChevron = true, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "group flex h-[38px] items-center gap-5 rounded-[12px] border border-[#3A4043] bg-[#0E0F10] px-3 py-2.5 outline-none transition-colors hover:border-[#5E666A] focus-visible:border-[#5E666A] data-[state=open]:border-[#5E666A]",
          className,
        )}
        {...props}
      >
        <span className="flex items-center gap-2.5">
          <span className="whitespace-nowrap text-[13px] font-medium tracking-[-0.195px] text-[#C5C9CC]">
            {label}
          </span>
          <span aria-hidden className="h-[11px] w-px shrink-0 bg-[#3A4043]" />
        </span>
        <span className="flex items-center gap-2.5">
          {value !== undefined && (
            <span className="whitespace-nowrap text-[13px] font-medium tracking-[-0.195px] text-[#F4F7F8]">
              {value}
            </span>
          )}
          {showChevron && (
            <ChevronDown className="size-5 shrink-0 text-[#C5C9CC] transition-transform duration-200 group-data-[state=open]:rotate-180" />
          )}
        </span>
      </button>
    );
  },
);

FilterPill.displayName = "FilterPill";
