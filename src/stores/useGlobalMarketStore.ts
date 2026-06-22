"use client";

import { create } from "zustand";
import type { IcrypexMarketAsset } from "@/types/icrypex";

type GlobalMarketState = {
  assets: Record<string, IcrypexMarketAsset>;
  upsertAssets: (list: IcrypexMarketAsset[]) => void;
};

export const useGlobalMarketStore = create<GlobalMarketState>((set) => ({
  assets: {},
  upsertAssets: (list) =>
    set((state) => {
      const next = { ...state.assets };
      list.forEach((asset) => {
        next[asset.s] = asset;
      });
      return { assets: next };
    }),
}));
