"use client";

import { Button } from "@/components/ui/button";
import DecimalInput from "@/components/ui/form/AppDecimlaInput";
import { InfoBox } from "@/components/ui/infobox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { D, decimal } from "@/lib/math/decimal";
import { completeWithdrawToBank, initiateWithdrawToBank } from "@/services/fiat";
import { fetchWallet } from "@/services/wallet";
import { UserBank } from "@/types/bank";
import { InitiateWithdrawToBankRequest, InitiateWithdrawToBankResponse } from "@/types/fiat";
import { WalletApiItem } from "@/types/wallet";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { TwoFactorVerification } from "../../tfa/Tfa";

type BankWithdrawProps = {
  userBanks: UserBank[];
  onAddBank: () => void;
  onSuccess: () => void;
  t: (key: string, params?: Record<string, string>) => string;
};

type BankWithdrawFormValues = {
  asset: string;
  bankId: string;
  amount: decimal;
};

const FormField = ({ label, children, hasRequired }: { label: string; children: React.ReactNode, hasRequired?: boolean }) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-medium text-gray-400">
      {label}
      {hasRequired && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
);

export function BankWithdraw({
  userBanks,
  onAddBank,
  onSuccess,
  t,
}: BankWithdrawProps) {
  const locale = useI18n().locale;
  const [availableBalance, setAvailableBalance] = useState<decimal>(D.from(0));
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // 0: Form, 1: TFA
  const [withdrawResponse, setWithdrawResponse] = useState<InitiateWithdrawToBankResponse | null>(null);
  const [isVerified, setIsVerified] = useState(false);

  const { watch, setValue } = useForm<BankWithdrawFormValues>({
    defaultValues: {
      asset: "TL",
      bankId: "",
      amount: D.from(0),
    },
  });

  const form = watch();
  const selectedBank = userBanks.find((b) => b.id.toString() === form.bankId);

  const FIAT_PRECISION = 2;
  const transactionFee = 0.00;

  const getBankInitials = (bankName: string) => {
    return bankName
      .split(" ")
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const getAvailableBalance = async () => {
    setLoading(true);
    try {
      const res = await fetchWallet({ locale, assetSymbol: "TRY" });
      const availableBalance = await res.json() as WalletApiItem[]
      setAvailableBalance(D.parse(availableBalance.find((x) => x.asset === "TRY")?.available || "0"));
    } finally {
      setLoading(false);
    }
  };

  const controlValidation = () => {
    if (!form.bankId) {
      return t("modals.funds.bankAccountRequired");
    }
    if (form.amount.isZero()) {
      return t("modals.funds.amountRequired");
    }
    if (form.amount.greater(availableBalance.single())) {
      return t("modals.funds.insufficientBalance");
    }
  };

  const handleSubmit = async () => {
    const validation = controlValidation();
    if (validation) {
      toast.error(validation);
      return;
    }
    setLoading(true);
    const payload: InitiateWithdrawToBankRequest = {
      currency: "TRY",
      quantity: D.single(form.amount),
      iban: selectedBank?.iban!,
    }
    try {
      const res = await initiateWithdrawToBank(payload);
      if (res.flowId) {
        setWithdrawResponse(res);
        setCurrentStep(1);
      } else {
        toast.error(res?.message || t("modals.funds.withdrawError"));
      }
    } catch (error: any) {
      toast.error(error?.message || t("modals.funds.withdrawError"));
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    try {
      setLoading(true);
      const res = await completeWithdrawToBank(withdrawResponse?.flowId!);
      if (res.ok) {
        toast.success(t("modals.funds.withdrawSuccess"));
        onSuccess();
      } else {
        toast.error(t("modals.funds.withdrawError"));
      }
    } catch (error: any) {
      toast.error(error?.message || t("modals.funds.withdrawError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAvailableBalance();
  }, []);

  const inputClass = "bg-white border-[#E8EDF3] rounded-xl text-sm font-medium placeholder:text-[#9AA4B2] h-[45px] px-4 outline-none border";

  // TFA Step
  if (currentStep === 1 && withdrawResponse) {
    return (
      <div className="flex flex-col min-h-full gap-6 justify-between">
        <div className="flex flex-col gap-4">
          <p className="text-sm font-medium text-gray-200">
            {t("modals.funds.tfaDescription")}
          </p>
          <TwoFactorVerification
            onVerificationSuccess={() => setIsVerified(true)}
            defaultExpanded="Email"
            tfaConfig={withdrawResponse}
            variant="dark"
          />
        </div>
        <Button
          onClick={handleComplete}
          disabled={!isVerified || loading}
          className="w-full bg-white text-[#0F1415] hover:bg-white/90 rounded-full"
        >
          {t("modals.funds.complete")}
        </Button>
      </div>
    );
  }

  // Form Step
  return (
    <div className="flex flex-col min-h-full gap-6 justify-between">
      <div className="flex flex-col gap-6">
        <InfoBox variant="info-dark" hideIcon>
          <ul className="flex flex-col gap-4">
            {[
              "withdrawBankBullet1",
              "withdrawBankBullet2",
              "withdrawBankBullet3",
              "withdrawBankBullet4"
            ].map((item, index) => (
              <li key={index} className="flex items-center gap-4">
                <span className="h-2 w-2 shrink-0 rounded-full bg-[#7FA6FF]" />
                <span className="text-[13px] leading-[140%] tracking-[-0.015em] text-gray-200">
                  {t("modals.funds." + item, { asset: "TL" })}
                </span>
              </li>
            ))}
          </ul>
        </InfoBox>

        <form className="flex flex-col gap-6">
          {/* Bank Account Selector */}
          <FormField label={t("modals.funds.bankAccountTitle")} hasRequired>
            <Select
              value={form.bankId}
              onValueChange={(v) => setValue("bankId", v)}
              disabled={loading || userBanks.length === 0}
            >
              <SelectTrigger size="md" className="w-full bg-white/5 border-white/10 text-white data-[placeholder]:text-gray-500">
                <SelectValue placeholder={t("modals.funds.bankAccountPlaceholder")} />
              </SelectTrigger>
              <SelectContent className="bg-[#1C2425] border-white/10 text-white">
                {userBanks.map((bank) => (
                  <SelectItem
                    key={bank.id}
                    value={bank.id.toString()}
                    className="focus:bg-white/10"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                          <span className="text-xs font-semibold text-blue-300">
                            {getBankInitials(bank.bank)}
                          </span>
                        </div>
                        <span className="text-[14px] text-white">
                          {bank.label}
                        </span>
                      </div>
                      <span className="text-[12px] text-gray-400">
                        {bank.iban}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <Button
            variant="green"
            className="shadow-none bg-transparent w-fit hover:bg-[#25B88A] hover:text-white"
            onClick={onAddBank}
          >
            <Plus className="h-4 w-4 mr-2" />
            {t("modals.funds.addBankAccount")}
          </Button>

          {userBanks.length > 0 && (
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center text-[14px] font-medium">
                <span className="text-gray-400">{t("modals.funds.bankLabel")}</span>
                <span className="text-white">{selectedBank?.bank || "-"}</span>
              </div>
              <div className="flex justify-between items-center text-[14px] font-medium">
                <span className="text-gray-400">{t("modals.funds.ibanLabel")}</span>
                <span className="text-white">{selectedBank?.iban || "-"}</span>
              </div>
            </div>
          )}

          {/* Amount Input */}
          <DecimalInput
            label={t("modals.funds.amountLabel")}
            availableBalance={availableBalance}
            asset={form.asset}
            onAmountChange={(value) => setValue("amount", value)}
            maxPrecision={FIAT_PRECISION}
            placeholder="0,00"
            availableText={t("modals.funds.availableLabel", {
              amount: `${D.set(availableBalance, FIAT_PRECISION).format(true)} ${form.asset}`,
            })}
          />

          {/* Transaction Details */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center text-[14px] font-medium">
              <span className="text-gray-400">{t("modals.funds.withdrawFeeLabel")}</span>
              <span className="text-white">{transactionFee} TRY</span>
            </div>
            <div className="flex justify-between items-center text-[14px] font-medium">
              <span className="text-gray-400">{t("modals.funds.withdrawnAmountLabel")}</span>
              <span className="text-white">{D.format(form.amount, false)} TRY</span>
            </div>
          </div>
        </form>
      </div>

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-white text-[#0F1415] px-4 py-3 text-sm font-semibold rounded-full shadow-md transition hover:bg-white/90"
      >
        {t("modals.funds.confirmRequest")}
      </Button>
    </div>
  );
}
