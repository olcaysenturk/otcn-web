"use client";

import * as React from "react";
import { Check, ChevronDown, X } from "lucide-react";

import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";

interface ResponsiveFilterProps {
    label: string;
    value: string;
    options: { label: string; value: string }[];
    onValueChange: (value: string) => void;
    className?: string;
    drawerTitle?: string;
}

export function ResponsiveFilter({
    label,
    value,
    options,
    onValueChange,
    className,
    drawerTitle,
}: ResponsiveFilterProps) {
    const [open, setOpen] = React.useState(false);
    const isDesktop = useMediaQuery("(min-width: 768px)");

    // Find the selected option label for display
    const selectedOption = options.find((opt) => opt.value === value);

    if (isDesktop) {
        return (
            <Select value={value} onValueChange={onValueChange}>
                <SelectTrigger className={cn("h-10 w-auto min-w-[140px] rounded-full border border-slate-200 bg-white px-4 py-2 text-sm transition-colors hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600 [&>span]:line-clamp-1", className)}>
                    <div className="flex items-center gap-2 whitespace-nowrap">
                        <span className="text-sm font-normal text-slate-500 dark:text-slate-400">{label}</span>
                        <span className="text-slate-300 dark:text-slate-600">|</span>
                        <SelectValue className="text-sm font-medium text-slate-900 dark:text-white">
                            {selectedOption?.label}
                        </SelectValue>
                    </div>
                </SelectTrigger>
                <SelectContent className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        );
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <button
                    type="button"
                    className={cn(
                        "flex h-10 min-w-[140px] items-center justify-between rounded-full border border-slate-200 bg-white px-4 py-2 text-sm transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white",
                        className
                    )}
                >
                    <div className="flex items-center gap-2 whitespace-nowrap">
                        <span className="text-sm font-normal text-slate-500 dark:text-slate-400">{label}</span>
                        <span className="text-slate-300 dark:text-slate-600">|</span>
                        <span className="text-sm font-medium text-slate-900 dark:text-white">{selectedOption?.label}</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-slate-500" />
                </button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="flex items-center justify-between px-4 py-4">
                    <DrawerTitle>{drawerTitle || label}</DrawerTitle>
                    <DrawerClose asChild>
                        <button className="rounded-full p-2">
                            <X className="h-5 w-5 text-white" />
                        </button>
                    </DrawerClose>
                </DrawerHeader>
                <div className="p-4 bg-white rounded-t-[20px]">
                    <div className="flex flex-col gap-2">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => {
                                    onValueChange(option.value);
                                    setOpen(false);
                                }}
                                className={cn(
                                    "flex items-center justify-between rounded-xl p-4 text-left text-sm font-medium transition-colors",
                                    value === option.value
                                        ? "bg-violet-50 text-violet-700"
                                        : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                                )}
                            >
                                {option.label}
                                {value === option.value && <Check className="h-4 w-4 text-violet-600" />}
                            </button>
                        ))}
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
