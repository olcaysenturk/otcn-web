"use client";

import * as React from "react";
import { Search, X } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Autocomplete input — matched to Figma "Search products input / autocomplete"
 * + "List" dropdown (52609-11372 / 11387 / 10463).
 *
 * Field: magnifier + inline ghost completion (typed text in `foreground`, the
 * remaining suggestion in `secondary`, orange `primary` caret) + clear button.
 * Dropdown: first/active match highlighted (border/50 bg + primary text), the
 * rest plain regular-weight rows.
 *
 * Accept the inline completion with Tab / → (caret at end); Enter selects the
 * active row; ↑/↓ move; Esc closes.
 */
export interface AutocompleteInputProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onSelect?: (value: string) => void;
  suggestions: string[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function AutocompleteInput({
  value,
  defaultValue = "",
  onValueChange,
  onSelect,
  suggestions,
  placeholder = "Ara",
  disabled,
  className,
}: AutocompleteInputProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue);
  const q = isControlled ? value : internal;

  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(0);
  const [focused, setFocused] = React.useState(false);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const matches = React.useMemo(() => {
    if (!q) return [];
    const lower = q.toLowerCase();
    const starts = suggestions.filter((s) => s.toLowerCase().startsWith(lower));
    const includes = suggestions.filter(
      (s) => !s.toLowerCase().startsWith(lower) && s.toLowerCase().includes(lower),
    );
    return [...starts, ...includes];
  }, [q, suggestions]);

  // Inline ghost = remainder of the first prefix match (keeps suggestion casing).
  const ghostBase = q
    ? matches.find((s) => s.toLowerCase().startsWith(q.toLowerCase()))
    : undefined;
  const ghost = ghostBase ? ghostBase.slice(q.length) : "";

  const showDropdown = open && focused && matches.length > 0;

  React.useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setFocused(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const setQuery = (next: string) => {
    if (!isControlled) setInternal(next);
    onValueChange?.(next);
    setOpen(!!next);
    setActive(0);
  };

  const choose = (s: string) => {
    if (!isControlled) setInternal(s);
    onValueChange?.(s);
    onSelect?.(s);
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const atEnd = inputRef.current?.selectionStart === q.length;
    if ((e.key === "Tab" || (e.key === "ArrowRight" && atEnd)) && ghost) {
      e.preventDefault();
      setQuery(ghostBase as string);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((i) => Math.min(i + 1, matches.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      if (showDropdown && matches[active]) {
        e.preventDefault();
        choose(matches[active]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <div
        className={cn(
          "flex h-10 items-center gap-2 rounded-[24px] border border-[#3A4043] bg-[#0E0F10] py-1 pl-[10px] pr-1 transition-colors",
          focused && "border-[#5E666A]",
          disabled && "opacity-50",
        )}
      >
        <Search
          className={cn(
            "h-5 w-5 shrink-0 transition-colors",
            focused || q ? "text-[#C5C9CC]" : "text-[#5E666A]",
          )}
        />

        <div className="relative h-full flex-1">
          {/* Ghost completion overlay (typed = foreground, remainder = secondary) */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 flex items-center truncate text-sm"
          >
            <span className="text-[#F4F7F8]">{q}</span>
            <span className="text-[#5E666A]">{ghost}</span>
          </div>
          <input
            ref={inputRef}
            type="text"
            value={q}
            disabled={disabled}
            placeholder={q ? undefined : placeholder}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              setFocused(true);
              if (q) setOpen(true);
            }}
            onKeyDown={handleKeyDown}
            className="relative h-full w-full border-none bg-transparent text-sm text-transparent caret-primary outline-none placeholder:text-[#5E666A]"
          />
        </div>

        {q && !disabled && (
          <button
            type="button"
            aria-label="temizle"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[rgba(111,123,145,0.1)] text-[#C5C9CC] transition-colors hover:bg-[rgba(111,123,145,0.2)]"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="absolute left-0 top-[calc(100%+12px)] z-50 w-full rounded-[16px] border border-[#3A4043] bg-[#0E0F10] p-3 shadow-[0px_4px_3px_0px_rgba(0,0,0,0.1),0px_10px_8px_0px_rgba(0,0,0,0.04)]">
          {matches.map((s, i) => {
            const isActive = i === active;
            return (
              <button
                key={s}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onMouseEnter={() => setActive(i)}
                onClick={() => choose(s)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-[12px] px-2.5 py-2.5 text-left text-[13px] transition-colors",
                  isActive
                    ? "bg-border/50 font-semibold text-primary"
                    : "font-normal text-[#F4F7F8] hover:bg-white/5",
                )}
              >
                {s}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
