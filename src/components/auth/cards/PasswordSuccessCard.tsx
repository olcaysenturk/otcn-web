"use client";

import { useParams, useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/I18nProvider";

export function PasswordSuccessCard() {
  const { t } = useI18n();
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const basePath = `/${locale}`;

  const goToPanel = () => {
    try {
      window.localStorage.setItem("auth-verified", "true");
    } catch {
      // ignore storage errors
    }
    router.push(`${basePath}/auth/security-required`);
  };

  const goHome = () => {
    router.push(`${basePath}/`);
  };
  return (
    <div className="text-center">
      <div className="mx-auto mb-6 flex size-12 items-center justify-center rounded-full bg-[#e0f2fe] text-[#0284c7] shadow-sm">
        ✓
      </div>
      <h2 className="mb-4 text-3xl font-extrabold text-gray-900 lg:text-4xl">
        {t("auth.success.title")}
      </h2>
      <p className="mb-8 leading-relaxed text-gray-600">
        {t("auth.success.description")}
      </p>
      <div className="space-y-3">
        <button
          type="button"
          className="w-full rounded-lg bg-[#40404A] px-4 py-3.5 text-sm font-medium text-white shadow-lg transition duration-200 hover:-translate-y-0.5 hover:bg-[#40404A]/80 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4f46e5] focus:ring-offset-white"
          onClick={goToPanel}
        >
          {t("auth.success.goPanel")}
        </button>
        <button
          type="button"
          className="w-full h-9 rounded-lg border border-[#E8EDF3] px-4 text-sm font-medium text-gray-900 shadow-sm transition hover:border-gray-300 hover:bg-gray-50"
          onClick={goHome}
        >
          {t("auth.success.goHome")}
        </button>
      </div>
    </div>
  );
}
