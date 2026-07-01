"use client";

import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { withLocale } from "@/lib/i18n/href";

type VerificationCodeFormProps = {
  email: string;
  codeLabel?: string;
};

export function VerificationCodeForm({
  email,
  codeLabel,
}: VerificationCodeFormProps) {
  const { t } = useI18n();
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const basePath = `/${locale}`;

  const handleVerify = () => {
    router.push(withLocale("/auth/set-password", locale));
  };

  return (
    <div>
      <h2 className="mb-4 text-3xl font-extrabold text-gray-900 lg:text-4xl">
        {t("auth.verification.title")}
      </h2>
      <p className="mb-8 leading-relaxed text-gray-600">
        <span className="font-bold text-gray-800">{email}</span>{" "}
        {t("auth.verification.description")}
      </p>

      <form className="space-y-6">
        <div>
          <label
            htmlFor="verification_code"
            className="mb-2 block text-sm font-semibold text-gray-900"
          >
            {codeLabel ?? t("auth.verification.codeLabel")}
          </label>
          <Input
            id="verification_code"
            name="verification_code"
            type="text"
            inputMode="numeric"
            placeholder={t("auth.verification.codePlaceholder")}
            className="h-12 rounded-lg border border-[#E8EDF3] bg-white px-4 py-3 text-base font-medium text-gray-900 shadow-sm transition focus:border-transparent focus:ring-2 focus:ring-[#4f46e5]"
          />
        </div>

        <button
          type="button"
          className="w-full h-9 rounded-full bg-[#40404A] px-4 text-sm font-medium text-white shadow-lg transition duration-200 hover:-translate-y-0.5 hover:bg-[#40404A]/90 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4f46e5] focus:ring-offset-white"
          onClick={handleVerify}
        >
          {t("auth.verification.submit")}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          {t("auth.verification.resendPrompt")}{" "}
          <a
            href="#"
            className="border-b border-transparent pb-0.5 font-semibold text-[#4f46e5] transition-colors hover:border-[#4f46e5]"
          >
            {t("auth.verification.resend")}
          </a>
        </p>
      </div>
    </div>
  );
}
