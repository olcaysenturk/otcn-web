"use client";

import { create } from "zustand";
import type { IcrypexAsset, IcrypexExchangeInfo, IcrypexPair } from "@/types/icrypex";

type ExchangeInfoState = {
  assets: IcrypexAsset[];
  pairs: IcrypexPair[];
  isLoaded: boolean;
  setExchangeInfo: (info: IcrypexExchangeInfo | null) => void;
};

export const useExchangeInfoStore = create<ExchangeInfoState>((set) => ({
  assets: [],
  pairs: [],
  isLoaded: false,
  setExchangeInfo: (info) =>
    set({
      assets: info?.assets ?? [],
      pairs: info?.pairs ?? [],
      isLoaded: true,
    }),
}));
