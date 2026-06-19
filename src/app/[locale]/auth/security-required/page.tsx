"use client";

import { AuthLayout } from "@/components/auth/layout/AuthLayout";
import { ReturnUserPanel } from "@/components/auth/cards/ReturnUserPanel";
import { SecurityRequiredCard } from "@/components/auth/cards/SecurityRequiredCard";
import { useAuthSteps } from "@/components/auth/hooks/useAuthSteps";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { COMPANY_CONTACTS } from "@/config/company";

export default function SecurityRequiredPage() {
  const { t } = useI18n();
  const steps = useAuthSteps("verify");

  return (
    <div className="flex min-h-screen items-center justify-center">
      <AuthLayout
        heading={t("auth.securityRequired.title")}
        steps={steps}
        email={COMPANY_CONTACTS.email}
        callCenter={COMPANY_CONTACTS.callCenter}
        whatsappHref={COMPANY_CONTACTS.whatsappHref}
        telegramHref={COMPANY_CONTACTS.telegramHref}
        showSteps={false}
        leftContent={<ReturnUserPanel />}
      >
        <SecurityRequiredCard />
      </AuthLayout>
    </div>
  );
}
