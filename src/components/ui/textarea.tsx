"use client";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useEffect, useId, useState } from "react";

export type AppTextareaSize = "sm" | "md" | "lg";
export type AppTextareaVariant = "outline" | "subtle";

type NativeTextareaProps = Omit<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    "size"
>;

export type AppTextareaProps = NativeTextareaProps & {
    label?: string;
    labelClassName?: string;
    error?: string;
    helperText?: string;

    size?: AppTextareaSize;
    variant?: AppTextareaVariant;
    containerClassName?: string;

    onValueChange?: (value: string) => void;
};

export function Textarea(props: AppTextareaProps) {
    const {
        label,
        labelClassName,
        error,
        helperText,
        size = "md",
        variant = "outline",
        containerClassName,
        className,
        onValueChange,
        onChange,
        value,
        defaultValue,
        rows = 4,
        ...rest
    } = props;

    const textareaId = useId();
    const isControlled = value !== undefined;

    const [innerValue, setInnerValue] = useState<string>(() => {
        if (typeof value === "string") return value;
        if (typeof defaultValue === "string") return defaultValue;
        return "";
    });

    useEffect(() => {
        if (isControlled && typeof value === "string") {
            setInnerValue(value);
        }
    }, [isControlled, value]);

    const currentValue = isControlled ? (value as string) : innerValue;

    const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
        const newValue = e.target.value;

        if (!isControlled) setInnerValue(newValue);

        onValueChange?.(newValue);
        onChange?.(e);
    };

    const sizeClasses = label
        ? size === "sm"
            ? "min-h-[80px] px-3 pt-4 pb-2 text-xs"
            : size === "lg"
                ? "min-h-[140px] px-4 pt-5 pb-2 text-base"
                : "min-h-[110px] px-3.5 pt-4 pb-2 text-sm"
        : size === "sm"
            ? "min-h-[80px] px-3 text-xs"
            : size === "lg"
                ? "min-h-[140px] px-4 pt-3 pb-2 text-base"
                : "min-h-[110px] px-3.5 pt-3 pb-2 text-sm";

    const variantClasses =
        variant === "subtle"
            ? "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-500 focus-visible:ring-purple-500/50 focus-visible:ring-[3px] focus-visible:border-purple-500"
            : "border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-purple-500/50 focus-visible:ring-[3px] focus-visible:border-purple-500";
    const mergedClassName = cn(
        "w-full rounded-lg border shadow-sm transition focus-visible:outline-none resize-none",
        sizeClasses,
        variantClasses,
        error &&
        "border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500",
        label &&
        "peer placeholder:text-transparent focus:placeholder:text-slate-400",
        className
    );

    const id = rest.id ?? textareaId;

    return (
        <div className={containerClassName}>
            <div className="relative">
                <textarea
                    id={id}
                    rows={rows}
                    {...rest}
                    value={currentValue}
                    onChange={handleChange}
                    placeholder={label ? " " : rest.placeholder}
                    className={mergedClassName}
                />

                {label && (
                    <Label
                        htmlFor={id}
                        className={cn(
                            "pointer-events-none absolute left-3 top-4 z-10 text-sm text-slate-500 transition-all font-normal",
                            "peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm",
                            "peer-focus:top-1 peer-focus:text-xs peer-focus:text-slate-700",
                            "peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-700",
                            labelClassName
                        )}
                    >
                        {label}
                    </Label>
                )}
            </div>

            {helperText && !error && (
                <p className="mt-1 text-xs text-slate-500">{helperText}</p>
            )}

            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}