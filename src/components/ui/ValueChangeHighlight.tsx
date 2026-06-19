"use client";

import { ReactNode, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type ValueChangeHighlightProps = {
  value: number;
  children: ReactNode;
  className?: string;
  upClassName?: string;
  downClassName?: string;
  durationMs?: number;
};

function applyClasses(el: HTMLElement, classes: string, action: "add" | "remove") {
  const parts = classes.split(" ").filter(Boolean);
  if (parts.length === 0) return;
  if (action === "add") el.classList.add(...parts);
  else el.classList.remove(...parts);
}

export function ValueChangeHighlight({
  value,
  children,
  className,
  upClassName = "bg-emerald-50 text-emerald-700",
  downClassName = "bg-rose-50 text-rose-700",
  durationMs = 700,
}: ValueChangeHighlightProps) {
  const elRef = useRef<HTMLSpanElement | null>(null);
  const prevRef = useRef<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!Number.isFinite(value)) return;

    if (prevRef.current === null) {
      prevRef.current = value;
      return;
    }

    const prev = prevRef.current;
    if (value === prev) return;

    prevRef.current = value;
    const el = elRef.current;
    if (!el) return;

    const targetClass = value > prev ? upClassName : downClassName;
    applyClasses(el, upClassName, "remove");
    applyClasses(el, downClassName, "remove");
    applyClasses(el, targetClass, "add");

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      applyClasses(el, upClassName, "remove");
      applyClasses(el, downClassName, "remove");
    }, durationMs);
  }, [value, upClassName, downClassName, durationMs]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <span ref={elRef} className={cn("transition-colors duration-500", className)}>
      {children}
    </span>
  );
}
