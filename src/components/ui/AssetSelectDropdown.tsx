"use client";

import { cn } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

export type AssetSelectOption = {
  value: string;
  label: string;
  iconSrc?: string;
  meta?: string;
};

type AssetSelectDropdownProps = {
  value?: string;
  options: AssetSelectOption[];
  placeholder: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  menuClassName?: string;
};

export function AssetSelectDropdown({
  value,
  options,
  placeholder,
  onChange,
  disabled = false,
  className,
  triggerClassName,
  menuClassName,
}: AssetSelectDropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const selected = useMemo(
    () => options.find((option) => option.value === value),
    [options, value]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!rootRef.current) return;
      if (rootRef.current.contains(event.target as Node)) return;
      setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={rootRef} className={cn("relative z-30 w-full", className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "flex h-[45px] w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4",
          disabled && "cursor-not-allowed opacity-50",
          triggerClassName
        )}
      >
        <div className="min-w-0">
          {selected ? (
            <div className="flex items-center gap-2">
              {selected.iconSrc ? (
                <Image
                  src={selected.iconSrc}
                  alt={selected.label}
                  width={22}
                  height={22}
                  className="h-5.5 w-5.5 rounded-full object-contain"
                  unoptimized
                  onError={(e) => {
                    const image = e.currentTarget;
                    image.src = "/assets/coin-logo/BTC.svg";
                  }}
                />
              ) : null}
              <span className="truncate text-[14px] font-semibold text-white">
                {selected.label}
              </span>
              {selected.meta ? (
                <>
                  <span className="text-[14px] font-medium text-gray-500">|</span>
                  <span className="truncate text-[14px] font-medium text-white">
                    {selected.meta}
                  </span>
                </>
              ) : null}
            </div>
          ) : (
            <span className="text-[14px] text-gray-500">{placeholder}</span>
          )}
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-gray-400 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {open && !disabled ? (
        <div
          className={cn(
            "absolute left-0 right-0 top-[48px] max-h-72 overflow-auto rounded-xl border border-white/10 bg-[#1C2425] p-2 shadow-lg",
            menuClassName
          )}
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 hover:bg-white/10"
            >
              <div className="flex min-w-0 items-center gap-2">
                {option.iconSrc ? (
                  <Image
                    src={option.iconSrc}
                    alt={option.label}
                    width={22}
                    height={22}
                    className="h-5.5 w-5.5 rounded-full object-contain"
                    unoptimized
                    onError={(e) => {
                      const image = e.currentTarget;
                      image.src = "/assets/coin-logo/BTC.svg";
                    }}
                  />
                ) : null}
                <span className="truncate text-[14px] font-semibold text-white">
                  {option.label}
                </span>
                {option.meta ? (
                  <span className="truncate text-[14px] font-medium text-gray-400">
                    {option.meta}
                  </span>
                ) : null}
              </div>
              {value === option.value ? (
                <Check className="h-4 w-4 shrink-0 text-gray-300" />
              ) : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
