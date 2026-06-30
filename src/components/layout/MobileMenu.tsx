"use client";

import { useEffect, useState } from "react";
import type { MouseEvent } from "react";
import { X, ChevronRight, LayoutDashboard, CandlestickChart, ReceiptText, Wallet, User, Bell, Globe, ChevronDown, ChartNoAxesCombined } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { withLocale } from "@/lib/i18n/href";
import { getInternalPath, switchLocalePath } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";
import type { ModalName } from "@/stores/useModalStore";

import { mainMenuList } from "@/config/main-menu-list";

type MobileMenuProps = {
    isOpen: boolean;
    onClose: () => void;
    isAuthenticated: boolean;
    locale: string;
    t: (key: string) => string;
    onLogout: () => void;
    pathname: string;
    openModal?: (name: Exclude<ModalName, null>, data?: unknown) => void;
};

type SubNavItem = {
    label: string;
    href: string;
};

type NavItem = {
    label: string;
    href?: string;
    icon?: LucideIcon;
    isAnchor?: boolean;
    isExpandable?: boolean;
    isOpen?: boolean;
    setOpen?: (open: boolean) => void;
    subItems?: SubNavItem[];
};

export function MobileMenu({
    isOpen,
    onClose,
    isAuthenticated,
    locale,
    t,
    onLogout,
    pathname,
    openModal,
}: MobileMenuProps) {
    const router = useRouter();
    const currentPathname = usePathname();
    const internalPath = getInternalPath(pathname);
    const [isTransactionsOpen, setIsTransactionsOpen] = useState(false);
    const [isTradeOpen, setIsTradeOpen] = useState(false);
    const [isLanguageOpen, setIsLanguageOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleNav = (href: string) => {
        router.push(withLocale(href, locale));
        onClose();
    };

    const handleAnchorClick = (e: MouseEvent, hash: string) => {
        e.preventDefault();
        const elementId = hash.startsWith("#") ? hash.substring(1) : hash;
        const element = document.getElementById(elementId);

        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
            onClose();
        } else {
            // If not on homepage, redirect to home with hash
            router.push(withLocale(`/${hash}`, locale));
            onClose();
        }
    };

    const handleLocaleChange = (nextLocale: string) => {
        if (!currentPathname) return;
        const nextPath = switchLocalePath(currentPathname, nextLocale);
        router.push(nextPath);
        router.refresh();
        onClose();
    };

    const authNavItems: NavItem[] = [
        { label: t("header.overview"), href: "/dashboard", icon: LayoutDashboard },
        {
            label: t("header.trade"),
            icon: CandlestickChart,
            isExpandable: true,
            isOpen: isTradeOpen,
            setOpen: setIsTradeOpen,
            subItems: [
                { label: t("header.tradeMenu.easyTrade"), href: "/trade/easy" },
                { label: t("header.tradeMenu.spotTrade"), href: "/trade/spot" },
                { label: t("header.tradeMenu.futureTrade"), href: "/trade/future" },
            ]
        },
        { label: t("header.market"), href: "/markets", icon: ChartNoAxesCombined },
        {
            label: t("header.transactions"),
            icon: ReceiptText,
            isExpandable: true,
            isOpen: isTransactionsOpen,
            setOpen: setIsTransactionsOpen,
            subItems: [
                { label: t("header.txMenu.allTransactions"), href: "/transaction/deposit-withdraw" },
                { label: t("header.txMenu.tradeOrders"), href: "/transaction/trade-orders" },
            ]
        },
        { label: t("header.wallet"), href: "/wallet", icon: Wallet },
    ];

    const guestNavItems: NavItem[] = mainMenuList.map(item => ({
        label: t(item.key),
        href: item.path,
        isAnchor: item.path.startsWith("#")
    }));

    const navItems = isAuthenticated ? authNavItems : guestNavItems;

    return (
        <div className="fixed inset-0 z-1000 flex flex-col bg-[#182121] animate-in fade-in duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4">
                <Link href={withLocale("/", locale)} onClick={onClose} className="flex shrink-0 items-center text-white">
                    <span className="font-satoshi text-[28px] font-black leading-none tracking-[0.01em]">
                        OTCN
                    </span>
                    <span className="ml-1.5 -mt-4.5 h-1.5 w-1.5 rounded-full bg-white" />
                </Link>
                <button
                    onClick={onClose}
                    className="p-2 text-white/60 hover:text-white transition"
                >
                    <X className="h-6 w-6" />
                </button>
            </div>

            {/* Menu Card */}
            <div className="mx-4 mb-4 flex-1 overflow-hidden flex flex-col bg-[#1C2425] rounded-[32px] border border-white/10">
                <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
                    <div className="space-y-1">
                        {navItems.map((item) => (
                            <div key={item.label}>
                                {(() => {
                                    const isActive = item.isExpandable
                                        ? item.subItems?.some((sub) => internalPath.startsWith(sub.href))
                                        : !!item.href && internalPath.startsWith(item.href);
                                    return (
                                <button
                                    onClick={(e) => {
                                        if (item.isExpandable) {
                                            item.setOpen?.(!item.isOpen);
                                        } else if (item.isAnchor && item.href) {
                                            handleAnchorClick(e, item.href);
                                        } else if (item.href) {
                                            handleNav(item.href);
                                        }
                                    }}
                                    className={cn(
                                        "flex w-full items-center justify-between py-4 text-left group transition-colors",
                                        isActive ? "text-white" : "text-gray-400"
                                    )}
                                >
                                    <span className="text-[17px] font-medium leading-6">{item.label}</span>
                                    {item.isExpandable ? (
                                        <ChevronDown className={cn("h-5 w-5 text-gray-500 transition-transform", item.isOpen && "rotate-180")} />
                                    ) : (
                                        <ChevronRight className="h-5 w-5 text-gray-500 group-hover:translate-x-0.5 transition-transform" />
                                    )}
                                </button>
                                    );
                                })()}
                                {item.isExpandable && item.isOpen && (
                                    <div className="pl-4 pb-2 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
                                        {item.subItems?.map((sub) => (
                                            <button
                                                key={sub.label}
                                                onClick={() => handleNav(sub.href)}
                                                className="block w-full text-left py-2 text-base font-medium text-gray-400 hover:text-white"
                                            >
                                                {sub.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        <div className="my-2 h-px bg-white/10" />

                        {isAuthenticated && (
                            <>
                                <button
                                    onClick={() => handleNav("/account/profile")}
                                    className="flex w-full items-center gap-3 py-4 text-left text-gray-400"
                                >
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/10 overflow-hidden">
                                        <User className="h-5 w-5 text-gray-300" />
                                    </div>
                                    <span className="text-[17px] font-medium leading-6">{t("account.menu.profile")}</span>
                                </button>

                                <button
                                    onClick={() => handleNav("/dashboard")}
                                    className="flex w-full items-center gap-3 py-4 text-left text-gray-400"
                                >
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5">
                                        <Bell className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <span className="text-[17px] font-medium leading-6">{t("header.notifications")}</span>
                                </button>
                            </>
                        )}

                        <button
                            onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                            className="flex w-full items-center justify-between py-4 text-left text-gray-400"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5">
                                    <Globe className="h-5 w-5 text-gray-400" />
                                </div>
                                <span className="text-[17px] font-medium leading-6 uppercase">{locale}</span>
                            </div>
                            <ChevronDown className={cn("h-5 w-5 text-gray-500 transition-transform", isLanguageOpen && "rotate-180")} />
                        </button>
                        {isLanguageOpen && (
                            <div className="pl-13 pb-2 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
                                {["en", "pt", "es", "ru"].map((loc) => (
                                    <button
                                        key={loc}
                                        onClick={() => handleLocaleChange(loc)}
                                        className={cn(
                                            "block w-full text-left py-2 text-base font-medium transition-colors",
                                            locale === loc ? "text-white" : "text-gray-400 hover:text-white"
                                        )}
                                    >
                                        {{ en: "English", pt: "Português", es: "Español", ru: "Русский" }[loc]}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Action */}
                <div className="p-6 pt-2">
                    {isAuthenticated ? (
                        <div className="flex flex-col gap-3">
                            <Button
                                variant="outline"
                                className="w-full h-14 rounded-full border-white/20 text-white hover:bg-white/5 text-lg font-semibold bg-transparent"
                                onClick={() => {
                                    onLogout();
                                    onClose();
                                }}
                            >
                                {t("auth.logout")}
                            </Button>
                            <Button
                                className="w-full h-14 rounded-full bg-primary hover:bg-[#B7EA00] text-lg font-bold text-black shadow-none transition-all"
                                onClick={() => {
                                    if (openModal) {
                                        openModal("funds", { mode: "deposit" });
                                    }
                                    onClose();
                                }}
                            >
                                {t("header.deposit")}
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            <Button
                                variant="outline"
                                className="w-full h-14 rounded-full border-white/20 text-white hover:bg-white/5 text-lg font-semibold bg-transparent"
                                onClick={() => handleNav("/auth/register")}
                            >
                                {t("auth.register")}
                            </Button>
                            <Button
                                className="w-full h-14 rounded-full bg-primary hover:bg-[#B7EA00] text-lg font-bold text-black"
                                onClick={() => handleNav("/auth/login")}
                            >
                                {t("auth.login")}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
