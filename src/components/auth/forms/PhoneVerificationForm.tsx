"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { withLocale } from "@/lib/i18n/href";

import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { ArrowLeft } from "lucide-react";

type PhoneVerificationFormProps = {
  phone?: string;
};

export function PhoneVerificationForm({
  phone = "+90 532 *** 6810",
}: PhoneVerificationFormProps) {
  const { t } = useI18n();
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const basePath = `/${locale}`;

  const [code, setCode] = React.useState("");

  const handleVerify = (event: React.FormEvent) => {
    event.preventDefault();
    try {
      window.localStorage.setItem("auth-verified", "true");
    } catch {
      // ignore
    }
    router.push(withLocale("/", locale));
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => router.push(withLocale("/auth/security-required", locale))}
        className="mb-6 flex items-center gap-2 text-sm font-semibold text-gray-800 hover:text-gray-800/70 absolute left-0 top-5"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("back")}
      </button>

      <h2 className="mb-3 text-3xl font-extrabold text-gray-900 lg:text-4xl">
        {t("auth.securityPhone.title")}
      </h2>
      <p className="mb-8 leading-relaxed text-gray-600">
        {t("auth.securityPhone.description").replace("{{phone}}", phone)}
      </p>

      <form className="space-y-4" onSubmit={handleVerify}>
        <div className="space-y-2">
          <label
            htmlFor="phone_code"
            className="block text-sm font-semibold text-gray-900"
          >
            {t("auth.securityPhone.label")}
          </label>
          <div className="flex gap-3">
            <Input
              id="phone_code"
              name="phone_code"
              type="text"
              inputMode="numeric"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={t("auth.securityPhone.placeholder")}
              className="h-12 flex-1 rounded-lg border border-[#E8EDF3] bg-white px-4 text-base font-medium text-gray-900 placeholder:text-gray-400 shadow-sm transition focus:border-transparent focus:ring-2 focus:ring-[#4f46e5]"
            />
            <button
              type="button"
              className="h-12 whitespace-nowrap rounded-lg border border-[#E8EDF3] px-4 text-sm font-medium text-gray-900 shadow-sm transition hover:border-gray-300 hover:bg-gray-50"
            >
              {t("auth.securityPhone.send")}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={!code}
          className="h-9 w-full rounded-full bg-[#40404A] px-4 text-sm font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#40404A]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4f46e5] focus:ring-offset-white disabled:translate-y-0 disabled:bg-gray-200 disabled:text-gray-500"
        >
          {t("auth.securityPhone.verify")}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        {t("auth.securityPhone.resendPrompt")}{" "}
        <button
          type="button"
          className="font-semibold text-gray-900 underline decoration-gray-400 underline-offset-4 hover:text-[#4f46e5]"
        >
          {t("auth.securityPhone.resend")}
        </button>
      </p>
    </div>
  );
}
