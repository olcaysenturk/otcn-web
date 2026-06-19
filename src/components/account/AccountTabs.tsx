"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";

import { useI18n } from "@/lib/i18n/I18nProvider";
import { withLocale } from "@/lib/i18n/href";

export const ACCOUNT_TABS = [
  "profile",
  "corporate",
  "bank",
  "address",
  "security",
  "preferences",
] as const;

export const ACCOUNT_TAB_PATH: Record<(typeof ACCOUNT_TABS)[number], string> = {
  profile: "/account/profile",
  corporate: "/account/account-info",
  bank: "/account/bank",
  address: "/account/address",
  security: "/account/security",
  preferences: "/account/preferences",
};

export function AccountTabs({ active }: { active: (typeof ACCOUNT_TABS)[number] }) {
  const { t, locale } = useI18n();
  const router = useRouter();

  const labels = useMemo(
    () => ({
      profile: t("account.menu.profile"),
      corporate: t("account.menu.corporate"),
      bank: t("account.menu.bank"),
      address: t("account.menu.address"),
      security: t("account.menu.security"),
      preferences: t("account.menu.preferences"),
    }),
    [t],
  );

  const goTab = (key: (typeof ACCOUNT_TABS)[number]) => router.push(withLocale(ACCOUNT_TAB_PATH[key] ?? "/account", locale));

  return (
    <div className="hidden w-full md:flex flex-wrap gap-1 overflow-x-auto no-scrollbar">
      {ACCOUNT_TABS.map((key) => (
        <button
          key={key}
          onClick={() => goTab(key)}
          className={[
            "shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200",
            key === active
              ? "bg-white text-[#0F1415] shadow-sm"
              : "text-gray-400 hover:text-white",
          ].join(" ")}
        >
          {labels[key]}
        </button>
      ))}
    </div>
  );
}
