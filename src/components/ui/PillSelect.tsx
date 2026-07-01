"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type PillSelectProps = {
    label: string;
    options: { label: string; value: string }[];
    value?: string;
    onChange?: (val: string) => void;
};

export function PillSelect({
    label,
    options,
    value,
    onChange,
}: PillSelectProps) {
    const selectedLabel = options.find((opt) => opt.value === value)?.label;

    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="h-10 border border-slate-200 bg-white px-4 py-2 rounded-full hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600 transition-colors w-auto min-w-[140px] [&>span]:line-clamp-1">
                <div className="flex items-center gap-2 whitespace-nowrap">
                    <span className="text-sm font-normal text-slate-500 dark:text-slate-400">{label}</span>
                    <span className="text-slate-300 dark:text-slate-600">|</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {selectedLabel || value}
                    </span>
                </div>
            </SelectTrigger>
            <SelectContent className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white min-w-[200px]">
                {options.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
