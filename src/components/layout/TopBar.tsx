"use client";

import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  BarChart3,
  Bell,
  ChevronDown,
  Globe2,
  TrendingUp,
  User,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { LocaleDropdown } from "./LocaleDropdown";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { withLocale } from "@/lib/i18n/href";
import { ModalName, useModalStore } from "@/stores/useModalStore";
import { clearAuthSession } from "@/lib/auth/clientSession";
import { invalidateSession } from "@/lib/api/session";
import { HamburgerIcon } from "./HamburgerIcon";
import { MobileMenu } from "./MobileMenu";
import { NavLink } from "./topbar/NavLink";
import { TransactionsNav } from "./topbar/TransactionsNav";
import { cn } from "@/lib/utils";
import { getInternalPath } from "@/lib/i18n/navigation";

type NavItem = {
  label: string;
  href: string;
  activeInternalPrefix?: string;
  active?: boolean;
};

const siteNavItems: Array<{
  labelKey: string;
  href: string;
  hasDropdown?: boolean;
}> = [
  { labelKey: "header.buyCrypto", href: "/" },
  { labelKey: "header.market", href: "/markets" },
  { labelKey: "header.trade", href: "/trade", hasDropdown: true },
  { labelKey: "header.blog", href: "/" },
] as const;

function buildTradeMenuItems(t: (key: string) => string) {
  return [
    {
      icon: Zap,
      title: t("header.tradeMenu.easyTrade"),
      desc: t("header.tradeMenu.easyTradeDesc"),
      href: "/trade/easy",
    },
    {
      icon: BarChart3,
      title: t("header.tradeMenu.spotTrade"),
      desc: t("header.tradeMenu.spotTradeDesc"),
      href: "/trade/spot",
    },
    {
      icon: TrendingUp,
      title: t("header.tradeMenu.futureTrade"),
      desc: t("header.tradeMenu.futureTradeDesc"),
      href: "/trade/future",
    },
  ];
}

export function Topbar({ isAuthenticated }: { isAuthenticated: boolean }) {
  const pathname = usePathname() || "/";
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const { t } = useI18n();
  const router = useRouter();
  const openModal = useModalStore((state) => state.openModal);
  const [authed, setAuthed] = useState(isAuthenticated);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      invalidateSession();
      clearAuthSession();
      setAuthed(false);
      router.push(withLocale("/auth/login", locale));
      router.refresh();
    }
  };

  const internalPath = getInternalPath(pathname);
  const isHome = internalPath === "/";
  const isPublicMarket = internalPath.startsWith("/markets");
  const isPublicSpotDetail = internalPath.startsWith("/trade/spot");

  if ((isHome || isPublicMarket || isPublicSpotDetail) && !authed) {
    return (
      <SiteTopbar
        locale={locale}
        t={t}
        router={router}
        pathname={pathname}
        isAuthenticated={authed}
        onLogout={handleLogout}
        openModal={openModal}
      />
    );
  }

  return (
    <DashboardTopbar
      locale={locale}
      pathname={pathname}
      openModal={openModal}
      t={t}
      onLogout={handleLogout}
    />
  );
}

