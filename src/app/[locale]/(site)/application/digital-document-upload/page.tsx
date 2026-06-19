"use client";

import React from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";

const rows = [
  { nameKey: "declaration", upload: "Jun 02, 2025", last: "Jun 02, 2025", status: "pending", action: "upload" },
  { nameKey: "petition", upload: "Jun 03, 2025", last: "Jun 03, 2025", status: "pending", action: "upload" },
  { nameKey: "signatureCircular", upload: "Jun 04, 2025", last: "Jun 04, 2025", status: "pending", action: "upload" },
  { nameKey: "taxPlate", upload: "Jun 05, 2025", last: "Jun 05, 2025", status: "approved", action: "view" },
  { nameKey: "activityCertificate", upload: "Jun 06, 2025", last: "Jun 06, 2025", status: "rejected", action: "reason" },
  { nameKey: "tradeRegistry", upload: "Jun 07, 2025", last: "Jun 07, 2025", status: "reviewing", action: "view" },
  { nameKey: "shareholderInfo1", upload: "Jun 08, 2025", last: "Jun 08, 2025", status: "reviewing", action: "view" },
  { nameKey: "shareholderInfo2", upload: "Jun 09, 2025", last: "Jun 09, 2025", status: "reviewing", action: "view" },
  { nameKey: "invoice", upload: "Jun 10, 2025", last: "Jun 10, 2025", status: "reviewing", action: "view" },
  { nameKey: "ubo", upload: "Jun 10, 2025", last: "Jun 10, 2025", status: "approved", action: "view" },
];

function statusBadge(status: string, t: (key: string) => string) {
  switch (status) {
    case "pending":
      return <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">{t("application.digitalDocumentUpload.status.pending")}</span>;
    case "approved":
      return <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{t("application.digitalDocumentUpload.status.approved")}</span>;
    case "rejected":
      return <span className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">{t("application.digitalDocumentUpload.status.rejected")}</span>;
    case "reviewing":
      return <span className="rounded-full border border-fuchsia-200 bg-fuchsia-50 px-3 py-1 text-xs font-semibold text-fuchsia-700">{t("application.digitalDocumentUpload.status.reviewing")}</span>;
    default:
      return null;
  }
}

export default function DigitalDocumentUploadPage() {
  const { t } = useI18n();

  return (
    <div className="space-y-4 px-2 pb-8 pt-4">
      <div className="rounded-xl bg-gradient-to-r from-gray-100 via-white to-gray-100 p-4 text-sm text-gray-800 shadow-inner ring-1 ring-gray-200">
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-600">🛡️</span>
            </div>
            <div className="flex-1 space-y-1">
              <p className="font-semibold">{t("application.digitalDocumentUpload.infoTitle")}</p>
              <p>
                {t("application.digitalDocumentUpload.infoDescription")}
              </p>
            </div>
          </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#E8EDF3] bg-white shadow-sm">
        <table className="w-full text-sm text-gray-800">
          <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-600">
            <tr>
              <th className="px-4 py-3">{t("application.digitalDocumentUpload.table.documentName")}</th>
              <th className="px-4 py-3">{t("application.digitalDocumentUpload.table.uploadDate")}</th>
              <th className="px-4 py-3">{t("application.digitalDocumentUpload.table.lastActionDate")}</th>
              <th className="px-4 py-3">{t("application.digitalDocumentUpload.table.status")}</th>
              <th className="px-4 py-3 text-right"> </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3">{t(`application.digitalDocumentUpload.documents.${row.nameKey}`)}</td>
                <td className="px-4 py-3 text-gray-700">{row.upload}</td>
                <td className="px-4 py-3 text-gray-700">{row.last}</td>
                <td className="px-4 py-3">{statusBadge(row.status, t)}</td>
                <td className="px-4 py-3 text-right">
                  {row.action === "upload" ? (
                    <button className="rounded-lg bg-gray-900 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-gray-800">
                      {t("application.digitalDocumentUpload.actions.uploadDocument")}
                    </button>
                  ) : row.action === "reason" ? (
                    <button className="rounded-lg border border-[#E8EDF3] px-3 py-2 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50">
                      {t("application.digitalDocumentUpload.actions.viewRejectionReason")}
                    </button>
                  ) : (
                    <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E8EDF3] text-gray-500 transition hover:bg-gray-50">
                      <span className="text-lg">🔍</span>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50 px-4 py-3">
          <button className="flex items-center gap-2 rounded-lg border border-[#E8EDF3] px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-100">
            {t("application.digitalDocumentUpload.actions.startCourierRequest")}
          </button>
          <button className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800">
            {t("common.actions.continue")}
          </button>
        </div>
      </div>
    </div>
  );
}
