"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/**
 * Uygulama genelinde kullanacağımız input modu
 */
export type AppInputMode = "text" | "number" | "phone" | "tc";

export type AppInputSize = "sm" | "md" | "lg";
export type AppInputVariant = "outline" | "subtle";

type NativeInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "inputMode" | "maxLength" | "size"
>;

export type AppInputProps = NativeInputProps & {
  /** Üstte görünen label (opsiyonel) */
  label?: string;
  /** Label için özel class */
  labelClassName?: string;
  /** Hata mesajı (varsa kırmızı stil + mesaj) */
  error?: string;
  /** Yardımcı açıklama metni */
  helperText?: string;

  /** Davranış modu: text / number / phone / tc */
  mode?: AppInputMode;

  /** Görsel boyut */
  size?: AppInputSize;

  /** Görsel varyant */
  variant?: AppInputVariant;

  /** Dış wrapper div için ekstra class */
  containerClassName?: string;

  /**
   * Filtrelenmiş değeri yukarıya veren event
   * (sadece rakam filtreleri uygulandıktan sonra)
   */
  onValueChange?: (value: string) => void;

  /**
   * Mode bazlı maxLength değerini ezmek istersen
   * Örn: phone default 11 ama sen 10 yapmak istiyorsun
   */
  maxLengthOverride?: number;
};

/**
 * Mode'a göre HTML attribute'larını belirleyen helper
 */
function getModeHtmlProps(
  mode: AppInputMode,
  maxLengthOverride?: number
): {
  type: React.HTMLInputTypeAttribute;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  autoComplete?: string;
  maxLength?: number;
} {
  switch (mode) {
    case "number":
      return {
        type: "text",
        inputMode: "numeric",
        autoComplete: "off",
        maxLength: maxLengthOverride,
      };

    case "phone":
      return {
        type: "tel",
        inputMode: "tel",
        autoComplete: "tel",
        maxLength: maxLengthOverride ?? 11,
      };

    case "tc":
      return {
        type: "text",
        inputMode: "numeric",
        autoComplete: "off",
        maxLength: maxLengthOverride ?? 11,
      };

    case "text":
    default:
      return {
        type: "text",
        autoComplete: "on",
        maxLength: maxLengthOverride,
      };
  }
}

/**
 * Mode'a göre gelen değeri filtreleyen helper
 * text -> olduğu gibi
 * number/phone/tc -> sadece rakam, maxLength varsa kes
 */
function filterValueByMode(
  mode: AppInputMode,
  raw: string,
  maxLength?: number
) {
  if (mode === "text") return raw;

  let onlyDigits = raw.replace(/\D+/g, "");

  if (typeof maxLength === "number") {
    onlyDigits = onlyDigits.slice(0, maxLength);
  }

  return onlyDigits;
}

export const AppInput = React.forwardRef<HTMLInputElement, AppInputProps>(
  (props, ref) => {
    const {
      label,
      labelClassName,
      error,
      helperText,
      mode = "text",
      size = "md",
      variant = "outline",
      containerClassName,
      className,
      onValueChange,
      maxLengthOverride,
      ...rest
    } = props;

    // value, defaultValue, onChange'i ayrıca alıyoruz
    const { value, defaultValue, onChange, ...inputRest } = rest;
    const inputId = React.useId();

    const htmlProps = getModeHtmlProps(mode, maxLengthOverride);

    const isControlled = value !== undefined;

    const [innerValue, setInnerValue] = React.useState<string>(() => {
      if (typeof value === "string") return value;
      if (typeof defaultValue === "string") return defaultValue;
      return "";
    });

    React.useEffect(() => {
      // Controlled kullanımda dış value değişirse iç state'i senkron tutalım
      if (isControlled && typeof value === "string") {
        setInnerValue(value);
      }
    }, [isControlled, value]);

    const currentValue = isControlled ? (value as string) : innerValue;

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
      const raw = e.target.value;

      const filtered = filterValueByMode(
        mode,
        raw,
        htmlProps.maxLength ?? maxLengthOverride
      );

      if (!isControlled) {
        setInnerValue(filtered);
      }

      if (onValueChange) {
        onValueChange(filtered);
      }

      // Parent onChange de dinlemek isterse, orijinal event'i de forward edelim
      if (typeof onChange === "function") {
        onChange(e);
      }
    };

    const sizeClasses = label
      ? size === "sm"
        ? "min-h-10 px-3 pt-4 pb-2 text-xs"
        : size === "lg"
          ? "min-h-14 px-4 pt-5 pb-2 text-base"
          : "min-h-12 px-3.5 pt-4 pb-2 text-sm"
      : size === "sm"
        ? "h-8 px-3 text-xs"
        : size === "lg"
          ? "h-12 px-4 text-base"
          : "h-10 px-3.5 text-sm";

    const variantClasses =
      variant === "subtle"
        ? "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-500 focus-visible:ring-slate-400 focus-visible:border-slate-200     "
        : "border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#373b45]/40 focus-visible:border-[#373b45]    ";

    const mergedClassName = cn(
      "w-full rounded-lg border shadow-sm transition focus-visible:outline-none",
      sizeClasses,
      variantClasses,
      error && "border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500",
      label &&
        "peer placeholder:text-transparent focus:placeholder:text-slate-400",
      className,
    );

    return (
      <div className={containerClassName}>
        <div className="relative">
          <Input
            ref={ref}
            id={inputRest.id ?? inputId}
            {...inputRest}
            {...htmlProps}
            placeholder={label ? " " : inputRest.placeholder}
            value={currentValue}
            onChange={handleChange}
            className={mergedClassName}
          />
          {label && (
            <Label
              htmlFor={inputRest.id ?? inputId}
              className={cn(
                "pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-sm text-slate-500 transition-all font-normal",
                "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm",
                "peer-focus:top-0.5 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-slate-700",
                "peer-[:not(:placeholder-shown)]:top-0.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-700",
                labelClassName,
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
);

AppInput.displayName = "AppInput";
