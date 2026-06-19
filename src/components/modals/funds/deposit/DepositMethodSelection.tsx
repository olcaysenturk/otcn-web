"use client";

import { InfoBox } from "@/components/ui/infobox";
import { OptionCard } from "../components/OptionCard";
import type { Step } from "../FundsModal";

type DepositMethodSelectionProps = {
  isFirstDeposit: boolean;
  onSelectMethod: (step: Step) => void;
  t: (key: string) => string;
};

export function DepositMethodSelection({
  isFirstDeposit,
  onSelectMethod,
  t,
}: DepositMethodSelectionProps) {
  return (
    <div className="space-y-4">
      <InfoBox variant="info-dark">
        <p
          className="text-sm text-gray-200"
          dangerouslySetInnerHTML={{ __html: t(isFirstDeposit ? "modals.funds.firstTimeDesc" : "modals.funds.depositDesc") }}
        />
      </InfoBox>
      <OptionCard
        title={t("modals.funds.optionDepositBankTitle")}
        description={t("modals.funds.optionDepositBankDesc")}
        onClick={() => onSelectMethod("deposit-bank")}
        icon="/assets/icons/Wallet-01.svg"
        active
      />
      <OptionCard
        title={t("modals.funds.optionDepositCryptoTitle")}
        description={t("modals.funds.optionDepositCryptoDesc")}
        onClick={() => onSelectMethod("deposit-crypto")}
        icon="/assets/icons/Bitcoin-02.svg"
        disabled={isFirstDeposit}
      />
    </div>
  );
}
