"use client";

import { useI18n } from "@/lib/i18n/I18nProvider";
import { AccountTabs } from "@/components/account/AccountTabs";

export default function AccountNotificationPage() {
  const { t } = useI18n();

  return (
    <div className="">
      {/* <AccountTabs active="notification" /> */}

      <div className="mt-6 rounded-2xl border border-[#E8EDF3] bg-white p-4 shadow-sm  ">
        <h2 className="text-lg font-semibold text-gray-900 ">{t("notificationPage.title")}</h2>

        <div className="mt-4 rounded-2xl bg-gray-100/80 px-4 py-4 text-sm text-gray-800  ">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-700 shadow-sm ring-1 ring-gray-200   ">
                🔕
              </div>
              <div>
                <p className="text-base font-semibold">{t("notificationPage.blockedTitle")}</p>
                <p className="text-sm text-gray-700 ">{t("notificationPage.blockedDesc")}</p>
              </div>
            </div>
            <button className="rounded-xl bg-gradient-to-r from-slate-200 via-white to-slate-200 px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm transition hover:opacity-90    ">
              {t("notificationPage.enable")}
            </button>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between rounded-2xl border border-gray-100 px-4 py-4 text-sm ">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 ">
                {t("notificationPage.preferenceTitle")}
              </p>
              <p className="text-sm font-semibold text-gray-900 ">{t("notificationPage.preferenceValue")}</p>
              <p className="text-sm text-gray-600 ">{t("notificationPage.preferenceDesc")}</p>
            </div>
            <button className="flex items-center gap-2 rounded-lg border border-[#E8EDF3] bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50    ">
              {t("notificationPage.edit")}
            </button>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-gray-100 px-4 py-4 text-sm ">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 ">
                {t("notificationPage.customizeTitle")}
              </p>
              <p className="text-sm font-semibold text-gray-900 ">{t("notificationPage.customizeDesc")}</p>
            </div>
            <button className="flex items-center gap-2 rounded-lg border border-[#E8EDF3] bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50    ">
              {t("notificationPage.edit")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
