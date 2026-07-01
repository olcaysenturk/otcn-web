"use client";

import { createContext, useContext, useMemo, ReactNode } from "react";
import type { Locale } from "./config";

type I18nContextValue = {
  locale: Locale;
  t: (key: string, params?: Record<string, string | number>) => string;
  get: (key: string) => unknown;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export type Messages = Record<string, unknown>;

export function I18nProvider({
  locale,
  messages,
  children,
}: {
  locale: Locale;
  messages: Messages;
  children: ReactNode;
}) {
  const value = useMemo<I18nContextValue>(() => {
    const get = (key: string) => {
      const direct = (messages as Record<string, unknown>)[key];
      if (direct !== undefined) return direct;

      const parts = key.split(".");
      let current: unknown = messages;

      for (const part of parts) {
        if (
          current &&
          typeof current === "object" &&
          part in (current as Record<string, unknown>)
        ) {
          current = (current as Record<string, unknown>)[part];
        } else {
          current = undefined;
          break;
        }
      }

      return current;
    };

    const t = (key: string, params?: Record<string, string | number>) => {
      let value = get(key);
      if (typeof value !== "string") return key;

      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          value = (value as string).replace(new RegExp(`{{${k}}}`, "g"), String(v));
        });
      }

      return value as string;
    };

    return { locale, t, get };
  }, [locale, messages]);

  return (
    <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
