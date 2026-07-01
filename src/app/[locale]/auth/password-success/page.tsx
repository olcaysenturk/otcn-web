"use client";

import * as React from "react";
import { AuthLayout } from "@/components/auth/layout/AuthLayout";
import { ActivationShowcase } from "@/components/auth/layout/ActivationShowcase";
import { useAuthSteps } from "@/components/auth/hooks/useAuthSteps";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { COMPANY_CONTACTS } from "@/config/company";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter, useParams } from "next/navigation";
import { withLocale } from "@/lib/i18n/href";
import { AuthHeading } from "@/components/auth/forms/AuthHeading";

export default function PasswordSuccessPage() {
  const { t } = useI18n();
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const steps = useAuthSteps("password");

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const storedData = sessionStorage.getItem("registration_form_data");
      if (!storedData) {
        router.push(withLocale("/auth/login", locale));
      }
    }
  }, [locale, router]);

  const handleContinue = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("registration_form_data");
      sessionStorage.removeItem("user-registration-id");
    }
    router.push(withLocale("/auth/login", locale));
  };

  return (
    <div className="flex items-center justify-center overflow-hidden w-full">
      <AuthLayout
        heading={t("auth.success.title")}
        steps={steps}
        email={COMPANY_CONTACTS.email}
        callCenter={COMPANY_CONTACTS.callCenter}
        whatsappHref={COMPANY_CONTACTS.whatsappHref}
        telegramHref={COMPANY_CONTACTS.telegramHref}
        showSteps={false}
        leftContent={<ActivationShowcase />}
      >
        <div className="mx-auto flex h-full w-full max-w-[500px] flex-col py-5 lg:h-auto md:p-0">
          <div className="flex flex-col items-center mb-10 md:mb-14 gap-[50px] md:gap-[76px]">
            <div className="w-[140px] md:w-[180px] relative">
              <img
                src="/assets/images/success-icon.png"
                alt="Success Icon"
                className="h-full w-full object-contain hue-rotate-[75deg] saturate-[1.7] drop-shadow-[0_0_20px_rgba(199,247,10,0.2)]"
              />
            </div>
            <AuthHeading
              title={t("auth.success.title")}
              description={t("auth.success.description")}
            />
          </div>

          <div className="w-full">
            <Button
              onClick={handleContinue}
              size="xl"
              className="min-w-22.5 h-14 w-full rounded-[18px] bg-[#C7F70A]! font-bold text-[#080A0B] hover:bg-[#D5FF28]!"
            >
              {t("auth.success.goPanel")}
            </Button>
          </div>
        </div>
      </AuthLayout>
    </div>
  );
}
