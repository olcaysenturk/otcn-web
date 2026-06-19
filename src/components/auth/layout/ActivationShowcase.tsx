"use client";

import { Send, ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { cn } from "@/lib/utils";

export function ActivationShowcase() {
    const { t } = useI18n();
    const steps = [
        {
            id: "activate-account",
            title: t("auth.steps.activate.title"),
            description: t("auth.steps.activate.description"),
        },
        {
            id: "complete-application",
            title: t("auth.steps.application.title"),
            description: t("auth.steps.application.description"),
        },
        {
            id: "start-trading",
            title: t("auth.steps.start.title"),
            description: t("auth.steps.start.description"),
        },
    ].map((step, index) => ({
        ...step,
        number: `${String(index + 1).padStart(2, "0")}.`,
    }));

    return (
        <div className="relative flex min-h-full flex-col items-stretch overflow-hidden bg-black p-6">
            <div className="absolute inset-0 bg-[url('/assets/bitanova/hero-liquid.jpg')] bg-cover bg-center" />
            <div className="absolute inset-0 bg-black/25" />
            <div className="relative z-10 flex min-h-full flex-col rounded-[32px] border border-white/10 bg-[#0B0D0E]/30 p-8 shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl">
                <div>
                    <h2 className="mb-8 max-w-[460px] text-[32px] font-medium leading-12 text-[#F4F7F8]">
                        {t("auth.heading")}
                    </h2>

                    <div className="flex flex-col gap-3">
                        {steps.map((step, index) => (
                            <div
                                key={step.id}
                                className={cn(
                                    "relative pl-[26px] flex flex-col gap-1 py-3",
                                    index !== 0 && "border-l-2 border-[#3A4043]"
                                )}
                            >
                                {index === 0 && (
                                    <div className="absolute bottom-0 left-0 top-0 w-[2px] bg-[#C7F70A]" />
                                )}
                                <div className="text-[12px] leading-4 text-[#C5C9CC]">
                                    {step.number}
                                </div>
                                <h3 className="text-[18px] font-bold leading-7 text-[#F4F7F8]">
                                    {step.title}
                                </h3>
                                <p className="mt-1 max-w-sm text-[14px] leading-5 text-[#C5C9CC]">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Support Section */}
                <div className="relative mt-auto overflow-hidden rounded-[24px] border border-[#3A4043] bg-[#0D0F10]/90 p-5 text-white">
                    {/* Subtle background glow removed as per design request for gradient focus */}

                    <div className="relative z-10 mb-6 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                            <ArrowRight className="h-5 w-5 text-white" />
                        </div>
                        <h4 className="text-[18px] leading-7 font-medium">{t("auth.supportTitle")}</h4>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-xs relative z-10">
                        <div className="space-y-3">
                            <p className="text-[#9CA3AF] text-[10px] leading-3 uppercase font-semibold tracking-wider">{t("auth.supportContact")}</p>
                            <div className="flex gap-2">
                                <a href="#" className="h-8 w-8 flex items-center justify-center rounded-full bg-[#25D366] hover:opacity-80 transition-opacity">
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                </a>
                                <a href="#" className="h-8 w-8 flex items-center justify-center rounded-full bg-[#24A1DE] hover:opacity-80 transition-opacity">
                                    <Send className="h-6 w-6 fill-white text-[#24A1DE] -ml-0.5" />
                                </a>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <p className="text-[#9CA3AF] text-[10px] leading-3 uppercase font-semibold tracking-wider">{t("auth.supportCallCenter")}</p>
                            <p className="text-[12px] leading-3.5 font-medium">{t("auth.supportCallCenterValue")}</p>
                        </div>

                        <div className="space-y-3">
                            <p className="text-[#9CA3AF] text-[10px] leading-3 uppercase font-semibold tracking-wider">{t("auth.supportEmail")}</p>
                            <p className="text-[12px] leading-3.5 font-medium">{t("auth.supportEmailValue")}</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
