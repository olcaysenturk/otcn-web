"use client";

import { useI18n } from "@/lib/i18n/I18nProvider";
import { cn } from "@/lib/utils";

interface TradePercentSelectorProps {
    value: number | null;
    onChange: (percent: number) => void;
    className?: string;
}

const PERCENTAGES = [25, 50, 75, 100];

export function TradePercentSelector({ value, onChange, className }: TradePercentSelectorProps) {
    const { t } = useI18n();

    return (
        <div className={cn("grid grid-cols-4 gap-2", className)}>
            {PERCENTAGES.map((p) => (
                <button
                    key={p}
                    type="button"
                    onClick={() => onChange(p)}
                    className={cn(
                        "rounded-full border px-3 py-2 text-sm font-semibold transition active:scale-95",
                        value === p
                            ? "border-[#111827] bg-[#111827] text-white"
                            : "border-[#E8EDF3] bg-white text-gray-700 hover:border-gray-300",
                    )}
                >
                    {p === 100 ? t("trade.maxLabel") : `%${p}`}
                </button>
            ))}
        </div>
    );
}
