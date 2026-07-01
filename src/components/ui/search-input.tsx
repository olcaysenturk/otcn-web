"use client";

import { Loader2, Search, X } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/I18nProvider";

export interface SearchResult {
  name: string;
  symbol?: string;
}

export interface SearchInputProps<T = SearchResult> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (query: string) => void;

  placeholder?: string;
  className?: string;
  inputClassName?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  clearable?: boolean;

  results?: T[];
  resultsLabel?: string;
  loading?: boolean;
  emptyText?: string;
  open?: boolean;

  onResultSelect?: (result: T) => void;
  renderResult?: (result: T, active: boolean) => ReactNode;
  getResultKey?: (result: T, index: number) => string | number;
  isResultActive?: (result: T) => boolean;
}

function defaultRender(result: unknown): ReactNode {
  const r = result as SearchResult;
  if (r && typeof r === "object" && "name" in r) {
    return r.symbol ? `${r.name} (${r.symbol})` : r.name;
  }
  return String(result);
}

export function SearchInput<T = SearchResult>({
  value,
  defaultValue = "",
  onValueChange,
  placeholder,
  className,
  inputClassName,
  disabled,
  autoFocus,
  clearable = true,
  results,
  resultsLabel,
  loading = false,
  emptyText,
  open,
  onResultSelect,
  renderResult,
  getResultKey,
  isResultActive,
}: SearchInputProps<T>) {
  const { t } = useI18n();
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(defaultValue);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const query = isControlled ? value : internal;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const setQuery = (next: string) => {
    if (!isControlled) setInternal(next);
    onValueChange?.(next);
  };

  const hasResults = !!results && results.length > 0;
  const hasDropdownContent = hasResults || loading || (!!emptyText && !!query);
  const isOpen = open ?? (isFocused && !!query && hasDropdownContent);
  const label = resultsLabel ?? t("common.searchInput.relatedResults");

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <div
        className={cn(
          "flex h-10 items-center gap-2 rounded-[24px] border border-[#3A4043] bg-[#0E0F10] py-1 pl-[10px] pr-1 transition-colors",
          isFocused && "border-[#5E666A]",
          disabled && "opacity-50",
          inputClassName,
        )}
      >
        <Search
          className={cn(
            "h-5 w-5 shrink-0 transition-colors",
            // Figma "Search products input" (52609-11387): nötr ikon, turuncu caret.
            isFocused || query ? "text-[#C5C9CC]" : "text-[#5E666A]",
          )}
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          disabled={disabled}
          autoFocus={autoFocus}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder ?? t("common.searchInput.placeholder")}
          className="h-full min-w-0 flex-1 border-none bg-transparent text-sm text-[#F4F7F8] caret-primary outline-none placeholder:text-[#5E666A]"
        />
        {clearable && query && !disabled && (
          <button
            type="button"
            aria-label="clear"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              setQuery("");
              setIsFocused(true);
              inputRef.current?.focus();
            }}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[rgba(111,123,145,0.1)] text-[#C5C9CC] transition-colors hover:bg-[rgba(111,123,145,0.2)]"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-full space-y-3 rounded-[16px] border border-[#3A4043] bg-[#0E0F10] p-3 shadow-lg">
          {label && <div className="px-3 text-xs font-medium text-[#5E666A]">{label}</div>}

          {loading ? (
            <div className="flex items-center justify-center py-4 text-[#5E666A]">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : hasResults ? (
            <div className="flex flex-col">
              {results!.map((result, idx) => {
                const active = isResultActive?.(result) ?? false;
                return (
                  <button
                    key={getResultKey?.(result, idx) ?? idx}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      onResultSelect?.(result);
                      setIsFocused(false);
                    }}
                    className={cn(
                      "flex items-center gap-2 rounded-[12px] px-[10px] py-[10px] text-left text-[13px] transition-colors",
                      active
                        ? "bg-[rgba(58,64,67,0.5)] font-medium text-[#F54A14]"
                        : "text-[#F4F7F8] hover:bg-white/5",
                    )}
                  >
                    {(renderResult ?? defaultRender)(result, active)}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="px-3 py-2 text-[13px] text-[#5E666A]">{emptyText}</div>
          )}
        </div>
      )}
    </div>
  );
}
