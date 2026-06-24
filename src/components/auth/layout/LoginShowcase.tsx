"use client";

import { useI18n } from "@/lib/i18n/I18nProvider";

export function LoginShowcase() {
  const { t } = useI18n();

  return (
    <div className="relative flex min-h-full flex-1 flex-col justify-end overflow-hidden bg-black p-6">
      <div className="absolute inset-0 bg-[url('/assets/otcn/hero-liquid.jpg')] bg-cover bg-center" />
      <div className="absolute inset-0 bg-black/10" />
      <div className="relative z-10 rounded-[32px] border border-white/10 bg-[#0B0D0E]/85 p-8 shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl xl:p-10">
          <h2 className="mb-5 text-[34px] font-bold leading-[1.18] tracking-[-1.4px] text-[#F4F7F8] xl:text-[46px]">
            {t("auth.returnUser.title")}
          </h2>
          <p className="max-w-xl text-base leading-6 text-[#C5C9CC] xl:text-lg xl:leading-7">
            {t("auth.returnUser.subtitle")}
          </p>
      </div>
    </div>
  );
}
