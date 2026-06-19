"use client";

import { useCallback, useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { AccountTabs } from "@/components/account/AccountTabs";
import { AccountHeader } from "@/components/account/AccountHeader";
import { PageCard } from "@/components/ui/page-card";
import { ResponsivePageWrapper } from "@/components/ui/responsive-page-wrapper";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { withLocale } from "@/lib/i18n/href";
import { getAccountInfo } from "@/services/account";
import { AccountInfo } from "@/types/account";
import { format } from "date-fns";
import { getDateFnsLocale } from "@/lib/i18n/dateFnsLocale";
import { toast } from "sonner";
import { AccountProfileSkeleton } from "@/components/account/AccountSkeleton";

export default function AccountProfilePage() {
    const { t, locale } = useI18n();
    const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchAccountInfo = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getAccountInfo();
            if (data) {
                setAccountInfo(data);
            }
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
            return format(new Date(dateStr), "dd.MM.yyyy", {
                locale: getDateFnsLocale(locale)
            });
        } catch (e) {
            return dateStr;
        }
    };

    const profileData = [
        { label: t("account.profile.fullName"), content: accountInfo ? `${accountInfo.firstName} ${accountInfo.lastName}` : "-" },
        { label: t("account.profile.email"), content: accountInfo?.email || "-" },
        { label: t("account.profile.phone"), content: accountInfo?.phoneNumber || "-" },
        { label: t("account.profile.idNumber"), content: accountInfo?.identityNumber || "-" },
        { label: t("account.profile.birthDate"), content: formatDate(accountInfo?.dateOfBirth) },
    ];

    return (
        <PageCard>
            <ResponsivePageWrapper>
                {/* Mobile Header */}
                <div className="flex items-center gap-3 bg-[#0F1415] p-4 text-white lg:hidden mb-6">
                    <Link href={withLocale("/account", locale)} className="rounded p-1 hover:bg-white/10">
                        <ArrowLeft className="h-6 w-6" />
                    </Link>
                    <span className="text-lg font-semibold">{t("account.menu.profile")}</span>
                </div>

                {/* Desktop Header */}
                <AccountHeader
                    title={t("accountHeader.title")}
                    description={t("accountHeader.description")}
                />

                <div className="hidden lg:block">
                    <AccountTabs active="profile" />
                </div>

                {/* Profile Info Card */}
                <div className="bg-[#1C2425] rounded-3xl p-6 lg:p-8 border border-white/10 min-h-[calc(100vh-94px)] flex flex-col">
                    <h2 className="mb-6 text-lg font-semibold text-white hidden lg:block">{t("account.menu.profile")}</h2>

                    {isLoading ? (
                        <AccountProfileSkeleton />
                    ) : (
                        <div className="space-y-1">
                            {profileData.map((row) => (
                                <div
                                    key={row.label}
                                    className="flex flex-col gap-2 border-b border-white/10 py-5 last:border-b-0 lg:grid lg:grid-cols-[240px_1fr] lg:gap-0 lg:items-center"
                                >
                                    <span className="text-sm font-medium text-[#9B91FF]">{row.label}</span>
                                    <div className="text-sm text-gray-300">{row.content}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </ResponsivePageWrapper>
        </PageCard>
    );
}
