import type { OtcAsset } from "@/types/otc";
import { ReactNode } from "react";

export interface WalletSidebarAsset {
    id: string;
    icon: ReactNode | string;
    name: string;
    symbol: string;
    amount: string;
    fiat: string;
    fiatValue?: number;
    usdtValue?: number;
    btcValue?: number;
    available: string;
    inOrder: string;
    withdraw: string;
    asset?: OtcAsset | null;
}

export type WalletApiItem = {
    asset: string;
    order: string;
    request: string;
    locked: string;
    blocked: string;
    total: string;
    available: string;
    tryValue: string;
    btcValue: string;
};

export type FetchWalletArgs = {
    locale: string;
    assetSymbol?: string;
};

export interface WalletBalanceMovement {
    eventKey: string;
    amount: number;
    transactionType: string;
    walletType: string;
    createdDate: string;
    assetSymbol?: string;
}

export interface BalanceMovementsResponse {
    summaries: WalletBalanceMovement[];
    breakdowns: any[];
}

export interface WalletBalanceResponse {
    asset: string;
    assetName: string;
    order: string;
    request: string;
    locked: string;
    blocked: string;
    total: string;
    available: string;
    tryValue: string;
    btcValue: string;
}