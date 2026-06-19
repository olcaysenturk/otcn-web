"use client";

import { useI18n } from "@/lib/i18n/I18nProvider";

export function ReturnUserPanel() {
  const { t } = useI18n();
  return (
    <div className="space-y-8 mt-5">
      <div className="min-h-40 bg-gray-400 rounded-2xl"></div>

      <div>
        <h3 className="text-xl font-extrabold text-gray-900">
          {t("auth.returnUser.title")}
        </h3>
        <p className="mt-2 text-sm text-gray-700">
          {t("auth.returnUser.subtitle")}
        </p>
      </div>
    </div>
  );
}
