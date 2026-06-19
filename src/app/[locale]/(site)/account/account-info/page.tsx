"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Download, Plus, Trash2, Search, Building2, FileText, User, ArrowLeft, Edit2 } from "lucide-react";
import Link from "next/link";

import { AccountTabs } from "@/components/account/AccountTabs";
import { AccountHeader } from "@/components/account/AccountHeader";
import { PageCard } from "@/components/ui/page-card";
import { ResponsivePageWrapper } from "@/components/ui/responsive-page-wrapper";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { withLocale } from "@/lib/i18n/href";
import { toast } from "sonner";
import { AccountProfileSkeleton, AccountTableSkeleton } from "@/components/account/AccountSkeleton";

import { useModalStore } from "@/stores/useModalStore";
import { getApplicationDetail } from "@/services/account";
import { ApplicationDetail } from "@/types/application";
import { format } from "date-fns";
import { getDateFnsLocale } from "@/lib/i18n/dateFnsLocale";

export default function AccountInfoPage() {
  const { t, locale } = useI18n();
  const { openModal } = useModalStore();
  const [corpSection, setCorpSection] = useState<"info" | "docs">("info");
  const [application, setApplication] = useState<ApplicationDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("application", application);
  }, [application]);

  const fetchApplicationData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getApplicationDetail();
      if (response && response.applications.length > 0) {
        setApplication(response.applications[0]);
      }
    } catch (error) {
      console.error("Failed to fetch application details", error);
      toast.error(t("common.error"));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchApplicationData();

    // Listen for updates
    window.addEventListener("application-updated", fetchApplicationData);
    return () => window.removeEventListener("application-updated", fetchApplicationData);
  }, [fetchApplicationData]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    try {
      return format(new Date(dateStr), "dd.MM.yyyy", {
        locale: getDateFnsLocale(locale)
      });
    } catch {
      return dateStr;
    }
  };

  const shareHoldersList = useMemo(() => application?.shareHolders || [], [application]);

  const corpDocs = useMemo(
    () => [
      { key: "userDeclarationForm", approve: "Jun 02, 2025", valid: "Jun 02, 2025", status: "approved" as const },
      { key: "accountOpeningPetition", approve: "Jun 03, 2025", valid: "Jun 03, 2025", status: "approved" as const },
      { key: "signatureCircular", approve: "Jun 04, 2025", valid: "Jun 04, 2025", status: "approved" as const },
      { key: "taxCertificate", approve: "Jun 05, 2025", valid: "Jun 05, 2025", status: "approved" as const },
      { key: "activityCertificate", approve: "Jun 06, 2025", valid: "Jun 06, 2025", status: "approved" as const },
      { key: "tradeRegistryGazette", approve: "Jun 07, 2025", valid: "Nov 12, 2025", status: "expired" as const },
      { key: "shareholderInfo1", approve: "Jun 07, 2025", valid: "Jun 07, 2025", status: "approved" as const },
      { key: "shareholderInfo2", approve: "Jun 09, 2025", valid: "Jun 09, 2025", status: "approved" as const },
      { key: "invoiceSamples", approve: "Jun 10, 2025", valid: "Jun 10, 2025", status: "approved" as const },
      { key: "uboDeclaration", approve: "Jun 10, 2025", valid: "Jun 10, 2025", status: "approved" as const },
    ],
    [],
  );

  const activeTabClass = "bg-white/10 text-white";
  const inactiveTabClass = "bg-transparent text-gray-400 hover:bg-white/5 hover:text-white";

  return (
    <PageCard>
      <ResponsivePageWrapper>
        {/* Mobile Header */}
        <div className="flex items-center gap-3 bg-[#0F1415] p-4 text-white lg:hidden">
          <Link href={withLocale("/account", locale)} className="rounded p-1 hover:bg-white/10">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <span className="text-lg font-semibold">{t("account.menu.corporate")}</span>
        </div>

        {/* Desktop Header */}
        <AccountHeader
          title={t("accountHeader.title")}
          description={t("accountHeader.description")}
        />

        <div className="hidden lg:block">
          <AccountTabs active="corporate" />
        </div>


        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[260px_1fr] lg:gap-8 lg:items-start bg-[#1C2425] lg:bg-transparent rounded-3xl lg:rounded-none p-3 lg:p-0">
          {/* Sub Navigation */}
          <div className="flex gap-4 overflow-x-auto lg:flex-col lg:gap-2 shrink-0 bg-[#1C2425] p-6 rounded-[32px] lg:border lg:border-white/10">
            <button
              onClick={() => setCorpSection("info")}
              className={`flex items-center gap-2 px-6 py-3 lg:px-4 lg:py-3 rounded-xl lg:rounded-lg text-sm font-semibold transition-all whitespace-nowrap lg:w-full lg:justify-start ${corpSection === "info" ? activeTabClass : inactiveTabClass
                }`}
            >
              <Building2 className={`h-5 w-5 ${corpSection === "info" ? "text-white" : "text-gray-400"}`} />
              {t("account.corporateMenu.info")}
            </button>
            <button
              onClick={() => setCorpSection("docs")}
              className={`flex items-center gap-2 px-6 py-3 lg:px-4 lg:py-3 rounded-xl lg:rounded-lg text-sm font-semibold transition-all whitespace-nowrap lg:w-full lg:justify-start ${corpSection === "docs" ? activeTabClass : inactiveTabClass
                }`}
            >
              <FileText className={`h-5 w-5 ${corpSection === "docs" ? "text-white" : "text-gray-400"}`} />
              {t("account.corporateMenu.docs")}
            </button>
          </div>

          {isLoading ? (
            <div className="w-full bg-[#1C2425] p-6 lg:p-8 rounded-[32px]">
              {corpSection === "info" ? <AccountProfileSkeleton /> : <AccountTableSkeleton />}
            </div>
          ) : corpSection === "info" ? (
            <div className="space-y-6 w-full bg-[#1C2425] p-6 rounded-[32px]">
              {/* Shareholder Info */}
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-white">{t("account.corporateInfo.title")}</h2>
                </div>

                <div className="space-y-4">
                  {shareHoldersList.length === 0 ? (
                    <div className="py-10 text-center text-gray-400 text-sm">
                      {t("account.corporateInfo.noShareholder")}
                    </div>
                  ) : (
                    shareHoldersList.map((s, idx) => (
                      <div key={s.shareHolderId || idx} className="flex items-center justify-between py-4 border-b border-white/10 last:border-0">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white">
                            <User className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#9B91FF]">{s.shareHolderName} {s.shareHolderSurname}</p>
                            <p className="text-sm text-gray-400">{formatDate(s.shareHolderBirthDate)}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Account Authority */}
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-white">{t("account.corporateInfo.managerTitle")}</h2>
                  <button
                    onClick={() => openModal("update-account-authority", application)}
                    className="flex items-center gap-1.5 px-4 h-9 border border-white/20 rounded-full text-gray-300 text-sm font-semibold hover:bg-white/5 transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                    {t("account.corporateInfo.edit")}
                  </button>
                </div>

                <div className="space-y-1">
                  {[
                    { label: t("account.profile.idNumber"), content: application?.userIdentityNumber || "-" },
                    { label: t("account.profile.birthDate"), content: formatDate(application?.userBirthDate) },
                    { label: t("account.profile.email"), content: application?.email || "-" },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex flex-col gap-2 border-b border-white/10 py-5 last:border-b-0 md:grid md:grid-cols-[240px_1fr] md:gap-0 md:items-center"
                    >
                      <span className="text-sm font-medium text-[#9B91FF]">{row.label}</span>
                      <div className="text-sm text-gray-300">{row.content}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Corporate Documents */
            <div className="w-full">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-semibold text-white">{t("account.corporateTable.title")}</h2>
                <span className="text-sm text-gray-400">{t("account.corporateTable.resultCount", { count: "120" })}</span>
              </div>

              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={t("account.corporateTable.searchPlaceholder")}
                  className="w-full pl-11 pr-4 py-3 rounded-lg border border-white/10 bg-white/5 text-white shadow-sm placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 focus:border-white/20 outline-none"
                />
              </div>

              {/* Desktop Table */}
              <div className="hidden md:block overflow-hidden rounded-xl border border-white/10 mt-6">
                <table className="min-w-full divide-y divide-white/10">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{t("account.corporateTable.headers.product")}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{t("account.corporateTable.headers.approveDate")}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{t("account.corporateTable.headers.validDate")}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{t("account.corporateTable.headers.status")}</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">{t("account.corporateTable.headers.action")}</th>
                    </tr>
                  </thead>
                  <tbody className="bg-[#1C2425] divide-y divide-white/10">
                    {corpDocs.map((doc, idx) => (
                      <tr key={idx}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                          {t(`account.corporateTable.documents.${doc.key}`)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{doc.approve}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{doc.valid}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${doc.status === 'approved'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-red-500/10 text-red-400 border-red-500/30'
                            }`}>
                            {doc.status === 'approved'
                              ? t("account.corporateTable.status.approved")
                              : t("account.corporateTable.status.expired")}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <button className="p-2 hover:bg-white/10 rounded-full border border-white/15">
                            <Download className="h-4 w-4 text-gray-300" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card List */}
              <div className="md:hidden space-y-4 mt-6">
                {corpDocs.map((doc, idx) => (
                  <div key={idx} className="border border-white/10 rounded-2xl p-5 hover:bg-white/5 transition-all bg-[#1C2425]">
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-base font-medium text-white pr-4">
                        {t(`account.corporateTable.documents.${doc.key}`)}
                      </span>
                      <button className="p-2 hover:bg-white/10 rounded-full border border-white/15 shrink-0">
                        <Download className="h-4 w-4 text-gray-300" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">{t("account.corporateTable.headers.approveDate")}</span>
                        <span className="font-medium text-white">{doc.approve}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">{t("account.corporateTable.headers.validDate")}</span>
                        <span className="font-medium text-white">{doc.valid}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm pt-2 border-t border-white/10">
                        <span className="text-gray-400">{t("account.corporateTable.headers.status")}</span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${doc.status === 'approved'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-red-500/10 text-red-400 border-red-500/30'
                          }`}>
                          {doc.status === 'approved'
                            ? t("account.corporateTable.status.approved")
                            : t("account.corporateTable.status.expired")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </ResponsivePageWrapper>
    </PageCard>
  );
}
