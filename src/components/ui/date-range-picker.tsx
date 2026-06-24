"use client";

import * as React from "react";
import { DateRange, DayPicker, type DayPickerProps } from "react-day-picker";
import type { Locale } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

export interface DateRangePickerProps {
  /** Currently selected range. */
  selected?: DateRange;
  /** Fires whenever the selection changes. */
  onSelect?: (range: DateRange | undefined) => void;
  /** Months rendered side by side. Defaults to 2. */
  numberOfMonths?: number;
  /** date-fns locale used for month/weekday labels. */
  locale?: Locale;
  /** 0 = Sunday, 1 = Monday. Defaults to 1. */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /** Disabled matcher forwarded to react-day-picker (e.g. `{ after: new Date() }`). */
  disabled?: DayPickerProps["disabled"];
  /** Render the İptal / Uygula footer with the range summary. Defaults to false. */
  showFooter?: boolean;
  /** Text shown on the left of the footer (e.g. the formatted range). */
  summary?: React.ReactNode;
  applyLabel?: string;
  cancelLabel?: string;
  applyDisabled?: boolean;
  onApply?: () => void;
  onCancel?: () => void;
  /** Extra classes for the outer card. */
  className?: string;
}

const dayPickerClassNames = {
  root: "relative",
  months: "flex gap-2",
  month: "space-y-1 px-2.5 pt-1",
  month_caption: "flex h-9 items-center justify-center",
  caption_label: "text-[14px] font-medium leading-[14px] text-[#F4F7F8]",
  nav: "pointer-events-none absolute inset-x-0 top-1 z-10 flex items-center justify-between px-1",
  button_previous:
    "pointer-events-auto flex size-9 items-center justify-center rounded-full text-[#F4F7F8] transition-colors hover:bg-white/5 disabled:opacity-30",
  button_next:
    "pointer-events-auto flex size-9 items-center justify-center rounded-full text-[#F4F7F8] transition-colors hover:bg-white/5 disabled:opacity-30",
  month_grid: "border-collapse",
  weekday: "h-8 w-[38px] align-middle text-[12px] font-medium leading-3 text-[#C5C9CC]",
  day: "h-8 w-[38px] p-0 text-center align-middle",
  day_button:
    "flex h-8 w-[38px] items-center justify-center rounded-[6px] text-[13px] font-medium leading-[1.4] tracking-[-0.195px] text-[#F4F7F8] transition-colors hover:bg-white/5 disabled:pointer-events-none",
  today: "",
  outside: "[&_button]:text-[#5E666A] [&_button]:opacity-50 [&_button]:hover:bg-transparent",
  disabled: "[&_button]:pointer-events-none [&_button]:text-[#5E666A] [&_button]:opacity-40",
  // Figma "Dateicker" (52609-10518): range endpoints = solid primary (#F54A14)
  // with white (#F4F7F8) text; range middle = border/50 (#3A4043 @ 50%) with
  // primary text. Tokens: primary, foreground, border.
  selected:
    "[&_button]:!rounded-[8px] [&_button]:!bg-primary [&_button]:!text-foreground [&_button]:hover:!bg-primary",
  range_start:
    "rounded-l-[8px] bg-primary [&_button]:!rounded-none [&_button]:!bg-transparent [&_button]:!text-foreground [&_button]:hover:!bg-transparent",
  range_end:
    "rounded-r-[8px] bg-primary [&_button]:!rounded-none [&_button]:!bg-transparent [&_button]:!text-foreground [&_button]:hover:!bg-transparent",
  range_middle:
    "bg-border/50 [&_button]:!rounded-none [&_button]:!bg-transparent [&_button]:!text-primary [&_button]:hover:!bg-transparent",
};

/**
 * Reusable two-month range date picker matched to the otcn design
 * (dark surface, lime selection). Usable standalone or embedded inside a
 * filter dropdown. Pass `showFooter` to render the İptal / Uygula actions.
 */
export function DateRangePicker({
  selected,
  onSelect,
  numberOfMonths = 2,
  locale,
  weekStartsOn = 1,
  disabled,
  showFooter = false,
  summary,
  applyLabel = "Uygula",
  cancelLabel = "İptal",
  applyDisabled,
  onApply,
  onCancel,
  className,
}: DateRangePickerProps) {
  const isApplyDisabled = applyDisabled ?? (!selected?.from || !selected?.to);

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-[20px] border border-[#3A4043] bg-[#0E0F10] shadow-[0px_10px_14px_0px_rgba(15,42,81,0.03)]",
        className,
      )}
    >
      <div className="p-2.5">
        <DayPicker
          mode="range"
          numberOfMonths={numberOfMonths}
          weekStartsOn={weekStartsOn}
          locale={locale}
          selected={selected}
          onSelect={onSelect}
          disabled={disabled}
          showOutsideDays
          classNames={dayPickerClassNames}
          components={{
            Chevron: ({ orientation }) =>
              orientation === "left" ? (
                <ChevronLeft className="size-5" />
              ) : (
                <ChevronRight className="size-5" />
              ),
          }}
        />
      </div>

      {showFooter && (
        <div className="flex items-center justify-end gap-5 border-t border-[#3A4043] py-3 pr-[15px]">
          {summary && (
            <span className="text-[14px] font-medium leading-[14px] text-[#F4F7F8]">{summary}</span>
          )}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-[8px] border-[0.8px] border-[#F4F7F8] px-[12.8px] py-2 text-[11px] font-bold leading-[14px] text-[#F4F7F8] transition-colors hover:bg-white/5"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={onApply}
              disabled={isApplyDisabled}
              className="rounded-[8px] bg-[#F4F7F8] px-[12.8px] py-2 text-[11px] font-bold leading-[14px] text-[#0E0F10] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {applyLabel}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
