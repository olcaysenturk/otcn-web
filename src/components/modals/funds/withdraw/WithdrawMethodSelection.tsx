"use client";

import { OptionCard } from "../components/OptionCard";
import type { Step } from "../FundsModal";

type WithdrawMethodSelectionProps = {
  onSelectMethod: (step: Step) => void;
  hasCryptoAssets?: boolean;
  t: (key: string) => string;
};

export function WithdrawMethodSelection({
  onSelectMethod,
  hasCryptoAssets = false,
  t,
}: WithdrawMethodSelectionProps) {
  return (
    <div className="space-y-4">
      <OptionCard
        title={t("modals.funds.optionWithdrawBankTitle")}
        description={t("modals.funds.optionWithdrawBankDesc")}
        onClick={() => onSelectMethod("withdraw-bank")}
        icon="/assets/icons/Wallet-01.svg"
        active
      />
      <OptionCard
        title={t("modals.funds.optionWithdrawCryptoTitle")}
        description={t("modals.funds.optionWithdrawCryptoDesc")}
        onClick={() => onSelectMethod("withdraw-crypto")}
        icon="/assets/icons/Bitcoin-02.svg"
        disabled={!hasCryptoAssets}
      />
    </div>
  );
}
