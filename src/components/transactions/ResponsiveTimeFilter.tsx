"use client";

import * as React from "react";
import { Check, ChevronLeft, X } from "lucide-react";
import { DateRange } from "react-day-picker";
import * as Popover from "@radix-ui/react-popover";
import { getDateFnsLocale } from "@/lib/i18n/dateFnsLocale";

import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { FilterPill } from "@/components/ui/filter-pill";
import { DateRangePicker } from "@/components/ui/date-range-picker";
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
    /** Fired when the custom-range calendar is revealed, so the parent can sync
     *  the draft range to the currently applied range before editing. */
    onCustomOpen?: () => void;
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
    onCustomOpen,
    rangeSummary,
    className,
    drawerTitle,
}: ResponsiveTimeFilterProps) {
    const { t, locale } = useI18n();
    const [open, setOpen] = React.useState(false); // mobile drawer
    const [desktopOpen, setDesktopOpen] = React.useState(false);
    const [customOpen, setCustomOpen] = React.useState(false); // mobile: show calendar panel
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const dayPickerLocale = getDateFnsLocale(locale);
    const weekStartsOn = locale === "en" ? 0 : 1;
    const maxDate = React.useMemo(() => new Date(), []);

    // Desktop: reveal the calendar LOCALLY when "custom" is picked, without telling
    // the parent yet — so no fetch happens until the user presses Apply.
    const [showCustom, setShowCustom] = React.useState(value === "custom");
    React.useEffect(() => { setShowCustom(value === "custom"); }, [value]);

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

    // Desktop View — single panel: options list (left) + calendar (right when custom).
    if (isDesktop) {
        const handleDesktopSelect = (next: SharedTimeFilterValue) => {
            if (next === "custom") {
                // Only reveal the calendar — do NOT apply/fetch until Apply is pressed.
                onCustomOpen?.();
                setShowCustom(true);
                return;
            }
            onValueChange(next);
            setDesktopOpen(false);
        };

        return (
            <Popover.Root
                open={desktopOpen}
                onOpenChange={(o) => {
                    setDesktopOpen(o);
                    if (!o) setShowCustom(value === "custom");
                }}
            >
                <Popover.Trigger asChild>
                    <FilterPill label={label} value={selectedLabel} className={className} />
                </Popover.Trigger>
                <Popover.Portal>
                    <Popover.Content
                        align="start"
                        sideOffset={8}
                        className="z-[10060] flex items-start gap-2"
                    >
                        <ul className="flex w-[180px] flex-col gap-1 rounded-[14px] border border-[#3A4043] bg-[#0E0F10] p-2 shadow-[0px_10px_14px_0px_rgba(15,42,81,0.03)]">
                            {options.map((option) => {
                                const active = option.value === "custom" ? showCustom : value === option.value && !showCustom;
                                return (
                                    <li key={option.value}>
                                        <button
                                            type="button"
                                            onClick={() => handleDesktopSelect(option.value)}
                                            className={cn(
                                                "flex w-full items-center rounded-[8px] px-3 py-2 text-left text-[14px] font-medium tracking-[-0.21px] transition-colors",
                                                active
                                                    ? "bg-[#f54a14]/10 text-[#f54a14]"
                                                    : "text-[#C5C9CC] hover:bg-white/5 hover:text-[#F4F7F8]",
                                            )}
                                        >
                                            {option.label}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>

                        {showCustom && (
                            <DateRangePicker
                                selected={draftRange}
                                onSelect={onDraftRangeChange}
                                locale={dayPickerLocale}
                                weekStartsOn={weekStartsOn}
                                disabled={{ after: maxDate }}
                                showFooter
                                summary={rangeSummary}
                                applyLabel={t("common.actions.apply")}
                                cancelLabel={t("common.actions.cancel")}
                                onApply={() => {
                                    onApplyRange?.();
                                    setDesktopOpen(false);
                                }}
                                onCancel={() => {
                                    onCancelRange?.();
                                    setShowCustom(false);
                                    setDesktopOpen(false);
                                }}
                            />
                        )}
                    </Popover.Content>
                </Popover.Portal>
            </Popover.Root>
        );
    }

    // Mobile View
    const handleMobileTriggerClick = () => {
        if (value === "custom") {
            onCustomOpen?.();
            setCustomOpen(true);
        } else {
            setCustomOpen(false);
        }
    };

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
                <FilterPill
                    label={label}
                    value={selectedLabel}
                    onClick={handleMobileTriggerClick}
                    className={className}
                />
            </DrawerTrigger>

            <DrawerContent className="border border-[#f54a14] bg-[#0E0F10] p-0">
                {customOpen ? (
                    <div className="flex flex-col">
                        <DrawerHeader className="flex flex-row items-center justify-between bg-[#f54a14] px-4 py-4">
                            <button
                                onClick={() => setCustomOpen(false)}
                                className="rounded-full p-1 text-[#0E0F10] transition hover:bg-black/10"
                                aria-label={t("common.actions.cancel")}
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            <DrawerTitle className="text-base font-semibold text-[#0E0F10]">
                                {t("transactions.filters.time.customRange")}
                            </DrawerTitle>
                            <div className="w-7" />
                        </DrawerHeader>
                        <div className="px-3 pb-5 pt-2">
                            <DateRangePicker
                                selected={draftRange}
                                onSelect={onDraftRangeChange}
                                numberOfMonths={1}
                                locale={dayPickerLocale}
                                weekStartsOn={weekStartsOn}
                                disabled={{ after: maxDate }}
                                showFooter
                                summary={rangeSummary}
                                applyLabel={t("common.actions.apply")}
                                cancelLabel={t("common.actions.cancel")}
                                onApply={() => {
                                    onApplyRange?.();
                                    setOpen(false);
                                    setCustomOpen(false);
                                }}
                                onCancel={() => {
                                    onCancelRange?.();
                                    setOpen(false);
                                    setCustomOpen(false);
                                }}
                                className="w-full"
                            />
                        </div>
                    </div>
                ) : (
                    <>
                        <DrawerHeader className="flex flex-row items-center justify-between bg-[#f54a14] px-5 py-4">
                            <DrawerTitle className="text-base font-semibold text-[#0E0F10]">{drawerTitle || label}</DrawerTitle>
                            <DrawerClose asChild>
                                <button className="rounded-full p-1 text-[#0E0F10] transition hover:bg-black/10">
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
                                            if (option.value === "custom") {
                                                // Only reveal the calendar — apply/fetch happens on Apply.
                                                onCustomOpen?.();
                                                setCustomOpen(true);
                                            } else {
                                                onValueChange(option.value);
                                                setOpen(false);
                                            }
                                        }}
                                        className={cn(
                                            "flex w-full items-center justify-between py-4 text-left text-base font-medium transition-colors",
                                            active ? "text-[#f54a14]" : "text-[#F4F7F8] hover:text-[#f54a14]",
                                        )}
                                    >
                                        {option.label}
                                        {active && <Check className="h-5 w-5 text-[#f54a14]" />}
                                    </button>
                                );
                            })}
                        </div>
                    </>
                )}
            </DrawerContent>
        </Drawer>
    );
}
