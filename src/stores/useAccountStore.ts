// stores/useAccountStore.ts
import { getAccountInfo } from '@/services/account';
import type { AccountInfo } from '@/types/account';
import { create } from 'zustand';

interface AccountStore {
    accountInfo: AccountInfo | null;
    isLoading: boolean;
    lastFetched: number | null;

    fetchAccountInfo: (force?: boolean) => Promise<void>;
    clearCache: () => void;
}

const CACHE_DURATION = 2 * 60 * 1000; // 2 dakika (account info daha sık güncellenebilir)

export const useAccountStore = create<AccountStore>((set, get) => ({
    accountInfo: null,
    isLoading: false,
    lastFetched: null,

    fetchAccountInfo: async (force = false) => {
        const state = get();
        const now = Date.now();

        if (
            !force &&
            state.lastFetched &&
            now - state.lastFetched < CACHE_DURATION
        ) {
            return;
        }

        set({ isLoading: true });
        try {
            const data = await getAccountInfo();
            set({
                accountInfo: data,
                lastFetched: now,
                isLoading: false,
            });
        } catch (error) {
            console.error('Account info yüklenemedi:', error);
            set({ isLoading: false });
        }
    },

    clearCache: () => {
        set({ lastFetched: null });
    },
}));