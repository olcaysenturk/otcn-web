// stores/useBankStore.ts
import { fetchBanks, fetchDepositBanks, fetchUserBanks } from '@/services/bank';
import type { Bank, DepositBankItem, UserBank } from '@/types/bank';
import { create } from 'zustand';

interface BankStore {
    // Data
    userBanks: UserBank[];
    allBanks: Bank[];
    depositBanks: DepositBankItem[];

    // Loading states
    isLoadingUserBanks: boolean;
    isLoadingAllBanks: boolean;
    isLoadingDepositBanks: boolean;

    // Cache timestamps
    userBanksLastFetched: number | null;
    allBanksLastFetched: number | null;
    depositBanksLastFetched: number | null;

    // Actions
    fetchUserBanks: (force?: boolean) => Promise<void>;
    fetchAllBanks: (force?: boolean) => Promise<void>;
    fetchDepositBanks: (force?: boolean) => Promise<void>;

    // Utility
    clearCache: () => void;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 dakika

export const useBankStore = create<BankStore>((set, get) => ({
    // Initial state
    userBanks: [],
    allBanks: [],
    depositBanks: [],

    isLoadingUserBanks: false,
    isLoadingAllBanks: false,
    isLoadingDepositBanks: false,

    userBanksLastFetched: null,
    allBanksLastFetched: null,
    depositBanksLastFetched: null,

    // Fetch user banks (withdraw için)
    fetchUserBanks: async (force = false) => {
        const state = get();
        const now = Date.now();

        // Cache kontrolü
        if (
            !force &&
            state.userBanksLastFetched &&
            now - state.userBanksLastFetched < CACHE_DURATION
        ) {
            return;
        }

        set({ isLoadingUserBanks: true });
        try {
            const data = await fetchUserBanks();
            set({
                userBanks: data,
                userBanksLastFetched: now,
                isLoadingUserBanks: false,
            });
        } catch (error) {
            console.error('User banks yüklenemedi:', error);
            set({ isLoadingUserBanks: false });
        }
    },

    // Fetch all banks (banka ekleme formu için)
    fetchAllBanks: async (force = false) => {
        const state = get();
        const now = Date.now();

        if (
            !force &&
            state.allBanksLastFetched &&
            now - state.allBanksLastFetched < CACHE_DURATION
        ) {
            return;
        }

        set({ isLoadingAllBanks: true });
        try {
            const data = await fetchBanks();
            set({
                allBanks: data,
                allBanksLastFetched: now,
                isLoadingAllBanks: false,
            });
        } catch (error) {
            console.error('All banks yüklenemedi:', error);
            set({ isLoadingAllBanks: false });
        }
    },

    // Fetch deposit banks (deposit için)
    fetchDepositBanks: async (force = false) => {
        const state = get();
        const now = Date.now();

        if (
            !force &&
            state.depositBanksLastFetched &&
            now - state.depositBanksLastFetched < CACHE_DURATION
        ) {
            return;
        }

        set({ isLoadingDepositBanks: true });
        try {
            const data = await fetchDepositBanks();
            set({
                depositBanks: data,
                depositBanksLastFetched: now,
                isLoadingDepositBanks: false,
            });
        } catch (error) {
            console.error('Deposit banks yüklenemedi:', error);
            set({ isLoadingDepositBanks: false });
        }
    },

    // Clear all cache
    clearCache: () => {
        set({
            userBanksLastFetched: null,
            allBanksLastFetched: null,
            depositBanksLastFetched: null,
        });
    },
}));