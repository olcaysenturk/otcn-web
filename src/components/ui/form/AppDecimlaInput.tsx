"use client";

import { FORMAT_CONFIG } from "@/config/format";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { D, decimal } from "@/lib/math/decimal";
import { useRef, useState } from "react";

interface DecimalInputProps {
    label?: string;
    availableBalance: decimal;
    asset: string;
    onAmountChange?: (amount: decimal) => void;
    placeholder?: string;
    maxPrecision?: number;
    showMaxButton?: boolean;
    availableText?: string;
}

export default function DecimalInput({
    label,
    availableBalance,
    asset,
    onAmountChange,
    placeholder = "0,00000000",
    maxPrecision = 8,
    showMaxButton = true,
    availableText,
}: DecimalInputProps) {
    const { t } = useI18n();
    const [amountInput, setAmountInput] = useState<string>("");
    const inputRef = useRef<HTMLInputElement>(null);

    const { thousandSeparator, fractionSeparator } = FORMAT_CONFIG;

    const isValidInput = (value: string): boolean => {
        const allowedChars = new RegExp(`^[0-9${thousandSeparator}${fractionSeparator}]+$`);
        if (!allowedChars.test(value)) return false;

        const fractionCount = (value.match(new RegExp(`\\${fractionSeparator}`, 'g')) || []).length;
        if (fractionCount > 1) return false;

        return true;
    };

    const trimDecimalPrecision = (value: string): string => {
        const parts = value.split(fractionSeparator);
        if (parts.length === 2 && parts[1].length > maxPrecision) {
            return parts[0] + fractionSeparator + parts[1].substring(0, maxPrecision);
        }
        return value;
    };

    const formatWithTrailingZeros = (value: string, formatted: string): string => {
        const parts = value.split(fractionSeparator);

        if (value.endsWith(fractionSeparator) && !formatted.includes(fractionSeparator)) {
            return formatted + fractionSeparator;
        }

        if (parts.length === 2 && parts[1].length > 0) {
            const userDecimals = parts[1];
            const formattedParts = formatted.split(fractionSeparator);

            if (formattedParts.length === 1 || (formattedParts[1] && formattedParts[1].length < userDecimals.length)) {
                return formattedParts[0] + fractionSeparator + userDecimals;
            }
        }

        return formatted;
    };

    const calculateCursorPosition = (
        oldValue: string,
        newValue: string,
        currentPosition: number
    ): number => {
        const oldSeparatorCount = (oldValue.substring(0, currentPosition).match(new RegExp(`\\${thousandSeparator}`, 'g')) || []).length;
        const newSeparatorCount = (newValue.substring(0, currentPosition).match(new RegExp(`\\${thousandSeparator}`, 'g')) || []).length;

        return currentPosition + (newSeparatorCount - oldSeparatorCount);
    };

    const handleAmountChange = (value: string): void => {
        if (!value) {
            setAmountInput("");
            const zeroAmount = D.zero(maxPrecision);
            onAmountChange?.(zeroAmount);
            return;
        }

        if (!isValidInput(value)) return;

        const trimmedValue = trimDecimalPrecision(value);

        try {
            const parsed = D.parse(trimmedValue, maxPrecision);
            const cursorPosition = inputRef.current?.selectionStart || 0;

            let formatted = parsed.format(true);
            formatted = formatWithTrailingZeros(trimmedValue, formatted);

            const newCursorPosition = calculateCursorPosition(amountInput, formatted, cursorPosition);

            setAmountInput(formatted);
            onAmountChange?.(parsed);

            requestAnimationFrame(() => {
                if (inputRef.current) {
                    inputRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
                }
            });
        } catch (error) {
            console.error("Decimal parse error:", error);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        const allowedKeys = [
            'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight',
            'ArrowUp', 'ArrowDown', 'Tab', 'Home', 'End'
        ];

        const isNumber = /^[0-9]$/.test(e.key);
        const isSeparator = e.key === thousandSeparator || e.key === fractionSeparator;
        const isCtrlCmd = e.ctrlKey || e.metaKey;

        if (!isNumber && !isSeparator && !allowedKeys.includes(e.key) && !isCtrlCmd) {
            e.preventDefault();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>): void => {
        e.preventDefault();

        const pastedText = e.clipboardData.getData('text');
        const cleaned = pastedText.trim();
        const allowedChars = new RegExp(`^[0-9${thousandSeparator}${fractionSeparator}]+$`);

        if (allowedChars.test(cleaned)) {
            handleAmountChange(cleaned);
        }
    };

    const handleMaxClick = (): void => {
        const maxAmount = D.set(availableBalance, maxPrecision);
        const formatted = maxAmount.format(true);

        setAmountInput(formatted);
        onAmountChange?.(maxAmount);
    };

    const resolvedLabel = label ?? t("common.decimalInput.amountLabel");
    const formattedBalance = D.set(availableBalance, maxPrecision).format(true);
    const resolvedAvailableText = availableText ?? t("common.decimalInput.available", {
        amount: `${formattedBalance} ${asset}`,
    });

    return (
        <div className="flex flex-col items-start gap-2 w-full">
            <label className="text-[14px] leading-[14px] font-medium text-gray-400">
                {resolvedLabel}
            </label>

            <div className="flex flex-col items-end gap-2 w-full">
                <div className="flex flex-row items-center w-full h-[45px] pl-4 pr-1 py-3 bg-white/5 border border-white/10 rounded-xl focus-within:ring-2 focus-within:ring-primary transition-colors">
                    <input
                        ref={inputRef}
                        type="text"
                        inputMode="decimal"
                        value={amountInput}
                        onChange={(e) => handleAmountChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onPaste={handlePaste}
                        placeholder={placeholder}
                        className="flex-1 text-[14px] leading-[150%] tracking-[-0.015em] font-medium text-white bg-transparent border-none outline-none placeholder:text-gray-500"
                    />
                    <span className="text-[14px] leading-[150%] tracking-[-0.015em] font-medium text-gray-500 mr-2">
                        {asset}
                    </span>
                    {showMaxButton && (
                        <button
                            onClick={handleMaxClick}
                            type="button"
                            className="flex flex-row items-center px-[12.8px] py-2 bg-white rounded-[79.2px] h-[30px] hover:bg-white/90 transition-colors active:scale-95"
                        >
                            <span className="text-[11px] leading-[14px] font-bold text-[#0F1415]">
                                {t("common.actions.max")}
                            </span>
                        </button>
                    )}
                </div>

                <span className="text-[12px] leading-[135%] tracking-[-0.01em] font-medium text-[#7FA6FF]">
                    {resolvedAvailableText}
                </span>
            </div>
        </div>
    );
}
