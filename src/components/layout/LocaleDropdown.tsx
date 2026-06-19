"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { ChevronDown, ChevronUp } from "lucide-react";

import { cn } from "@/lib/utils";
import { SvgIcon } from "@/components/ui/svg-icon";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { switchLocalePath } from "@/lib/i18n/navigation";

const LOCALES = [
  { value: "en", label: "EN" },
  { value: "pt", label: "PT" },
  { value: "es", label: "ES" },
  { value: "ru", label: "RU" },
] as const;

type LocaleValue = (typeof LOCALES)[number]["value"];

function isLocaleValue(value: string): value is LocaleValue {
  return LOCALES.some((localeOption) => localeOption.value === value);
}

export function LocaleDropdown({
  className = "",
  initialLocale,
  variant = "default",
  triggerClassName,
  align = "left",
  icon,
}: {
  className?: string;
  initialLocale?: string;
  variant?: "default" | "ghost";
  triggerClassName?: string;
  align?: "left" | "right";
  icon?: ReactNode;
}) {
  const router = useRouter();
  const { t } = useI18n();
  const pathname = usePathname();
  const params = useParams();
  const currentLocaleRaw = (params?.locale as string) || initialLocale || "en";
  // If params.locale captures "login" or similar, fallback to "en"
  const currentLocale = isLocaleValue(currentLocaleRaw)
    ? currentLocaleRaw
    : "en";

  const displayLocale = currentLocale.toUpperCase();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("relative", className)} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "flex items-center gap-2 rounded-xl text-sm font-semibold text-gray-800 transition dark:text-gray-100",
          variant === "default" && "px-4 py-2 border border-[#E8EDF3] bg-white shadow-[0_6px_18px_rgba(0,0,0,0.08)] hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700",
          variant === "ghost" && "bg-transparent p-0",
          triggerClassName,
        )}
        aria-label={t("common.locale.changeLanguage")}
      >
        {icon ?? <SvgIcon name="globe" size={16} decorative />}
        <span>{displayLocale}</span>
        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {open && (
        <div
          className={cn(
            "absolute z-[1000] mt-2 w-28 rounded-lg border border-[#E8EDF3] bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800",
            align === "right" ? "right-0" : "left-0",
          )}
        >
          {LOCALES.map((loc) => (
            <button
              key={loc.value}
              type="button"
              onClick={() => {
                setOpen(false);
                const nextPath = switchLocalePath(pathname || "/", loc.value);
                router.push(nextPath);
                router.refresh();
              }}
              className={cn(
                "flex w-full items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700",
                currentLocale === loc.value && "font-semibold text-gray-900 dark:text-white",
              )}
            >
              <span>{loc.label}</span>
              {currentLocale === loc.value && <span>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
