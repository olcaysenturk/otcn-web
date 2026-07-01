// stores/useCryptoStore.ts
import { fetchCryptoAssets, fetchCryptoPlatforms } from '@/services/crypto';
import type { CryptoAsset, CryptoPlatform } from '@/types/crypto';
import { create } from 'zustand';

interface CryptoStore {
    cryptoPlatforms: CryptoPlatform[];
    cryptoAssets: CryptoAsset[];
    isLoading: boolean;
    lastFetched: number | null;
    currentLocale: string | null;

    fetchCryptoPlatforms: (locale: string, force?: boolean) => Promise<void>;
    fetchCryptoAssets: (locale: string, force?: boolean) => Promise<void>;
    clearCache: () => void;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 dakika

export const useCryptoStore = create<CryptoStore>((set, get) => ({
    cryptoPlatforms: [],
    cryptoAssets: [],
    isLoading: false,
    lastFetched: null,
    currentLocale: null,

    fetchCryptoPlatforms: async (locale: string, force = false) => {
        const state = get();
        const now = Date.now();

        // Cache kontrolü + locale değişti mi?
        if (
            !force &&
            state.lastFetched &&
            state.currentLocale === locale &&
            now - state.lastFetched < CACHE_DURATION
        ) {
            return;
        }

        set({ isLoading: true });
        try {
            const data = await fetchCryptoPlatforms(locale);
            set({
                cryptoPlatforms: data,
                lastFetched: now,
                currentLocale: locale,
                isLoading: false,
            });
        } catch (error) {
            console.error('Crypto platforms yüklenemedi:', error);
            set({ isLoading: false });
        }
    },
    fetchCryptoAssets: async (locale: string, force = false) => {
        const state = get();
        const now = Date.now();

        // Cache kontrolü + locale değişti mi?
        if (
            !force &&
            state.lastFetched &&
            state.currentLocale === locale &&
            now - state.lastFetched < CACHE_DURATION
        ) {
            return;
        }

        set({ isLoading: true });
        try {
            const data = await fetchCryptoAssets(locale);
            set({
                cryptoAssets: data,
                lastFetched: now,
                currentLocale: locale,
                isLoading: false,
            });
        } catch (error) {
            console.error('Crypto assets yüklenemedi:', error);
            set({ isLoading: false });
        }
    },

    clearCache: () => {
        set({ lastFetched: null, currentLocale: null });
    },
}));