"use client";

import * as React from "react";
import { Check, ChevronDown, ChevronLeft, X } from "lucide-react";
import { DateRange, DayPicker } from "react-day-picker";
import * as Popover from "@radix-ui/react-popover";
import type { Locale } from "date-fns";
import { getDateFnsLocale } from "@/lib/i18n/dateFnsLocale";

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
import { useI18n } from "@/lib/i18n/I18nProvider";
import type { SharedTimeFilterValue } from "@/components/transactions/timeRange";

interface ResponsiveTimeFilterProps {
    label: string;
    value: SharedTimeFilterValue;
    onValueChange: (value: SharedTimeFilterValue) => void;
    draftRange?: DateRange;
    onDraftRangeChange?: (range: DateRange | undefined) => void;
    onApplyRange?: () => void;
    onCancelRange?: () => void;
    rangeSummary?: string;
    className?: string;
    drawerTitle?: string;
}

export function ResponsiveTimeFilter({
    label,
    value,
    onValueChange,
    draftRange,
    onDraftRangeChange,
    onApplyRange,
    onCancelRange,
    rangeSummary,
    className,
    drawerTitle,
}: ResponsiveTimeFilterProps) {
    const { t, locale } = useI18n();
    const [open, setOpen] = React.useState(false);
    const [customOpen, setCustomOpen] = React.useState(false); // For custom range drawer/popover
    const openTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const blockCloseRef = React.useRef(false);
    const unblockCloseTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const dayPickerLocale = getDateFnsLocale(locale);
    const weekStartsOn = locale === "en" ? 0 : 1;

    React.useEffect(() => {
        return () => {
            if (openTimeoutRef.current) {
                clearTimeout(openTimeoutRef.current);
            }
            if (unblockCloseTimeoutRef.current) {
                clearTimeout(unblockCloseTimeoutRef.current);
            }
        };
    }, []);

    const openCustomAfterSelectClose = () => {
        if (openTimeoutRef.current) {
            clearTimeout(openTimeoutRef.current);
        }
        blockCloseRef.current = true;
        if (unblockCloseTimeoutRef.current) {
            clearTimeout(unblockCloseTimeoutRef.current);
        }
        unblockCloseTimeoutRef.current = setTimeout(() => {
            blockCloseRef.current = false;
        }, 250);
        openTimeoutRef.current = setTimeout(() => {
            setCustomOpen(true);
        }, 0);
    };

    const handleCustomTriggerOpen = (event: React.PointerEvent<HTMLButtonElement>) => {
        if (value !== "custom") return;
        event.preventDefault();
        event.stopPropagation();
        openCustomAfterSelectClose();
    };

    // Sync Radix Select open state with local for custom range logic if needed, 
    // but existing logic used a "deferRangeOpen" ref which is complex.
    // Let's simplify: 
    // Desktop: Use the existing logic with Popover inside Select if "custom" is selected.
    // BUT Popover inside Select is tricky. The original code had Popover WRAPPING Select.
    // Let's reproduce the desktop structure exactly as it was, but encapsulated.

    const options: { label: string; value: SharedTimeFilterValue }[] = [
        { label: t("transactions.filters.time.today"), value: "today" },
        { label: t("transactions.filters.time.yesterday"), value: "yesterday" },
        { label: t("transactions.filters.time.last7"), value: "last7" },
        { label: t("transactions.filters.time.last30"), value: "last30" },
        { label: t("transactions.filters.time.last90"), value: "last90" },
        { label: t("transactions.filters.time.thisMonth"), value: "thisMonth" },
        { label: t("transactions.filters.time.lastMonth"), value: "lastMonth" },
        { label: t("transactions.filters.time.customRange"), value: "custom" },
    ];

    const selectedOption = options.find((opt) => opt.value === value);
    const selectedLabel =
        value === "custom" && rangeSummary ? rangeSummary : selectedOption?.label;
    const handleMobileTriggerClick = () => {
        if (value === "custom") {
            setCustomOpen(true);
            return;
        }
        setCustomOpen(false);
    };

    // Desktop View
    if (isDesktop) {
        return (
            <Popover.Root
                open={customOpen}
                onOpenChange={(nextOpen) => {
                    if (!nextOpen && blockCloseRef.current) return;
                    setCustomOpen(nextOpen);
                }}
            >
                <Select
                    value={value}
                    onValueChange={(v) => {
                        if (v === "custom") {
                            setCustomOpen(false);
                            onValueChange("custom"); // Parent handles "ignoreNextRangeClose" etc if needed? 
                            // Actually, if we encapsulate, we might need to handle the "defer" logic internally or expose controlled props.
                            // For simplicity, let's assume parent handles the "custom" selection side effects via onValueChange
                            // but we need to trigger the popover.
                            openCustomAfterSelectClose();
                        } else {
                            setCustomOpen(false);
                            onValueChange(v as SharedTimeFilterValue);
                        }
                    }}
                >
                    <Popover.Anchor asChild>
                        <SelectTrigger
                            onPointerDown={handleCustomTriggerOpen}
                            className={cn("h-10 w-auto min-w-[140px] rounded-full border border-slate-200 bg-white px-4 py-2 text-sm transition-colors hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600 [&>span]:line-clamp-1", className)}
                        >
                            <div className="flex items-center gap-2 whitespace-nowrap">
                                <span className="text-sm font-normal text-slate-500 dark:text-slate-400">{label}</span>
                                <span className="text-slate-300 dark:text-slate-600">|</span>
                                <SelectValue className="text-sm font-medium text-slate-900 dark:text-white">
                                    {selectedLabel}
                                </SelectValue>
                            </div>
                        </SelectTrigger>
                    </Popover.Anchor>
                    <SelectContent className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">
                        {options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Popover.Portal>
                    <Popover.Content
                        side="bottom"
                        align="start"
                        sideOffset={8}
                        className="z-10060 w-[90vw] max-w-[680px] rounded-3xl border border-slate-200 bg-white p-5 shadow-xl"
                    >
                        <DateRangePickerContent
                            draftRange={draftRange}
                            onDraftRangeChange={onDraftRangeChange}
                            rangeSummary={rangeSummary}
                            onCancel={() => {
                                setCustomOpen(false);
                                onCancelRange?.();
                            }}
                            onApply={() => {
                                setCustomOpen(false);
                                onApplyRange?.();
                            }}
                            t={t}
                            locale={dayPickerLocale}
                            weekStartsOn={weekStartsOn}
                        />
                    </Popover.Content>
                </Popover.Portal>
            </Popover.Root>
        );
    }

    // Mobile View
    return (
        <Drawer
            open={open}
            onOpenChange={(nextOpen) => {
                setOpen(nextOpen);
                if (!nextOpen) {
                    setCustomOpen(false);
                }
            }}
        >
            <DrawerTrigger asChild>
                <button
                    type="button"
                    onClick={handleMobileTriggerClick}
                    className={cn(
                        "flex h-10 min-w-[140px] items-center justify-between rounded-full border border-slate-200 bg-white px-4 py-2 text-sm transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white",
                        className
                    )}
                >
                    <div className="flex items-center gap-2 whitespace-nowrap">
                        <span className="text-sm font-normal text-slate-500 dark:text-slate-400">{label}</span>
                        <span className="text-slate-300 dark:text-slate-600">|</span>
                        <span className="text-sm font-medium text-slate-900 dark:text-white">{selectedLabel}</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-slate-500" />
                </button>
            </DrawerTrigger>

            <DrawerContent className="p-0">
                {customOpen ? (
                    <div className="flex h-full flex-col rounded-t-[28px] bg-gradient-button">
                        <DrawerHeader className="flex items-center justify-between px-4 pb-4 pt-5">
                            <button
                                onClick={() => setCustomOpen(false)}
                                className="rounded-full p-1 text-white"
                                aria-label={t("common.actions.cancel")}
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            <DrawerTitle>{t("transactions.filters.time.customRange")}</DrawerTitle>
                            <div className="w-8" />
                        </DrawerHeader>
                        <div className="rounded-t-[28px] bg-[#f3f4f6] px-3 pb-4 pt-3">
                            <div className="rounded-3xl border border-[#d9dde6] bg-[#f8f8fa] p-3">
                                <DateRangePickerContent
                                    draftRange={draftRange}
                                    onDraftRangeChange={onDraftRangeChange}
                                    rangeSummary={rangeSummary}
                                    onCancel={() => {
                                        onCancelRange?.();
                                        setOpen(false);
                                        setCustomOpen(false);
                                    }}
                                    onApply={() => {
                                        onApplyRange?.();
                                        setOpen(false);
                                        setCustomOpen(false);
                                    }}
                                    t={t}
                                    isMobile
                                    locale={dayPickerLocale}
                                    weekStartsOn={weekStartsOn}
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    // Mobile Options List View
                    <>
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
                                            if (option.value === "custom") {
                                                setCustomOpen(true);
                                                onValueChange("custom");
                                                // Keep drawer open and render custom range panel.
                                            } else {
                                                onValueChange(option.value);
                                                setOpen(false);
                                            }
                                        }}
                                        className={cn(
                                            "flex items-center justify-between rounded-xl p-4 text-left text-sm font-medium transition-colors",
                                            value === option.value
                                                ? ""
                                                : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                                        )}
                                    >
                                        {option.label}
                                        {value === option.value && <Check className="h-4 w-4 text-violet-600" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </DrawerContent>
        </Drawer>
    );
}

function DateRangePickerContent({
    draftRange,
    onDraftRangeChange,
    rangeSummary,
    onCancel,
    onApply,
    t,
    isMobile,
    locale,
    weekStartsOn,
}: {
    draftRange?: DateRange;
    onDraftRangeChange?: (range: DateRange | undefined) => void;
    rangeSummary?: string;
    onCancel?: () => void;
    onApply?: () => void;
    t: (key: string, params?: Record<string, string | number>) => string;
    isMobile?: boolean;
    locale: Locale;
    weekStartsOn: 0 | 1;
}) {
    return (
        <>
            <DayPicker
                mode="range"
                numberOfMonths={isMobile ? 1 : 2}
                weekStartsOn={weekStartsOn}
                locale={locale}
                selected={draftRange}
                onSelect={onDraftRangeChange}
                disabled={{ after: new Date() }}
                hideNavigation={false}
                classNames={{
                    months: isMobile ? "flex flex-col" : "grid grid-cols-2 gap-6",
                    month: "space-y-4",
                    caption: cn(
                        "relative flex items-center justify-center px-8",
                        isMobile && "pb-2"
                    ),
                    caption_label: "text-center text-sm font-semibold text-slate-900 w-full block",
                    nav: cn(
                        "pointer-events-none absolute left-0 right-0 flex items-center justify-between px-1",
                        isMobile ? "top-[90px] left-[5%] right-auto w-[90%]" : "top-8"
                    ),
                    button_previous: cn(
                        "pointer-events-auto h-7 w-7 rounded-full text-slate-600 hover:bg-slate-50",
                        !isMobile && "bg-white"
                    ),
                    button_next: cn(
                        "pointer-events-auto h-7 w-7 rounded-full text-slate-600 hover:bg-slate-50",
                        !isMobile && "bg-white"
                    ),
                    month_grid: "w-full",
                    table: "w-full border-collapse",
                    head_row: "flex",
                    head_cell: "w-9 text-[11px] font-medium text-slate-500",
                    row: "mt-2 flex w-full",
                    cell: "relative h-9 w-9 text-center text-sm",
                    day: "h-9 w-9 rounded-full text-slate-700 hover:bg-slate-100 text-center cursor-pointer [&.rdp-disabled]:opacity-45 [&.rdp-disabled]:cursor-not-allowed",
                    day_range_middle: "rounded-full !bg-violet-100 !text-violet-800",
                    day_range_start: "rounded-full !bg-violet-600 !text-white",
                    day_range_end: "rounded-full !bg-violet-600 !text-white",
                    day_selected: "rounded-full !bg-violet-600 !text-white",
                    day_outside: "text-slate-300 opacity-70",
                    day_disabled: "cursor-not-allowed text-slate-300 opacity-45 bg-slate-100/70 pointer-events-none",
                    day_today: "rounded-full border border-violet-400 text-violet-600",
                }}
                modifiersClassNames={{
                    selected: "bg-violet-600 text-white",
                    range_start: "bg-violet-600 text-white",
                    range_end: "bg-violet-600 text-white",
                    range_middle: "bg-violet-100 text-violet-800 rounded-none",
                }}
                modifiersStyles={{
                    selected: { backgroundColor: "#7D55E8", color: "#ffffff" },
                    range_start: {
                        backgroundColor: "#7D55E8",
                        color: "#ffffff",
                        borderTopLeftRadius: "8px",
                        borderTopRightRadius: "0px",
                        borderBottomRightRadius: "0px",
                        borderBottomLeftRadius: "8px",
                    },
                    range_end: {
                        backgroundColor: "#7D55E8",
                        color: "#ffffff",
                        borderTopLeftRadius: "0px",
                        borderTopRightRadius: "8px",
                        borderBottomRightRadius: "8px",
                        borderBottomLeftRadius: "0px",
                    },
                    range_middle: { backgroundColor: "#F3EFFF", color: "#7D55E8" },
                }}
            />
            <div
                className={cn(
                    "mt-4 border-t pt-4 text-sm",
                    isMobile
                        ? "space-y-3 border-slate-200"
                        : "flex items-center justify-between border-slate-100"
                )}
            >
                <span className={cn("text-slate-600", isMobile && "block text-center text-[14px] leading-5 text-slate-800")}>
                    {rangeSummary}
                </span>
                <div className={cn("flex items-center gap-2", isMobile && "flex-col")}>
                    <button
                        type="button"
                        onClick={onCancel}
                        className={cn(
                            "rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50",
                            isMobile && "h-[44px] w-full border-slate-900 text-base text-slate-900"
                        )}
                    >
                        {t("common.actions.cancel")}
                    </button>
                    <button
                        type="button"
                        onClick={onApply}
                        disabled={!draftRange?.from || !draftRange?.to}
                        className={cn(
                            "rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60",
                            isMobile && "h-[44px] w-full text-base"
                        )}
                    >
                        {t("common.actions.apply")}
                    </button>
                </div>
            </div>
        </>
    );
}
