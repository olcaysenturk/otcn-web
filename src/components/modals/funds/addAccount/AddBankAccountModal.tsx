"use client";

import { useI18n } from "@/lib/i18n/I18nProvider";
import { useBankStore } from "@/stores/useBankStore";
import { useModalStore } from "@/stores/useModalStore";
import { useEffect } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { ModalSheet } from "@/components/modals/ModalSheet";
import { AddBankAccount } from "./AddBankAccount";

export function AddBankAccountModal() {
    const { t } = useI18n();
    const { closeModal, isClosing, data } = useModalStore();
    const { allBanks, fetchAllBanks, isLoadingAllBanks } = useBankStore();

    useEffect(() => {
        fetchAllBanks();
    }, [fetchAllBanks]);

    const handleSuccess = () => {
        closeModal();
        const onSuccess = (data as { onSuccess?: () => void } | null)?.onSuccess;
        if (typeof onSuccess === "function") onSuccess();
    };

    const hasBanks = allBanks && allBanks.length > 0;

    return (
        <ModalSheet
            title={t("modals.funds.subtitleAddBankAccount")}
            onClose={closeModal}
            isClosing={isClosing}
            mobile="fullscreen"
        >
            {hasBanks ? (
                <AddBankAccount t={t} onSuccess={handleSuccess} banks={allBanks} />
            ) : isLoadingAllBanks ? (
                <div className="flex flex-1 items-center justify-center py-12 text-[#5E666A]">
                    <Loader2 className="h-6 w-6 animate-spin" />
                </div>
            ) : (
                <div className="flex flex-1 flex-col items-center justify-center gap-4 py-12 text-center">
                    <p className="text-sm text-[#C5C9CC]">{t("common.error")}</p>
                    <button
                        type="button"
                        onClick={() => fetchAllBanks(true)}
                        className="inline-flex items-center gap-2 rounded-full border border-[#3A4043] px-4 py-2 text-sm font-medium text-[#F4F7F8] transition hover:border-[#C7F022] hover:text-[#C7F022]"
                    >
                        <RefreshCw className="h-4 w-4" />
                        {t("common.retry")}
                    </button>
                </div>
            )}
        </ModalSheet>
    );
}
