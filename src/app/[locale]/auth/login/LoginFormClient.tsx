"use client";

import { AuthLayout } from "@/components/auth/layout/AuthLayout";
import { LoginForm } from "@/components/auth/forms/LoginForm";
import { LoginShowcase } from "@/components/auth/layout/LoginShowcase";
import { useAuthSteps } from "@/components/auth/hooks/useAuthSteps";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { COMPANY_CONTACTS } from "@/config/company";

export default function LoginPage() {
  const { t } = useI18n();
  const steps = useAuthSteps("success");

  return (
    <div className="flex items-center justify-center overflow-hidden w-full">
      <AuthLayout
        heading={t("auth.loginPage.title")}
        steps={steps}
        email={COMPANY_CONTACTS.email}
        callCenter={COMPANY_CONTACTS.callCenter}
        whatsappHref={COMPANY_CONTACTS.whatsappHref}
        telegramHref={COMPANY_CONTACTS.telegramHref}
        showSteps={false}
        leftContent={<LoginShowcase />}
      >
        <LoginForm />
      </AuthLayout>
    </div>
  );
}
