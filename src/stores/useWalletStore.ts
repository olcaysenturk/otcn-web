import { create } from "zustand";
import { fetchWalletAssets } from "@/services/wallet";
import { fetchBinancePrices } from "@/services/binance";
import { calculateAssetValues } from "@/lib/wallet/calculateAssetValues";
import type { WalletSidebarAsset } from "@/types/wallet";

interface WalletState {
  assets: WalletSidebarAsset[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: number;
  fetchAssets: (locale: string, force?: boolean) => Promise<void>;
  startPolling: (locale: string, intervalMs?: number) => void;
  stopPolling: () => void;
  intervalId: NodeJS.Timeout | null;
  activeSubscribers: number;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  assets: [],
  isLoading: false,
  error: null,
  lastUpdated: 0,
  intervalId: null as NodeJS.Timeout | null,
  activeSubscribers: 0,

  startPolling: (locale: string, intervalMs = 10000) => {
    const { activeSubscribers, intervalId, fetchAssets } = get();
    
    // Increment subscriber count
    set({ activeSubscribers: activeSubscribers + 1 });

    // If already polling, don't start a new one
    if (intervalId) return;

    // Fetch immediately
    fetchAssets(locale);

    // Start interval
    const id = setInterval(() => {
        // Force fetch to bypass cache duration check in fetchAssets if needed,
        // or rely on fetchAssets internal check? 
        // We want live updates, so we should likely force or reduce cache duration.
        // Actually, fetchAssets has a cache logic. Let's make sure we pass 'force=true' 
        // or rely on the natural expiration. 
        // For "live" prices, we usually want to force it or have a short cache.
        // Let's pass force=true for polling updates to ensure we get new prices.
        fetchAssets(locale, true); 
    }, intervalMs);

    set({ intervalId: id });
  },

  stopPolling: () => {
    const { activeSubscribers, intervalId } = get();
    const newCount = Math.max(0, activeSubscribers - 1);
    
    set({ activeSubscribers: newCount });

    // Only stop polling if no subscribers left
    if (newCount === 0 && intervalId) {
      clearInterval(intervalId);
      set({ intervalId: null });
    }
  },

  fetchAssets: async (locale: string, force = false) => {
    const { assets, lastUpdated } = get();
    const now = Date.now();
    const CACHE_DURATION = 30 * 1000; // 30 seconds cache for manual fetches

    // Prevent redundant fetches if data is fresh (unless forced)
    if (!force && assets.length > 0 && now - lastUpdated < CACHE_DURATION) {
      return;
    }

    // specific check: prevent setting loading if we simply re-fetch in background (force=true),
    // only set true if we have no data.
    // However, if force=true (polling), we DON'T want to set isLoading=true causing flickering.
    if (assets.length === 0) {
        set({ isLoading: true, error: null });
    }

    try {
      // 1. Fetch raw wallet assets
      const walletData = await fetchWalletAssets({ locale });

      // 2. Prepare symbols for price fetching
      const symbolsToFetch: string[] = [];
      walletData.forEach((a) => {
        if (a.symbol !== "TRY") {
          symbolsToFetch.push(`"${a.symbol.toUpperCase()}TRY"`);
          if (a.symbol.toUpperCase() !== "USDT") {
            symbolsToFetch.push(`"${a.symbol.toUpperCase()}USDT"`);
          }
        }
      });

      // Always fetch USDT/TRY and BTC/USDT as baselines
      if (!symbolsToFetch.includes('"USDTTRY"')) symbolsToFetch.push('"USDTTRY"');
      if (!symbolsToFetch.includes('"BTCUSDT"')) symbolsToFetch.push('"BTCUSDT"');

      // 3. Fetch current prices
      const priceMap = await fetchBinancePrices(symbolsToFetch);

      // 4. Calculate enriched values (USDT, BTC, Fiat)
      const updatedAssets = walletData.map((asset) => calculateAssetValues(asset, priceMap));

      set({ 
        assets: updatedAssets, 
        isLoading: false, 
        lastUpdated: Date.now(),
        error: null 
      });
    } catch (error) {
      console.error("Failed to fetch wallet assets:", error);
      // Don't clear assets on error, just set error state
      set({ 
        isLoading: false, 
        error: "Failed to fetch wallet data" 
      });
    }
  },
}));
