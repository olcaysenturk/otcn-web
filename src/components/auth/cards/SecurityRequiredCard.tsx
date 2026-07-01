"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowRight, Mail, Phone, ShieldCheck } from "lucide-react";

import { useI18n } from "@/lib/i18n/I18nProvider";
import { cn } from "@/lib/utils";

type SecurityItem = {
  id: "email" | "phone" | "twofa";
  icon: React.ReactNode;
  label: string;
  href: string;
  completed?: boolean;
};

export function SecurityRequiredCard() {
  const { t } = useI18n();
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const basePath = `/${locale}`;

  const items: SecurityItem[] = [
    {
      id: "email",
      icon: <Mail className="h-5 w-5" />,
      label: t("auth.securityRequired.items.email"),
      href: `${basePath}/auth/security/email`,
      completed: true,
    },
    {
      id: "phone",
      icon: <Phone className="h-5 w-5" />,
      label: t("auth.securityRequired.items.phone"),
      href: `${basePath}/auth/security/phone`,
      completed: true,
    },
    {
      id: "twofa",
      icon: <ShieldCheck className="h-5 w-5" />,
      label: t("auth.securityRequired.items.twofa"),
      href: `${basePath}/auth/security/2fa`,
    },
  ];

  return (
    <div>
      <h2 className="mb-3 text-3xl font-extrabold text-gray-900 lg:text-4xl">
        {t("auth.securityRequired.title")}
      </h2>
      <p className="mb-8 leading-relaxed text-gray-600">
        {t("auth.securityRequired.description")}
      </p>

      <div className="space-y-3">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => router.push(item.href)}
            className={cn(
              "flex w-full items-center justify-between gap-3 rounded-xl border border-[#E8EDF3] px-4 py-3 text-left shadow-sm transition hover:border-gray-300 hover:shadow-md",
              item.completed && "border-emerald-200 bg-emerald-50"
            )}
          >
            <div className="flex items-center gap-3 text-gray-900">
              <span >
                {item.icon}
              </span>
              <span className="text-base font-medium">{item.label}</span>
            </div>
            {item.completed ? (
              <span className="text-emerald-600">✓</span>
            ) : (
              <ArrowRight className="h-4 w-4 text-gray-500 button-arrow" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
