"use client";

import { Copy, X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useModalStore } from "@/stores/useModalStore";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { getCoinIconPath } from "@/lib/coinIcons";
import { cn } from "@/lib/utils";
import type { PendingDepositDeclaration } from "@/types/crypto";

type PendingTransactionsModalProps = {
  items?: PendingDepositDeclaration[];
};

export function PendingTransactionsModal({ items = [] }: PendingTransactionsModalProps) {
  const { closeModal, openModal, isClosing } = useModalStore();
  const { t } = useI18n();
  const compactAddress = (value?: string, head = 6, tail = 6) => {
    if (!value) return "-";
    if (value.length <= head + tail + 3) return value;
    return `${value.slice(0, head)}...${value.slice(-tail)}`;
  };
  const copyWithToast = (value?: string) => {
    const raw = value?.trim();
    if (!raw || raw === "-") return;

    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(raw).then(
        () => toast.success(t("toast.copied")),
        () => toast.error(t("toast.copied")),
      );
      return;
    }

    toast.info(t("toast.copied"));
  };
  const pendingTransactions = items.map((item) => ({
    id: item.id,
    asset: item.assetSymbol,
    symbol: item.assetSymbol,
    amount: item.quantity,
    senderAddress: item.fromAddress,
    network: item.networkName,
    icon: getCoinIconPath(item.assetSymbol || ""),
  }));

  return (
    <div className="absolute inset-0 z-20 flex items-start justify-center overflow-auto p-4 md:items-start md:pt-6">
      <div className={cn(
        "relative z-20 flex w-full h-full max-h-[95vh] max-w-[520px] flex-col overflow-hidden rounded-4xl bg-white shadow-2xl ring-1 ring-black/5 lg:ml-auto dark:bg-gray-900 dark:ring-white/10",
        isClosing ? "animate-slide-out-to-right" : "animate-slide-in-from-right"
      )}>
        
        {/* Header - Purple Gradient matching design */}
        <div className="relative flex items-center justify-between bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] px-8 py-6 text-white shrink-0">
          <h3 className="text-xl font-bold tracking-tight">{t("modals.pending.title")}</h3>
          <button
            onClick={closeModal}
            className="rounded-full bg-white/20 p-2 text-white hover:bg-white/30 transition backdrop-blur-sm"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar bg-white dark:bg-gray-900">
          <div className="space-y-4">
            {pendingTransactions.length === 0 && (
              <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-800/50">
                {t("modals.pending.noRecords")}
              </div>
            )}
            {pendingTransactions.map((tx) => (
              <div
                key={tx.id}
                className="rounded-3xl border border-gray-100 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:border-gray-800 dark:bg-gray-800/50"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="relative h-10 w-10 flex-shrink-0">
                    <Image src={tx.icon} alt={tx.symbol} fill className="object-contain" />
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-bold text-gray-900 dark:text-white">{tx.asset}</span>
                    <span className="text-gray-400 text-sm font-medium">({tx.symbol})</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-400">{t("modals.pending.amount")}</span>
                    <span className="font-bold text-gray-900 dark:text-white uppercase">{tx.amount}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="shrink-0 font-medium text-gray-400">{t("modals.pending.senderAddress")}</span>
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="truncate font-bold text-gray-900 dark:text-white">
                        {compactAddress(tx.senderAddress, 6, 6)}
                      </span>
                      {!!tx.senderAddress && (
                        <button
                          type="button"
                          onClick={() => copyWithToast(tx.senderAddress)}
                          aria-label={t("modals.funds.copy")}
                          className="inline-flex shrink-0 items-center rounded-full border border-gray-200 p-1.5 text-gray-600 transition hover:bg-gray-50"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-400">{t("modals.pending.network")}</span>
                    <span className="font-bold text-gray-900 dark:text-white">{tx.network}</span>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => openModal("declare-transaction", { mode: "deposit", transactionId: tx.id })}
                    className="rounded-full bg-[#111] px-8 py-3 text-xs font-bold text-white transition hover:bg-black/80 shadow-md"
                  >
                    {t("modals.pending.declareAction")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
