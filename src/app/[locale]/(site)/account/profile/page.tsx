"use client";

import { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";

import { useI18n } from "@/lib/i18n/I18nProvider";
import { getDateFnsLocale } from "@/lib/i18n/dateFnsLocale";
import { getAccountInfo } from "@/services/account";
import { AccountInfo } from "@/types/account";
import { Skeleton } from "@/components/ui/skeleton";

export default function AccountProfilePage() {
  const { t, locale } = useI18n();
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAccountInfo = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getAccountInfo();
      if (data) setAccountInfo(data);
    } catch (error) {
      console.error("Failed to fetch account info", error);
      toast.error(t("common.error"));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchAccountInfo();
  }, [fetchAccountInfo]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    try {
      return format(new Date(dateStr), "dd.MM.yyyy", { locale: getDateFnsLocale(locale) });
    } catch {
      return dateStr;
    }
  };

  const rows = [
    { label: t("account.profile.fullName"), value: accountInfo ? `${accountInfo.firstName} ${accountInfo.lastName}` : "-" },
    { label: t("account.profile.email"), value: accountInfo?.email || "-" },
    { label: t("account.profile.phone"), value: accountInfo?.phoneNumber || "-" },
    { label: t("account.profile.idNumber"), value: accountInfo?.identityNumber || "-" },
    { label: t("account.profile.birthDate"), value: formatDate(accountInfo?.dateOfBirth) },
    { label: t("account.profile.customerNo"), value: accountInfo?.accountNumber || "-" },
  ];

  return (
    <div className="rounded-[22px] bg-[#0E0F10] p-6 shadow-[0px_2px_8px_0.3px_rgba(58,64,67,0.2)]">
      <h2 className="text-lg font-medium text-[#F4F7F8]">{t("account.menu.profile")}</h2>

      <div className="mt-3 flex flex-col">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col gap-2 border-b border-[#3A4043] py-5 last:border-b-0 md:flex-row md:items-center md:gap-[120px]"
              >
                <Skeleton className="h-5 w-[160px] bg-white/10" />
                <Skeleton className="h-4 w-48 bg-white/10" />
              </div>
            ))
          : rows.map((row) => (
              <div
                key={row.label}
                className="flex flex-col gap-2 border-b border-[#3A4043] py-5 last:border-b-0 md:flex-row md:items-center md:gap-[120px]"
              >
                <span className="w-[200px] shrink-0 text-[18px] font-medium tracking-[-0.27px] text-[#8F93FE]">
                  {row.label}
                </span>
                <span className="break-all text-base text-[#C5C9CC]">{row.value}</span>
              </div>
            ))}
      </div>
    </div>
  );
}
