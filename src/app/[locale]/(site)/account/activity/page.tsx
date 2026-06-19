"use client";

import { useI18n } from "@/lib/i18n/I18nProvider";
import { AccountTabs } from "@/components/account/AccountTabs";


export default function AccountActivityPage() {
  const { t } = useI18n();

  return (
    <div className="">
      {/* <AccountTabs active="activity" /> */}

      <div className="mt-6 space-y-3 rounded-2xl border border-[#E8EDF3] bg-white p-4 shadow-sm  ">
        <h2 className="text-lg font-semibold text-gray-900 ">{t("account.menu.activity")}</h2>
        <p className="text-sm text-gray-700 ">{t("activityPage.comingSoon")}</p>
      </div>
    </div>
  );
}