function SiteTopbar({
  locale,
  t,
  router,
  pathname,
  isAuthenticated,
  onLogout,
  openModal,
}: {
  locale: string;
  t: (key: string) => string;
  router: ReturnType<typeof useRouter>;
  pathname: string;
  isAuthenticated: boolean;
  onLogout: () => void;
  openModal: (name: Exclude<ModalName, null>, data?: unknown) => void;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTradeMenuOpen, setIsTradeMenuOpen] = useState(false);

  const tradeMenuItems = buildTradeMenuItems(t);

  const handleAuthClick = () => {
    if (isAuthenticated) {
      onLogout();
      setIsMenuOpen(false);
      return;
    }
    const target = withLocale("/auth/login", locale);
    router.push(target);
    router.refresh();
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#182121]">
      <div className="mx-auto flex h-[84px] max-w-[1392px] items-center justify-between gap-6 px-6 sm:px-8 lg:px-14">
        <Link href={withLocale("/", locale)} className="flex shrink-0 items-center text-white">
          <span className="font-satoshi text-[28px] font-black leading-none tracking-[0.01em] sm:text-[37px]">
            OTCN
          </span>
          <span className="ml-1.5 mt-[-18px] h-1.5 w-1.5 rounded-full bg-white sm:mt-[-24px] sm:h-2 sm:w-2" />
        </Link>

        <nav className="hidden flex-1 items-center gap-11 pl-6 text-[16px] font-medium text-white/90 lg:flex xl:pl-9">
          {siteNavItems.map((item) =>
            item.hasDropdown ? (
              <div
                key={item.labelKey}
                className="relative"
                onMouseEnter={() => setIsTradeMenuOpen(true)}
                onMouseLeave={() => setIsTradeMenuOpen(false)}
              >
                <button
                  type="button"
                  className={cn(
                    "flex items-center gap-2 whitespace-nowrap transition-colors hover:text-white",
                    getInternalPath(pathname).startsWith(item.href) && "text-[#8F93FE]",
                  )}
                >
                  {t(item.labelKey)}
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 stroke-[1.75] transition-transform",
                      isTradeMenuOpen && "rotate-180",
                    )}
                  />
                </button>

                {isTradeMenuOpen && (
                  <div className="absolute left-0 top-full z-50 w-80 pt-3 text-left">
                    <div className="space-y-1 rounded-2xl border border-[#E8EDF3] bg-white p-3 shadow-xl">
                      {tradeMenuItems.map((menuItem) => (
                        <Link
                          key={menuItem.title}
                          href={withLocale(menuItem.href, locale)}
                          onClick={() => setIsTradeMenuOpen(false)}
                          className="flex items-start gap-3 rounded-xl px-3 py-2.5 transition hover:bg-gray-200"
                        >
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F4F2FF] text-[#5932D1]">
                            <menuItem.icon className="h-5 w-5" />
                          </span>
                          <span>
                            <span className="block text-sm font-semibold text-gray-900">
                              {menuItem.title}
                            </span>
                            <span className="mt-0.5 block text-xs font-normal text-gray-500">
                              {menuItem.desc}
                            </span>
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.labelKey}
                href={withLocale(item.href, locale)}
                className={cn(
                  "flex items-center gap-2 whitespace-nowrap transition-colors hover:text-white",
                  getInternalPath(pathname).startsWith(item.href) &&
                    item.href !== "/" &&
                    "text-[#8F93FE]",
                )}
              >
                {t(item.labelKey)}
              </Link>
            ),
          )}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Button
            variant="outline"
            size="default"
            className="h-11 min-w-20 border-white/90 bg-transparent px-5 text-[14px] font-semibold text-white shadow-none hover:bg-white/10 hover:ring-0"
            onClick={handleAuthClick}
          >
            {isAuthenticated ? t("auth.logout") : t("auth.login")}
          </Button>

          <Button
            size="default"
            className="h-11 min-w-[92px] border-0 bg-[#C8FF00] px-5 text-[14px] font-bold text-black shadow-none hover:bg-[#B7EA00]"
            onClick={() => {
              const isHomePage = pathname === "/" || pathname === `/${locale}`;
              if (isHomePage) {
                window.dispatchEvent(new Event("trigger-register-shake"));
                return;
              }
              const target = withLocale("/auth/register", locale);
              router.push(target);
              router.refresh();
            }}
          >
            {t("auth.register")}
          </Button>

          <LocaleDropdown
            initialLocale={locale}
            variant="ghost"
            className="text-white"
            triggerClassName="gap-2 text-[14px] font-medium text-white hover:text-white"
            align="right"
            icon={<Globe2 className="h-[18px] w-[18px]" />}
          />
        </div>

        <button
          type="button"
          aria-label="Menüyü aç"
          className="flex h-10 w-10 items-center justify-center text-white transition md:hidden"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <HamburgerIcon className="h-6 w-6 text-white" />
        </button>
      </div>

      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        isAuthenticated={isAuthenticated}
        locale={locale}
        t={t}
        onLogout={onLogout}
        pathname={pathname}
        openModal={openModal}
      />
    </header>
  );
}

function DashboardTopbar({
  locale,
  pathname,
  openModal,
  t,
  onLogout,
}: {
  locale: string;
  pathname: string;
  openModal: (name: Exclude<ModalName, null>, data?: unknown) => void;
  t: (key: string) => string;
  onLogout: () => void;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTradeOpen, setIsTradeOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const internalPath = getInternalPath(pathname);

  const navItems: NavItem[] = [
    { label: t("header.dashboard"), href: withLocale("/dashboard", locale), activeInternalPrefix: "/dashboard" },
    { label: t("header.wallet"), href: withLocale("/wallet", locale), activeInternalPrefix: "/wallet" },
    { label: t("header.trade"), href: withLocale("/trade/easy", locale), activeInternalPrefix: "/trade" },
    { label: t("header.market"), href: withLocale("/markets", locale), activeInternalPrefix: "/markets" },
    { label: t("header.transactions"), href: withLocale("/transaction/deposit-withdraw", locale), activeInternalPrefix: "/transaction" },
  ];

  const tradeMenuItems = buildTradeMenuItems(t);

  const navWithActive = navItems.map((item) => ({
    ...item,
    active: item.activeInternalPrefix
      ? internalPath.startsWith(item.activeInternalPrefix)
      : pathname.startsWith(item.href),
  }));

  const transactionLinks = [
    {
      href: withLocale("/transaction/deposit-withdraw", locale),
      title: t("header.txMenu.allTransactions"),
      desc: t("header.txMenu.allTransactionsDesc"),
    },
    {
      href: withLocale("/transaction/trade-orders", locale),
      title: t("header.txMenu.tradeOrders"),
      desc: t("header.txMenu.tradeOrdersDesc"),
    },
  ];

  const isAccountPage = pathname.includes("/account");

  return (
    <header
      className={[
        "sticky top-0 z-50 w-full bg-[#1C2425]",
        isAccountPage ? "hidden lg:block" : "",
      ].join(" ")}
    >
      <div className="relative mx-auto flex h-[84px] max-w-[1392px] items-center justify-between gap-3 px-6 lg:px-8 xl:gap-5">
        <div className="flex min-w-0 items-center gap-6 xl:gap-12">
          <Link href={withLocale("/", locale)} className="flex shrink-0 items-center text-white">
            <span className="font-satoshi text-[28px] font-black leading-none tracking-[0.01em] sm:text-[37px]">
              OTCN
            </span>
            <span className="ml-1.5 mt-[-18px] h-1.5 w-1.5 rounded-full bg-white sm:mt-[-24px] sm:h-2 sm:w-2" />
          </Link>

          <div className="hidden min-w-0 items-center gap-4 lg:flex xl:gap-9">
            {navWithActive.map((item) =>
              item.activeInternalPrefix === "/transaction" ? (
                <TransactionsNav
                  key={item.label}
                  label={item.label}
                  active={item.active}
                  links={transactionLinks.map((link) => ({
                    href: link.href,
                    title: link.title,
                    description: link.desc,
                  }))}
                  onNavigate={() => setIsMenuOpen(false)}
                />
              ) : item.label === t("header.trade") ? (
                <div key={item.label} className="relative">
                  <button
                    type="button"
                    onClick={() => setIsTradeOpen((prev) => !prev)}
                    className={cn(
                      "relative flex h-[42px] items-center gap-1.5 whitespace-nowrap text-[16px] font-medium text-white/90 transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-[#8F84FF] xl:gap-2",
                      item.active ? "text-[#9B91FF] after:w-full" : "hover:text-white after:w-0",
                    )}
                  >
                    {item.label}
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  {isTradeOpen && (
                    <div className="absolute left-0 top-full z-50 mt-2 w-80 text-left">
                      <div className="space-y-1 rounded-2xl border border-[#E8EDF3] bg-white p-3 shadow-xl dark:border-gray-700 dark:bg-gray-900">
                        {tradeMenuItems.map((menuItem) => (
                          <Link
                            key={menuItem.title}
                            href={withLocale(menuItem.href, locale)}
                            onClick={() => {
                              setIsTradeOpen(false);
                              setIsMenuOpen(false);
                            }}
                            className="flex items-start gap-3 rounded-xl px-3 py-2.5 transition hover:bg-gray-50 dark:hover:bg-gray-800"
                          >
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F4F2FF] text-[#5932D1]">
                              <menuItem.icon className="h-5 w-5" />
                            </span>
                            <span>
                              <span className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
                                {menuItem.title}
                              </span>
                              <span className="mt-0.5 block text-xs font-normal text-gray-500 dark:text-gray-300">
                                {menuItem.desc}
                              </span>
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <NavLink
                  key={item.label}
                  href={item.href}
                  label={item.label}
                  active={item.active}
                  onClick={() => setIsMenuOpen(false)}
                />
              ),
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 xl:gap-4">
          <div className="hidden items-center sm:flex">
            <Button
              variant="default"
              className="h-10 rounded-[11px] border-0 bg-[#C8FF00] px-4 text-[12px] font-bold text-black shadow-none hover:bg-[#B7EA00] xl:h-11 xl:rounded-[12px] xl:px-6 xl:text-[14px]"
              onClick={() => openModal("funds", { mode: "deposit" })}
            >
              {t("header.deposit")}
            </Button>
          </div>
          <div className="hidden items-center lg:flex">
            <LocaleDropdown
              initialLocale={locale}
              variant="ghost"
              className="text-white"
              triggerClassName="gap-2 text-[14px] font-medium text-white hover:text-white"
              align="right"
              icon={<Globe2 className="h-[18px] w-[18px]" />}
            />
          </div>
          <button
            type="button"
            aria-label={t("header.notifications")}
            className="relative hidden h-10 w-10 items-center justify-center text-white/90 transition hover:text-white sm:flex"
          >
            <Bell className="h-[18px] w-[18px] stroke-[1.6]" />
          </button>
          <div ref={profileMenuRef} className="relative flex">
            <Link
              href={withLocale("/account", locale)}
              className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[#F4F6F7] transition hover:ring-2 hover:ring-white/30 lg:hidden xl:h-12 xl:w-12"
              aria-label={t("account.menu.profile")}
            >
              <User className="h-5 w-5 text-gray-500" />
            </Link>

            <button
              type="button"
              aria-label={t("account.menu.profile")}
              className="hidden h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[#F4F6F7] transition hover:ring-2 hover:ring-white/30 lg:flex xl:h-12 xl:w-12"
              onClick={() => setIsProfileOpen((prev) => !prev)}
            >
              <User className="h-5 w-5 text-gray-500" />
            </button>

            <div
              className={cn(
                "absolute right-0 top-12 z-50 hidden lg:block w-72 rounded-[32px] border border-[#E8EDF3] bg-white p-4 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:border-gray-700 dark:bg-gray-900",
                "transition-all duration-300 ease-in-out origin-top-right",
                isProfileOpen
                  ? "opacity-100 scale-100 visible translate-y-0"
                  : "opacity-0 scale-95 invisible -translate-y-2 pointer-events-none"
              )}
            >
              <div className="space-y-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                {[
                  { label: t("account.menu.profile"), href: withLocale("/account/profile", locale) },
                  { label: t("account.menu.corporate"), href: withLocale("/account/account-info", locale) },
                  { label: t("account.menu.bank"), href: withLocale("/account/bank", locale) },
                  { label: t("account.menu.address"), href: withLocale("/account/address", locale) },
                  { label: t("account.menu.security"), href: withLocale("/account/security", locale) },
                  { label: t("account.menu.preferences"), href: withLocale("/account/preferences", locale) },
                ].map((item) => {
                  const isActive = pathname === item.href || (item.href === withLocale("/account", locale) && pathname === withLocale("/account/profile", locale));
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={cn(
                        "flex w-full items-center rounded-2xl px-4 py-3 text-left transition",
                        isActive
                          ? "bg-[#F4F2FF] text-[#5932D1]"
                          : "hover:bg-gray-50 dark:hover:bg-gray-800"
                      )}
                      onClick={() => setIsProfileOpen(false)}
                    >
                      {item.label}
                    </Link>
                  );
                })}
                <div className="my-2 h-px bg-[#F4F2FF]" />
                <button
                  type="button"
                  className="flex w-full items-center rounded-2xl px-4 py-3 text-left text-rose-500 transition hover:bg-rose-50"
                  onClick={() => {
                    setIsProfileOpen(false);
                    onLogout();
                  }}
                >
                  {t("auth.logout")}
                </button>
              </div>
            </div>
          </div>
          <button
            type="button"
            aria-label="Menüyü aç"
            className="flex h-10 w-10 items-center justify-center text-gray-700 transition lg:hidden"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <HamburgerIcon className="h-6 w-6 text-gray-700 dark:text-gray-100" />
          </button>
        </div>

        <MobileMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          isAuthenticated={true}
          locale={locale}
          t={t}
          onLogout={onLogout}
          pathname={pathname}
          openModal={openModal}
        />
      </div>
    </header>
  );
}
