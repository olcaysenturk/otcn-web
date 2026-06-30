"use client";

import { createPortal } from "react-dom";
import { useEffect } from "react";
import { X } from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nProvider";

type ConfirmationModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
    isConfirmDisabled?: boolean;
};

export function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText,
    cancelText,
    isLoading = false,
    isConfirmDisabled = false,
}: ConfirmationModalProps) {
    const { t } = useI18n();

    const effectiveConfirmText = confirmText || t("common.actions.yes");
    const effectiveCancelText = cancelText || t("common.actions.no");

    useEffect(() => {
        if (isOpen) {
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            const previousOverflow = document.body.style.overflow;
            const previousPaddingRight = document.body.style.paddingRight;

            document.body.dataset.modalPrevOverflow = previousOverflow;
            document.body.dataset.modalPrevPaddingRight = previousPaddingRight;
            document.body.style.overflow = "hidden";
            if (scrollbarWidth > 0) {
                document.body.style.paddingRight = `${scrollbarWidth}px`;
            }
        } else {
            document.body.style.overflow = document.body.dataset.modalPrevOverflow || "";
            document.body.style.paddingRight = document.body.dataset.modalPrevPaddingRight || "";
        }
        return () => {
            document.body.style.overflow = document.body.dataset.modalPrevOverflow || "";
            document.body.style.paddingRight = document.body.dataset.modalPrevPaddingRight || "";
        };
    }, [isOpen]);

    if (typeof document === "undefined") return null;

    if (!isOpen) return null;

    const content = (
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-[1px] transition-opacity"
                onClick={isLoading ? undefined : onClose}
            />

            <div className="relative z-10 w-full max-w-sm overflow-hidden rounded-2xl bg-[#0F1415] shadow-xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between bg-primary px-6 py-4 h-14">
                    <h3 className="text-base font-semibold text-white">{title}</h3>
                    <button
                        type="button"
                        onClick={isLoading ? undefined : onClose}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-white transition hover:bg-white/10"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="px-6 pt-6 pb-3">
                    <p className="text-sm text-gray-300 leading-relaxed">
                        {description}
                    </p>

                    <div className="mt-6 flex gap-3">
                        <button
                            type="button"
                            className="flex-1 rounded-full border border-white/20 bg-transparent py-2.5 text-sm font-semibold text-white hover:bg-white/5 disabled:opacity-50"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            {effectiveCancelText}
                        </button>
                        <button
                            type="button"
                            className="flex-1 rounded-full bg-red-500 py-2.5 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-50 shadow-sm"
                            onClick={onConfirm}
                            disabled={isLoading || isConfirmDisabled}
                        >
                            {isLoading ? t("common.actions.processing") : effectiveConfirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(content, document.body);
}
