"use client";

import { AuthLayout } from "@/components/auth/layout/AuthLayout";
import { LoginShowcase } from "@/components/auth/layout/LoginShowcase";
import { useAuthSteps } from "@/components/auth/hooks/useAuthSteps";
import { ApplicationForm } from "@/components/application-form/ApplicationForm";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { COMPANY_CONTACTS } from "@/config/company";

export default function RegisterPage() {
  const { t } = useI18n();
  const steps = useAuthSteps("success");

  return (
    <div className="flex w-full items-center justify-center overflow-hidden">
      <AuthLayout
        heading={t("auth.register")}
        steps={steps}
        email={COMPANY_CONTACTS.email}
        callCenter={COMPANY_CONTACTS.callCenter}
        whatsappHref={COMPANY_CONTACTS.whatsappHref}
        telegramHref={COMPANY_CONTACTS.telegramHref}
        showSteps={false}
        leftContent={<LoginShowcase />}
      >
        <div className="mx-auto w-full max-w-[560px] py-2">
          <div className="mb-10 text-center">
            <h2 className="mb-3 text-2xl font-bold leading-8 tracking-[-0.48px] text-[#F4F7F8] md:text-[28px] md:leading-[42px]">
              {t("auth.registerPage.title")}
            </h2>
            <p className="text-sm leading-5 text-[#C5C9CC] md:text-base md:leading-6">
              {t("auth.registerPage.description")}
            </p>
          </div>
          <ApplicationForm
            variant="dark"
            className="border-0 bg-transparent p-0 shadow-none"
          />
        </div>
      </AuthLayout>
    </div>
  );
}
