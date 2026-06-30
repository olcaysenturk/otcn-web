"use client";

import { useEffect, useMemo, useState } from "react";
import { Pencil } from "lucide-react";

import { useI18n } from "@/lib/i18n/I18nProvider";
import {
  AppPreferences,
  getClientAppPreferences,
  getDefaultAppPreferences,
} from "@/lib/preferences/appPreferences";
import { useModalStore } from "@/stores/useModalStore";

export default function AccountPreferencesPage() {
  const { t, locale } = useI18n();
  const { openModal } = useModalStore();
  const [preferences, setPreferences] = useState<AppPreferences>(() => getDefaultAppPreferences(locale));

  useEffect(() => {
    setPreferences(getClientAppPreferences(locale));
  }, [locale]);

  useEffect(() => {
    const syncPreferences = () => setPreferences(getClientAppPreferences(locale));
    window.addEventListener("preferences-updated", syncPreferences);
    return () => window.removeEventListener("preferences-updated", syncPreferences);
  }, [locale]);

  const contentLabels = useMemo(() => {
    const timezoneMap: Record<AppPreferences["timezone"], string> = {
      UTC: t("preferencesPage.timezones.utc"),
      "Europe/Istanbul": t("preferencesPage.timezones.istanbul"),
      "America/New_York": t("preferencesPage.timezones.newYork"),
    };
    const languageMap: Record<AppPreferences["language"], string> = {
      en: t("preferencesPage.languages.en"),
      pt: t("preferencesPage.languages.pt"),
      es: t("preferencesPage.languages.es"),
      ru: t("preferencesPage.languages.ru"),
    };
    const numberFormatMap: Record<AppPreferences["dateFormat"], string> = {
      en: "1,234,567.89",
      pt: "1.234.567,89",
      es: "1.234.567,89",
      ru: "1 234 567,89",
    };
    return {
      timezone: timezoneMap[preferences.timezone] ?? timezoneMap.UTC,
      currency: preferences.currency,
      language: languageMap[preferences.language],
      numberFormat: numberFormatMap[preferences.dateFormat],
    };
  }, [preferences, t]);

  const rows = [
    { key: "timezone", label: t("preferencesPage.timezone"), value: contentLabels.timezone },
    { key: "currency", label: t("preferencesPage.currency"), value: contentLabels.currency },
    { key: "language", label: t("preferencesPage.language"), value: contentLabels.language },
    { key: "numberFormat", label: t("preferencesPage.numberFormat"), value: contentLabels.numberFormat },
  ];

  return (
    <div className="rounded-[26px] bg-[#0E0F10] p-6 shadow-[0px_2px_8px_0.3px_rgba(58,64,67,0.2)]">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-medium text-[#F4F7F8]">{t("preferencesPage.title")}</h2>
        <button
          type="button"
          onClick={() => openModal("account-preferences")}
          className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-[12px] border border-[#F4F7F8] px-4 py-2.5 text-xs font-bold text-[#F4F7F8] transition hover:border-[#f54a14] hover:text-[#f54a14]"
        >
          <Pencil className="h-4 w-4" />
          {t("preferencesPage.edit")}
        </button>
      </div>

      <div className="flex flex-col py-3">
        {rows.map((row) => (
          <div
            key={row.key}
            className="flex flex-col gap-2 border-b border-[#3A4043] py-5 last:border-b-0 md:flex-row md:items-center md:gap-[120px]"
          >
            <span className="w-[200px] shrink-0 text-[18px] font-medium tracking-[-0.27px] text-[#8F93FE]">
              {row.label}
            </span>
            <span className="break-all text-base text-[#C5C9CC]">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
