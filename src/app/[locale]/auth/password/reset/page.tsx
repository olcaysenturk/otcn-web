"use client";

import { AuthLayout } from "@/components/auth/layout/AuthLayout";
import { PasswordResetForm } from "@/components/auth/forms/PasswordResetForm";
import { ActivationShowcase } from "@/components/auth/layout/ActivationShowcase";
import { useAuthSteps } from "@/components/auth/hooks/useAuthSteps";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { COMPANY_CONTACTS } from "@/config/company";
import { Suspense } from "react";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { SecurityEmailForm } from "@/components/auth/forms/SecurityEmailForm";
import { SecurityPhoneForm } from "@/components/auth/forms/SecurityPhoneForm";
import { Security2faForm } from "@/components/auth/forms/Security2faForm";
import { handleBackendError } from "@/lib/utils/toast";
import { ExpiredLink } from "@/components/auth/ui/ExpiredLink";

type Step = "loading" | "email" | "phone" | "2fa" | "form";

function PasswordResetPageContent() {
    const { t } = useI18n();
    const searchParams = useSearchParams();
    const flowId = searchParams.get("flowId");

    const [currentStep, setCurrentStep] = useState<Step>("loading");
    const [userData, setUserData] = useState<any>(null);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (!flowId) {
            toast.error(t("auth.verification.missingParams"));
            setIsError(true);
            return;
        }

        const initFlow = async () => {
            try {
                const res = await fetch("/api/auth/forgot-password-init", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ flowId }),
                });

                const data = await res.json().catch(() => null);

                if (!res.ok) {
                    if (data?.upstreamBody?.message) {
                        setErrorMessage(data.upstreamBody.message);
                    } else if (data?.message) {
                        setErrorMessage(data.message);
                    }

                    handleBackendError(data, t);
                    setIsError(true);
                    return;
                }

                // Handle both nested { data: { ... } } and flat { ... } responses
                const userDataObj = data?.data || data;
                setUserData(userDataObj);

                // Determine first step - Explicitly skipping email verification as per request
                if (userDataObj?.isPhoneTwoFactorEnabled) {
                    setCurrentStep("phone");
                } else if (userDataObj?.isAuthenticatorTwoFactorEnabled) {
                    setCurrentStep("2fa");
                } else {
                    setCurrentStep("form");
                }

            } catch (error) {
                handleBackendError(null, t);
                setIsError(true);
            }
        };

        initFlow();
    }, [flowId, t]);

    const handleEmailSuccess = () => {
        // This step is currently skipped in initialization, but keeping for completeness
        if (userData?.isPhoneTwoFactorEnabled) {
            setCurrentStep("phone");
        } else if (userData?.isAuthenticatorTwoFactorEnabled) {
            setCurrentStep("2fa");
        } else {
            setCurrentStep("form");
        }
    };

    const handlePhoneSuccess = () => {
        if (userData?.isAuthenticatorTwoFactorEnabled) {
            setCurrentStep("2fa");
        } else {
            setCurrentStep("form");
        }
    };

    const handle2faSuccess = () => {
        setCurrentStep("form");
    };

    const steps = useAuthSteps("verify");

    return (
        <div className="flex items-center justify-center overflow-hidden w-full">
            <AuthLayout
                heading={t("auth.password.title")}
                steps={steps}
                email={COMPANY_CONTACTS.email}
                callCenter={COMPANY_CONTACTS.callCenter}
                whatsappHref={COMPANY_CONTACTS.whatsappHref}
                telegramHref={COMPANY_CONTACTS.telegramHref}
                showSteps={false}
                leftContent={<ActivationShowcase />}
            >
                {isError ? (
                    <ExpiredLink description={errorMessage} />
                ) : (
                    <>
                        {currentStep === "loading" && (
                            <div className="flex flex-col items-center justify-center py-20 gap-4">
                                <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#C7F70A] border-t-transparent" />
                                <p className="text-gray-500 font-medium">{t("auth.verification.redirecting")}</p>
                            </div>
                        )}

                        {currentStep === "email" && userData && (
                            <SecurityEmailForm
                                email={userData.email || userData.emailAddress || String(userData.userId || "")}
                                flowId={flowId!}
                                onSuccess={handleEmailSuccess}
                                showProgress={false}
                            />
                        )}

                        {currentStep === "phone" && userData && (
                            <SecurityPhoneForm
                                phone={userData.phone || userData.phoneNumber || ""}
                                flowId={flowId!}
                                onSuccess={handlePhoneSuccess}
                                showProgress={false}
                            />
                        )}

                        {currentStep === "2fa" && userData && (
                            <Security2faForm
                                flowId={flowId!}
                                onSuccess={handle2faSuccess}
                                showProgress={false}
                            />
                        )}

                        {currentStep === "form" && (
                            <PasswordResetForm />
                        )}
                    </>
                )}
            </AuthLayout>
        </div>
    );
}

export default function PasswordResetPage() {
    return (
        <Suspense>
            <PasswordResetPageContent />
        </Suspense>
    );
}
