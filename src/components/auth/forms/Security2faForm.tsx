"use client";

import * as React from "react";
import { useForm, type SubmitHandler, type SubmitErrorHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { handleBackendError } from "@/lib/utils/toast";
import { useRouter, useParams } from "next/navigation";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { withLocale } from "@/lib/i18n/href";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AuthLabel } from "./AuthLabel";
import { AuthPrompt } from "./AuthPrompt";
import { AuthHeading } from "./AuthHeading";
import { SecurityProgress } from "../layout/SecurityProgress";
import { invalidateSession } from "@/lib/api/session";
import { clearLoginSessionData } from "@/lib/auth/clientSession";

const security2faSchema = (t: any) => z.object({
    code: z.string().min(6, t("auth.security2fa.placeholder")),
});

type Security2faFormValues = z.infer<ReturnType<typeof security2faSchema>>;

interface Security2faFormProps {
    flowId?: string;
    onSuccess?: () => void;
    showProgress?: boolean;
}

export function Security2faForm({ flowId: propsFlowId, onSuccess, showProgress = true }: Security2faFormProps) {
    const { t } = useI18n();
    const router = useRouter();
    const params = useParams();
    const locale = (params?.locale as string) || "en";

    const [isResending, setIsResending] = React.useState(false);

    const {
        register,
        handleSubmit,
        formState: { isSubmitting, errors },
    } = useForm<Security2faFormValues>({
        resolver: zodResolver(security2faSchema(t)),
        criteriaMode: "all",
        defaultValues: {
            code: "",
        },
    });

    const onSubmit: SubmitHandler<Security2faFormValues> = async (values) => {
        const flowId = propsFlowId || (typeof window !== "undefined" ? sessionStorage.getItem("user-login-flow-id") : null);
        if (!flowId) {
            toast.error(t("auth.verification.missingParams"));
            return;
        }

        try {
            const res = await fetch("/api/auth/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    flowId,
                    tfaType: "Google",
                    code: values.code,
                }),
            });

            const data = await res.json().catch(() => null);

            if (!res.ok || data?.isVerified === false) {
                handleBackendError(data, t);
                return;
            }

            if (onSuccess) {
                onSuccess();
            } else {
                const remember = typeof window !== "undefined" ? sessionStorage.getItem("user-remember") === "true" : false;
                const completeRes = await fetch("/api/auth/login-complete", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ flowId, remember }),
                });

                if (completeRes.ok) {
                    invalidateSession();

                    let targetPath = withLocale("/dashboard", locale);

                    // Fetch application detail to decide redirection
                    try {
                        const { getApplicationDetail } = await import("@/services/application");
                        const appDetail = await getApplicationDetail();

                        if (appDetail?.applications && appDetail.applications.length > 0) {
                            const status = appDetail.applications[0].applicationStatus;
                            if (status < 6) {
                                targetPath = withLocale("/application/company-info", locale);
                            }
                        }
                    } catch (err) {
                        console.error("Failed to fetch application detail for redirection:", err);
                    }

                    clearLoginSessionData();
                    toast.success(t("auth.loginPage.successTitle"));
                    router.push(targetPath);
                } else {
                    toast.error(t("auth.verification.verifyFailed"));
                }
            }
        } catch {
            handleBackendError(null, t, undefined, t("auth.verification.verifyFailed"));
        }
    };

    const onInvalid: SubmitErrorHandler<Security2faFormValues> = (formErrors) => {
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
        // Usually not applicable for Google Auth, but keeping for structure
        toast.info("Google Authenticator codes are generated on your device.");
    };

    const handleRecovery = async () => {
        toast.info("Recovery flow not implemented yet.");
    };

    return (
        <div className="mx-auto flex h-full w-full max-w-[500px] flex-col py-5 lg:h-auto md:p-0">
            <div className="flex flex-col h-full lg:h-auto gap-14">
                {showProgress && <SecurityProgress currentStep="2fa" progress={100} />}

                <AuthHeading
                    title={t("auth.security2fa.title")}
                    description={t("auth.security2fa.description")}
                />

                <form
                    onSubmit={handleSubmit(onSubmit, onInvalid)}
                    noValidate
                    className="flex-1 lg:flex-none flex flex-col gap-14"
                >
                    <div className="space-y-6 md:space-y-8 flex-1">
                        <div className="space-y-2">
                            <AuthLabel htmlFor="code">
                                {t("auth.security2fa.label")}
                            </AuthLabel>
                            <div className="flex flex-col items-end md:items-center md:flex-row gap-5 md:gap-8">
                                <Input
                                    id="code"
                                    placeholder={t("auth.security2fa.placeholder")}
                                    aria-invalid={Boolean(errors.code)}
                                    variant="auth"
                                    className="flex-1"
                                    {...register("code")}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <Button
                            type="submit"
                            size="xl"
                            className="min-w-22.5 h-14 w-full rounded-[18px] bg-[#C7F70A]! font-bold text-[#080A0B] hover:bg-[#D5FF28]!"
                            disabled={isSubmitting}
                        >
                            {t("auth.security2fa.verify")}
                        </Button>
                        <AuthPrompt
                            prompt={t("auth.security2fa.help")}
                            buttonText={t("auth.security2fa.recovery")}
                            onAction={handleRecovery}
                            disabled={isResending}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}
