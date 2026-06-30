"use client";

import { useState } from "react";
import { BellOff, ChevronRight } from "lucide-react";

import { useI18n } from "@/lib/i18n/I18nProvider";
import { Switch } from "@/components/ui/switch";

export default function AccountNotificationPage() {
  const { t } = useI18n();
  const [sms, setSms] = useState(false);
  const [email, setEmail] = useState(false);

  const rows = [
    {
      key: "sms",
      label: t("notificationPage.smsLabel"),
      description: t("notificationPage.smsDesc"),
      checked: sms,
      onChange: setSms,
    },
    {
      key: "email",
      label: t("notificationPage.emailLabel"),
      description: t("notificationPage.emailDesc"),
      checked: email,
      onChange: setEmail,
    },
  ];

  return (
    <div className="rounded-[22px] bg-[#0E0F10] p-6 shadow-[0px_2px_8px_0.3px_rgba(58,64,67,0.2)]">
      <h2 className="text-lg font-medium text-[#F4F7F8]">{t("account.menu.notification")}</h2>

      {/* Browser notifications blocked warning */}
      <div className="mt-4 flex flex-col gap-4 rounded-[20px] border border-[#FFD951]/20 bg-[#FFD951]/10 p-4 md:flex-row md:items-center">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFD951]/10 text-[#FFD951]">
          <BellOff className="h-5 w-5" />
        </span>
        <div className="flex-1">
          <p className="text-sm font-medium text-[#F4F7F8]">{t("notificationPage.blockedTitle")}</p>
          <p className="text-sm text-[#C5C9CC]">{t("notificationPage.blockedDesc")}</p>
        </div>
        <button
          type="button"
          className="inline-flex shrink-0 items-center gap-1.5 self-start whitespace-nowrap rounded-[12px] border border-[#F4F7F8] px-4 py-2.5 text-xs font-bold text-[#F4F7F8] transition hover:border-[#f54a14] hover:text-[#f54a14] md:self-auto"
        >
          {t("notificationPage.enable")}
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Channels */}
      <div className="flex flex-col py-3">
        {rows.map((row) => (
          <div
            key={row.key}
            className="flex flex-col gap-3 border-b border-[#3A4043] py-5 last:border-b-0 md:flex-row md:items-center md:gap-[120px]"
          >
            <span className="w-[200px] shrink-0 text-[18px] font-medium tracking-[-0.27px] text-[#8F93FE]">
              {row.label}
            </span>
            <p className="flex-1 text-base text-[#C5C9CC]">{row.description}</p>
            <Switch
              checked={row.checked}
              onCheckedChange={row.onChange}
              className="shrink-0 border-0 data-[state=checked]:bg-[#27E9A6] data-[state=unchecked]:bg-white/15"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
