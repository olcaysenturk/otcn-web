"use client";

import * as React from "react";

import { usePathname } from "next/navigation";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ApplicationTab } from "./ApplicationTabs";

type Props = {
    tabs: ApplicationTab[];
};

export function ApplicationStepper({ tabs }: Props) {
    const pathname = usePathname();

    const getStepStatus = (tab: ApplicationTab) => {
        if (tab.status === "success") return "completed";
        if (pathname?.startsWith(tab.href ?? "")) return "current";
        return "upcoming";
    };

    const stepCount = tabs.length;
    const stepPercentage = 100 / stepCount;
    const halfStepPercentage = stepPercentage / 2;

    // Refs for scrolling behavior
    const scrollContainerRef = React.useRef<HTMLDivElement>(null);
    const itemRefs = React.useRef<(HTMLLIElement | null)[]>([]);
    const hasInitialScrolled = React.useRef(false);

    // Find grid index based on pathname matching to ensure we always have a valid current step position
    // independently of the visual status (which might be 'completed' even for the current page)
    const activeIndex = tabs.findIndex(t => pathname?.startsWith(t.href ?? ""));
    const safeActiveIndex = activeIndex === -1 ? 0 : activeIndex;

    // Auto-scroll to active step on mount or change
    React.useEffect(() => {
        if (safeActiveIndex >= 0 && itemRefs.current[safeActiveIndex]) {
            const scroll = () => {
                itemRefs.current[safeActiveIndex]?.scrollIntoView({
                    behavior: hasInitialScrolled.current ? "smooth" : "auto",
                    block: "nearest",
                    inline: "center"
                });
                hasInitialScrolled.current = true;
            };

            // Use a small timeout to ensure layout/hydration is stable
            const timer = setTimeout(scroll, 100);
            return () => clearTimeout(timer);
        }
    }, [safeActiveIndex]);

    return (
        <nav
            aria-label="Progress"
            className="w-full overflow-x-auto no-scrollbar lg:overflow-x-visible"
            ref={scrollContainerRef}
        >
            <div
                className="relative px-1 min-w-max lg:min-w-0 lg:w-full"
                style={{
                    "--step-count": stepCount
                } as React.CSSProperties}
            >
                {/* Background line — Figma "Steppers": System/Border #3A4043 */}
                <div
                    className="absolute top-[11px] h-[3px] bg-[#3A4043] z-0"
                    style={{
                        left: `${halfStepPercentage}%`,
                        right: `${halfStepPercentage}%`
                    }}
                />

                {/* Completed Steps Line — cyan #84E9E8 (Secondary), animated */}
                <div
                    className="absolute top-[11px] h-[3px] bg-[#84E9E8] transition-all duration-500 z-0"
                    style={{
                        left: `${halfStepPercentage}%`,
                        width: `${safeActiveIndex * stepPercentage}%`
                    }}
                />

                {/* Current Step Half-Line — gradient white→border (Figma transition) */}
                {safeActiveIndex < stepCount - 1 && (
                    <div
                        className="absolute top-[11px] h-[3px] bg-[linear-gradient(90deg,#F4F7F8_50%,#3A4043_50%)] transition-all duration-500 z-0"
                        style={{
                            left: `calc(${halfStepPercentage}% + ${safeActiveIndex * stepPercentage}%)`,
                            width: `${halfStepPercentage}%`
                        }}
                    />
                )}

                <ol
                    role="list"
                    className="relative grid z-10"
                    style={{ gridTemplateColumns: `repeat(${stepCount}, minmax(0, 1fr))` }}
                >
                    {tabs.map((tab, index) => {
                        const status = getStepStatus(tab);

                        return (
                            <li
                                key={tab.id}
                                className="flex flex-col items-center"
                                ref={el => { itemRefs.current[index] = el; }}
                            >
                                {/* Step Circle */}
                                <div
                                    className={cn(
                                        "relative z-10 flex h-6 w-6 items-center justify-center rounded-full transition-all duration-200 mb-3 shadow-[0px_0px_3px_1.5px_rgba(0,0,0,0.2)] bg-[#0E0F10]",
                                        status === "completed"
                                            ? "border border-[#84E9E8]"
                                            : status === "current"
                                                ? "border border-[#84E9E8]"
                                                : "border border-[#3A4043]"
                                    )}
                                    aria-current={status === "current" ? "step" : undefined}
                                >
                                    {status === "completed" ? (
                                        <Check className="h-3.5 w-3.5 text-[#84E9E8]" />
                                    ) : status === "current" ? (
                                        <span className="h-2 w-2 rounded-full bg-[#84E9E8]" />
                                    ) : (
                                        <span className="h-2 w-2 rounded-full bg-[#5E666A]" />
                                    )}
                                </div>
                                <div className="flex flex-row gap-2 items-center">
                                    {/* Icon */}
                                    <div className={cn(
                                        status === "completed"
                                            ? "text-[#84E9E8]"
                                            : status === "current"
                                                ? "text-[#84E9E8]"
                                                : "text-[#5E666A]"
                                    )}>
                                        {tab.icon}
                                    </div>

                                    {/* Label */}
                                    <span
                                        className={cn(
                                            "text-[12px] lg:leading-6 font-medium text-center",
                                            status === "completed"
                                                ? "text-[#84E9E8]"
                                                : status === "current"
                                                    ? "text-[#F4F7F8]"
                                                    : "text-[#5E666A]"
                                        )}
                                    >
                                        {tab.label}
                                    </span>
                                </div>
                            </li>
                        );
                    })}
                </ol>
            </div>
        </nav>
    );
}
