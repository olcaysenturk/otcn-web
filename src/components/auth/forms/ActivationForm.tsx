"use client";

import * as React from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { useForm, type SubmitHandler, type SubmitErrorHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { handleBackendError } from "@/lib/utils/toast";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { withLocale } from "@/lib/i18n/href";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AuthLabel } from "./AuthLabel";
import { AuthPrompt } from "./AuthPrompt";
import { AuthHeading } from "./AuthHeading";
import { ExpiredLink } from "../ui/ExpiredLink";
import { useCountdown } from "@/hooks/use-countdown";

const activationSchema = (t: any) => z.object({
    code: z.string().min(4, t("auth.verification.codePlaceholder")),
});

type ActivationFormValues = z.infer<ReturnType<typeof activationSchema>>;

export function ActivationForm() {
    const { t } = useI18n();
    const searchParams = useSearchParams();
    const router = useRouter();
    const params = useParams();
    const locale = (params?.locale as string) || "en";
    const [isResending, setIsResending] = React.useState(false);
    const [isResendingCompleted, setIsResendingCompleted] = React.useState(false);
    const [phoneNumber, setPhoneNumber] = React.useState("");
    const [activationError, setActivationError] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = React.useState(true);
    const { secondsLeft, start, isRunning } = useCountdown(30);
    const hasInitializedRef = React.useRef(false);

    React.useEffect(() => {
        const userRegistrationId = searchParams.get("user-registration-id");
        const storedData = typeof window !== "undefined" ? sessionStorage.getItem("registration_form_data") : null;

        if (!userRegistrationId) {
            toast.error(t("auth.verification.missingParams"), {
                description: t("auth.verification.missingParamsDesc")
            });
            router.push(withLocale("/auth/login", locale));
            setIsLoading(false); // Ensure loading is false if early exit
            return;
        }

        // 1. First, try to get phone number from session storage (if user just registered and redirected)
        if (storedData) {
            try {
                const parsed = JSON.parse(storedData);
                if (parsed.phoneNumber) {
                    const raw = parsed.phoneNumber.replace(/\D/g, "");
                    if (raw.length === 10) {
                        setPhoneNumber(`+90 (${raw.slice(0, 3)}) ${raw.slice(3, 6)} ${raw.slice(6, 8)} ${raw.slice(8, 10)}`);
                    } else {
                        setPhoneNumber(parsed.phoneNumber);
                    }
                }
            } catch (e) {
                console.error("Failed to parse registration_form_data", e);
            }
        }

        if (hasInitializedRef.current) {
            setIsLoading(false); // Ensure loading is false if already initialized
            return;
        }
        hasInitializedRef.current = true;

        if (typeof window !== "undefined") {
            sessionStorage.setItem("user-registration-id", userRegistrationId);
        }

        // 2. Fetch data from backend for the registration ID (case when user comes from email link)
        const fetchActivationData = async () => {
            try {
                const res = await fetch("/api/auth/complete-email-register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userRegisterNotification: userRegistrationId }),
                });

                if (!res.ok) {
                    const data = await res.json().catch(() => null);
                    // Show error toast with message from backend if available
                    if (data?.upstreamBody?.message) {
                        setErrorMessage(data.upstreamBody.message);
                    } else if (data?.message) {
                        setErrorMessage(data.message);
                    }

                    handleBackendError(data, t);
                    setActivationError(true);
                    return;
                }

                const data = await res.json();
                if (data?.phoneNumber) {
                    const raw = data.phoneNumber.replace(/\D/g, "");
                    if (raw.length === 10) {
                        setPhoneNumber(`+90 (${raw.slice(0, 3)}) ${raw.slice(3, 6)} ${raw.slice(6, 8)} ${raw.slice(8, 10)}`);
                    } else if (raw.length > 10) {
                        // If it includes country code already, just format or show as is
                        setPhoneNumber(data.phoneNumber);
                    } else {
                        setPhoneNumber(data.phoneNumber);
                    }
                }

            } catch (error) {
                console.error("Failed to fetch activation data", error);
                setActivationError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchActivationData();
    }, [searchParams, t, locale, router]);

    const {
        register,
        handleSubmit,
        formState: { isSubmitting, errors },
    } = useForm<ActivationFormValues>({
        resolver: zodResolver(activationSchema(t)),
        criteriaMode: "all",
        defaultValues: {
            code: "",
        },
    });

    const onSubmit: SubmitHandler<ActivationFormValues> = async (values) => {
        const userRegistrationId = searchParams.get("user-registration-id");
        if (!userRegistrationId) {
            toast.error(t("auth.verification.missingParams"));
            return;
        }

        try {
            const res = await fetch("/api/auth/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    flowId: userRegistrationId,
                    tfaType: "Sms",
                    code: values.code
                }),
            });

            const data = await res.json().catch(() => null);

            if (!res.ok || data?.isVerified === false) {
                handleBackendError(data, t);
                return;
            }

            toast.success(t("auth.loginPage.successTitle"), {
                description: t("auth.verification.redirecting") || "Redirecting...",
            });

            router.push(withLocale("/auth/set-password", locale));
        } catch (error) {
            handleBackendError(null, t, undefined, t("auth.verification.verifyFailed"));
        }
    };

    const onInvalid: SubmitErrorHandler<ActivationFormValues> = (formErrors) => {
        const messages: string[] = [];

        Object.values(formErrors).forEach((error) => {
            if (error?.types) {
                Object.values(error.types).forEach((msg) => {
                    if (typeof msg === "string") messages.push(msg);
                    else if (Array.isArray(msg)) messages.push(...msg);
                });
            } else if (error?.message) {
                messages.push(error.message);
            }
        });

        toast.error(t("auth.loginPage.errorTitle"), {
            description: messages.length ? (
                <ul className="mt-1 space-y-1 text-xs">
                    {messages.map((msg, index) => (
                        <li key={index} className="flex gap-1">
                            <span>•</span>
                            <span>{msg}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                t("auth.loginPage.errorDescription")
            ),
        });
    };

    const handleResend = async () => {
        const userRegistrationId = searchParams.get("user-registration-id");
        if (!userRegistrationId) return;

        setIsResending(true);
        try {
            const res = await fetch("/api/auth/sms-verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userRegisterNotification: userRegistrationId }),
            });

            const data = await res.json().catch(() => null);

            if (!res.ok) {
                handleBackendError(data, t);
                return;
            }

            const otpCounter = data?.otpCounterInSeconds ?? 60;
            start(otpCounter);
            toast.success(t("auth.verification.resendSuccess"));
        } catch (error) {
            handleBackendError(null, t, undefined, t("auth.verification.resendFailed"));
        } finally {
            setIsResending(false);
        }
    };

    const handleResendEmailRegister = async () => {
        const userRegistrationId = searchParams.get("user-registration-id");
        if (!userRegistrationId) return;

        setIsResending(true);
        try {
            const res = await fetch("/api/auth/resend-email-register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userRegisterNotification: userRegistrationId }),
            });

            const data = await res.json().catch(() => null);

            if (!res.ok) {
                handleBackendError(data, t);
                return;
            }

            toast.success(t("auth.verification.resendSuccess"));
            setIsResendingCompleted(true);
        } catch (error) {
            handleBackendError(null, t, undefined, t("auth.verification.resendFailed"));
        } finally {
            setIsResending(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-[#C7F70A]" />
            </div>
        );
    }

    if (activationError) {
        return (
            <ExpiredLink
                onResend={handleResendEmailRegister}
                isResending={isResending}
                isResendingCompleted={isResendingCompleted}
                description={errorMessage}
            />
        );
    }

    return (
        <div className="mx-auto flex h-full w-full max-w-[500px] flex-col py-5 lg:h-auto md:p-0">
            <div className="mb-10 flex flex-col items-center gap-10 md:mb-12 md:gap-12">
                <div className="w-[75px] md:w-[93px] relative">
                    <img
                        src="/assets/images/activation-icon.png"
                        alt="Activation Icon"
                        className="h-full w-full object-contain hue-rotate-[75deg] saturate-[1.7] drop-shadow-[0_0_20px_rgba(199,247,10,0.2)]"
                    />
                </div>
                <AuthHeading
                    title={t("auth.verification.title")}
                    description={
                        <>
                            <span className="font-bold">{phoneNumber}</span> {t("auth.verification.description", { phone: "" }).trim()}
                        </>
                    }
                />
            </div>

            <form
                onSubmit={handleSubmit(onSubmit, onInvalid)}
                noValidate
                className="flex-1 lg:flex-none flex flex-col"
            >
                <div className="space-y-6 md:space-y-8 flex-1">
                    <div className="space-y-2">
                        <AuthLabel htmlFor="code">
                            {t("auth.verification.codeLabel")}
                        </AuthLabel>
                        <div className="flex flex-col items-end md:items-center md:flex-row gap-5 md:gap-8">
                            <Input
                                id="code"
                                placeholder={t("auth.verification.codePlaceholder")}
                                aria-invalid={Boolean(errors.code)}
                                variant="auth"
                                className="flex-1"
                                {...register("code")}
                            />
                            <Button
                                type="button"
                                variant="default"
                                className="h-12 min-w-[128px] rounded-[16px] bg-[#F4F7F8] px-5 text-sm font-bold leading-4 text-[#0D0F10] hover:bg-white"
                                onClick={handleResend}
                                disabled={isResending || isRunning}
                            >
                                {isResending ? "..." : isRunning ? `${secondsLeft}s` : t("auth.securityEmail.send")}
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="mt-auto md:mt-14">
                    <Button
                        type="submit"
                        size="xl"
                        className="min-w-22.5 h-14 w-full rounded-[18px] bg-[#C7F70A]! font-bold text-[#080A0B] hover:bg-[#D5FF28]!"
                        disabled={isSubmitting}
                    >
                        {t("auth.verification.submit")}
                    </Button>
                    <AuthPrompt
                        prompt={t("auth.verification.resendPrompt")}
                        buttonText={t("auth.verification.resend")}
                        onAction={handleResend}
                        disabled={isResending}
                    />
                </div>
            </form>

        </div>
    );
}
