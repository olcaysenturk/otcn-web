"use client";

import { AuthLayout } from "@/components/auth/layout/AuthLayout";
import { PasswordSetupForm } from "@/components/auth/forms/PasswordSetupForm";
import { ActivationShowcase } from "@/components/auth/layout/ActivationShowcase";
import { useAuthSteps } from "@/components/auth/hooks/useAuthSteps";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { COMPANY_CONTACTS } from "@/config/company";

export default function SetPasswordPage() {
  const { t } = useI18n();
  const steps = useAuthSteps("password");

  return (
    <div className="flex items-center justify-center overflow-hidden w-full">
      <AuthLayout
        heading={t("auth.heading")}
        steps={steps}
        email={COMPANY_CONTACTS.email}
        callCenter={COMPANY_CONTACTS.callCenter}
        whatsappHref={COMPANY_CONTACTS.whatsappHref}
        telegramHref={COMPANY_CONTACTS.telegramHref}
        showSteps={false}
        leftContent={<ActivationShowcase />}
      >
        <PasswordSetupForm />
      </AuthLayout>
    </div>
  );
}
