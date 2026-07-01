"use client";

import { Monitor } from "lucide-react";

import { useI18n } from "@/lib/i18n/I18nProvider";

const CARD = "rounded-[26px] bg-[#0E0F10] p-6 shadow-[0px_2px_8px_0.3px_rgba(58,64,67,0.2)]";

type ActivityRow = { id: string; name: string; location: string; ip: string };

// ⚠️ TEMPORARY DEMO MOCK — sessions/devices have no API yet.
const SESSIONS: ActivityRow[] = [
  { id: "s1", name: "Opera (Windows)", location: "Turkey", ip: "03.142.80.39" },
  { id: "s2", name: "Safari (macOS)", location: "Turkey", ip: "03.142.80.39" },
  { id: "s3", name: "Chrome (Windows)", location: "Turkey", ip: "03.142.80.39" },
];

const DEVICES: ActivityRow[] = [
  { id: "d1", name: "Apple MacBook Pro", location: "Turkey", ip: "03.142.80.39" },
];

export default function AccountActivityPage() {
  const { t } = useI18n();

  const Row = ({ row }: { row: ActivityRow }) => (
    <div className="flex flex-col gap-3 border-b border-[#3A4043] py-5 last:border-b-0 md:flex-row md:items-center md:gap-[120px]">
      <div className="flex items-center gap-2 md:w-[220px] md:shrink-0">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#8F93FE]/10 text-[#8F93FE]">
          <Monitor className="h-5 w-5" />
        </span>
        <div className="flex flex-col gap-1">
          <span className="text-[18px] font-medium tracking-[-0.27px] text-[#8F93FE]">{row.name}</span>
          <span className="text-sm font-medium text-[#27E9A6]">{t("account.activity.active")}</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1">
        <span className="text-base font-medium text-[#F4F7F8]">{row.location}</span>
        <span className="text-base text-[#C5C9CC]">{row.ip}</span>
      </div>

      <button
        type="button"
        className="shrink-0 self-start whitespace-nowrap rounded-[12px] border border-[#FF4D6D] px-4 py-2.5 text-xs font-bold text-[#FF4D6D] transition hover:bg-[#FF4D6D]/10 md:self-auto"
      >
        {t("account.activity.logout")}
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className={CARD}>
        <h2 className="text-lg font-medium text-[#F4F7F8]">
          {t("account.activity.sessionTitle", { count: SESSIONS.length })}
        </h2>
        <div className="flex flex-col py-3">
          {SESSIONS.map((row) => (
            <Row key={row.id} row={row} />
          ))}
        </div>
      </div>

      <div className={CARD}>
        <h2 className="text-lg font-medium text-[#F4F7F8]">
          {t("account.activity.deviceTitle", { count: DEVICES.length })}
        </h2>
        <div className="flex flex-col py-3">
          {DEVICES.map((row) => (
            <Row key={row.id} row={row} />
          ))}
        </div>
      </div>
    </div>
  );
}
