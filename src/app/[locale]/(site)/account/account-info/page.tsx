"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Building2, ChevronRight, Download, FileText, Plus, Search, Trash2, User } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import { useI18n } from "@/lib/i18n/I18nProvider";
import { getDateFnsLocale } from "@/lib/i18n/dateFnsLocale";
import { useModalStore } from "@/stores/useModalStore";
import { getApplicationDetail } from "@/services/account";
import { ApplicationDetail } from "@/types/application";
import { DataTable, type DataTableColumn } from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type CorpDoc = {
  key: string;
  approve: string;
  valid: string;
  status: "approved" | "expired";
};

const DOC_PAGE_COUNT = 10;
const CARD = "rounded-[22px] bg-[#0E0F10] p-6 shadow-[0px_2px_8px_0.3px_rgba(58,64,67,0.2)]";

export default function AccountInfoPage() {
  const { t, locale } = useI18n();
  const { openModal } = useModalStore();
  const [section, setSection] = useState<"info" | "docs">("docs");
  const [application, setApplication] = useState<ApplicationDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [docPage, setDocPage] = useState(1);

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
    window.addEventListener("application-updated", fetchApplicationData);
    return () => window.removeEventListener("application-updated", fetchApplicationData);
  }, [fetchApplicationData]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    try {
      return format(new Date(dateStr), "dd.MM.yyyy", { locale: getDateFnsLocale(locale) });
    } catch {
      return dateStr;
    }
  };

  const shareHoldersList = useMemo(() => application?.shareHolders || [], [application]);

  const authorityRows = [
    { label: t("form.firstName"), value: application?.userName || "-" },
    { label: t("form.lastName"), value: application?.userSurname || "-" },
    { label: t("account.profile.idNumber"), value: application?.userIdentityNumber || "-" },
    { label: t("account.profile.birthDate"), value: formatDate(application?.userBirthDate) },
    { label: t("modals.corporate.updateAuthority.fields.identitySerialNumber"), value: "-" },
  ];

  // ⚠️ TEMPORARY DEMO MOCK — company documents have no API yet.
  const docs = useMemo<CorpDoc[]>(
    () => [
      { key: "userDeclarationForm", approve: "09.11.2025", valid: "09.11.2025", status: "approved" },
      { key: "accountOpeningPetition", approve: "09.11.2025", valid: "09.11.2025", status: "approved" },
      { key: "signatureCircular", approve: "09.11.2025", valid: "09.11.2025", status: "approved" },
      { key: "taxCertificate", approve: "09.11.2025", valid: "09.11.2025", status: "approved" },
      { key: "activityCertificate", approve: "09.11.2025", valid: "09.11.2025", status: "expired" },
      { key: "tradeRegistryGazette", approve: "09.11.2025", valid: "09.11.2025", status: "approved" },
      { key: "shareholderInfo1", approve: "09.11.2025", valid: "09.11.2025", status: "approved" },
      { key: "shareholderInfo2", approve: "09.11.2025", valid: "09.11.2025", status: "approved" },
      { key: "invoiceSamples", approve: "09.11.2025", valid: "09.11.2025", status: "approved" },
      { key: "uboDeclaration", approve: "09.11.2025", valid: "09.11.2025", status: "approved" },
    ],
    [],
  );

  const StatusBadge = ({ status }: { status: CorpDoc["status"] }) => {
    const approved = status === "approved";
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium",
          approved
            ? "border-[#27E9A6]/40 bg-[#27E9A6]/10 text-[#27E9A6]"
            : "border-[#FF4D6D]/40 bg-[#FF4D6D]/10 text-[#FF4D6D]",
        )}
      >
        {approved ? t("account.corporateTable.status.approved") : t("account.corporateTable.status.expired")}
      </span>
    );
  };

  const columns: DataTableColumn<CorpDoc>[] = [
    {
      id: "product",
      header: t("account.corporateTable.headers.product"),
      width: "32%",
      cellClassName: "font-medium",
      skeleton: <Skeleton className="h-4 w-40 bg-white/10" />,
      cell: (doc) => t(`account.corporateTable.documents.${doc.key}`),
    },
    {
      id: "approve",
      header: t("account.corporateTable.headers.approveDate"),
      width: "18%",
      skeleton: <Skeleton className="h-4 w-20 bg-white/10" />,
      cell: (doc) => doc.approve,
    },
    {
      id: "valid",
      header: t("account.corporateTable.headers.validDate"),
      width: "18%",
      skeleton: <Skeleton className="h-4 w-20 bg-white/10" />,
      cell: (doc) => (
        <span className={doc.status === "expired" ? "text-[#FF4D6D]" : undefined}>{doc.valid}</span>
      ),
    },
    {
      id: "status",
      header: t("account.corporateTable.headers.status"),
      width: "20%",
      skeleton: <Skeleton className="h-6 w-24 rounded-full bg-white/10" />,
      cell: (doc) => <StatusBadge status={doc.status} />,
    },
    {
      id: "action",
      header: "",
      width: "12%",
      align: "right",
      hideOnMobile: true,
      skeleton: (
        <div className="flex justify-end">
          <Skeleton className="h-9 w-9 rounded-full bg-white/10" />
        </div>
      ),
      cell: (doc) =>
        doc.status === "expired" ? (
          <button
            type="button"
            className="whitespace-nowrap rounded-[12px] border border-[#F4F7F8] px-4 py-2 text-xs font-bold text-[#F4F7F8] transition hover:border-[#C7F022] hover:text-[#C7F022]"
          >
            {t("account.corporateTable.upload")}
          </button>
        ) : (
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#3A4043] text-[#788084] transition hover:border-[#C7F022] hover:text-[#C7F022]"
          >
            <Download className="h-4 w-4" />
          </button>
        ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[241px_1fr] lg:items-start">
      {/* Left sub-navigation (Şirket Bilgileri / Şirket Evrakları) */}
      <div className="flex shrink-0 gap-2 overflow-x-auto rounded-[26px] bg-[#0E0F10] p-4 no-scrollbar lg:flex-col lg:gap-3 lg:p-6">
        {([
          { key: "info", icon: Building2, label: t("account.corporateMenu.info") },
          { key: "docs", icon: FileText, label: t("account.corporateMenu.docs") },
        ] as const).map(({ key, icon: Icon, label }) => {
          const active = section === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setSection(key)}
              className={cn(
                "flex items-center justify-between gap-1 whitespace-nowrap rounded-[12px] px-2 py-[10px] text-left transition-colors lg:w-full",
                active ? "bg-[rgba(25,49,51,0.5)]" : "hover:bg-white/5",
              )}
            >
              <span className="flex items-center gap-2">
                <Icon className={cn("h-5 w-5 shrink-0", active ? "text-[#C7F022]" : "text-[#C5C9CC]")} />
                <span className={cn("text-[13px] font-medium", active ? "text-[#C7F022]" : "text-[#F4F7F8]")}>
                  {label}
                </span>
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-[#5E666A]" />
            </button>
          );
        })}
      </div>

      {/* Right content */}
      <div className="min-w-0">
        {section === "info" ? (
          <div className="space-y-6">
            {/* Hissedar Bilgileri */}
            <div className={CARD}>
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-lg font-medium text-[#F4F7F8]">{t("account.corporateInfo.title")}</h2>
                <button
                  type="button"
                  onClick={() => openModal("add-shareholder", application)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#27E9A6] px-4 py-2 text-xs font-bold text-[#27E9A6] transition hover:bg-[#27E9A6]/10"
                >
                  <Plus className="h-4 w-4" />
                  {t("account.corporateInfo.add")}
                </button>
              </div>

              {isLoading ? (
                <div className="space-y-3 py-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-14 w-full bg-white/10" />
                  ))}
                </div>
              ) : shareHoldersList.length === 0 ? (
                <p className="py-8 text-center text-sm text-[#788084]">{t("account.corporateInfo.noShareholder")}</p>
              ) : (
                <div className="flex flex-col py-3">
                  {shareHoldersList.map((s, idx) => (
                    <div
                      key={s.shareHolderId || idx}
                      className="flex items-center justify-between gap-4 border-b border-[#3A4043] py-3 last:border-b-0"
                    >
                      <div className="flex items-center gap-2">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#8F93FE]/10 text-[#8F93FE]">
                          <User className="h-5 w-5" />
                        </span>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[18px] font-medium tracking-[-0.27px] text-[#8F93FE]">
                            {s.shareHolderName} {s.shareHolderSurname}
                          </span>
                          <span className="text-sm text-[#5E666A]">{t("account.corporateInfo.role")}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        aria-label={t("account.bank.actions.delete")}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#FF4D6D] text-[#FF4D6D] transition hover:bg-[#FF4D6D]/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Hesap Yetkilisi */}
            <div className={CARD}>
              <h2 className="mb-2 text-lg font-medium text-[#F4F7F8]">{t("account.corporateInfo.managerTitle")}</h2>
              <div className="flex flex-col py-3">
                {(isLoading
                  ? Array.from({ length: 5 }).map((_, i) => ({ label: "", value: "", _i: i }))
                  : authorityRows
                ).map((row, i) => (
                  <div
                    key={i}
                    className="flex flex-col gap-2 border-b border-[#3A4043] py-5 last:border-b-0 md:flex-row md:items-center md:gap-[120px]"
                  >
                    {isLoading ? (
                      <>
                        <Skeleton className="h-5 w-[160px] bg-white/10" />
                        <Skeleton className="h-4 w-40 bg-white/10" />
                      </>
                    ) : (
                      <>
                        <span className="w-[200px] shrink-0 text-[18px] font-medium tracking-[-0.27px] text-[#8F93FE]">
                          {row.label}
                        </span>
                        <span className="break-all text-base text-[#C5C9CC]">{row.value}</span>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 rounded-[26px] bg-[#0E0F10] p-6 shadow-[0px_2px_8px_0.3px_rgba(58,64,67,0.2)]">
            <h2 className="text-lg font-medium text-[#F4F7F8]">{t("account.corporateTable.title")}</h2>

            <div className="relative w-full max-w-[500px]">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#5E666A]" />
              <input
                type="text"
                placeholder={t("account.corporateTable.searchPlaceholder")}
                className="h-10 w-full rounded-[24px] border border-[#3A4043] bg-[#0E0F10] pl-10 pr-3 text-sm text-[#F4F7F8] outline-none transition placeholder:text-[#5E666A] focus:border-[#5E666A]"
              />
            </div>

            <DataTable<CorpDoc>
              columns={columns}
              data={docs}
              isLoading={isLoading}
              skeletonRows={5}
              tableLayout="fixed"
              getRowId={(doc) => doc.key}
              rowClassName={() => "hover:[&>td]:bg-[#121516]"}
            />

            {!isLoading && (
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-[#788084]">
                  <span>{t("wallet.table.pagination.perPage")}</span>
                  <span className="text-[#F4F7F8]">8</span>
                </div>
                <Pagination currentPage={docPage} totalPages={DOC_PAGE_COUNT} onPageChange={setDocPage} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
