"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface ModalSheetProps {
  /** Header title (rendered in the lime bar). Omit `header` to use this. */
  title?: ReactNode;
  /** Replace the whole lime header bar. */
  header?: ReactNode;
  onClose: () => void;
  isClosing?: boolean;
  children: ReactNode;
  /**
   * Mobile presentation. Desktop is always a right-side panel.
   * - "sheet": bottom sheet, slides up, rounded top (default).
   * - "fullscreen": full-page, slides up, no rounding.
   */
  mobile?: "sheet" | "fullscreen";
  /** Extra classes for the panel. */
  className?: string;
  /** Extra classes for the scrollable content area. */
  contentClassName?: string;
}

/**
 * Responsive modal shell rendered inside `ModalRoot` (which provides the backdrop
 * + portal). Bottom sheet or full page on mobile; right-side panel on desktop.
 */
export function ModalSheet({
  title,
  header,
  onClose,
  isClosing,
  children,
  mobile = "sheet",
  className,
  contentClassName,
}: ModalSheetProps) {
  const fullscreen = mobile === "fullscreen";

  return (
    <div
      onClick={onClose}
      className={cn(
        "absolute inset-0 z-20 flex justify-center overflow-auto md:items-start md:p-4 md:pt-6",
        fullscreen ? "items-stretch" : "items-end",
      )}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "relative z-20 flex w-full flex-col overflow-hidden bg-[#0F1415] shadow-2xl ring-1 ring-black/5",
          "md:ml-auto md:h-full md:max-h-[95vh] md:max-w-130 md:rounded-[1.75rem]",
          fullscreen ? "h-full rounded-none" : "max-h-[90vh] rounded-t-[28px]",
          isClosing ? "animate-sheet-out" : "animate-sheet-in",
          className,
        )}
      >
        {header ?? (
          <div className="flex h-14 shrink-0 items-center justify-between bg-primary px-6 py-4">
            <h3 className="text-base font-semibold text-white">{title}</h3>
            <button
              type="button"
              onClick={onClose}
              aria-label="close"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-white transition hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className={cn("custom-scrollbar flex-1 overflow-y-auto bg-[#0F1415] px-6 pb-4 pt-6", contentClassName)}>
          {children}
        </div>
      </div>
    </div>
  );
}
