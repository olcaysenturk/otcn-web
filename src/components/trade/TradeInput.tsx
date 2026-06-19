"use client";

import { NumericFormat } from "react-number-format";
import { cn } from "@/lib/utils";
import { inputVariants } from "@/components/ui/input";

interface TradeInputProps {
    label: string;
    value: string;
    onValueChange: (value: string) => void;
    decimalScale: number;
    suffix?: string;
    className?: string;
}

const inputDecimalSeparator = ".";

export function TradeInput({
    label,
    value,
    onValueChange,
    decimalScale,
    suffix,
    className,
}: TradeInputProps) {
    return (
        <div className={cn("space-y-1", className)}>
            <label className="text-xs font-semibold text-gray-700">{label}</label>
            <div className="flex items-center overflow-hidden rounded-xl border border-border bg-white focus-within:ring-2 focus-within:ring-primary">
                <NumericFormat
                    value={value}
                    onValueChange={(values, sourceInfo) => {
                        if (!sourceInfo || sourceInfo.source === "event") {
                            onValueChange(values.value);
                        }
                    }}
                    placeholder="0"
                    className={cn(
                        inputVariants({
                            className: "h-12 border-0 text-lg font-semibold text-gray-900 shadow-none focus-visible:ring-0",
                        }),
                        "flex-1",
                    )}
                    thousandSeparator={false}
                    decimalSeparator={inputDecimalSeparator}
                    allowedDecimalSeparators={[".", ","]}
                    decimalScale={decimalScale}
                    allowNegative={false}
                />
                {suffix && (
                    <div className="flex items-center px-3 text-sm font-semibold text-gray-700">
                        <span>{suffix}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
