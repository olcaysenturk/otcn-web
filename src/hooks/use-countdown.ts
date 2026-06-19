import { useState, useEffect, useCallback } from "react";

export function useCountdown(initialSeconds: number = 30) {
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const timeout = setTimeout(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [secondsLeft]);

  const start = useCallback((seconds?: number) => {
    setSecondsLeft(seconds ?? initialSeconds);
  }, [initialSeconds]);

  const isRunning = secondsLeft > 0;

  return { secondsLeft, start, isRunning };
}
