"use client";

import { Button } from "@/components/ui/button";
import { AssetSelectDropdown } from "@/components/ui/AssetSelectDropdown";
import DecimalInput from "@/components/ui/form/AppDecimlaInput";
import { InfoBox } from "@/components/ui/infobox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { D, decimal } from "@/lib/math/decimal";
import { getCoinIconPath } from "@/lib/coinIcons";
import { getCryptoAddresses } from "@/services/crypto";
import { initiateWithdrawCrypto, withdrawCryptoComplete } from "@/services/otc";
import { fetchWallet } from "@/services/wallet";
import { useCryptoStore } from "@/stores/useCryptoStore";
import { CryptoAddress, CryptoAsset } from "@/types/crypto";
import { CryptoWithdrawResponse } from "@/types/otc";
import { WalletBalanceResponse } from "@/types/wallet";
import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { TwoFactorVerification } from "../../tfa/Tfa";

type CryptoWithdrawProps = {
  t: (key: string, params?: Record<string, string>) => string;
  asset?: string;
  onAddAddress: (asset: string) => void;
  onSuccess: () => void;
};

type WithdrawFormValues = {
  assetSymbol: string;
  networkName: string;
  addressId: string;
  amount: decimal;
  assetSource: string;
  withdrawPurpose: string;
  //UI
  withdrawPurposeOther?: string;
  assetSourceOther?: string;
};

const ASSET_SOURCE_OPTIONS = [
  { value: "SALARY_WORK_INCOME", key: "salaryWorkIncome" },
  { value: "CRYPTO_GAIN", key: "cryptoGain" },
  { value: "RENTAL_INCOME", key: "rentalIncome" },
  { value: "PERSONAL_INVESTMENT", key: "personalInvestment" },
  { value: "ASSET_SOURCE_OTHER", key: "other" },
];

const WITHDRAW_PURPOSE_OPTIONS = [
  { value: "TRANSFER_TO_OWN_WALLET", key: "transferOwnWallet" },
  { value: "TRANSFER_TO_OTHER_EXCHANGE", key: "transferOtherExchange" },
  { value: "YIELD_STAKING_LENDING", key: "yieldStakingLending" },
  { value: "INVESTMENT_ICO_IEO", key: "investmentIcoIeo" },
  { value: "CUSTODY_AND_SECURITY", key: "custodySecurity" },
  { value: "WITHDRAW_PURPOSE_OTHER", key: "other" },
];

const FormField = ({ label, children, hasRequired }: { label: string; children: React.ReactNode, hasRequired?: boolean }) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-medium text-gray-400">
      {label}
      {hasRequired && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
);

