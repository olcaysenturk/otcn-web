"use client";

import React from "react";
import { useApplicationStore } from "@/stores/useApplicationStore";
import { ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nProvider";

export function ApplicationLayoutClient({ children }: { children: React.ReactNode }) {
    const { t } = useI18n();
    const { isSavingGlobal, submitAction } = useApplicationStore();

    return (
        <div className="flex flex-col gap-6">
            <div className="w-full min-w-0">
                {children}
            </div>

            {/* Sticky Bottom Action Bar */}
            {submitAction && (
                <div className="w-full bg-white py-3 px-4 md:px-6 rounded-xl border border-[#E8EDF3]">
                    <div className="flex justify-center md:justify-end">
                        <button
                            onClick={() => submitAction()}
                            disabled={isSavingGlobal}
                            className="flex w-full md:w-[170px] h-[44px] items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#9564F4] to-[#3E1C82] text-sm font-semibold text-white shadow-lg transition hover:opacity-90 disabled:opacity-70"
                        >
                            {isSavingGlobal
                                ? t("form.submitting") || "..."
                                : t("application.companyInfo.buttons.saveContinue")}
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
