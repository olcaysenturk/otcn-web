"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, X } from "lucide-react";

import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { FilterPill } from "@/components/ui/filter-pill";
import {
    Select,
    SelectContent,
    SelectItem,
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
                <SelectPrimitive.Trigger asChild>
                    <FilterPill label={label} value={selectedOption?.label} className={className} />
                </SelectPrimitive.Trigger>
                <SelectContent className="min-w-[var(--radix-select-trigger-width)] rounded-[14px] border-[#3A4043] bg-[#0E0F10] p-2 text-[#F4F7F8]">
                    {options.map((option) => (
                        <SelectItem
                            key={option.value}
                            value={option.value}
                            className="cursor-pointer rounded-[12px] px-3 py-2.5 text-[13px] font-medium tracking-[-0.195px] text-[#F4F7F8] focus:bg-white/5 data-[state=checked]:bg-[#3A4043]/50 data-[state=checked]:font-semibold data-[state=checked]:text-[#F54A14] [&>span:first-child]:hidden"
                        >
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
                <FilterPill label={label} value={selectedOption?.label} className={className} />
            </DrawerTrigger>
            <DrawerContent className="border border-[#C7F022]">
                <DrawerHeader className="items-center justify-between bg-[#C7F022] px-5 py-4">
                    <DrawerTitle className="text-base font-semibold text-[#0E0F10]">{drawerTitle || label}</DrawerTitle>
                    <DrawerClose asChild>
                        <button className="rounded-full p-1 text-[#0E0F10] transition hover:bg-black/10" aria-label="close">
                            <X className="h-5 w-5" />
                        </button>
                    </DrawerClose>
                </DrawerHeader>
                <div className="max-h-[70vh] overflow-auto bg-[#0E0F10] px-5 pb-6 pt-2">
                    {options.map((option) => {
                        const active = value === option.value;
                        return (
                            <button
                                key={option.value}
                                onClick={() => {
                                    onValueChange(option.value);
                                    setOpen(false);
                                }}
                                className={cn(
                                    "flex w-full items-center justify-between py-4 text-left text-base font-medium transition-colors",
                                    active ? "text-[#F54A14]" : "text-[#F4F7F8] hover:text-[#F54A14]",
                                )}
                            >
                                {option.label}
                                {active && <Check className="h-5 w-5 text-[#F54A14]" />}
                            </button>
                        );
                    })}
                </div>
            </DrawerContent>
        </Drawer>
    );
}
