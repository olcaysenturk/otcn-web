"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AccountTabs } from "@/components/account/AccountTabs";
import { AccountHeader } from "@/components/account/AccountHeader";
import { PageCard } from "@/components/ui/page-card";
import { ResponsivePageWrapper } from "@/components/ui/responsive-page-wrapper";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { withLocale } from "@/lib/i18n/href";
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

  return (
    <PageCard>
      <ResponsivePageWrapper>
        {/* Mobile Header */}
        <div className="flex items-center gap-3 bg-[#0F1415] p-4 text-white lg:hidden mb-6">
          <Link href={withLocale("/account", locale)} className="rounded p-1 hover:bg-white/10">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <span className="text-lg font-semibold">{t("preferencesPage.title")}</span>
        </div>

        {/* Desktop Header */}
        <AccountHeader
          title={t("accountHeader.title")}
          description={t("accountHeader.description")}
        />

        <div className="hidden lg:block">
          <AccountTabs active="preferences" />
        </div>

        {/* Preferences Content Card */}
        <div className="bg-[#1C2425] rounded-t-[32px] p-6 lg:p-8 border border-white/10 min-h-[calc(100vh-94px)]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-semibold text-white md:text-lg">{t("preferencesPage.title")}</h2>
            <button
              type="button"
              onClick={() => openModal("account-preferences")}
              className="flex items-center gap-2 rounded-full border border-white/20 bg-transparent px-4 h-10 text-xs font-semibold text-white hover:bg-white/5 transition-colors md:h-11 md:px-6 md:text-sm"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                <path d="M2 11.5V14H4.5L11.8733 6.62667L9.37333 4.12667L2 11.5ZM13.8067 4.69333C14.0667 4.43333 14.0667 4.01333 13.8067 3.75333L12.2467 2.19333C11.9867 1.93333 11.5667 1.93333 11.3067 2.19333L10.0867 3.41333L12.5867 5.91333L13.8067 4.69333Z" fill="currentColor" />
              </svg>
              {t("preferencesPage.edit")}
            </button>
          </div>

          <div className="space-y-1">
            {[
              { key: "timezone", label: t("preferencesPage.timezone"), content: contentLabels.timezone },
              { key: "currency", label: t("preferencesPage.currency"), content: contentLabels.currency },
              { key: "language", label: t("preferencesPage.language"), content: contentLabels.language },
              { key: "numberFormat", label: t("preferencesPage.numberFormat"), content: contentLabels.numberFormat },
            ].map((row) => (
              <div
                key={row.key}
                className="flex flex-col gap-2 border-b border-white/10 py-5 last:border-b-0 lg:grid lg:grid-cols-[240px_1fr] lg:gap-0 lg:items-center"
              >
                <span className="text-sm font-medium text-[#9B91FF]">{row.label}</span>
                <div className="text-sm text-gray-300">{row.content}</div>
              </div>
            ))}
          </div>
        </div>
      </ResponsivePageWrapper>
    </PageCard>
  );
}
