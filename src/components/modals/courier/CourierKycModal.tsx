"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Check, ChevronDown, ChevronRight, Info, X } from "lucide-react";

import { useModalStore } from "@/stores/useModalStore";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function CourierKycModal() {
  const { closeModal, isClosing, data } = useModalStore();
  const { t } = useI18n();
  const modalData = data as { phone?: string } | undefined;
  const phoneNumber = modalData?.phone || "";

  const [expanded, setExpanded] = useState<string | null>(null);
  const [view, setView] = useState<"form" | "list">("form");
  const [smsSent, setSmsSent] = useState(false);
  const [counter, setCounter] = useState(60);

  const documentKeys = ["sig", "gazette", "activity", "tax", "declaration", "petition", "invoice", "ubo"] as const;
  const bulletCounts: Record<string, number> = { sig: 3, gazette: 2, activity: 2, tax: 1, declaration: 1, petition: 1, invoice: 1, ubo: 1 };

  const documents = documentKeys.map((key) => ({
    key,
    title: t(`application.companyInfo.officer.kyc.courierPanel.documents.${key}.title`),
    bullets: Array.from({ length: bulletCounts[key] }, (_, i) =>
      t(`application.companyInfo.officer.kyc.courierPanel.documents.${key}.bullets.${i}`)
    ),
    sampleTitle: t(`application.companyInfo.officer.kyc.courierPanel.documents.${key}.sampleTitle`),
    sampleDesc: t(`application.companyInfo.officer.kyc.courierPanel.documents.${key}.sampleDesc`),
    download: t(`application.companyInfo.officer.kyc.courierPanel.documents.${key}.download`),
  }));

  const steps = [
    t("application.companyInfo.officer.kyc.courierPanel.step1"),
    t("application.companyInfo.officer.kyc.courierPanel.step2"),
    t("application.companyInfo.officer.kyc.courierPanel.step3"),
    t("application.companyInfo.officer.kyc.courierPanel.step4"),
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (smsSent && counter > 0) {
      timer = setInterval(() => {
        setCounter((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [smsSent, counter]);

  const handleSend = () => {
    setSmsSent(true);
    setCounter(60);
  };

  const handleResend = () => {
    setCounter(60);
  };

  return (
    <div
      onClick={closeModal}
      className="pointer-events-auto absolute inset-0 z-20 flex items-start justify-center overflow-auto p-4 md:items-start md:pt-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "relative z-20 flex h-full w-full max-h-[95vh] max-w-[520px] flex-col overflow-hidden rounded-[1.75rem] p-1 gap-2 bg-gradient-modal-1 shadow-2xl ring-1 ring-black/5 lg:ml-auto transition-all",
          isClosing ? "animate-slide-out-to-right" : "animate-slide-in-from-right"
        )}
      >
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 h-12 text-white">
          <div className="flex items-center gap-3">
            {view === "list" && (
              <button
                type="button"
                onClick={() => setView("form")}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-white transition hover:bg-white/10"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}
            <h3 className="text-base font-semibold">
              {view === "list"
                ? t("application.companyInfo.officer.kyc.courierPanel.requiredDocuments")
                : t("application.companyInfo.officer.kyc.courierPanel.title")}
            </h3>
          </div>
          <button
            onClick={closeModal}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-white transition hover:bg-white/10"
            aria-label="Kapat"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        {/* Content Container */}
        <div className="flex-1 flex flex-col min-h-0 bg-white rounded-3xl overflow-hidden">
          <div className="custom-scrollbar flex-1 overflow-y-auto px-4 lg:px-6 py-6 space-y-6 lg:space-y-5">
            {view === "list" ? (
              <>
                <div className="flex items-start gap-3 rounded-2xl border border-[#487AF6] bg-[#F2F7FE] p-4 text-[13px] leading-[18px] text-[#0F121A]">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#487AF633] bg-[#487AF60D] text-[#487AF6]">
                    <Info className="h-3 w-3" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="text-xs lg:text-sm leading-4 lg:leading-[19px] font-bold text-[#0F121A]">{t("application.companyInfo.officer.kyc.courierPanel.infoTitle")}</p>
                    <p>{t("application.companyInfo.officer.kyc.courierPanel.documentsInfo")}</p>
                  </div>
                </div>

                <div className="space-y-4 lg:space-y-4 pt-1">
                  <p className="text-4 font-medium text-[#0F121A] leading-6">
                    {t("application.companyInfo.officer.kyc.courierPanel.companyDocuments")}
                  </p>
                  <div className="space-y-3">
                    {documents.map((doc, idx) => {
                      const isOpen = expanded === doc.key;
                      return (
                        <div
                          key={doc.key}
                          className="rounded-2xl border border-[#E8EDF3] bg-white px-4 py-3 transition hover:border-[#D0E1FD]"
                        >
                          <button
                            type="button"
                            className="flex w-full items-center justify-between text-[14px] leading-5 font-bold text-[#0F121A]"
                            onClick={() => setExpanded(isOpen ? null : doc.key)}
                          >
                            <div className="flex items-center gap-3">
                              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F2F0FF]">
                                <span className="text-[#582FD9]">📄</span>
                              </span>
                              <span>{doc.title}</span>
                            </div>
                            <ChevronDown
                              className={cn(
                                "h-5 w-5 text-[#6F7B91] transition",
                                isOpen ? "rotate-180" : "rotate-0"
                              )}
                            />
                          </button>
                          {isOpen && (
                            <div className="mt-4 space-y-5 animate-in fade-in slide-in-from-top-2 duration-200">
                              <ul className="space-y-4 lg:space-y-6">
                                {doc.bullets.map((bullet, bIdx) => (
                                  <li key={bIdx} className="flex items-start gap-3 text-[13px] leading-[18px] text-[#0F121A]">
                                    <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0F121A]" />
                                    {bullet}
                                  </li>
                                ))}
                              </ul>

                              {/* Sample File Box */}
                              <div className="flex items-center justify-between rounded-xl bg-[#F3EFFF80] p-4 border border-[#F3EFFF]">
                                <div className="space-y-1">
                                  <p className="text-[13px] lg:text-sm leading-[18px] lg:leading-[19px] font-medium text-[#0F121A]">{doc.sampleTitle}</p>
                                  <p className="text-[12px] lg:text-[13px] leading-4 lg:leading-[19px] text-[#4F5C75]">{doc.sampleDesc}</p>
                                </div>
                                <button className="flex items-center gap-2 rounded-full h-[30px] border border-[#0F121A] px-3 py-2 text-[10px] leading-3 font-bold text-[#0F121A]">
                                  {doc.download}
                                  <ChevronRight className="h-3 w-4" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Info Box */}
                <div className="flex flex-col gap-4 rounded-2xl border border-[#487AF6] bg-[#F2F7FE] p-3 lg:p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#487AF633] text-[#487AF6]" style={{ background: "radial-gradient(circle, rgba(72,122,246,0.05) 0%, rgba(72,122,246,0.10) 50%, rgba(72,122,246,0.20) 100%)" }}>
                      <Info className="h-3 w-3" />
                    </div>
                    <div className="flex-1 space-y-2 lg:space-y-4">
                      <p className="text-xs lg:text-[14px] leading-4 lg:leading-[19px] font-bold text-[#0F121A]">{t("application.companyInfo.officer.kyc.courierPanel.infoTitle")}</p>
                      <p className="text-xs lg:text-[13px] leading-4 lg:leading-[18px] text-[#4F5C75]">
                        {t("application.companyInfo.officer.kyc.courierPanel.infoContent")}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setView("list")}
                    className="flex items-center justify-center gap-1 self-end rounded-full border border-[#0F121A] px-4 py-2 text-xs font-semibold text-[#0F121A] transition hover:bg-[#F8FAFC]"
                  >
                    {t("application.companyInfo.officer.kyc.courierPanel.viewDocumentList")}
                    <ChevronRight className="h-3.5 w-3.5 text-[#6F7B91]" />
                  </button>
                </div>

                {/* SMS Section */}
                <div className="rounded-2xl border border-[#E8EDF3] p-5 space-y-4">
                  <label className="block text-[14px] leading-3.5 font-medium text-[#4F5C75] tracking-wide">
                    {t("application.companyInfo.officer.kyc.courierPanel.phoneLabel")}
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex flex-1 items-center h-11 rounded-xl border border-[#E8EDF3] bg-white px-4 text-[14px] font-semibold text-[#0F121A]">
                      <span>{phoneNumber}</span>
                    </div>
                    <Button
                      onClick={handleSend}
                      variant="dark"
                      className="h-11 px-4 text-xs font-bold whitespace-nowrap"
                      disabled={smsSent}
                    >
                      {t("application.companyInfo.officer.kyc.courierPanel.sendSms")}
                    </Button>

                  </div>

                  {!smsSent ? (
                    <p className="text-[13px] leading-[18px] text-[#0F121A]">
                      {t("application.companyInfo.officer.kyc.courierPanel.smsHint")}
                    </p>
                  ) : (
                    <div className="space-y-3 pt-1">

                      <div className="flex flex-col items-center gap-2 text-[13px] text-[#0F121A]">
                        <span className="flex items-center justify-center w-16 h-[30px] rounded-lg bg-[#F8FAFC] border border-[#F1F5F9] font-bold text-[#0F121A] text-4 leading-5">
                          {`00:${counter.toString().padStart(2, "0")}`}
                        </span>
                        <div className="flex flex-row gap-1 text-4 leading-6 text-[#4F5C75]">
                          <span>{t("application.companyInfo.officer.kyc.courierPanel.smsNotReceived")}</span>
                          <button
                            className="font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handleResend}
                            disabled={counter > 0}
                          >
                            {t("application.companyInfo.officer.kyc.courierPanel.resendSms")}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Steps Section */}
                <div className="rounded-2xl border border-[#E8EDF3] p-5 space-y-6">
                  <h3 className="text-4 lg:text-[18px] leading-6 lg:leading-[27px] font-medium text-[#0F121A]">
                    {t("application.companyInfo.officer.kyc.courierPanel.stepsTitle")}
                  </h3>
                  <div className="space-y-3 lg:space-y-5">
                    {steps.map((step, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F2F0FF] text-[13px] lg:text-[14px] leading-[18px] lg:leading-[19px] font-semibold text-[#582FD9]">
                          {index + 1}
                        </div>
                        <p className="text-sm leading-[19px] text-[#0F121A]">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {view === "list" && (
            <div className="px-4 lg:px-6 py-3 bg-white border-t border-gray-100 flex gap-3">
              <Button
                variant="outline"
                className="flex-1 h-9 text-xs leading-4 font-bold text-[#0F121A] border-[#E8EDF3] hover:bg-[#F8FAFC]"
                onClick={() => setView("form")}
              >
                {t("application.companyInfo.officer.kyc.courierPanel.backToCourier")}
              </Button>
              <Button
                variant="dark"
                className="flex-1 h-9 text-xs leading-4 font-bold"
              >
                {t("application.companyInfo.officer.kyc.courierPanel.downloadList")}
              </Button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
