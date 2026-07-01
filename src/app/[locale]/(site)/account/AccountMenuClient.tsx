"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

import { useI18n } from "@/lib/i18n/I18nProvider";
import { withLocale } from "@/lib/i18n/href";
import { ACCOUNT_TABS, ACCOUNT_TAB_PATH } from "@/components/account/AccountTabs";

export default function AccountMenuClient() {
    const { t, locale } = useI18n();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Basic check for desktop to redirect
        if (typeof window !== "undefined" && window.innerWidth >= 1024) {
            router.replace(withLocale("/account/profile", locale));
        }
    }, [router, locale]);

    if (!mounted) return null;

    // Labels mapping
    const labels: Record<string, string> = {
        profile: t("account.menu.profile"),
        corporate: t("account.menu.corporate"),
        bank: t("account.menu.bank"),
        address: t("account.menu.address"),
        security: t("account.menu.security"),
        preferences: t("account.menu.preferences"),
    };

    return (
        <div className="fixed inset-0 z-1000 flex flex-col p-2 pb-0 bg-[#0F1415] lg:hidden">
            {/* Mobile Header */}
            <div className="flex items-center justify-between px-4 py-4 text-white">
                <h1 className="text-lg font-semibold">{t("accountHeader.title")}</h1>
                <button
                    className="rounded p-1 hover:bg-white/10"
                    onClick={() => router.push(withLocale("/dashboard", locale))}
                >
                    <X className="h-6 w-6" />
                </button>
            </div>

            {/* Menu List */}
            <div className="flex-1 overflow-y-auto p-4 bg-[#1C2425] rounded-t-2xl">
                {ACCOUNT_TABS.map((key) => (
                    <button
                        key={key}
                        onClick={() => router.push(withLocale(ACCOUNT_TAB_PATH[key] ?? "/account", locale))}
                        className="flex w-full items-center justify-between py-4 text-left border-b border-white/10 last:border-0"
                    >
                        <span className="text-base font-medium text-white">{labels[key]}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
