"use client";

import { Info, X, Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { useModalStore } from "@/stores/useModalStore";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
export function DigitalKycModal() {
    const { closeModal, isClosing } = useModalStore();
    const { t } = useI18n();
    const [copied, setCopied] = useState(false);

    // Placeholder verification link
    const verificationLink = "https://verify.minkafintek.com.tr/kyc/abc123xyz";

    const handleCopy = () => {
        navigator.clipboard.writeText(verificationLink);
        setCopied(true);
        toast.success(t("modals.funds.copySuccess"));
        setTimeout(() => setCopied(false), 2000);
    };

    const steps = [
        t("application.companyInfo.officer.kyc.digitalPanel.step1"),
        t("application.companyInfo.officer.kyc.digitalPanel.step2"),
        t("application.companyInfo.officer.kyc.digitalPanel.step3"),
        t("application.companyInfo.officer.kyc.digitalPanel.step4"),
    ];

    return (
        <div
            onClick={closeModal}
            className="pointer-events-auto absolute inset-0 z-20 flex items-start justify-center overflow-auto p-4 md:items-start md:pt-6"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className={cn(
                    "relative z-20 flex h-full w-full max-h-[95vh] max-w-[520px] flex-col overflow-hidden rounded-[1.75rem] p-1 gap-2 bg-gradient-modal-1 shadow-2xl ring-1 ring-black/5 lg:ml-auto transition-all",
                    isClosing ? "animate-slide-out-to-right" : "animate-slide-in-from-right"
                )}>
                {/* Header */}
                <header className="flex items-center justify-between px-6 py-4 h-12 text-white">
                    <h3 className="text-base font-semibold">{t("application.companyInfo.officer.kyc.digitalPanel.title")}</h3>
                    <button
                        onClick={closeModal}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-white transition hover:bg-white/10"
                        aria-label="Kapat"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </header>

                {/* Content Container */}
                <div className="flex-1 flex flex-col min-h-0 bg-white rounded-3xl overflow-hidden">
                    <div className="custom-scrollbar flex-1 overflow-y-auto px-4 lg:px-6 py-6 space-y-5">
                        {/* Info Box */}
                        <div className="flex items-start gap-3 rounded-2xl border border-[#D0E1FD] bg-[#F2F7FE] p-4">
                            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#487AF633] bg-[#487AF60D] text-[#487AF6]">
                                <Info className="h-3 w-3" />
                            </div>
                            <p className="text-[13px] leading-[18px] text-[#0F121A]">
                                {t("application.companyInfo.officer.kyc.digitalPanel.info")}
                            </p>
                        </div>

                        {/* QR Code Section */}
                        <div className="hidden lg:flex flex-col items-center justify-center rounded-2xl border border-[#E8EDF3] p-5 text-center space-y-6">
                            <div className="relative h-40 w-40 bg-white p-2 border border-[#E8EDF3] rounded-xl flex items-center justify-center">
                                {/* Replace with actual QR code image */}
                                <img
                                    src="/icons/kyc-qr.png"
                                    alt="KYC QR Code"
                                    className="h-full w-full object-contain"
                                    onError={(e) => {
                                        // Fallback for missing image
                                        (e.target as HTMLImageElement).src = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" + encodeURIComponent(verificationLink);
                                    }}
                                />
                            </div>
                            <p className="text-sm leading-[19px] font-medium text-[#6F7B91]">
                                {t("application.companyInfo.officer.kyc.digitalPanel.qrHint")}
                            </p>

                            <div className="flex w-full items-center gap-4">
                                <div className="h-px flex-1 bg-[#E8EDF3]" />
                                <span className="text-[13px] leading-[18px] text-[#6F7B91]">{t("application.companyInfo.officer.kyc.digitalPanel.or")}</span>
                                <div className="h-px flex-1 bg-[#E8EDF3]" />
                            </div>

                            <div className="w-full text-left space-y-2">
                                <label className="text-sm leading-3.5 font-medium text-[#4F5C75] mb-2">
                                    {t("application.companyInfo.officer.kyc.digitalPanel.linkTitle")}
                                </label>
                                <div className="relative flex items-center">
                                    <input
                                        type="text"
                                        readOnly
                                        value={verificationLink}
                                        className="h-11 w-full rounded-xl border border-[#E8EDF3] bg-[#F8FAFC] pl-4 pr-12 text-sm text-[#0F121A] focus:outline-none"
                                    />
                                    <button
                                        onClick={handleCopy}
                                        className="absolute right-2 flex h-8 w-8 items-center justify-center rounded-lg text-[#4F5C75] hover:bg-[#E2E8F0] transition-colors"
                                    >
                                        {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                                    </button>
                                </div>
                                <p className="text-[13px] leading-[18px] text-[#0F121A]">
                                    {t("application.companyInfo.officer.kyc.digitalPanel.linkHint")}
                                </p>
                            </div>
                        </div>

                        {/* Verification Steps Section */}
                        <div className="rounded-2xl border border-[#E8EDF3] p-5 space-y-6">
                            <h3 className="text-[18px] leading-[27px] font-medium text-[#0F121A]">
                                {t("application.companyInfo.officer.kyc.digitalPanel.stepsTitle")}
                            </h3>
                            <div className="space-y-5">
                                {steps.map((step, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F2F0FF] text-[13px] font-semibold text-[#582FD9]">
                                            {index + 1}
                                        </div>
                                        <p className="text-sm leading-[19px] text-[#0F121A]">{step}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Mobile Button Footer */}
                    <div className="lg:hidden px-4 py-3 bg-white border-t border-gray-100">
                        <Button
                            variant="dark"
                            size="xl"
                            className="w-full text-sm leading-5 font-bold"
                            onClick={() => window.open(verificationLink, "_blank")}
                        >
                            {t("application.companyInfo.officer.kyc.digitalPanel.startVerification")}
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    );
}
