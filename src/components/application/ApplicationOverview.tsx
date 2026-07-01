"use client";

import { Bell, ShieldCheck, Wallet2, Repeat } from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nProvider";

type Notice = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

export function ApplicationOverview() {
  const { t } = useI18n();

  const notices: Notice[] = [
    {
      icon: <Bell className="h-5 w-5 text-gray-700" />,
      title: t("applicationPage.notifications.0.title"),
      description: t("applicationPage.notifications.0.description"),
    },
    {
      icon: <ShieldCheck className="h-5 w-5 text-emerald-600" />,
      title: t("applicationPage.notifications.1.title"),
      description: t("applicationPage.notifications.1.description"),
    },
    {
      icon: <ShieldCheck className="h-5 w-5 text-gray-700" />,
      title: t("applicationPage.notifications.2.title"),
      description: t("applicationPage.notifications.2.description"),
    },
    {
      icon: <ShieldCheck className="h-5 w-5 text-emerald-600" />,
      title: t("applicationPage.notifications.3.title"),
      description: t("applicationPage.notifications.3.description"),
    },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
      <div className="space-y-5">
        <InfoCard
          icon={<Wallet2 className="h-6 w-6 text-gray-800" />}
          title={t("applicationPage.assets.title")}
          description={t("applicationPage.assets.description")}
          cta={t("applicationPage.cta")}
        />
        <InfoCard
          icon={<Repeat className="h-6 w-6 text-gray-800" />}
          title={t("applicationPage.trades.title")}
          description={t("applicationPage.trades.description")}
          cta={t("applicationPage.cta")}
        />
      </div>

      <div className="space-y-3 rounded-2xl border border-[#E8EDF3] bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="px-2 text-lg font-semibold text-gray-900 dark:text-white">
          {t("applicationPage.notifications.title")}
        </h3>
        <div className="space-y-3">
          {notices.map((notice, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-[#fbfbfc] px-4 py-3 text-sm text-gray-800 shadow-[0_12px_28px_rgba(0,0,0,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(0,0,0,0.06)] dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            >
              <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-white/5">
                {notice.icon}
              </div>
              <div>
                <p className="text-base font-semibold">{notice.title}</p>
                <p className="mt-1 text-sm text-gray-600 dark:text-slate-300">
                  {notice.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  description,
  cta,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  cta: string;
}) {
  return (
    <div className="flex items-center justify-between gap-6 rounded-2xl border border-[#E8EDF3] bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:min-h-[225px]">
      <div className="max-w-xl space-y-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-gray-700 dark:text-slate-300">
          {description}
        </p>
        <button className="mt-2 inline-flex items-center justify-center rounded-lg bg-[#373b45] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#2c2f37]">
          {cta}
        </button>
      </div>
      <div className="relative hidden shrink-0 items-center justify-center md:flex">
        <div className="absolute h-32 w-32 rounded-full bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-white/10 dark:via-white/5 dark:to-white/0" />
        <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-2xl bg-white shadow-[0_14px_36px_rgba(0,0,0,0.08)] ring-1 ring-black/5 dark:bg-slate-800 dark:ring-white/10">
          {icon}
        </div>
      </div>
    </div>
  );
}
