"use client";

import React, { useState } from "react";
import { Info, Download, ChevronDown } from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nProvider";

const documentKeys = ["sig", "gazette", "activity", "tax", "declaration", "petition", "invoice", "ubo"] as const;

export default function WetSignatureDeliveryPage() {
  const { t } = useI18n();
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-4 px-2 pb-10 pt-4">
      <div className="rounded-xl bg-gradient-to-r from-gray-100 via-white to-gray-100 p-4 text-sm text-gray-800 shadow-inner ring-1 ring-gray-200">
        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            <Info className="h-5 w-5 text-indigo-500" />
          </div>
          <div className="flex-1 space-y-1">
            <p className="font-semibold">{t("application.companyInfo.officer.kyc.courierPanel.infoTitle")}</p>
            <p>
              {t("application.companyInfo.officer.kyc.courierPanel.infoContent")}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-[#E8EDF3] bg-white p-4 text-sm shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{t("application.companyInfo.officer.kyc.courierPanel.phoneLabel")}</p>
          <div className="mt-2 flex items-center justify-between rounded-lg border border-[#E8EDF3] px-3 py-2 text-sm font-semibold text-gray-900">
            <span>+90 (539) 646 2665</span>
            <button className="rounded-lg bg-gray-900 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-gray-800">
              {t("application.companyInfo.officer.kyc.courierPanel.sendSms")}
            </button>
          </div>
          <p className="mt-2 text-xs text-rose-600">
            *{t("application.companyInfo.officer.kyc.courierPanel.smsHint")}
          </p>
        </div>

        <div className="rounded-xl border border-[#E8EDF3] bg-white p-4 text-sm shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{t("application.companyInfo.officer.kyc.courierPanel.stepsTitle")}:</p>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-gray-700">
            <li>{t("application.companyInfo.officer.kyc.courierPanel.step1")}</li>
            <li>{t("application.companyInfo.officer.kyc.courierPanel.step2")}</li>
            <li>{t("application.companyInfo.officer.kyc.courierPanel.step3")}</li>
            <li>{t("application.companyInfo.officer.kyc.courierPanel.step4")}</li>
          </ul>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-900">{t("application.companyInfo.officer.kyc.courierPanel.requiredDocuments")}</p>
          <p className="text-xs text-gray-600">
            {t("application.companyInfo.officer.kyc.courierPanel.documentsInfo")}
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-lg border border-[#E8EDF3] bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50">
          <Download className="h-4 w-4" />
          {t("application.companyInfo.officer.kyc.courierPanel.downloadList")}
        </button>
      </div>

      <div className="space-y-1 rounded-2xl border border-[#E8EDF3] bg-white shadow-sm">
        <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500">{t("application.companyInfo.officer.kyc.courierPanel.companyDocuments")}</div>
        {documentKeys.map((docKey) => {
          const isOpen = expanded === docKey;
          return (
            <div key={docKey} className="border-t border-gray-100">
              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : docKey)}
                className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E8EDF3] text-gray-500">📄</span>
                  <span>{t(`application.companyInfo.officer.kyc.courierPanel.documents.${docKey}.title`)}</span>
                </div>
                <ChevronDown className={["h-4 w-4 text-gray-500 transition", isOpen ? "rotate-180" : ""].join(" ")} />
              </button>
              {isOpen && (
                <div className="px-4 pb-3 text-xs text-gray-600">
                  {t("application.companyInfo.officer.kyc.courierPanel.documentHint")}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
