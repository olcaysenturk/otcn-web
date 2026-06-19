"use client";

import React, { useMemo, useState, useEffect, useCallback, useRef, useImperativeHandle, forwardRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { withLocale } from "@/lib/i18n/href";
import {
  ArrowRight,
  Banknote,
  Plus,
  Info,
  Check,
} from "lucide-react";

import { useModalStore } from "@/stores/useModalStore";
import { useApplicationStore } from "@/stores/useApplicationStore";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { handleBackendError } from "@/lib/utils/toast";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  getApplicationDetail,
  updateBankInfo,
  updateShareholders,
  updateOfficerInfo
} from "@/services/application";
import type {
  ApplicationDetailResponse,
  BankInfoRequest,
  OfficerInfoRequest,
  ShareholdersRequest
} from "@/types/application";

type InnerStep = "shareholder" | "bank" | "officer";

export default function CompanyInfoPage() {
  const { t, locale } = useI18n();
  const [innerStep, setInnerStep] = useState<InnerStep>("shareholder");
  const [applicationData, setApplicationData] = useState<any>(null);
  const { setSubmitAction, setIsSavingGlobal } = useApplicationStore();
  const stepRef = useRef<{ submit: () => Promise<void> }>(null);

  useEffect(() => {
    setSubmitAction(() => stepRef.current?.submit() || Promise.resolve());
    return () => setSubmitAction(null);
  }, [innerStep, setSubmitAction]);

  const loadData = useCallback(async () => {
    try {
      const data = await getApplicationDetail();
      if (data) {
        setApplicationData(data);
      }
    } catch (error) {
      console.error("Error fetching application detail:", error);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const innerNav = useMemo(
    () => [
      { key: "shareholder", label: t("application.companyInfo.nav.shareholder"), index: 1 },
      { key: "bank", label: t("application.companyInfo.nav.bank"), index: 2 },
      { key: "officer", label: t("application.companyInfo.nav.officer"), index: 3 },
    ],
    [t],
  );

  const currentIndex = useMemo(() => {
    return innerNav.find((item) => item.key === innerStep)?.index || 1;
  }, [innerNav, innerStep]);

  return (
    <div className="space-y-6 rounded-lg bg-transparent">
      <div className={cn("grid gap-4", locale === "en" ? "lg:grid-cols-[290px_1fr]" : "lg:grid-cols-[241px_1fr]")}>
        <div className="rounded-xl border border-[#E8EDF3] bg-white p-1 lg:p-6 lg:h-fit w-full max-w-full overflow-x-auto scroll-smooth no-scrollbar">
          <div className="relative flex flex-row lg:flex-col lg:overflow-visible px-4 lg:mx-0 lg:px-0">
            {innerNav.map((item, index) => {
              const active = innerStep === item.key;
              const isCompleted = item.index < currentIndex;
              const isLast = index === innerNav.length - 1;
              return (
                <div key={item.key} className="relative shrink-0 lg:pb-6 last:pb-0">
                  {!isLast && (
                    <div className={cn(
                      "hidden lg:block absolute left-[19px] top-8 bottom-[-6px] w-px border-l border-dotted z-0",
                      isCompleted ? "border-[#10b981]" : "border-gray-300"
                    )} />
                  )}

                  <button
                    onClick={() => setInnerStep(item.key as InnerStep)}
                    className={cn(
                      "relative z-10 flex w-auto lg:w-full items-center gap-[2px] lg:gap-[10px] rounded-full text-left transition-all whitespace-nowrap py-1.5 px-2.5 lg:py-0 lg:px-0",
                      active
                        ? "bg-[#0F121A] text-white shadow-md pr-4 pl-1.5 py-1.5"
                        : isCompleted
                          ? "text-[#10b981] hover:bg-[#10b981]/5 py-1.5"
                          : "hover:bg-gray-50 text-gray-600 py-1.5"
                    )}
                    type="button"
                  >
                    <span
                      className={cn(
                        "flex lg:h-9 lg:w-9 lg:shrink-0 items-center justify-center rounded-full text-[13px] leading-[18px] font-medium transition-colors lg:border-2",
                        active
                          ? "lg:bg-white lg:text-[#0F121A]"
                          : isCompleted
                            ? "lg:border-[#10b981] lg:bg-white lg:text-[#10b981] bg-[#E9F8F3]!"
                            : "lg:border-gray-200 lg:bg-white lg:text-gray-500"
                      )}
                    >
                      {item.index}<div className="lg:hidden text-inherit">.</div>
                    </span>
                    <span className="font-medium text-xs lg:text-sm leading-4 lg:leading-[19px]">{item.label}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-5">
          {innerStep === "bank" && (
            <BankStep
              ref={stepRef}
              applicationData={applicationData}
              loadData={loadData}
              setInnerStep={setInnerStep}
              setIsSaving={setIsSavingGlobal}
            />
          )}
          {innerStep === "officer" && (
            <OfficerStep
              ref={stepRef}
              applicationData={applicationData}
              loadData={loadData}
              setIsSaving={setIsSavingGlobal}
            />
          )}
          {innerStep === "shareholder" && (
            <ShareholderStep
              ref={stepRef}
              applicationData={applicationData}
              loadData={loadData}
              setInnerStep={setInnerStep}
              setIsSaving={setIsSavingGlobal}
            />
          )}
        </div>
      </div>
    </div>
  );
}

interface StepProps {
  applicationData: any;
  loadData: () => Promise<void>;
  setInnerStep?: (step: InnerStep) => void;
  setIsSaving: (val: boolean) => void;
}

const BankStep = forwardRef<any, StepProps>(({ applicationData, loadData, setInnerStep, setIsSaving }, ref) => {
  const { t } = useI18n();
  const [formData, setFormData] = useState({ bankAccountName: "", taxNumber: "", iban: "" });

  useEffect(() => {
    const app = applicationData?.applications?.[0];
    if (app) {
      setFormData({
        bankAccountName: app.bankAccountName || "",
        taxNumber: app.taxNumber || "",
        iban: app.iban || "",
      });
    }
  }, [applicationData]);

  const isLocked = useMemo(() => {
    const app = applicationData?.applications?.[0];
    return {
      bankAccountName: !!app?.bankAccountName,
      taxNumber: !!app?.taxNumber,
      iban: !!app?.iban,
    };
  }, [applicationData]);

  const onSave = async () => {
    if (!formData.bankAccountName || !formData.taxNumber || !formData.iban) {
      toast.error(t("form.errorTitle"), { description: t("form.errorDescription") });
      return;
    }
    setIsSaving(true);
    try {
      const app = applicationData?.applications?.[0];
      const payload: BankInfoRequest = { applicationId: app?.applicationId || 0, ...formData };
      const res = await updateBankInfo(payload);

      if (!res?.ok) {
        const data = await res?.json().catch(() => null);
        handleBackendError(data, t, t("form.errorTitle"), t("form.errorDescription"));
        return;
      }
      toast.success(t("form.successTitle"));
      await loadData();
      setInnerStep?.("officer");
    } catch (e) {
      toast.error(t("form.errorTitle"));
    } finally {
      setIsSaving(false);
    }
  };

  useImperativeHandle(ref, () => ({ submit: onSave }));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-2">
        <Field
          label={t("application.companyInfo.bank.accountNameLabel")}
          placeholder={t("application.companyInfo.bank.accountNamePlaceholder")}
          value={formData.bankAccountName}
          onChange={isLocked.bankAccountName ? undefined : e => setFormData(p => ({ ...p, bankAccountName: e.target.value }))}
          readOnly={isLocked.bankAccountName}
        />
        <Field
          label={t("application.companyInfo.bank.taxNumberLabel")}
          placeholder={t("application.companyInfo.bank.taxNumberPlaceholder")}
          value={formData.taxNumber}
          onChange={isLocked.taxNumber ? undefined : e => setFormData(p => ({ ...p, taxNumber: e.target.value }))}
          readOnly={isLocked.taxNumber}
        />
        <div className="md:col-span-2">
          <Field
            label={t("application.companyInfo.bank.ibanLabel")}
            placeholder={t("application.companyInfo.bank.ibanPlaceholder")}
            value={formData.iban}
            onChange={isLocked.iban ? undefined : e => setFormData(p => ({ ...p, iban: e.target.value }))}
            readOnly={isLocked.iban}
          />
        </div>
      </div>
    </div>
  );
});

BankStep.displayName = "BankStep";

const ShareholderStep = forwardRef<any, StepProps>(({ applicationData, loadData, setInnerStep, setIsSaving }, ref) => {
  const { t } = useI18n();
  const [isSavingLocal, setIsSavingLocal] = useState(false);
  const [savedShareholders, setSavedShareholders] = useState<any[]>([]);
  const [newShareholder, setNewShareholder] = useState({ name: "", surname: "", identityNumber: "", birthDate: "" });
  const [expanded, setExpanded] = useState("");

  const formatDateToInput = (isoString: string) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const parseDateFromInput = (formatted: string) => {
    if (!formatted) return "";
    const parts = formatted.split("/");
    if (parts.length !== 3) return "";
    const [day, month, year] = parts;
    const date = new Date(`${year}-${month}-${day}`);
    return isNaN(date.getTime()) ? "" : date.toISOString();
  };

  useEffect(() => {
    const app = applicationData?.applications?.[0];
    if (app?.shareHolders?.length > 0) {
      setSavedShareholders(app.shareHolders.map((s: any) => ({
        id: s.shareHolderId?.toString() || crypto.randomUUID(),
        name: s.shareHolderName || "",
        surname: s.shareHolderSurname || "",
        identityNumber: s.shareHolderIdentityNumber || "",
        birthDate: formatDateToInput(s.shareHolderBirthDate),
      })));
    }
  }, [applicationData]);

  const saveNewShareholder = async () => {
    if (!newShareholder.name || !newShareholder.surname || !newShareholder.identityNumber || !newShareholder.birthDate) {
      toast.error(t("form.errorTitle"), { description: t("form.errorDescription") });
      return;
    }
    setIsSavingLocal(true);
    try {
      const app = applicationData?.applications?.[0];
      const payload: ShareholdersRequest = {
        applicationId: app?.applicationId || 0,
        hasAnyShareholder: true,
        shareHolders: [
          ...savedShareholders.map(s => ({
            name: s.name, surname: s.surname, identityNumber: s.identityNumber,
            birthDate: parseDateFromInput(s.birthDate) || new Date().toISOString(),
          })),
          {
            name: newShareholder.name,
            surname: newShareholder.surname,
            identityNumber: newShareholder.identityNumber,
            birthDate: parseDateFromInput(newShareholder.birthDate) || new Date().toISOString()
          }
        ],
      };

      const res = await updateShareholders(payload);

      if (!res?.ok) {
        const data = await res?.json().catch(() => null);
        handleBackendError(data, t, t("form.errorTitle"), t("form.errorDescription"));
        return;
      }
      toast.success(t("form.successTitle"));
      setNewShareholder({ name: "", surname: "", identityNumber: "", birthDate: "" });
      await loadData();
    } catch (e) {
      toast.error(t("form.errorTitle"));
    } finally {
      setIsSavingLocal(false);
    }
  };

  useImperativeHandle(ref, () => ({ submit: async () => setInnerStep?.("bank") }));

  return (
    <div className="space-y-4">
      <div className="flex gap-3 md:gap-4 rounded-xl border border-[#487AF6] bg-[#F2F7FE] items-center p-3 md:p-4 text-xs md:text-sm leading-4 md:leading-[21px] text-[#0F121A]">
        <div className="flex w-6 md:w-9 h-6 md:h-9 shrink-0 items-center justify-center rounded-full border border-[#487AF633] bg-[#487AF60D]">
          <Info className="w-3 h-3 md:w-4 md:h-4" />
        </div>
        <span className="leading-5">{t("application.companyInfo.shareholder.notice")}</span>
      </div>

      <div className="space-y-3">
        {savedShareholders.map(s => {
          const isOpen = expanded === s.id;
          const name = [s.name, s.surname].filter(Boolean).join(" ");
          return (
            <div key={s.id} className="rounded-xl border border-[#E8EDF3] bg-white p-4 md:p-6 space-y-4">
              <button type="button" onClick={() => setExpanded(isOpen ? "" : s.id)} className="flex w-full items-center justify-between text-left">
                <span className="text-base font-semibold text-gray-900">{name}</span>
                <span className="text-lg text-gray-500">{isOpen ? "▴" : "▾"}</span>
              </button>
              {isOpen && (
                <div className="grid gap-6 md:gap-7 md:grid-cols-2">
                  <Field label={t("application.companyInfo.shareholder.fields.nameLabel")} value={s.name} placeholder={t("application.companyInfo.shareholder.fields.namePlaceholder")} />
                  <Field label={t("application.companyInfo.shareholder.fields.surnameLabel")} value={s.surname} placeholder={t("application.companyInfo.shareholder.fields.surnamePlaceholder")} />
                  <Field label={t("application.companyInfo.shareholder.fields.nationalIdLabel")} value={s.identityNumber} placeholder={t("application.companyInfo.shareholder.fields.nationalIdPlaceholder")} />
                  <Field label={t("application.companyInfo.shareholder.fields.birthLabel")} value={s.birthDate} placeholder={t("application.companyInfo.shareholder.fields.birthPlaceholder")} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-[#E8EDF3] bg-white p-5 md:p-6 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label={t("application.companyInfo.shareholder.fields.nameLabel")} placeholder={t("application.companyInfo.shareholder.fields.namePlaceholder")} value={newShareholder.name} onChange={e => setNewShareholder(p => ({ ...p, name: e.target.value }))} />
          <Field label={t("application.companyInfo.shareholder.fields.surnameLabel")} placeholder={t("application.companyInfo.shareholder.fields.surnamePlaceholder")} value={newShareholder.surname} onChange={e => setNewShareholder(p => ({ ...p, surname: e.target.value }))} />
          <Field label={t("application.companyInfo.shareholder.fields.nationalIdLabel")} placeholder={t("application.companyInfo.shareholder.fields.nationalIdPlaceholder")} value={newShareholder.identityNumber} onChange={e => setNewShareholder(p => ({ ...p, identityNumber: e.target.value }))} />
          <Field label={t("application.companyInfo.shareholder.fields.birthLabel")} placeholder={t("application.companyInfo.shareholder.fields.birthPlaceholder")} value={newShareholder.birthDate} onChange={e => {
            let val = e.target.value.replace(/\D/g, "");
            if (val.length > 8) val = val.slice(0, 8);
            if (val.length > 4) val = val.slice(0, 2) + "/" + val.slice(2, 4) + "/" + val.slice(4);
            else if (val.length > 2) val = val.slice(0, 2) + "/" + val.slice(2);
            setNewShareholder(p => ({ ...p, birthDate: val }));
          }} />
        </div>
        <button onClick={saveNewShareholder} disabled={isSavingLocal} className="inline-flex items-center gap-2 rounded-full border border-[#25B88A] px-4 py-2.5 text-xs font-semibold text-[#25B88A]">
          <Plus className="h-4 w-4" />
          {isSavingLocal ? t("form.submitting") : t("application.companyInfo.buttons.addShareholder")}
        </button>
        {savedShareholders.length === 0 && (
          <>
            <div className="h-px w-full bg-[#E8EDF3] mt-6 md:mt-8" />
            <label className="flex items-start gap-3 cursor-pointer py-2.5 mt-6 md:mt-10">
              <input type="checkbox" className="mt-0.5 h-4 w-4 rounded border-gray-300 text-gray-600" />
              <span className="text-[13px] md:text-sm text-gray-600 leading-[18px] md:leading-5">{t("application.companyInfo.shareholder.noShareholderCheckbox")}</span>
            </label>
          </>
        )}
      </div>
    </div>
  );
});

ShareholderStep.displayName = "ShareholderStep";

const OfficerStep = forwardRef<any, StepProps>(({ applicationData, loadData, setIsSaving }, ref) => {
  const { t } = useI18n();
  const router = useRouter();
  const params = useParams();
  const { openModal } = useModalStore();
  const [formData, setFormData] = useState({ name: "", surname: "", userIdentityNumber: "", userBirthDate: "", userSerialNumber: "" });

  const formatDateToInput = (isoString: string) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const parseDateFromInput = (formatted: string) => {
    if (!formatted) return "";
    const parts = formatted.split("/");
    if (parts.length !== 3) return "";
    const [day, month, year] = parts;
    const date = new Date(`${year}-${month}-${day}`);
    return isNaN(date.getTime()) ? "" : date.toISOString();
  };

  useEffect(() => {
    const app = applicationData?.applications?.[0];
    if (app) {
      setFormData({
        name: app.userName || "",
        surname: app.userSurname || "",
        userIdentityNumber: app.userIdentityNumber || "",
        userBirthDate: formatDateToInput(app.userBirthDate),
        userSerialNumber: app.userSerialNumber || "",
      });
    }
  }, [applicationData]);

  const isLocked = useMemo(() => {
    const app = applicationData?.applications?.[0];
    return {
      name: !!app?.userName,
      surname: !!app?.userSurname,
      userIdentityNumber: !!app?.userIdentityNumber,
      userBirthDate: !!app?.userBirthDate,
      userSerialNumber: !!app?.userSerialNumber,
    };
  }, [applicationData]);

  const onSave = async () => {
    if (!formData.userIdentityNumber || !formData.userBirthDate || !formData.userSerialNumber) {
      toast.error(t("form.errorTitle"), { description: t("form.errorDescription") });
      return;
    }
    setIsSaving(true);
    try {
      const app = applicationData?.applications?.[0];
      const payload: OfficerInfoRequest = {
        applicationId: app?.applicationId || 0,
        userIdentityNumber: formData.userIdentityNumber,
        userBirthDate: parseDateFromInput(formData.userBirthDate),
        userIdentitySerialNumber: formData.userSerialNumber,
      };

      const res = await updateOfficerInfo(payload);

      if (!res?.ok) {
        const data = await res?.json().catch(() => null);
        handleBackendError(data, t, t("form.errorTitle"), t("form.errorDescription"));
        return;
      }
      toast.success(t("form.successTitle"));
      await loadData();
      router.push(`/${params?.locale || "en"}/application/digital-document-upload`);
    } catch (e) {
      toast.error(t("form.errorTitle"));
    } finally {
      setIsSaving(false);
    }
  };

  useImperativeHandle(ref, () => ({ submit: onSave }));

  return (
    <div className="space-y-6">
      <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-2">
        <Field
          label={t("application.companyInfo.officer.fields.nameLabel")}
          value={formData.name}
          onChange={isLocked.name ? undefined : e => setFormData(p => ({ ...p, name: e.target.value }))}
          placeholder={t("application.companyInfo.officer.fields.namePlaceholder")}
          readOnly={isLocked.name}
        />
        <Field
          label={t("application.companyInfo.officer.fields.surnameLabel")}
          value={formData.surname}
          onChange={isLocked.surname ? undefined : e => setFormData(p => ({ ...p, surname: e.target.value }))}
          placeholder={t("application.companyInfo.officer.fields.surnamePlaceholder")}
          readOnly={isLocked.surname}
        />
        <Field
          label={t("application.companyInfo.officer.fields.nationalIdLabel")}
          value={formData.userIdentityNumber}
          onChange={isLocked.userIdentityNumber ? undefined : e => setFormData(p => ({ ...p, userIdentityNumber: e.target.value }))}
          placeholder={t("application.companyInfo.officer.fields.nationalIdPlaceholder")}
          readOnly={isLocked.userIdentityNumber}
        />
        <Field
          label={t("application.companyInfo.officer.fields.birthLabel")}
          value={formData.userBirthDate}
          onChange={isLocked.userBirthDate ? undefined : e => {
            let val = e.target.value.replace(/\D/g, "");
            if (val.length > 8) val = val.slice(0, 8);
            if (val.length > 4) val = val.slice(0, 2) + "/" + val.slice(2, 4) + "/" + val.slice(4);
            else if (val.length > 2) val = val.slice(0, 2) + "/" + val.slice(2);
            setFormData(p => ({ ...p, userBirthDate: val }));
          }}
          placeholder={t("application.companyInfo.officer.fields.birthPlaceholder")}
          readOnly={isLocked.userBirthDate}
        />
        <Field
          label={t("application.companyInfo.officer.fields.serialNumberLabel")}
          value={formData.userSerialNumber}
          onChange={isLocked.userSerialNumber ? undefined : e => setFormData(p => ({ ...p, userSerialNumber: e.target.value }))}
          placeholder={t("application.companyInfo.officer.fields.serialNumberPlaceholder")}
          readOnly={isLocked.userSerialNumber}
        />
      </div>

      <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h3 className="text-[18px] leading-[27px] font-medium text-[#0F121A]">{t("application.companyInfo.officer.kyc.title")}</h3>
          <p className="text-sm md:text-base leading-[19px] md:leading-6 text-[#4F5C75]">{t("application.companyInfo.officer.kyc.description")}</p>
        </div>
        <div className="flex flex-col md:flex-row gap-3 md:gap-6">
          <KycCard
            title={t("application.companyInfo.officer.kyc.digitalTitle")}
            desc={t("application.companyInfo.officer.kyc.digitalDesc")}
            badge={t("application.companyInfo.officer.kyc.badge")}
            iconSrc="/icons/digital-kyc.png"
            onClick={() => openModal("digital-kyc")}
          />
          <KycCard
            title={t("application.companyInfo.officer.kyc.courierTitle")}
            desc={t("application.companyInfo.officer.kyc.courierDesc")}
            badge={t("application.companyInfo.officer.kyc.courierLink")}
            iconSrc="/icons/courier-kyc.png"
            onClick={() => openModal("courier-kyc", { phone: applicationData?.applications?.[0]?.phone })}
          />
        </div>
      </div>
    </div>
  );
});

OfficerStep.displayName = "OfficerStep";

function Field({ label, placeholder, trailing, value, onChange, readOnly }: { label: string; placeholder: string; trailing?: string; value?: string; onChange?: React.ChangeEventHandler<HTMLInputElement>; readOnly?: boolean }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm leading-3.5 font-medium text-theme-text-body">{label}</span>
      <div className="relative">
        <input
          className={cn(
            "h-[38px] md:h-11 w-full rounded-lg border border-[#E8EDF3] bg-white px-4 text-[13px] md:text-sm leading-[18px] md:leading-5 font-normal text-gray-steel focus:outline-none",
            readOnly && "cursor-not-allowed opacity-70"
          )}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          readOnly={readOnly || !onChange}
        />
        {trailing && <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">{trailing}</span>}
      </div>
    </label>
  );
}

function KycCard({ title, desc, onClick, badge, iconSrc }: { title: string; desc: string; onClick?: () => void; badge?: string; iconSrc: string }) {
  return (
    <button type="button" onClick={onClick} className="relative flex flex-row gap-4 items-center rounded-xl border border-[#E8EDF3] bg-white p-3 md:px-4 md:py-5 text-left w-full group">
      <div className="absolute md:relative left-3 top-3 md:left-0 md:top-0 flex h-6 md:h-9 w-6 md:w-9 items-center justify-center rounded-full bg-[radial-gradient(circle,#582FD90D_0%,#582FD91A_70%,#582FD933_100%)] shrink-0">
        <Image src={iconSrc} alt="" width={20} height={20} className="w-3 md:w-5 h-3 md:h-5 object-contain" />
      </div>
      <div className="flex flex-col gap-3 md:gap-0.5 pr-20">
        <p className="font-semibold text-xs md:text-sm leading-6 md:leading-[18px] text-[#0F121A] pl-9 md:pl-0">{title}</p>
        <p className="text-[#4F5C75] text-[12px] leading-[16px]">{desc}</p>
      </div>
      {badge && (
        <span className="border border-[#487AF6] rounded-full py-1 px-1.5 text-[#487AF6] flex flex-row items-center gap-1 absolute right-3 md:right-4 top-3 md:top-4 text-[10px]">
          <Check className="w-2.5 h-2.5" />
          {badge}
        </span>
      )}
    </button>
  );
}
