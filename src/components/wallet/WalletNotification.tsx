"use client";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { cn } from "@/lib/utils";
import { useModalStore } from "@/stores/useModalStore";
import { Bell, ChevronRight } from "lucide-react";

type WalletNotificationProps = {
    pendingCount?: number;
    onAction?: () => void;
    className?: string;
};

export function WalletNotification({ pendingCount = 0, onAction, className }: WalletNotificationProps) {
    const { t } = useI18n();
    const openModal = useModalStore((state) => state.openModal);
    const handleAction = onAction ?? (() => openModal("pending-transactions"));

    return (
        <div
            className={cn(
                "flex items-center flex-col md:flex-row justify-between rounded-[20px] bg-amber-500/10 px-6 py-4 border border-amber-500/30 mb-0",
                className
            )}
        >
            <div className="flex w-full items-start gap-4 md:basis-3/4">
                <Bell className="h-5 w-5 shrink-0 mt-0.5 text-amber-400" />
                <div className="text-amber-400">
                    <p className="text-body-sm-medium text-amber-200">{t("wallet.pendingNotification.title")}</p>
                    <p className="mt-1 text-body-sm text-amber-200/70">
                        {t("wallet.pendingNotification.description")}
                    </p>
                </div>
            </div>
            <div className="mt-3 block w-full text-right md:mt-0 md:basis-1/4">
                <Button variant="outline" size="sm" className="border-amber-400/40 text-amber-200 hover:bg-amber-500/10" onClick={handleAction}>
                    {t("wallet.pendingNotification.action")}
                    {pendingCount > 0 ? ` (${pendingCount})` : ""}
                    <ChevronRight className="h-3 w-3" />
                </Button>
            </div>
        </div>
    );
}
