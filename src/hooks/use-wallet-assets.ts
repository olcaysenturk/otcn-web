import { useEffect } from "react";
import { useWalletStore } from "@/stores/useWalletStore";
import type { WalletSidebarAsset } from "@/types/wallet";

interface UseWalletAssetsResult {
  assets: WalletSidebarAsset[];
  isLoading: boolean;
  refresh: () => Promise<void>;
}

interface UseWalletAssetsOptions {
  locale: string;
}

export function useWalletAssets({ locale }: UseWalletAssetsOptions): UseWalletAssetsResult {
  const { assets, isLoading, fetchAssets, startPolling, stopPolling } = useWalletStore();

  useEffect(() => {
    // Start polling on mount
    startPolling(locale);

    // Stop polling on unmount
    return () => {
      stopPolling();
    };
  }, [locale, startPolling, stopPolling]);

  return {
    assets,
    isLoading,
    refresh: () => fetchAssets(locale, true),
  };
}
