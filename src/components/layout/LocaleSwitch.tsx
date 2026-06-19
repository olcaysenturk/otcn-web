"use client";

import * as React from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe2 } from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nProvider";

const LOCALES = [
  { value: "en", label: "EN" },
  { value: "pt", label: "PT" },
  { value: "es", label: "ES" },
  { value: "ru", label: "RU" },
] as const;

import { switchLocalePath } from "@/lib/i18n/navigation";

export function LocaleSwitcher({ compact = false }: { compact?: boolean }) {
  const { t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const currentLocale = (params?.locale as string) || "en";

  return (
    <div className="flex items-center gap-2">
      <Select
        value={currentLocale}
        onValueChange={(nextLocale) => {
          const nextPath = switchLocalePath(pathname || "/", nextLocale);
          router.push(nextPath);
          router.refresh();
        }}
      >
        <SelectTrigger
          className={
            compact
              ? "h-10 min-w-[90px] rounded-xl border border-[#E8EDF3] bg-white px-3 text-sm font-semibold text-gray-800 shadow-[0_6px_18px_rgba(0,0,0,0.08)] hover:bg-gray-50    "
              : "rounded-4xl"
          }
        >
          {compact ? (
            <div className="flex items-center gap-2">
              <Globe2 className="h-4 w-4" />
              <span className="text-sm font-semibold">{currentLocale.toUpperCase()}</span>
              {/* <ChevronDown className="h-4 w-4" /> */}
            </div>
          ) : (
            <SelectValue placeholder={t("common.locale.selectLanguage")} />
          )}
        </SelectTrigger>
        <SelectContent className="rounded-2xl border border-[#E8EDF3] shadow-lg ">
          {LOCALES.map((l) => (
            <SelectItem
              key={l.value}
              value={l.value}
              className="text-base py-2 px-3"
            >
              {l.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* <button
        type="button"
        onClick={toggleTheme}
        className="flex items-center gap-1 rounded-full border border-[#E8EDF3] bg-white px-3 py-2 text-xs font-medium text-gray-800 shadow-sm transition hover:border-gray-300 hover:bg-gray-50    "
        aria-label="Tema değiştir"
      >
        {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        <span className="hidden sm:inline">{theme === "dark" ? "Dark" : "Light"}</span>
      </button> */}
    </div>
  );
}
