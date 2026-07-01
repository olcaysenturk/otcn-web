"use client";

import * as React from "react";
import { toast } from "sonner";
import { AuthLayout } from "@/components/auth/layout/AuthLayout";
import { Security2faForm } from "@/components/auth/forms/Security2faForm";
import { LoginShowcase } from "@/components/auth/layout/LoginShowcase";
import { useAuthSteps } from "@/components/auth/hooks/useAuthSteps";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { COMPANY_CONTACTS } from "@/config/company";
import { ArrowLeft } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { getSession } from "@/lib/api/session";
import { withLocale } from "@/lib/i18n/href";

export default function Security2faPage() {
  const { t } = useI18n();
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const steps = useAuthSteps("success");

  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const checkSession = async () => {
      const flowId = typeof window !== "undefined" ? sessionStorage.getItem("user-login-flow-id") : null;
      const session = await getSession();
      if (session?.authenticated) {
        router.replace(withLocale("/dashboard", locale));
        return;
      }

      if (!flowId) {
        toast.error(t("auth.verification.missingParams"));
        router.push(withLocale("/", locale));
      }

      setIsLoading(false);
    };

    checkSession();
  }, [router, t]);

  if (isLoading) {
    return null;
  }

  return (
    <div className="flex items-center justify-center overflow-hidden w-full">
      <AuthLayout
        heading={t("auth.security2fa.title")}
        steps={steps}
        email={COMPANY_CONTACTS.email}
        callCenter={COMPANY_CONTACTS.callCenter}
        whatsappHref={COMPANY_CONTACTS.whatsappHref}
        telegramHref={COMPANY_CONTACTS.telegramHref}
        showSteps={false}
        leftContent={<LoginShowcase />}
      >
        <div className="flex flex-col w-full h-full lg:h-auto items-start">
          {/* <button
            onClick={() => router.back()}
            className="flex items-center gap-4 text-[#4F5C75] hover:text-gray-900 transition-colors w-fit group md:absolute md:left-[4px] md:top-8 text-[14px] md:text-[18px] leading-5 md:leading-7 mb-3 md:mb-0"
          >
            <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
            <span className="font-medium text-base">Geri</span>
          </button> */}

          <div className="w-full flex justify-center">
            <Security2faForm />
          </div>
        </div>
      </AuthLayout>
    </div>
  );
}
