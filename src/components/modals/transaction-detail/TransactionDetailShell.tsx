"use client";

import type { ReactNode } from "react";
import { Copy, X } from "lucide-react";

import { useI18n } from "@/lib/i18n/I18nProvider";
import { cn } from "@/lib/utils";
import { useModalStore } from "@/stores/useModalStore";

/**
 * Shared dark slide-in panel for transaction detail popups (crypto + fiat).
 * Keeps both detail modals visually consistent with the otcn design system.
 */
export function TransactionDetailShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const { closeModal, isClosing } = useModalStore();
  const { t } = useI18n();

  return (
    <div
      onClick={closeModal}
      className="absolute inset-0 z-20 flex items-start justify-center overflow-auto p-4 md:pt-3"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "relative z-20 flex h-[96vh] w-full max-w-[560px] flex-col overflow-hidden rounded-[28px] border border-[#3A4043] bg-[#0E0F10] shadow-2xl lg:ml-auto",
          isClosing ? "animate-slide-out-to-right" : "animate-slide-in-from-right",
        )}
      >
        <div className="flex items-center justify-between bg-[#f54a14] px-5 py-4">
          <h3 className="text-base font-semibold leading-none text-[#0E0F10]">{title}</h3>
          <button
            type="button"
            onClick={closeModal}
            className="rounded-full p-2 text-[#0E0F10] transition hover:bg-black/10"
            aria-label={t("common.close")}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-auto px-6 py-2">{children}</div>
      </div>
    </div>
  );
}

export function DetailRow({
  label,
  value,
  copyValue,
  onCopy,
}: {
  label: string;
  value: ReactNode;
  copyValue?: string;
  onCopy?: (value?: string) => void;
}) {
  const canCopy = Boolean(copyValue && copyValue.trim() && copyValue.trim() !== "-");

  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#3A4043] py-4 last:border-b-0">
      <span className="text-base text-[#C5C9CC]">{label}</span>
      <div className="flex w-[239px] min-w-0 max-w-[60%] items-center gap-2 text-base font-medium text-[#F4F7F8]">
        <span className="break-all">{value}</span>
        {canCopy && onCopy && (
          <button
            type="button"
            onClick={() => onCopy(copyValue)}
            className="shrink-0 rounded p-1 text-[#788084] transition hover:bg-white/5 hover:text-[#F4F7F8]"
            aria-label="copy"
          >
            <Copy className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
