"use client";

import { create } from "zustand";
import type { IcrypexTicker } from "@/types/icrypex";

type TickerState = {
  tickers: Record<string, IcrypexTicker>;
  setTickers: (list: IcrypexTicker[]) => void;
  upsertTickers: (list: IcrypexTicker[]) => void;
};

export const useTickerStore = create<TickerState>((set) => ({
  tickers: {},
  setTickers: (list) =>
    set({
      tickers: Object.fromEntries(list.map((ticker) => [ticker.ps, ticker])),
    }),
  upsertTickers: (list) =>
    set((state) => {
      const next = { ...state.tickers };
      list.forEach((ticker) => {
        next[ticker.ps] = ticker;
      });
      return { tickers: next };
    }),
}));
