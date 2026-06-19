"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { X } from "lucide-react";

import { useModalStore } from "@/stores/useModalStore";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { withLocale } from "@/lib/i18n/href";
import { getInternalPath } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";
import {
  AppPreferences,
  getClientAppPreferences,
  getDefaultAppPreferences,
  setClientAppPreferences,
} from "@/lib/preferences/appPreferences";

export function AccountPreferencesModal() {
  const { t, locale } = useI18n();
  const { closeModal, isClosing } = useModalStore();
  const router = useRouter();
  const pathname = usePathname() || "/";
  const [preferences, setPreferences] = useState<AppPreferences>(() => getDefaultAppPreferences(locale));

  useEffect(() => {
    setPreferences(getClientAppPreferences(locale));
  }, [locale]);

  const languageOptions = useMemo(
    () => ({
      en: "English",
      pt: "Português",
      es: "Español",
      ru: "Русский",
    }),
    [],
  );

  const handleApply = () => {
    setClientAppPreferences(preferences);
    window.dispatchEvent(new Event("preferences-updated"));
    closeModal();

    if (preferences.language !== locale) {
      const internalPath = getInternalPath(pathname);
      router.push(withLocale(internalPath, preferences.language));
      router.refresh();
    }
  };

  return (
    <div
      onClick={closeModal}
      className="absolute inset-0 z-20 flex items-start justify-center overflow-auto p-4 md:items-start md:pt-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "relative z-20 flex h-full max-h-[95vh] w-full max-w-130 flex-col overflow-hidden rounded-[1.75rem] gap-2 bg-[#0F1415] shadow-2xl ring-1 ring-black/5 lg:ml-auto",
          isClosing ? "animate-slide-out-to-right" : "animate-slide-in-from-right",
        )}
      >
        <div className="flex shrink-0 items-center justify-between bg-[#C8FF00] px-6 py-4 h-14">
          <h3 className="text-base font-semibold text-[#0F1415]">{t("preferencesPage.title")}</h3>
          <button
            type="button"
            onClick={closeModal}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#0F1415] transition hover:bg-black/10"
            aria-label={t("common.close")}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="custom-scrollbar flex h-full flex-1 flex-col justify-between overflow-y-auto bg-[#0F1415] px-6 pt-6 pb-3">
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">{t("preferencesPage.timezone")}</label>
                <select
                  value={preferences.timezone}
                  onChange={(e) =>
                    setPreferences((prev) => ({ ...prev, timezone: e.target.value as AppPreferences["timezone"] }))
                  }
                  className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white"
                >
                  <option className="bg-[#1C2425]" value="UTC">[+00:00 UTC] UTC, Universal Time</option>
                  <option className="bg-[#1C2425]" value="Europe/Istanbul">[+03:00 UTC] Europe/Istanbul</option>
                  <option className="bg-[#1C2425]" value="America/New_York">[-05:00 UTC] America/New_York</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">{t("preferencesPage.currency")}</label>
                <select
                  value={preferences.currency}
                  onChange={(e) =>
                    setPreferences((prev) => ({ ...prev, currency: e.target.value as AppPreferences["currency"] }))
                  }
                  className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white"
                >
                  <option className="bg-[#1C2425]" value="TRY">TRY</option>
                  <option className="bg-[#1C2425]" value="USDT">USDT</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">{t("preferencesPage.language")}</label>
                <select
                  value={preferences.language}
                  onChange={(e) =>
                    setPreferences((prev) => ({ ...prev, language: e.target.value as AppPreferences["language"] }))
                  }
                  className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white"
                >
                  <option className="bg-[#1C2425]" value="en">{languageOptions.en}</option>
                  <option className="bg-[#1C2425]" value="pt">{languageOptions.pt}</option>
                  <option className="bg-[#1C2425]" value="es">{languageOptions.es}</option>
                  <option className="bg-[#1C2425]" value="ru">{languageOptions.ru}</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">{t("preferencesPage.numberFormat")}</label>
                <select
                  value={preferences.dateFormat}
                  onChange={(e) =>
                    setPreferences((prev) => ({ ...prev, dateFormat: e.target.value as AppPreferences["dateFormat"] }))
                  }
                  className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white"
                >
                  <option className="bg-[#1C2425]" value="en">1,234,567.89</option>
                  <option className="bg-[#1C2425]" value="pt">1.234.567,89</option>
                  <option className="bg-[#1C2425]" value="es">1.234.567,89</option>
                  <option className="bg-[#1C2425]" value="ru">1 234 567,89</option>
                </select>
              </div>
            </div>

            <div className="mt-auto pt-6">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="h-11 flex-1 rounded-full border border-white/20 bg-transparent px-4 text-sm font-semibold text-white hover:bg-white/5"
                >
                  {t("common.actions.cancel")}
                </button>
                <button
                  type="button"
                  onClick={handleApply}
                  className="h-11 flex-1 rounded-full bg-white px-4 text-sm font-semibold text-[#0F1415] hover:bg-white/90"
                >
                  {t("common.actions.apply")}
                </button>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
