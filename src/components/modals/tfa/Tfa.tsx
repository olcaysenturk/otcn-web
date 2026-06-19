"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { InfoBox } from "@/components/ui/infobox";
import { Input } from "@/components/ui/input";
import { useCountdown } from "@/hooks/use-countdown";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { cn } from "@/lib/utils";
import { sendTfaCode, verifyTfa } from "@/services/tfa";
import { useModalStore } from "@/stores/useModalStore";
import { TfaType } from "@/types/tfa";
import { Mail, Smartphone, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export type TwoFactorVerificationProps = {
    tfaConfig?: TfaConfig | null;
    onVerificationSuccess?: () => void;
    defaultExpanded?: TfaType;
    isMainModal?: boolean;
    infoText?: string;
    title?: string;
    variant?: "light" | "dark";
};


export type TfaConfig = {
    flowId: string;
    email: string;
    phone: string;
    isPhoneRequired: boolean;
    isEmailRequired: boolean;
    isAuthenticatorRequired: boolean;
}

type VerificationMethodConfig = {
    type: TfaType;
    accordionValue: string;
    icon: React.ReactNode;
    labelKey: string;
    sentTextKey: string;
    sentTextParams: Record<string, string>;
    isRequired: boolean;
    isVerified: boolean;
    onVerified: () => void;
    countdown: ReturnType<typeof useCountdown>;
};

export function TwoFactorVerification({
    tfaConfig,
    onVerificationSuccess,
    defaultExpanded = "Email",
    isMainModal = false,
    infoText,
    title,
    variant = "light",
}: TwoFactorVerificationProps) {
    const isDark = variant === "dark";
    const { t } = useI18n();
    const { isClosing, closeModal } = useModalStore();

    const [verificationCodes, setVerificationCodes] = useState<Record<TfaType, string>>({
        Email: "",
        Sms: "",
        Authenticator: "",
    });
    const [isVerifying, setIsVerifying] = useState(false);
    const [isSendingCode, setIsSendingCode] = useState(false);
    const [openAccordion, setOpenAccordion] = useState<string>(defaultExpanded);

    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [isPhoneVerified, setIsPhoneVerified] = useState(false);
    const [isAuthenticatorVerified, setIsAuthenticatorVerified] = useState(false);
    const flowId = tfaConfig?.flowId ?? "";
    const email = tfaConfig?.email ?? "";
    const phone = tfaConfig?.phone ?? "";
    const isEmailRequired = Boolean(tfaConfig?.isEmailRequired);
    const isPhoneRequired = Boolean(tfaConfig?.isPhoneRequired);
    const isAuthenticatorRequired = Boolean(tfaConfig?.isAuthenticatorRequired);

    const emailCountdown = useCountdown(30);
    const smsCountdown = useCountdown(30);
    const authenticatorCountdown = useCountdown(30);

    const countdownMap: Record<TfaType, ReturnType<typeof useCountdown>> = {
        Email: emailCountdown,
        Sms: smsCountdown,
        Authenticator: authenticatorCountdown,
    };

    const formatPhoneNumber = (phoneNumber: string) => {
        const raw = phoneNumber.replace(/\D/g, "");
        return `+90 (${raw.slice(0, 3)}) ${raw.slice(3, 6)} ${raw.slice(6, 8)} ${raw.slice(8, 10)}`;
    };

    const formatCountdown = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${String(s).padStart(2, "0")}`;
    };

    const handleSendCode = async (method: TfaType) => {
        if (!flowId) return toast.error(t("modals.tfa.errors.flowIdNotFound"));

        setIsSendingCode(true);
        try {
            const res = await sendTfaCode({ mfaType: method, flowId });
            if (res.otpCounterInSeconds) {
                toast.success(t("modals.tfa.success.sent"));
                countdownMap[method].start(res.otpCounterInSeconds);
            } else {
                toast.error(res.message || t("modals.tfa.errors.sendFailed"));
            }
        } catch {
            toast.error(t("modals.tfa.errors.generic"));
        } finally {
            setIsSendingCode(false);
        }
    };

    const handleVerifyCode = async (method: TfaType, onVerified: () => void) => {
        const code = verificationCodes[method];

        if (!flowId) return toast.error(t("modals.tfa.errors.flowIdNotFound"));
        if (code.length !== 6) return toast.error(t("modals.tfa.errors.invalidCode"));

        setIsVerifying(true);
        try {
            const res = await verifyTfa({ tfaType: method, flowId, code });

            if (res.success) {
                toast.success(t("modals.tfa.success.verified"));
                onVerified();
                setOpenAccordion("");
                setVerificationCodes((prev) => ({ ...prev, [method]: "" }));

                if (!isMainModal) {
                    const emailOk = isEmailRequired ? (method === "Email" ? true : isEmailVerified) : true;
                    const phoneOk = isPhoneRequired ? (method === "Sms" ? true : isPhoneVerified) : true;
                    const authOk = isAuthenticatorRequired ? (method === "Authenticator" ? true : isAuthenticatorVerified) : true;
                    if (emailOk && phoneOk && authOk) onVerificationSuccess?.();
                }
            } else {
                toast.error(res.message || t("modals.tfa.errors.verifyFailed"));
            }
        } catch {
            toast.error(t("modals.tfa.errors.verifyFailed"));
        } finally {
            setIsVerifying(false);
        }
    };

    const verificationMethods: VerificationMethodConfig[] = [
        {
            type: "Email",
            accordionValue: "email",
            icon: <Mail className="w-5 h-5" />,
            labelKey: "modals.tfa.email",
            sentTextKey: "modals.tfa.emailSentText",
            sentTextParams: { email },
            isRequired: isEmailRequired,
            isVerified: isEmailVerified,
            onVerified: () => setIsEmailVerified(true),
            countdown: emailCountdown,
        },
        {
            type: "Sms",
            accordionValue: "phone",
            icon: <Smartphone className="w-5 h-5" />,
            labelKey: "modals.tfa.phone",
            sentTextKey: "modals.tfa.phoneSentText",
            sentTextParams: { phone: phone ? "+" + phone : "" },
            isRequired: isPhoneRequired,
            isVerified: isPhoneVerified,
            onVerified: () => setIsPhoneVerified(true),
            countdown: smsCountdown,
        },
        // {
        //     type: "Google",
        //     accordionValue: "authenticator",
        //     icon: <ShieldCheck className="w-5 h-5" />,
        //     labelKey: "modals.tfa.authenticator",
        //     sentTextKey: "modals.tfa.authenticatorText",
        //     sentTextParams: {},
        //     isRequired: !!isAuthenticatorRequired,
        //     isVerified: isAuthenticatorVerified,
        //     onVerified: () => setIsAuthenticatorVerified(true),
        //     countdown: googleCountdown,
        // },
    ];

    const renderAccordion = () => (
        <Accordion
            type="single"
            collapsible
            value={openAccordion}
            onValueChange={setOpenAccordion}
            className="w-full flex flex-col gap-4"
        >
            {verificationMethods
                .filter((m) => m.isRequired)
                .map(({ type, accordionValue, icon, labelKey, sentTextKey, sentTextParams, isVerified, onVerified, countdown }) => (
                    <AccordionItem
                        key={type}
                        value={accordionValue}
                        disabled={isVerified}
                        className={cn(
                            "border rounded-[20px] border-b!",
                            isDark ? "border-white/10 bg-white/5" : "border-[#E8EDF3] bg-white",
                            isVerified && (isDark ? "border-emerald-500/40! bg-emerald-500/10!" : "border-success-border! bg-success-border/20")
                        )}
                    >
                        <AccordionTrigger className="hover:no-underline p-4">
                            <div className="flex items-center gap-2">
                                <span className={cn(isVerified ? (isDark ? "text-emerald-400!" : "text-success-border!") : (isDark ? "text-white" : "text-[#0F121A]"))}>
                                    {icon}
                                </span>
                                <span className={cn(
                                    "text-base font-medium leading-[150%] tracking-[-0.01em]",
                                    isVerified ? (isDark ? "text-emerald-400!" : "text-success-border!") : (isDark ? "text-white" : "text-[#0F121A]")
                                )}>
                                    {t(labelKey)}
                                </span>
                            </div>
                        </AccordionTrigger>

                        <AccordionContent className="p-4">
                            <div className="flex flex-col gap-4">
                                <div className="flex gap-2 items-center">
                                    <Input
                                        value={verificationCodes[type]}
                                        onChange={(e) =>
                                            setVerificationCodes((prev) => ({ ...prev, [type]: e.target.value }))
                                        }
                                        placeholder={t("modals.tfa.codePlaceholder")}
                                        maxLength={6}
                                        className={cn(
                                            "flex-1 ml-1 rounded-xl text-sm font-medium h-[45px]",
                                            isDark
                                                ? "bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                                                : "bg-white border-[#E8EDF3] placeholder:text-[#6F7B91] placeholder:opacity-80"
                                        )}
                                    />
                                    <Button
                                        type="button"
                                        onClick={() => handleSendCode(type)}
                                        disabled={isSendingCode || countdown.isRunning}
                                        className={cn(
                                            "px-4 h-9 font-bold text-xs rounded-full disabled:opacity-50",
                                            isDark ? "bg-white text-[#0F1415] hover:bg-white/90" : "bg-[#0F121A] text-white hover:bg-[#0F121A]/90"
                                        )}
                                    >
                                        {isSendingCode
                                            ? t("modals.tfa.sending")
                                            : countdown.isRunning
                                                ? formatCountdown(countdown.secondsLeft)
                                                : t("modals.tfa.sendCode")
                                        }
                                    </Button>
                                </div>

                                <p className={cn("text-[13px] font-bold leading-[140%] tracking-[-0.015em]", isDark ? "text-gray-300" : "text-[#0F121A]")}>
                                    {t(sentTextKey, sentTextParams)}
                                </p>

                                <Button
                                    type="button"
                                    onClick={() => handleVerifyCode(type, onVerified)}
                                    disabled={isVerifying || verificationCodes[type].length !== 6}
                                    className="w-full h-9 bg-linear-to-r from-[#9564F4] to-[#3E1C82] text-white font-bold text-xs rounded-full hover:opacity-90 transition-all duration-300 disabled:opacity-50"
                                >
                                    {isVerifying ? t("modals.tfa.verifying") : t("modals.tfa.verify")}
                                </Button>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
        </Accordion>
    );

    return (
        <>
            {isMainModal ? (
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
                        <div className="flex items-center justify-between bg-[#C8FF00] px-6 py-4 h-14 shrink-0">
                            <h3 className="text-base font-semibold text-[#0F1415]">{title}</h3>
                            <button
                                type="button"
                                onClick={closeModal}
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-[#0F1415] transition hover:bg-black/10"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="flex flex-col justify-between bg-[#0F1415] pt-6 pb-3 px-6 custom-scrollbar flex-1 overflow-y-auto">
                            <div>
                                <InfoBox variant={isDark ? "info-dark" : "info"} className="mb-8">
                                    <p className={cn("text-sm font-medium", isDark ? "text-gray-200" : "text-gray-700")}>{infoText}</p>
                                </InfoBox>
                                {renderAccordion()}
                            </div>
                            <Button
                                className="w-full bg-white text-[#0F1415] hover:bg-white/90 rounded-full"
                                disabled={isVerifying ||
                                    verificationMethods.filter((met) => met.isRequired && !met.isVerified).length > 0
                                }
                                onClick={onVerificationSuccess}
                            >
                                {t("modals.tfa.confirm")}
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                renderAccordion()
            )}
        </>
    );
}
