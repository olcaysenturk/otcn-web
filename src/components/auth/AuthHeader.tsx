"use client";

import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { LocaleDropdown } from "../layout/LocaleDropdown";

export function AuthHeader() {
    const { locale } = useI18n();
    const router = useRouter();

    const handleLogoClick = (e: React.MouseEvent) => {
        e.preventDefault();
        sessionStorage.clear();
        router.push(`/${locale}`);
    };

    return (
        <header className="absolute top-0 left-0 right-0 z-50 flex h-20 items-center justify-between bg-[#0D0F10] px-5 py-3 md:px-12 md:py-4">
            <div className="hidden lg:flex"></div>
            <div className="lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2">
                <button
                    onClick={handleLogoClick}
                    className="cursor-pointer border-none bg-transparent p-0 text-[27px] font-bold leading-none tracking-[-1px] text-[#F4F7F8]"
                >
                    OTCN
                </button>
            </div>
            <LocaleDropdown
                initialLocale={locale}
                variant="ghost"
                align="right"
                triggerClassName="text-[#F4F7F8] hover:text-white"
            />
        </header>
    );
}
