"use client";

import { useI18n } from "@/lib/i18n/I18nProvider";
import { cn } from "@/lib/utils";
import { useBankStore } from "@/stores/useBankStore";
import { useModalStore } from "@/stores/useModalStore";
import { X } from "lucide-react";
import { useEffect } from "react";
import { AddBankAccount } from "./AddBankAccount";

export function AddBankAccountModal() {
    const { t } = useI18n();
    const { closeModal, isClosing, data } = useModalStore();
    const { allBanks, fetchAllBanks } = useBankStore();

    useEffect(() => {
        fetchAllBanks();
    }, [fetchAllBanks]);

    const handleSuccess = () => {
        closeModal();
        if (data && typeof (data as any).onSuccess === 'function') {
            (data as any).onSuccess();
        }
    };

    if (!allBanks || allBanks.length === 0) {
        return null;
    }

    return (
        <div
            onClick={closeModal}
            className="absolute inset-0 z-20 flex items-start justify-center overflow-auto p-4 md:items-start md:pt-6"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className={cn(
                    "relative z-20 flex w-full h-full max-h-[95vh] max-w-130 flex-col overflow-hidden rounded-[1.75rem] gap-2 bg-[#0F1415] shadow-2xl ring-1 ring-black/5 lg:ml-auto ",
                    isClosing ? "animate-slide-out-to-right" : "animate-slide-in-from-right"
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between bg-[#C8FF00] px-6 py-4 h-14 shrink-0">
                    <div>
                        <h3 className="text-base font-semibold text-[#0F1415]">
                            {t("modals.funds.subtitleAddBankAccount")}
                        </h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#0F1415] transition hover:bg-black/10"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="custom-scrollbar flex-1 overflow-y-auto px-6 pt-6 pb-3 bg-[#0F1415]">
                    <AddBankAccount
                        t={t}
                        onSuccess={handleSuccess}
                        banks={allBanks}
                    />
                </div>
            </div>
        </div>
    );
}
