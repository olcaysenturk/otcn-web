"use client";

import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { withLocale } from "@/lib/i18n/href";

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
  // True on the account menu root (/account) — its own screen on mobile; no sub-header.
  const isMenuRoot = /\/account\/?$/.test(pathname);

  const goTab = (key: string) => {
    const tab = ACCOUNT_NAV.find((x) => x.key === key);
    if (tab) router.push(withLocale(tab.path, locale));
  };

  return (
    <>
      {/* Mobile sub-page header (Figma lime bar) — sub-pages only */}
      {!isMenuRoot && (
        <div className="-mx-3 -mt-3 mb-2 flex items-center gap-2 bg-[#f54a14] px-5 py-2 md:hidden">
          <button
            type="button"
            aria-label="back"
            onClick={() => router.push(withLocale("/account", locale))}
            className="flex h-10 w-10 items-center justify-center text-[#0E0F10]"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <span className="text-base font-semibold text-[#0E0F10]">{t(`account.menu.${active}`)}</span>
        </div>
      )}

      <div className="md:space-y-6 md:rounded-[28px] md:border md:border-[#0E0F10] md:bg-[#0E0F10]/40 md:p-6">
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

        {/* Mobile: dark settings background; desktop: transparent (card provides its own bg). */}
        <div className="-mx-3 min-h-[60vh] bg-[#191D1E] px-3 py-4 md:mx-0 md:min-h-0 md:bg-transparent md:p-0">
          {children}
        </div>
      </div>
    </>
  );
}
