"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useModalStore } from "@/stores/useModalStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { X } from "lucide-react";
import { toast } from "sonner";
import { useCountdown } from "@/hooks/use-countdown";
import { cn } from "@/lib/utils";
import { clientFetch } from "@/lib/api/clientFetch";
import { getApiBase } from "@/lib/api/getApiBase";
import { handleBackendError } from "@/lib/utils/toast";
import { sendVerificationCode } from "@/services/auth";
import { clearAuthSession, clearLoginSessionData } from "@/lib/auth/clientSession";
import { invalidateSession } from "@/lib/api/session";
import { withLocale } from "@/lib/i18n/href";
import { useParams, useRouter } from "next/navigation";

interface VerificationData {
    flowId: string;
    email?: string;
    phone?: string;
    isPhoneRequired: boolean;
    isEmailRequired: boolean;
    isAuthenticatorRequired: boolean;
}

export function PasswordChangeVerifyModal() {
    const { t } = useI18n();
    const { activeModal, closeModal, isClosing, data } = useModalStore();
    const router = useRouter();
    const params = useParams();
    const locale = (params?.locale as string) || "en";
    const [modalData, setModalData] = useState<VerificationData | null>(data as VerificationData);

    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [error, setError] = useState(false);

    const { secondsLeft, start, isRunning } = useCountdown(180);

    // Determine current step
    const currentStep = useMemo(() => {
        if (!modalData) return null;
        if (modalData.isPhoneRequired) return "Sms";
        if (modalData.isEmailRequired) return "Email";
        if (modalData.isAuthenticatorRequired) return "Google";
        return null;
    }, [modalData]);

    const targetValue = useMemo(() => {
        if (!modalData || !currentStep) return "";
        if (currentStep === "Sms") return modalData.phone || "";
        if (currentStep === "Email") return modalData.email || "";
        return "";
    }, [modalData, currentStep]);

    useEffect(() => {
        if (activeModal === "password-change-verify") {
            setCode("");
            setError(false);
            // Reset countdown when activeModal or currentStep changes
            start(0);
        }
    }, [activeModal, currentStep]);

    const handleSendCode = async () => {
        if (!modalData?.flowId || !currentStep || currentStep === "Google") return;

        setIsResending(true);
        try {
            const res = await sendVerificationCode(modalData.flowId, currentStep as "Email" | "Sms");
            const data = await res.json().catch(() => null);

            if (res.ok) {
                const otpCounter = data?.otpCounterInSeconds ?? 180;
                start(otpCounter);
                toast.success(t("auth.verification.codeSent"));
            } else {
                handleBackendError(data, t);
            }
        } catch (err: any) {
            toast.error(err.message || t("auth.verification.resendFailed"));
        } finally {
            setIsResending(false);
        }
    };

    const handleVerify = async () => {
        if (!modalData?.flowId || !currentStep || code.length < 6) return;

        setLoading(true);
        setError(false);
        try {
            const res = await fetch("/api/auth/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    flowId: modalData.flowId,
                    tfaType: currentStep,
                    code: code,
                }),
            });

            const verifyResult = await res.json().catch(() => null);

            if (!res.ok || verifyResult?.isVerified === false) {
                setError(true);
                handleBackendError(verifyResult, t);
                return;
            }

            // Verification successful, update local state or move to next
            const updatedData = { ...modalData };
            if (currentStep === "Sms") updatedData.isPhoneRequired = false;
            else if (currentStep === "Email") updatedData.isEmailRequired = false;
            else if (currentStep === "Google") updatedData.isAuthenticatorRequired = false;

            // Check if more verification is needed
            if (updatedData.isPhoneRequired || updatedData.isEmailRequired || updatedData.isAuthenticatorRequired) {
                setModalData(updatedData);
                setCode("");
                setError(false);
                start(0); // Reset countdown for next step
            } else {
                // All steps done, complete password change
                await handleComplete(updatedData.flowId);
            }
        } catch (err) {
            console.error(err);
            toast.error(t("auth.verification.verifyFailed"));
        } finally {
            setLoading(false);
        }
    };

    const handleComplete = async (flowId: string) => {
        try {
            const base = getApiBase();
            const url = `${base}/v3/account/change-password-complete`;

            const res = await clientFetch(url, {
                method: "POST",
                body: JSON.stringify({ flowId })
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => null);
                handleBackendError(errorData, t);
                return;
            }

            toast.success(t("auth.password.changeSuccess"));
            try {
                await fetch("/api/auth/logout", { method: "POST" });
            } catch (error) {
                console.error("Logout after password change failed", error);
            } finally {
                invalidateSession();
                clearAuthSession();
                clearLoginSessionData();
            }
            closeModal();
            router.push(withLocale("/auth/login", locale));
            router.refresh();
        } catch (err) {
            console.error("Complete failed:", err);
            toast.error(t("common.error"));
        }
    };

    if (activeModal !== "password-change-verify" || !modalData) return null;

    const title = currentStep === "Sms"
        ? t("modals.security.passwordVerify.titles.sms")
        : currentStep === "Email"
            ? t("modals.security.passwordVerify.titles.email")
            : t("modals.security.passwordVerify.titles.authenticator");

    const description = currentStep === "Google"
        ? t("modals.security.passwordVerify.descriptions.authenticator")
        : currentStep === "Sms"
            ? (
                <>
                    {t("modals.security.passwordVerify.descriptions.smsPrefix")}{" "}
                    <span className="font-bold">{targetValue}</span>{" "}
                    {t("modals.security.passwordVerify.descriptions.smsSuffix")}
                </>
            )
            : (
                <>
                    {t("modals.security.passwordVerify.descriptions.emailPrefix")}{" "}
                    <span className="font-bold">{targetValue}</span>{" "}
                    {t("modals.security.passwordVerify.descriptions.emailSuffix")}
                </>
            );

    return (
        <div
            onClick={closeModal}
            className="absolute inset-0 z-20 flex items-start justify-center overflow-auto p-4 md:items-start md:pt-6"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className={cn(
                    "relative z-20 flex w-full h-full max-h-[95vh] max-w-130 flex-col overflow-hidden rounded-[1.75rem] gap-2 bg-[#0F1415] shadow-2xl ring-1 ring-black/5 lg:ml-auto",
                    isClosing ? "animate-slide-out-to-right" : "animate-slide-in-from-right"
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between bg-primary px-6 py-4 h-14 shrink-0">
                    <h3 className="text-base font-semibold text-white">{title}</h3>
                    <button
                        type="button"
                        onClick={closeModal}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-white transition hover:bg-white/10"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="custom-scrollbar flex-1 overflow-y-auto bg-[#0F1415] flex flex-col justify-between px-6 pt-6 pb-3">
                        <div className="space-y-6">
                            <p className="text-sm text-gray-300 leading-relaxed">
                                {description}
                            </p>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">{t("modals.security.passwordVerify.codeLabel")}</label>
                                    <div className="flex gap-3">
                                        <Input
                                            value={code}
                                            onChange={(e) => {
                                                setCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6));
                                                if (error) setError(false);
                                            }}
                                            placeholder={t("modals.security.passwordVerify.codePlaceholder")}
                                            className={cn(
                                                "rounded-xl h-11 flex-1 bg-white/5 text-white placeholder:text-gray-500",
                                                error ? "border-[#FF4D6D] focus-visible:ring-[#FF4D6D]/20" : "border-white/10"
                                            )}
                                        />
                                        {currentStep !== "Google" && (
                                            <Button
                                                variant="outline"
                                                onClick={handleSendCode}
                                                disabled={isRunning || isResending}
                                                className="rounded-xl h-11 bg-white text-[#0F1415] hover:bg-white/90 border-none px-6 text-sm font-semibold whitespace-nowrap"
                                            >
                                                {isRunning ? `${secondsLeft}s` : t("modals.security.passwordVerify.sendCode")}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto pt-6">
                            <Button
                                onClick={handleVerify}
                                disabled={code.length < 6 || loading}
                                className="w-full bg-white hover:bg-white/90 text-[#0F1415] rounded-full h-12 text-sm font-semibold"
                            >
                                {loading ? t("modals.security.passwordVerify.verifying") : t("modals.security.passwordVerify.confirm")}
                            </Button>
                        </div>
                </div>
            </div>
        </div>
    );
}
