"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { SvgIcon } from "./svg-icon";

export interface StepConfig {
    iconPath: string;
    title: string;
    label?: string;
}

interface ProgressBarProps {
    percentage: number;
    stepNumber?: number;
    configs: StepConfig[];
    className?: string;
}

interface StepState {
    isCompleted: boolean;
    isActive: boolean;
    isPending: boolean;
}

export function ProgressBar({
    percentage,
    stepNumber,
    configs,
    className,
}: ProgressBarProps) {
    const steps = stepNumber || configs.length;

    const stepRef = useRef<HTMLDivElement | null>(null);
    const [stepWidth, setStepWidth] = useState(0);
    const clampedPercentage = Math.max(0, Math.min(100, percentage));

    useEffect(() => {
        const calculateMargins = () => {
            if (!stepRef.current) return;
            const stepWidth = stepRef.current.offsetWidth;
            setStepWidth(stepWidth);
        };

        calculateMargins();
        window.addEventListener('resize', calculateMargins);
        return () => window.removeEventListener('resize', calculateMargins);
    }, [steps, configs]);

    const getStepState = (stepIndex: number): StepState => {
        const stepPosition = (stepIndex / (steps - 1)) * 100;

        const isPassed = clampedPercentage >= stepPosition;
        const isLast = stepIndex === steps - 1;
        const isFullComplete = clampedPercentage === 100;

        if (isLast && isFullComplete) {
            return { isCompleted: true, isActive: false, isPending: false };
        }

        if (isPassed) {
            const nextStepPosition = ((stepIndex + 1) / (steps - 1)) * 100;
            if (stepIndex < steps - 1 && clampedPercentage >= nextStepPosition) {
                return { isCompleted: true, isActive: false, isPending: false };
            }
            return { isCompleted: false, isActive: true, isPending: false };
        }

        return { isCompleted: false, isActive: false, isPending: true };
    };

    return (
        <div className={cn("relative w-full mb-8", className)}>
            <div className="absolute inset-x-0 top-1/4 -translate-y-1/2 z-0" style={{ left: `${stepWidth / 2}px`, right: `${stepWidth / 2}px` }}>
                <div className="h-[2px] w-full bg-white/10 rounded-full" />
                <div className="absolute left-0 top-0 h-[2px] transition-all duration-500 rounded-full bg-[#487AF6]" style={{ width: `${clampedPercentage}%` }} />
            </div>

            {/* Step Indicators */}
            <div className="relative flex justify-between w-full z-10">
                {Array.from({ length: steps }, (_, index) => {
                    const state = getStepState(index);
                    const config = configs[index] || {};
                    const iconPath = config.iconPath;

                    return (
                        <div ref={stepRef} key={index} className="flex flex-col items-center gap-2">
                            {/* Circle */}
                            <div className="relative w-6 h-6">
                                <div className={`flex items-center transition-all duration-500 border-[0.75px] justify-center w-6 h-6 bg-[#0F1415] rounded-full ${state.isActive
                                    ? ' border-white'
                                    : 'border-white/15'
                                    }`}>
                                    <div className={`w-3 h-3 rounded-full transition-all duration-500 ${state.isActive
                                        ? 'bg-[#582FD9]'
                                        : state.isCompleted
                                            ? 'bg-[#25B88A]'
                                            : 'bg-[#6F7B91] opacity-50'
                                        }`} />
                                </div>
                            </div>
                            {/* Icon + Label Row */}
                            <div className="flex flex-row items-center justify-center gap-1.5 min-w-[80px]">
                                {iconPath && (
                                    <SvgIcon src={"/assets/" + iconPath} className={cn(
                                        "w-5 h-5",
                                        state.isPending ? "text-gray-500" : "text-[#7FA6FF]"
                                    )}
                                    />
                                )}
                                <span className={cn(
                                    "text-base  font-medium leading-none capitalize",
                                    state.isPending ? "text-gray-500" : "text-white"
                                )}>
                                    {config.title}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}