export function CryptoWithdraw({ t, onAddAddress, asset, onSuccess }: CryptoWithdrawProps) {
  const locale = useI18n().locale;
  const [currentStep, setCurrentStep] = useState(0); // 0: Form, 1: TFA
  const [savedAddresses, setSavedAddresses] = useState<CryptoAddress[]>([]);
  const [loading, setLoading] = useState(false);
  const [availableBalance, setAvailableBalance] = useState<decimal>(D.from(0));
  const [withdrawResponse, setWithdrawResponse] = useState<CryptoWithdrawResponse | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const { cryptoAssets, fetchCryptoAssets } = useCryptoStore();

  const { watch, setValue } = useForm<WithdrawFormValues>({
    defaultValues: {
      assetSymbol: asset || "",
      networkName: "",
      addressId: "",
      amount: D.from(0),
      assetSource: "",
      withdrawPurpose: "",
      withdrawPurposeOther: "",
      assetSourceOther: "",
    },
  });

  const form = watch();
  const selectedAsset = cryptoAssets?.find(a => a.assetSymbol === form.assetSymbol);
  const assetOptions = (cryptoAssets ?? []).map((coin) => ({
    value: coin.assetSymbol,
    label: coin.assetSymbol,
    meta: coin.assetName,
    iconSrc: getCoinIconPath(coin.assetSymbol),
  }));

  const selectedNetwork = useMemo(() => {
    return selectedAsset?.network.find(n => n.networkName === form.networkName);
  }, [selectedAsset, form.networkName]);

  const minQty = selectedNetwork?.settings.withdrawalMinQty ?? 0;
  const networkTime = selectedNetwork?.settings.networkTime ?? 0;
  const networkTimeMinutes = Math.ceil(networkTime / 60);

  const transactionFee = 0.00;
  const feeDecimal = D.from(transactionFee);
  const netAmount = form.amount.sub(feeDecimal);
  const amount = netAmount.dgreater(D.from(0)) ? netAmount : D.from(0);
  const otherLabel = t("modals.funds.other");
  const assetSourceOptions = useMemo(
    () =>
      ASSET_SOURCE_OPTIONS.map((opt) => ({
        value: opt.value,
        text: t(`modals.funds.assetSourceOptions.${opt.key}`),
      })),
    [t],
  );
  const withdrawPurposeOptions = useMemo(
    () =>
      WITHDRAW_PURPOSE_OPTIONS.map((opt) => ({
        value: opt.value,
        text: t(`modals.funds.withdrawPurposeOptions.${opt.key}`),
      })),
    [t],
  );

  useEffect(() => {
    if (!selectedAsset) return;
    handleLoadAddresses(selectedAsset);
  }, [selectedAsset]);

  const handleLoadAddresses = async (asset: CryptoAsset) => {
    setValue("assetSymbol", asset.assetSymbol);
    const networks = asset.network;
    if (networks.length === 1) {
      setValue("networkName", networks[0].networkName);
    }

    try {
      setLoading(true);
      const response = await getCryptoAddresses(asset.assetSymbol);
      setSavedAddresses(response);

      const wallet = await fetchWallet({ locale, assetSymbol: asset.assetSymbol });
      const walletJson = await wallet.json() as WalletBalanceResponse[];
      if (walletJson.length > 0) {
        const available = D.parse(walletJson[0].available);
        setAvailableBalance(available);
      } else {
        setAvailableBalance(D.from(0));
      }
    } catch (error: any) {
      toast.error(error?.message || t("validation.addCryptoAddress.addressAddedError"));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.assetSymbol || !form.addressId || !form.assetSource || !form.withdrawPurpose) {
      toast.error(t("validation.addCryptoAddress.fillRequiredFields"));
      return;
    }

    if (form.assetSource === "ASSET_SOURCE_OTHER" && (!form.assetSourceOther || form.assetSourceOther.trim().length < 3)) {
      toast.error(t("validation.assetSourceOtherMin"));
      return;
    }

    if (form.withdrawPurpose === "WITHDRAW_PURPOSE_OTHER" && (!form.withdrawPurposeOther || form.withdrawPurposeOther.trim().length < 3)) {
      toast.error(t("validation.withdrawPurposeOtherMin"));
      return;
    }

    if (!form.amount.dgreater(D.from(0))) {
      toast.error(t("modals.funds.amountMustBeGreaterThanZero"));
      return;
    }

    const address = savedAddresses.find(addr => addr.id.toString() === form.addressId);
    if (!address) {
      toast.error(t("modals.funds.validAddressRequired"));
      return;
    }

    setLoading(true);
    try {
      const payload = {
        asset: form.assetSymbol,
        quantity: form.amount.single(),
        address: address.address,
        memoTag: (address as any).memoTag || undefined,
        network: form.networkName,
        assetSource: form.assetSource === "ASSET_SOURCE_OTHER" ? `${otherLabel} ( ${form.assetSourceOther} )` : form.assetSource,
        assetPurpose: form.withdrawPurpose === "WITHDRAW_PURPOSE_OTHER" ? `${otherLabel} ( ${form.withdrawPurposeOther} )` : form.withdrawPurpose,
      };
      const response = await initiateWithdrawCrypto(payload);
      if (response.flowId) {
        setWithdrawResponse(response);
        setCurrentStep(1);
      } else {
        toast.error(response.message || t("modals.funds.withdrawInitError"));
      }
    } catch (error: any) {
      toast.error(error?.message || t("modals.funds.withdrawInitError"));
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    try {
      setLoading(true);
      const res = await withdrawCryptoComplete(withdrawResponse?.flowId!);
      if (!res.message) {
        toast.success(t("modals.funds.withdrawSuccess"));
        onSuccess();
      } else {
        toast.error(res.message || t("modals.funds.withdrawError"));
      }
    } catch (error: any) {
      toast.error(error?.message || t("modals.funds.withdrawError"));
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "bg-white/5 border-white/10 rounded-xl text-sm font-medium placeholder:text-gray-500 h-[45px] px-4 outline-none border";

  // Initialize with BNB if no asset selected
  useEffect(() => {
    if (!form.assetSymbol || asset) {
      const coin = cryptoAssets?.find(a => a.assetSymbol === (asset || "BNB"));
      if (coin) {
        setValue("assetSymbol", coin.assetSymbol);
      }
    }
  }, []);

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
          {t(`modals.funds.complete`)}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full gap-6 justify-between">
      <InfoBox variant="info-dark" hideIcon>
        <ul className="flex flex-col gap-4">
          {[
            t("modals.funds.withdrawCryptoBullet1"),
            t("modals.funds.withdrawCryptoBullet2", { asset: form.assetSymbol, minQty: minQty.toString() }),
            t("modals.funds.withdrawCryptoBullet3", { time: networkTimeMinutes.toString() }),
          ].map((text, index) => (
            <li key={index} className="flex items-center gap-4">
              <span className="h-2 w-2 shrink-0 rounded-full bg-[#7FA6FF]" />
              <span className="text-[13px] leading-[140%] tracking-[-0.015em] text-gray-200">
                {text}
              </span>
            </li>
          ))}
        </ul>
      </InfoBox>
      <div className="flex flex-col gap-6">
        <form className="flex flex-col gap-6">
          {/* Asset Selector */}
          <FormField label={t("modals.funds.selectCoin")} hasRequired>
            <AssetSelectDropdown
              value={form.assetSymbol}
              options={assetOptions}
              placeholder={t("modals.funds.selectCoinPlaceholder")}
              onChange={(value) => {
                setValue("assetSymbol", value);
                setValue("networkName", "");
                setValue("addressId", "");
              }}
            />
          </FormField>

          {/* Address Selector */}
          {savedAddresses.length > 0 || loading ? (
            <div className="flex flex-col gap-4">
              <FormField label={t("modals.funds.address")} hasRequired>
                <Select
                  value={form.addressId}
                  onValueChange={(v) => {
                    setValue("addressId", v);
                    const selectedAddress = savedAddresses.find((address) => address.id.toString() === v);
                    if (selectedAddress?.networkName) {
                      setValue("networkName", selectedAddress.networkName);
                    }
                  }}
                  disabled={loading}
                >
                  <SelectTrigger size="md" className="w-full bg-white/5 border-white/10 text-white data-[placeholder]:text-gray-500">
                    <SelectValue placeholder={t("modals.funds.addressSelectPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1C2425] border-white/10 text-white">
                    {savedAddresses.map(address => (
                      <SelectItem key={address.id} value={address.id.toString()} className="focus:bg-white/10">
                        {address.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <Button
                variant="green"
                className="shadow-none bg-transparent w-fit hover:bg-[#25B88A] hover:text-white"
                disabled={!selectedAsset}
                onClick={() => onAddAddress(selectedAsset?.assetSymbol || "")}
              >
                <Plus className="h-4 w-4 mr-2" />
                {t("modals.funds.addNewAddress")}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <InfoBox variant="warning-dark">
                <span className="text-[13px] leading-[140%] text-gray-200">
                  {t("modals.funds.noAddressWarning")}
                </span>
              </InfoBox>

              <Button
                variant="green"
                className="shadow-none bg-transparent w-fit hover:bg-[#25B88A] hover:text-white"
                disabled={!selectedAsset}
                onClick={() => onAddAddress(selectedAsset?.assetSymbol || "")}
              >
                <Plus className="h-4 w-4 mr-2" />
                {t("modals.funds.addNewAddress")}
              </Button>
            </div>
          )}

          {/* Amount Input */}
          <DecimalInput
            label={t("modals.funds.amountLabel")}
            availableBalance={availableBalance}
            asset={selectedAsset?.assetSymbol || ""}
            onAmountChange={(value) => setValue("amount", value)}
            maxPrecision={8}
            availableText={t("modals.funds.availableLabel", {
              amount: `${D.set(availableBalance, 8).format(true)} ${selectedAsset?.assetSymbol || ""}`,
            })}
          />

          {/* Fee & Net Amount */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center text-[14px] font-medium">
              <span className="text-gray-400">{t("modals.funds.withdrawFeeLabel")}</span>
              <span className="text-white">{transactionFee} {selectedAsset?.assetSymbol}</span>
            </div>
            <div className="flex justify-between items-center text-[14px] font-medium">
              <span className="text-gray-400">{t("modals.funds.withdrawnAmountLabel")}</span>
              <span className="text-white">{amount.format(false)} {selectedAsset?.assetSymbol}</span>
            </div>
          </div>

          {/* Source of Funds */}
          <FormField label={t("modals.funds.assetSource")} hasRequired>
            <Select
              value={form.assetSource}
              onValueChange={(v) => setValue("assetSource", v)}
            >
              <SelectTrigger size="md" className="w-full bg-white/5 border-white/10 text-white data-[placeholder]:text-gray-500">
                <SelectValue placeholder={t("modals.funds.selectPlaceholder")} />
              </SelectTrigger>
              <SelectContent className="bg-[#1C2425] border-white/10 text-white">
                {assetSourceOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value} className="focus:bg-white/10">{opt.text}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          {form.assetSource === "ASSET_SOURCE_OTHER" && (
            <FormField label={t("modals.funds.description")} hasRequired>
              <Input
                value={form.assetSourceOther}
                type="text"
                className="h-11 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                onChange={(e) => setValue("assetSourceOther", e.target.value)}
              />
            </FormField>
          )}

          {/* Purpose */}
          <FormField label={t("modals.funds.transactionPurpose")} hasRequired>
            <Select
              value={form.withdrawPurpose}
              onValueChange={(v) => setValue("withdrawPurpose", v)}
            >
              <SelectTrigger size="md" className="w-full bg-white/5 border-white/10 text-white data-[placeholder]:text-gray-500">
                <SelectValue placeholder={t("modals.funds.selectPlaceholder")} />
              </SelectTrigger>
              <SelectContent className="bg-[#1C2425] border-white/10 text-white">
                {withdrawPurposeOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value} className="focus:bg-white/10">{opt.text}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          {form.withdrawPurpose === "WITHDRAW_PURPOSE_OTHER" && (
            <FormField label={t("modals.funds.description")} hasRequired>
              <Input
                value={form.withdrawPurposeOther}
                type="text"
                className="h-11 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                onChange={(e) => setValue("withdrawPurposeOther", e.target.value)}
              />
            </FormField>
          )}
        </form>
      </div>

      <Button
        className="w-full bg-white text-[#0F1415] hover:bg-white/90 rounded-full"
        onClick={handleSubmit}
        disabled={loading || savedAddresses.length === 0 || !form.assetSource || !form.withdrawPurpose}
      >
        {t("modals.funds.confirmRequest")}
      </Button>
    </div>
  );
}
