"use client";

import { ArrowLeft, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { useI18n } from "@/lib/i18n/I18nProvider";
import { cn } from "@/lib/utils";
import { useAccountStore } from "@/stores/useAccountStore";
import { useBankStore } from "@/stores/useBankStore";
import { useCryptoStore } from "@/stores/useCryptoStore";
import { useModalStore } from "@/stores/useModalStore";

// Withdraw components
import { AddBankAccount } from "./addAccount/AddBankAccount";
import { AddCryptoAddress } from "./addAccount/AddCryptoAddress";

// Deposit components
import { BankDeposit } from "./deposit/BankDeposit";
import { CryptoDeposit } from "./deposit/CryptoDeposit";
import { DepositMethodSelection } from "./deposit/DepositMethodSelection";

// Withdraw components
import { useRegionStore } from "@/stores/useRegionStore";
import { BankWithdraw } from "./withdraw/BankWithdraw";
import { CryptoWithdraw } from "./withdraw/CryptoWithdraw";

import { WithdrawMethodSelection } from "./withdraw/WithdrawMethodSelection";

export type FundsMode = "deposit" | "withdraw";
export type AssetType = "fiat" | "crypto";

const stepMap: Record<FundsMode, Record<AssetType, Step>> = {
  deposit: {
    fiat: "deposit-bank",
    crypto: "deposit-crypto",
  },
  withdraw: {
    fiat: "withdraw-bank",
    crypto: "withdraw-crypto",
  },
};

export type FundsData = {
  mode: FundsMode;
  asset?: string;
  assetType?: AssetType;
}

export type Step =
  | "deposit-method"
  | "deposit-bank"
  | "deposit-crypto"
  | "withdraw-method"
  | "withdraw-bank"
  | "add-bank-account"
  | "add-crypto-address"
  | "withdraw-crypto"
  | "confirm-withdraw";


export function FundsModal() {
  const { t, locale } = useI18n();
  const { closeModal, data, isClosing } = useModalStore();
  const { mode, asset, assetType } = data as FundsData;

  const getInitialStep = ({ mode, assetType }: FundsData): Step => {
    if (!assetType) {
      return mode === "deposit" ? "deposit-method" : "withdraw-method";
    };
    return stepMap[mode][assetType];
  };

  const [step, setStep] = useState<Step>(getInitialStep({ mode, assetType }));

  const [cryptoAddressStep, setCryptoAddressStep] = useState(0);
  const [cryptoAsset, setCryptoAsset] = useState(asset || "");

  const {
    userBanks,
    allBanks,
    depositBanks,
    fetchUserBanks,
    fetchDepositBanks,
    fetchAllBanks,
  } = useBankStore();

  const { accountInfo, fetchAccountInfo } = useAccountStore();
  const { cryptoPlatforms, fetchCryptoPlatforms } = useCryptoStore();
  const { countries, fetchCountries } = useRegionStore();
  const { cryptoAssets, fetchCryptoAssets } = useCryptoStore();

  useEffect(() => {
    fetchAccountInfo();
    if (mode === "deposit") {
      fetchDepositBanks();
    } else {
      fetchUserBanks(true);
      fetchCountries();
      fetchCryptoAssets(locale);
    }
  }, [mode, fetchAccountInfo, fetchDepositBanks, fetchUserBanks, fetchCountries, fetchCryptoAssets, locale]);

  useEffect(() => {
    if (step === "add-bank-account") {
      fetchAllBanks();
    }

    if (step === "add-crypto-address") {
      fetchCryptoPlatforms(locale);
    }
  }, [step, locale, fetchAllBanks, fetchCryptoPlatforms]);

  const handleBankAdded = async () => {
    await fetchUserBanks(true);
    setStep("withdraw-bank");
  };

  const handleBack = () => {
    if (step === "add-crypto-address" && cryptoAddressStep > 0) {
      setCryptoAddressStep(prev => prev - 1);
      return;
    }

    setStep((prev) => {
      switch (prev) {
        case "deposit-bank":
          return "deposit-method";
        case "deposit-crypto":
          return "deposit-method";
        case "withdraw-bank":
          return "withdraw-method";
        case "add-bank-account":
          return "withdraw-bank";
        case "add-crypto-address":
          return "withdraw-crypto";
        case "withdraw-crypto":
          return "withdraw-method";
        case "confirm-withdraw":
          return "withdraw-bank";
        default:
          return prev;
      }
    });

    if (step === "add-crypto-address") {
      setCryptoAddressStep(0);
    }
  };

  const showBackButton =
    step === "deposit-bank" ||
    step === "deposit-crypto" ||
    step === "withdraw-bank" ||
    step === "withdraw-crypto" ||
    step === "add-bank-account" ||
    step === "add-crypto-address" ||
    step === "confirm-withdraw";

  const title = useMemo(() => {
    switch (step) {
      case "deposit-method":
        return t("modals.funds.titleDeposit");
      case "deposit-bank":
        return t("modals.funds.subtitleDepositBank");
      case "deposit-crypto":
        return t("modals.funds.subtitleDepositCrypto");
      case "withdraw-method":
        return t("modals.funds.titleWithdraw");
      case "withdraw-bank":
        return t("modals.funds.subtitleWithdrawBank");
      case "withdraw-crypto":
        return t("modals.funds.subtitleWithdrawCrypto");
      case "add-bank-account":
        return t("modals.funds.subtitleAddBankAccount");
      case "confirm-withdraw":
        return t("modals.funds.subtitleConfirmWithdraw");
      case "add-crypto-address":
        return t("modals.funds.subtitleAddCryptoAddress");
      default:
        return t("modals.funds.titleDeposit");
    }
  }, [step, t]);

  // Render content based on current step
  const renderContent = () => {
    switch (step) {
      case "deposit-method":
        return (
          <DepositMethodSelection
            isFirstDeposit={false}
            onSelectMethod={setStep}
            t={t}
          />
        );

      case "deposit-bank":
        return (
          <BankDeposit
            bankList={depositBanks}
            t={t}
          />
        );

      case "deposit-crypto":
        return (
          <CryptoDeposit
            key={`deposit-crypto-${cryptoAsset || "default"}`}
            asset={cryptoAsset}
            t={t}
          />
        );

      case "withdraw-method":
        return (
          <WithdrawMethodSelection
            onSelectMethod={setStep}
            hasCryptoAssets={true}
            t={t}
          />
        );

      case "withdraw-bank":
        return (
          <BankWithdraw
            userBanks={userBanks}
            onAddBank={() => setStep("add-bank-account")}
            onSuccess={closeModal}
            t={t}
          />
        );

      case "add-bank-account":
        return (
          <AddBankAccount
            banks={allBanks}
            onSuccess={handleBankAdded}
            t={t}
          />
        );

      case "withdraw-crypto":
        return (
          <CryptoWithdraw
            t={t}
            asset={cryptoAsset}
            onAddAddress={(asset: string) => {
              setStep("add-crypto-address");
              setCryptoAsset(asset);
            }}
            onSuccess={closeModal}
          />
        );

      case "add-crypto-address":
        return (
          <AddCryptoAddress
            t={t}
            onSuccess={() => {
              setStep("withdraw-crypto");
              setCryptoAddressStep(0);
            }}
            currentStep={cryptoAddressStep}
            onStepChange={setCryptoAddressStep}
            asset={cryptoAsset}
            accountInfo={accountInfo!}
            cryptoPlatforms={cryptoPlatforms}
            cryptoAssets={cryptoAssets}
            countries={countries}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div
      onClick={closeModal}
      className="absolute inset-0 z-20 flex items-start justify-center overflow-auto p-4 md:items-start md:pt-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "relative z-20 flex w-full h-full max-h-[95vh] max-w-130 flex-col overflow-hidden rounded-[1.75rem] gap-2 bg-[#0F1415] shadow-2xl ring-1 ring-black/5 lg:ml-auto ",
          isClosing ? "animate-slide-out-to-right" : "animate-slide-in-from-right"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-primary px-6 py-4 h-14 shrink-0">
          <div>
            <h3 className="text-base font-semibold text-white">
              {title}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {showBackButton && (
              <button
                type="button"
                onClick={handleBack}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-white transition hover:bg-white/10"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}
            <button
              type="button"
              onClick={closeModal}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-white transition hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div id="funds-modal-content" className="custom-scrollbar flex-1 overflow-y-auto px-6 pt-6 pb-3 bg-[#0F1415]">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
