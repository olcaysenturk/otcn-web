"use client";

import { AuthLayout } from "@/components/auth/layout/AuthLayout";
import { ForgotPasswordForm } from "@/components/auth/forms/ForgotPasswordForm";
import { ActivationShowcase } from "@/components/auth/layout/ActivationShowcase";
import { useAuthSteps } from "@/components/auth/hooks/useAuthSteps";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { COMPANY_CONTACTS } from "@/config/company";
import { Suspense } from "react";

function ForgotPasswordPageContent() {
    const { t } = useI18n();
    const steps = useAuthSteps("verify");

    return (
        <div className="flex items-center justify-center overflow-hidden w-full">
            <AuthLayout
                heading={t("auth.forgotPassword.title")}
                steps={steps}
                email={COMPANY_CONTACTS.email}
                callCenter={COMPANY_CONTACTS.callCenter}
                whatsappHref={COMPANY_CONTACTS.whatsappHref}
                telegramHref={COMPANY_CONTACTS.telegramHref}
                showSteps={false}
                leftContent={<ActivationShowcase />}
            >
                <ForgotPasswordForm />
            </AuthLayout>
        </div>
    );
}

export default function ForgotPasswordPage() {
    return (
        <Suspense>
            <ForgotPasswordPageContent />
        </Suspense>
    );
}
