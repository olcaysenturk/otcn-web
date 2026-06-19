"use client";

import { cn } from "@/lib/utils";
import { useModalStore } from "@/stores/useModalStore";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AddressModal } from "./address/AddressModal";
import { AssetDetailModal } from "./asset-detail/AssetDetailModal";
import { AddShareholderModal } from "./corporate/AddShareholderModal";
import { UpdateAccountAuthorityModal } from "./corporate/UpdateAccountAuthorityModal";
import { CourierKycModal } from "./courier/CourierKycModal";
import { DigitalKycModal } from "./kyc/DigitalKycModal";
import { CryptoTransactionDetailModal } from "./crypto-transaction-detail/CryptoTransactionDetailModal";
import { DeclareTransactionModal } from "./declare-transaction/DeclareTransactionModal";
import { AddBankAccountModal } from "./funds/addAccount/AddBankAccountModal";
import { AddCryptoAddressModal } from "./funds/addAccount/AddCryptoAddressModal";
import { FundsModal } from "./funds/FundsModal";
import { PendingTransactionsModal } from "./pending-transactions/PendingTransactionsModal";
import { TradeOrderDetailModal } from "./trade-order-detail/TradeOrderDetailModal";
import { ChangePasswordModal } from "./security/ChangePasswordModal";
import { PasswordChangeVerifyModal } from "./security/PasswordChangeVerifyModal";
import { TwoFactorVerification } from "./tfa/Tfa";
import { AccountPreferencesModal } from "./preferences/AccountPreferencesModal";

const modalRegistry = {
  "declare-transaction": DeclareTransactionModal,
  funds: FundsModal,
  address: AddressModal,
  "courier-kyc": CourierKycModal,
  "digital-kyc": DigitalKycModal,
  "asset-detail": AssetDetailModal,
  "pending-transactions": PendingTransactionsModal,
  "crypto-transaction-detail": CryptoTransactionDetailModal,
  "trade-order-detail": TradeOrderDetailModal,
  "add-shareholder": AddShareholderModal,
  "add-bank-account": AddBankAccountModal,
  "change-password": ChangePasswordModal,
  "update-account-authority": UpdateAccountAuthorityModal,
  "add-crypto-address": AddCryptoAddressModal,
  "password-change-verify": PasswordChangeVerifyModal,
  "account-preferences": AccountPreferencesModal,
  "tfa-verification": TwoFactorVerification,
};

export function ModalRoot() {
  const { activeModal, isClosing, closeModal, data } = useModalStore();
  const portalTarget = typeof document !== "undefined" ? document.body : null;

  useEffect(() => {
    if (!portalTarget || !activeModal) return;
    const html = document.documentElement;
    html.classList.add("overflow-hidden");
    return () => {
      html.classList.remove("overflow-hidden");
    };
  }, [portalTarget, activeModal]);

  if (!portalTarget || !activeModal) return null;

  const ModalComponent = modalRegistry[activeModal];
  if (!ModalComponent) return null;

  return createPortal(
    <div className="fixed inset-0 z-9999 text-black">
      <div
        onClick={closeModal}
        className={cn(
          "absolute inset-0 z-10 bg-black/30 backdrop-blur-[2px] dark:bg-black/60",
          isClosing ? "animate-fade-out" : "animate-fade-in"
        )}
      />
      <ModalComponent {...((data ?? {}) as Record<string, unknown>)} />
    </div>,
    portalTarget,
  );
}
