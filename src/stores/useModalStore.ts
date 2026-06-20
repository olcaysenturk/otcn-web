"use client";

import { create } from "zustand";

export type ModalName = "declare-transaction" | "funds" | "address" | "courier-kyc" | "digital-kyc" | "asset-detail" | "pending-transactions" | "crypto-transaction-detail" | "fiat-transaction-detail" | "trade-order-detail" | "add-shareholder" | "add-bank-account" | "change-password"
  | "update-account-authority"
  | "add-crypto-address"
  | "password-change-verify"
  | "account-preferences"
  | "tfa-verification"
  | null;

type ModalState = {
  activeModal: ModalName;
  data?: unknown;
  isClosing: boolean;
  openModal: (name: Exclude<ModalName, null>, data?: unknown) => void;
  closeModal: () => void;
};

export const useModalStore = create<ModalState>((set) => ({
  activeModal: null,
  data: undefined,
  isClosing: false,
  openModal: (name, data) => set({ activeModal: name, data, isClosing: false }),
  closeModal: () => {
    set({ isClosing: true });
    setTimeout(() => {
      set({ activeModal: null, data: undefined, isClosing: false });
    }, 300); // Higher than or equal to slide-out animation duration
  },
}));
