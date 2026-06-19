"use client";

import React from "react";
import { Mail, MessageCircle, Send } from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nProvider";

export default function ReviewProcessPage() {
  const { t } = useI18n();

  return (
    <div className="space-y-4 px-2 pb-10 pt-4">
      <div className="grid gap-4 lg:grid-cols-[2fr_1.2fr]">
        <div className="rounded-2xl border border-[#E8EDF3] bg-white p-6 text-center shadow-sm">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-500 ring-1 ring-amber-100">
              <span className="text-2xl">⏳</span>
            </div>
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">{t("application.reviewProcess.title")}</h1>
          <p className="mt-2 text-sm text-gray-700">{t("application.reviewProcess.subtitle")}</p>

          <div className="mt-6 rounded-xl bg-gradient-to-r from-gray-100 via-white to-gray-100 px-4 py-5 text-sm text-gray-800 shadow-inner ring-1 ring-gray-200">
            {t("application.reviewProcess.description")}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-[#E8EDF3] bg-white p-5 shadow-sm">
            <div className="flex items-start gap-2 text-sm text-gray-800">
              <Mail className="mt-0.5 h-4 w-4 text-gray-600" />
              <div>
                <p className="text-base font-semibold text-gray-900">{t("application.reviewProcess.notificationTitle")}</p>
                <p className="mt-1 text-sm text-gray-700">
                  {t("application.reviewProcess.notificationDescription")}
                </p>
                <div className="mt-4 space-y-2 rounded-xl border border-gray-100 bg-gray-50 px-3 py-3">
                  <div className="grid grid-cols-[130px_1fr] text-sm text-gray-800">
                    <span className="font-semibold text-gray-600">{t("application.reviewProcess.emailLabel")}</span>
                    <span>ezgikaptanoglu@switas.com</span>
                  </div>
                  <div className="grid grid-cols-[130px_1fr] text-sm text-gray-800">
                    <span className="font-semibold text-gray-600">{t("application.reviewProcess.phoneLabel")}</span>
                    <span>0539 646 2665</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E8EDF3] bg-white p-5 shadow-sm">
            <p className="text-base font-semibold text-gray-900">{t("application.reviewProcess.helpTitle")}</p>
            <p className="mt-1 text-sm text-gray-700">
              {t("application.reviewProcess.helpDescription")}
            </p>

            <div className="mt-4 grid grid-cols-[110px_1fr] items-center gap-2 text-sm text-gray-800">
              <span className="font-semibold text-gray-600">{t("application.reviewProcess.emailLabel")}</span>
              <span className="text-gray-900">otcn@mail.com</span>
              <span className="font-semibold text-gray-600">{t("application.reviewProcess.callCenterLabel")}</span>
              <span className="text-gray-900">444 44 44</span>
              <span className="font-semibold text-gray-600">{t("application.reviewProcess.contactLabel")}</span>
              <div className="flex items-center gap-3 text-gray-900">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 text-green-600">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 text-sky-500">
                  <Send className="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
