"use client";

import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { withLocale } from "@/lib/i18n/href";

/**
 * Account/profile section tabs (Figma "Profil Navigation Tab"). Each routes to its
 * sub-page; active = current route. Living in this route-segment LAYOUT (not the
 * pages) keeps the TabsList mounted across navigations, so the animated pill
 * slides instead of remounting. Hidden on mobile (navigation via the account menu).
 */
const ACCOUNT_NAV = [
  { key: "profile", path: "/account/profile" },
  { key: "corporate", path: "/account/account-info" },
  { key: "bank", path: "/account/bank" },
  { key: "address", path: "/account/address" },
  { key: "security", path: "/account/security" },
  { key: "user", path: "/account/user" },
  { key: "reports", path: "/account/reports" },
  { key: "activity", path: "/account/activity" },
  { key: "notification", path: "/account/notification" },
  { key: "preferences", path: "/account/preferences" },
] as const;

export default function AccountLayout({ children }: { children: ReactNode }) {
  const { t, locale } = useI18n();
  const router = useRouter();
  const pathname = usePathname() || "";

  const active = ACCOUNT_NAV.find((tab) => pathname.includes(tab.path))?.key ?? "profile";

  const goTab = (key: string) => {
    const tab = ACCOUNT_NAV.find((x) => x.key === key);
    if (tab) router.push(withLocale(tab.path, locale));
  };

  return (
    <div className="space-y-6 rounded-[28px] border border-[#0E0F10] bg-[#0E0F10]/40 p-4 md:p-6">
      {/* Header + tabs are desktop-only; mobile navigates via the account menu. */}
      <div className="hidden flex-col gap-1 md:flex">
        <h1 className="text-[24px] font-medium leading-tight tracking-[-0.48px] text-[#F4F7F8]">
          {t("accountHeader.title")}
        </h1>
        <p className="text-base text-[#C5C9CC]">{t("accountHeader.description")}</p>
      </div>

      <div className="hidden overflow-x-auto no-scrollbar md:block">
        <Tabs value={active} onValueChange={goTab} className="w-max">
          <TabsList animated className="h-auto w-max gap-0.5 rounded-[14px] p-1">
            {ACCOUNT_NAV.map((tab) => (
              <TabsTrigger
                key={tab.key}
                value={tab.key}
                className="whitespace-nowrap rounded-[12px] px-5 py-2 text-base tracking-[-0.16px]"
              >
                {t(`account.menu.${tab.key}`)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {children}
    </div>
  );
}
