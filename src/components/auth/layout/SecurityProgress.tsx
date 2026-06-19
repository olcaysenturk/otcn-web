"use client";

import { Mail, Smartphone, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/I18nProvider";

type SecurityStep = "email" | "phone" | "2fa";

interface SecurityProgressProps {
    currentStep: SecurityStep;
    progress?: number; // 0-100 for the current step's line
    isLoading?: boolean;
}

export function SecurityProgress({ currentStep, progress = 0, isLoading }: SecurityProgressProps) {
    const { t } = useI18n();

    const steps = [
        {
            id: "email",
            label: t("auth.securityRequired.items.email"),
            icon: Mail,
        },
        {
            id: "phone",
            label: t("auth.securityRequired.items.phone"),
            icon: Smartphone,
        },
        {
            id: "2fa",
            label: t("auth.securityRequired.items.twofa"),
            icon: ShieldCheck,
        },
    ];

    const currentStepIndex = steps.findIndex((s) => s.id === currentStep);
    const isLastStep = currentStepIndex === steps.length - 1;

    // Calculate total progress: (completed steps + partial progress of current)
    // Each step segment is (100 / (steps.length - 1)) %
    const stepSegmentWidth = 100 / (steps.length - 1);
    const totalPercentage = (currentStepIndex * stepSegmentWidth) + (progress * stepSegmentWidth / 100);

    return (
        <div className="relative mx-auto mb-14 w-full max-w-[500px]">
            {/* Progress Lines Container - Inset by half circle width (10px) */}
            <div className="absolute left-[10px] right-[10px] top-[10px] -translate-y-1/2">
                {/* Background Line */}
                <div className="h-[3px] w-full rounded-full bg-[#3A4043]" />

                {/* Completed Segments Line (Green) */}
                <div
                    className="absolute left-0 top-0 h-[3px] rounded-full bg-[#22E6AE] transition-all duration-500"
                    style={{ width: `${Math.min(currentStepIndex * stepSegmentWidth, 100)}%` }}
                />

                {/* Current Step Progress Line (Black) */}
                {!isLastStep && (
                    <div
                        className="absolute top-0 h-[3px] rounded-full bg-[#F4F7F8] transition-all duration-500"
                        style={{
                            left: `${(currentStepIndex * stepSegmentWidth)}%`,
                            width: `${(progress * stepSegmentWidth / 100)}%`
                        }}
                    />
                )}
            </div>

            <div className="relative flex justify-between w-full">
                {steps.map((step, index) => {
                    const isActive = index === currentStepIndex;
                    const isCompleted = index < currentStepIndex;
                    const isFirst = index === 0;
                    const isLast = index === steps.length - 1;
                    const Icon = step.icon;

                    return (
                        <div key={step.id} className="relative flex flex-col items-center w-5 h-5">
                            {/* Circle */}
                            <div
                                className={cn(
                                    "relative z-10 flex h-5 w-5 items-center justify-center rounded-full border-2 bg-[#0D0F10] transition-colors duration-300",
                                    isCompleted ? "border-[#22E6AE] bg-[#22E6AE]" :
                                        isActive ? "border-[#F4F7F8] ring-4 ring-[#8D8CFF]/20" : "border-[#3A4043]"
                                )}
                            >
                                {isActive && <div className="h-2.5 w-2.5 rounded-full bg-[#8D8CFF]" />}
                                {isCompleted && (
                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>

                            {/* Label - Center-aligned relative to the point, but forced in-bounds on mobile edges */}
                            <div
                                className={cn(
                                    "absolute top-10 flex items-center gap-1.5 transition-colors duration-300",
                                    isActive ? "text-[#9A98FF]" : isCompleted ? "text-[#F4F7F8]" : "text-[#5E666A]",
                                    // Base: center aligned
                                    "left-1/2 -translate-x-1/2",
                                    // Mobile specific: override first/last to stay within container
                                    isFirst && "max-md:left-0 max-md:translate-x-0",
                                    isLast && "max-md:left-auto max-md:right-0 max-md:translate-x-0"
                                )}
                            >
                                <Icon className="w-4 h-4" />
                                <span className="text-[13px] md:text-base leading-[18px] md:leading-6 font-medium whitespace-nowrap">{step.label}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
