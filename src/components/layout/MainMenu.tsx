"use client";

import type { MouseEvent } from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";

import { useI18n } from "@/lib/i18n/I18nProvider";
import { withLocale } from "@/lib/i18n/href";
import { mainMenuList } from "@/config/main-menu-list";
import { cn } from "@/lib/utils";

type MainMenuProps = {
  className?: string;
};

export function MainMenu({ className }: MainMenuProps) {
  const pathname = usePathname();
  const params = useParams();
  const { t, locale: fallbackLocale } = useI18n();

  const currentLocale = (params?.locale as string) || fallbackLocale || "en";
  const homePath = `/${currentLocale}`;

  const handleAnchorClick = (event: MouseEvent<HTMLAnchorElement>, hash: string) => {
    if (pathname === homePath) {
      event.preventDefault();
      const target = document.getElementById(hash);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <nav className={cn("flex items-center gap-6 text-sm", className)}>
      {mainMenuList.map((item) => {
        const isAnchor = item.path.startsWith("#");
        const href = isAnchor
          ? `${homePath}${item.path}`
          : withLocale(item.path, currentLocale);

        const isActive = pathname === homePath && item.path === "#experience";

        return (
          <Link
            key={item.key}
            href={href}
            onClick={(e) => {
              if (isAnchor && pathname === homePath) {
                const hash = item.path.replace("#", "");
                handleAnchorClick(e, hash);
              }
            }}
            className={[
              "relative font-medium transition-colors",
              isActive
                ? "text-[#1D1534]"
                : "text-[#6F6A82] hover:text-[#1D1534]",
            ].join(" ")}
          >
            {t(item.key)}
          </Link>
        );
      })}
    </nav>
  );
}
