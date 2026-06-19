"use client";

import { useEffect, useState } from "react";

type UseCountUpOptions = {
  target: number;
  durationMs?: number;
  start?: number;
  disabled?: boolean;
};

export function useCountUp({
  target,
  durationMs = 900,
  start = 0,
  disabled = false,
}: UseCountUpOptions) {
  const [value, setValue] = useState(start);

  useEffect(() => {
    if (disabled) return;

    const from = start;
    const diff = target - from;
    const startTime = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - startTime) / durationMs);
      setValue(from + diff * progress);
      if (progress < 1) requestAnimationFrame(tick);
    };

    const raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [disabled, durationMs, start, target]);

  useEffect(() => {
    if (!disabled) return;
    const raf = requestAnimationFrame(() => setValue(target));
    return () => cancelAnimationFrame(raf);
  }, [disabled, target]);

  return value;
}
