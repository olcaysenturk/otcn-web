"use client";

import { useMemo, useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import { useI18n } from "@/lib/i18n/I18nProvider";
import { getDateFnsLocale } from "@/lib/i18n/dateFnsLocale";
import { cn } from "@/lib/utils";

type ReportType = "daily" | "monthly";

const YEAR = 2025;
const capitalize = (s: string) => s.charAt(0).toLocaleUpperCase() + s.slice(1);

export default function AccountReportsPage() {
  const { t, locale } = useI18n();
  const fnsLocale = getDateFnsLocale(locale);

  const [reportType, setReportType] = useState<ReportType>("daily");
  const [activeMonth, setActiveMonth] = useState(7); // August (Ağustos)
  // ⚠️ TEMPORARY DEMO MOCK — preselected dates matching the design.
  const [selected, setSelected] = useState<string[]>([
    `${YEAR}-2-2`,
    `${YEAR}-2-8`,
    `${YEAR}-7-15`,
    `${YEAR}-7-23`,
    `${YEAR}-7-27`,
  ]);

  const monthNames = useMemo(
    () => Array.from({ length: 12 }, (_, i) => capitalize(format(new Date(YEAR, i, 1), "LLLL", { locale: fnsLocale }))),
    [fnsLocale],
  );

  const weekdays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => capitalize(format(new Date(2024, 0, 1 + i), "EEEEEE", { locale: fnsLocale }))),
    [fnsLocale],
  );

  const cells = useMemo(() => {
    const firstOfMonth = new Date(YEAR, activeMonth, 1);
    const startOffset = (firstOfMonth.getDay() + 6) % 7; // Monday-first
    const daysInMonth = new Date(YEAR, activeMonth + 1, 0).getDate();
    const out: { day: number; current: boolean }[] = [];
    for (let i = 0; i < 42; i++) {
      const dayNum = i - startOffset + 1;
      out.push({ day: dayNum, current: dayNum >= 1 && dayNum <= daysInMonth });
    }
    return out;
  }, [activeMonth]);

  const key = (month: number, day: number) => `${YEAR}-${month}-${day}`;
  const isSelected = (day: number) => selected.includes(key(activeMonth, day));
  const monthCount = (month: number) => selected.filter((k) => Number(k.split("-")[1]) === month).length;

  const toggleDay = (day: number) => {
    const k = key(activeMonth, day);
    setSelected((prev) => (prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]));
  };

  const sortedSelected = useMemo(
    () =>
      [...selected].sort((a, b) => {
        const [, am, ad] = a.split("-").map(Number);
        const [, bm, bd] = b.split("-").map(Number);
        return am - bm || ad - bd;
      }),
    [selected],
  );

  const formatChip = (k: string) => {
    const [y, m, d] = k.split("-").map(Number);
    return format(new Date(y, m, d), "d MMMM yyyy", { locale: fnsLocale });
  };

  const tabs: { id: ReportType; label: string }[] = [
    { id: "daily", label: t("reportsPage.dailyTab") },
    { id: "monthly", label: t("reportsPage.monthlyTab") },
  ];

  return (
    <div className="rounded-[22px] bg-[#0E0F10] p-6 shadow-[0px_2px_8px_0.3px_rgba(58,64,67,0.2)]">
      <h2 className="text-lg font-medium text-[#F4F7F8]">{t("reportsPage.title")}</h2>

      {/* Report type tabs + year */}
      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex w-fit items-center gap-0.5 rounded-[12px] bg-[#1F2628] p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setReportType(tab.id)}
              className={cn(
                "rounded-[8px] px-3 py-1.5 text-xs font-medium transition-colors",
                reportType === tab.id ? "bg-[#0E0F10] text-[#F4F7F8] shadow-sm" : "text-[#C5C9CC] hover:text-[#F4F7F8]",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="inline-flex w-fit items-center gap-2 rounded-[39px] border border-[#3A4043] bg-[#0E0F10] px-3 py-2 text-xs text-[#F4F7F8] transition hover:border-[#5E666A]"
        >
          <span className="text-[#C5C9CC]">{t("reportsPage.year")}</span>
          <span>{YEAR}</span>
          <ChevronDown className="h-4 w-4 text-[#5E666A]" />
        </button>
      </div>

      <div className="my-5 h-px w-full bg-[#3A4043]" />

      {/* Month & day selection */}
      <p className="text-sm font-medium text-[#F4F7F8]">{t("reportsPage.selection")}</p>
      <div className="mt-4 flex flex-col gap-5 lg:flex-row">
        {/* Month grid */}
        <div className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-4">
          {monthNames.map((name, i) => {
            const active = i === activeMonth;
            const count = monthCount(i);
            return (
              <button
                key={name}
                type="button"
                onClick={() => setActiveMonth(i)}
                className={cn(
                  "relative flex items-center justify-center rounded-[12px] px-3 py-5 text-[13px] transition-colors",
                  active ? "bg-[rgba(25,49,51,0.5)] font-medium text-[#f54a14]" : "bg-[#191D1E] text-[#F4F7F8] hover:bg-white/5",
                )}
              >
                {name}
                {count > 0 && (
                  <span className="absolute right-2 top-2 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[#DADBFF] px-1 text-[10px] font-medium text-[#5F63EE]">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Calendar */}
        <div className="shrink-0 rounded-[16px] bg-[#191D1E] p-3 lg:w-[320px]">
          <div className="grid grid-cols-7 gap-y-1">
            {weekdays.map((w) => (
              <div key={w} className="flex h-8 items-center justify-center text-xs font-medium text-[#C5C9CC]">
                {w}
              </div>
            ))}
            {cells.map((cell, i) => {
              if (!cell.current) {
                return (
                  <div key={i} className="flex h-8 items-center justify-center text-[13px] font-medium text-[#5E666A] opacity-50">
                    {new Date(YEAR, activeMonth, cell.day).getDate()}
                  </div>
                );
              }
              const sel = isSelected(cell.day);
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggleDay(cell.day)}
                  className={cn(
                    "flex h-8 items-center justify-center rounded-[8px] text-[13px] font-medium transition-colors",
                    sel ? "bg-[#f54a14] text-[#193133]" : "text-[#F4F7F8] hover:bg-white/5",
                  )}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="my-5 h-px w-full bg-[#3A4043]" />

      {/* Selected date chips + actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          {sortedSelected.map((k) => (
            <span
              key={k}
              className="inline-flex items-center gap-1 rounded-[39px] border border-[#3A4043] bg-[#0E0F10] px-3 py-2 text-xs text-[#C5C9CC]"
            >
              {formatChip(k)}
              <button
                type="button"
                aria-label="remove"
                onClick={() => setSelected((prev) => prev.filter((x) => x !== k))}
                className="ml-1 flex h-[15px] w-[15px] items-center justify-center rounded-full border border-[#F4F7F8] text-[#F4F7F8] transition hover:border-[#FF4D6D] hover:text-[#FF4D6D]"
              >
                <X className="h-2 w-2" />
              </button>
            </span>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={() => setSelected([])}
            className="rounded-[14px] border border-[#F4F7F8] px-5 py-3 text-sm font-bold text-[#F4F7F8] transition hover:border-[#f54a14] hover:text-[#f54a14]"
          >
            {t("reportsPage.cancel")}
          </button>
          <button
            type="button"
            onClick={() => toast.success(t("common.success"))}
            className="rounded-[14px] bg-[#f54a14] px-5 py-3 text-sm font-bold text-[#0E0F10] transition hover:opacity-90"
          >
            {t("reportsPage.generate")}
          </button>
        </div>
      </div>
    </div>
  );
}
