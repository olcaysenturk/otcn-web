"use client";

import { ProgressBar } from "@/components/ui/bar";
import { AssetSelectDropdown } from "@/components/ui/AssetSelectDropdown";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getProgressBarSteps } from "@/config/withdraw";
import { getCoinIconPath } from "@/lib/coinIcons";
import { cn } from "@/lib/utils";
import { AddCryptoAddressFormValues, getAddCryptoAddressSchema } from "@/lib/validation/CryptoAddressSchema";
import { addCryptoAddressComplete, addCryptoAddressInit } from "@/services/crypto";
import { AccountInfo } from "@/types/account";
import { AddCryptoAddressPayload, AddCryptoAddressResponse, CryptoAsset, CryptoPlatform, ProviderType, ReceiverType } from "@/types/crypto";
import { Country } from "@/types/region";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { TwoFactorVerification } from "../../tfa/Tfa";

type AddCryptoAddressProps = {
    onSuccess: () => void;
    currentStep?: number;
    onStepChange?: (step: number) => void;
    t: (key: string, params?: Record<string, string>) => string;
    asset?: string;
    accountInfo: AccountInfo;
    cryptoPlatforms: CryptoPlatform[];
    cryptoAssets: CryptoAsset[];
    countries: Country[];
};

const PROVIDER_TYPES: { value: ProviderType; label: string }[] = [
    { value: "Wallet", label: "Wallet" },
    { value: "Exchange", label: "Exchange" },
];

const FormField = ({ label, children, hasRequired }: { label: string; children: React.ReactNode, hasRequired?: boolean }) => (
    <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-400">{label}{hasRequired && <span className="text-red-500">*</span>}
        </label>
        {children}
    </div>
);

export function AddCryptoAddress({
    onSuccess,
    t,
    currentStep: externalStep,
    onStepChange,
    asset,
    accountInfo,
    cryptoPlatforms,
    cryptoAssets,
    countries
}: AddCryptoAddressProps) {
    const [internalStep, setInternalStep] = useState(0);
    const [initResponse, setInitResponse] = useState<AddCryptoAddressResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const currentStep = externalStep ?? internalStep;

    const { register, watch, setValue } = useForm<AddCryptoAddressFormValues>({
        resolver: zodResolver(getAddCryptoAddressSchema(t)),
        criteriaMode: "all",
        defaultValues: {
            assetSymbol: asset || "",
            networkName: cryptoAssets?.find(c => c.assetSymbol === asset)?.network[0]?.networkName ?? "",
            accountId: accountInfo.accountId,
            name: "",
            address: "",
            memoTag: "",
            receiver: "",
            receiverType: "Individual",
            receiverBirthDate: null,
            identityNumber: null,
            taxNumber: null,
            providerType: "Wallet",
            providerName: "",
            receiverResidenceAddress: "",
            receiverCountry: "TR",
            otherProviderName: "",
            isSelfOwned: false,
        },
    });

    const form = watch();
    const selectedAsset = cryptoAssets?.find(c => c.assetSymbol === form.assetSymbol);
    const assetOptions = (cryptoAssets ?? []).map((coin) => ({
        value: coin.assetSymbol,
        label: coin.assetSymbol,
        iconSrc: coin.icon || getCoinIconPath(coin.assetSymbol),
    }));
    const networkOptions = selectedAsset?.network.map(n => ({ value: n.networkName, label: n.networkLabel })) ?? [];
    const isIndividual = form.receiverType === "Individual";
    const isCorporateSelfOwned = form.receiverType === "Corporate" && form.isSelfOwned;

    useEffect(() => {
        // Individual declarations must be entered manually.
        if (isIndividual) {
            if (form.isSelfOwned) setValue("isSelfOwned", false);
            return;
        }

        // Corporate + self-owned: lock to corporate data.
        if (form.isSelfOwned) {
            setValue("receiver", accountInfo.companyName || "");
            setValue("taxNumber", accountInfo.taxNumber ?? "");
        }
    }, [form.isSelfOwned, isIndividual, accountInfo.companyName, accountInfo.taxNumber, setValue]);

    useEffect(() => {
        if (!form.assetSymbol) return;
        const assetData = cryptoAssets?.find(c => c.assetSymbol === form.assetSymbol);
        if (assetData?.network.length === 1) {
            setValue("networkName", assetData.network[0].networkName);
        }
    }, [form.assetSymbol, cryptoAssets, setValue]);

    const handleReceiverTypeChange = (checked: boolean, type: ReceiverType) => {
        setValue("receiverType", type as ReceiverType);
        if (checked) {
            if (type === "Corporate") {
                setValue("receiver", "");
                setValue("receiverBirthDate", null);
                setValue("identityNumber", null);
                setValue("taxNumber", null);
            } else {
                setValue("receiver", "");
                setValue("taxNumber", null);
                setValue("identityNumber", null);
                setValue("receiverBirthDate", null);
            }
            setValue("isSelfOwned", false);
        }
    };
    const formValuesToPayload = (
        formValues: AddCryptoAddressFormValues,
    ): AddCryptoAddressPayload => {
        const providerName = formValues.providerName === "0"
            ? `Other - ${formValues.otherProviderName ?? ""}`.trim()
            : formValues.providerName;

        return {
            accountId: formValues.accountId,
            name: formValues.name,
            assetSymbol: formValues.assetSymbol,
            address: formValues.address,
            memoTag: formValues.memoTag && formValues.memoTag.trim() !== "" ? formValues.memoTag : null,
            networkName: formValues.networkName,
            receiver: formValues.receiver,
            description: "",
            receiverType: formValues.receiverType,
            receiverBirthDate: formValues.receiverBirthDate && formValues.receiverBirthDate.trim() !== ""
                ? formValues.receiverBirthDate
                : null,
            identityNumber: formValues.identityNumber && formValues.identityNumber.trim() !== ""
                ? formValues.identityNumber
                : null,
            taxNumber: formValues.taxNumber && formValues.taxNumber.trim() !== ""
                ? formValues.taxNumber
                : null,
            providerType: formValues.providerType,
            providerName,
            receiverResidenceAddress: formValues.receiverResidenceAddress ?? "",
            receiverCountry: formValues.receiverCountry ?? "TR",
        };
    };
    const getStepPercentage = () => [25, 75, 100][currentStep] ?? 0;

    const handleNext = async () => {
        if (currentStep === 2) {
            onSuccess();
            return;
        }

        // Step 0 validation
        if (currentStep === 0) {
            const schema = getAddCryptoAddressSchema(t);
            const validationResult = schema.safeParse(form);

            if (!validationResult.success) {
                // Check only step 0 fields
                const step0Fields = ["assetSymbol", "networkName", "name", "address"];
                const step0Errors = validationResult.error.issues
                    .filter(issue => step0Fields.includes(issue.path[0] as string))
                    .map(issue => issue.message);

                if (step0Errors.length > 0) {
                    toast.error(step0Errors.join(", "));
                    return;
                }
            }
        }

        // Step 1 validation and API call
        if (currentStep === 1) {
            const schema = getAddCryptoAddressSchema(t);
            const validationResult = schema.safeParse(form);

            if (!validationResult.success) {
                const errorMessages = validationResult.error.issues.map(issue => issue.message);
                toast.error(errorMessages.join(", "));
                return;
            }

            try {
                const payload = formValuesToPayload(form);
                setLoading(true);
                const response = await addCryptoAddressInit(payload);
                if (response.flowId) {
                    setInitResponse(response);
                }
                if (response.message) {
                    toast.error(response.message);
                    return;
                }
            } catch (error: unknown) {
                const message = error instanceof Error ? error.message : t("validation.addCryptoAddress.addressAddedError");
                toast.error(message);
                return;
            } finally {
                setLoading(false);
            }
        }

        // Move to next step
        const nextStep = currentStep + 1;
        if (onStepChange) {
            onStepChange(nextStep);
        } else {
            setInternalStep(nextStep);
        }
    };

    const handleComplete = async () => {
        const flowId = initResponse?.flowId;
        if (!flowId) {
            toast.error(t("validation.addCryptoAddress.addressAddedError"));
            return;
        }

        try {
            setLoading(true);
            const response = await addCryptoAddressComplete(flowId);
            if (response.id) {
                onSuccess();
            }
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : t("validation.addCryptoAddress.addressAddedError");
            toast.error(message);
            return;
        } finally {
            setLoading(false);
        }
    }

    const inputClass = "bg-white/5 border-white/10 rounded-xl text-sm font-medium text-white placeholder:text-gray-500 h-[45px] px-4 outline-none border";
    return (
        <div className="flex flex-col min-h-full gap-6 justify-between">
            <div className="flex flex-col gap-6">
                <ProgressBar percentage={getStepPercentage()} configs={getProgressBarSteps((key) => t(key))} />

                <form className="flex flex-col gap-6">
                    {currentStep === 0 && (
                        <>
                            <FormField label={t("modals.funds.selectCoin")} hasRequired>
                                <AssetSelectDropdown
                                    disabled={!!asset}
                                    value={form.assetSymbol}
                                    options={assetOptions}
                                    placeholder={t("modals.funds.selectCoinPlaceholder")}
                                    onChange={(v) => {
                                        setValue("assetSymbol", v);
                                        setValue("networkName", "");
                                    }}
                                />
                            </FormField>

                            <FormField label={t("modals.funds.network")} hasRequired>
                                <Select value={form.networkName} onValueChange={(v) => setValue("networkName", v)} disabled={!networkOptions.length}>
                                    <SelectTrigger size="md" className={cn("w-full bg-white/5 border-white/10 text-white data-[placeholder]:text-gray-500", !networkOptions.length && "opacity-50")}>
                                        <SelectValue placeholder={t("modals.funds.networkPlaceholder")} />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#1C2425] border-white/10 text-white">
                                        {networkOptions.map(net => (
                                            <SelectItem key={net.value} value={net.value} className="focus:bg-white/10">{net.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormField>

                            <FormField label={t("modals.funds.labelTitle")} hasRequired>
                                <Input {...register("name")} placeholder={t("modals.funds.labelPlaceholder")} className={inputClass} />
                            </FormField>

                            <FormField label={t("modals.funds.addressTitle")} hasRequired>
                                <Input {...register("address")} placeholder={t("modals.funds.addressPlaceholder")} className={inputClass} />
                            </FormField>

                            {selectedAsset?.network?.find(n => n.networkName === form.networkName)?.settings.hasMemoTag && (
                                <FormField label={t("modals.funds.memoTitle")} hasRequired>
                                    <Input {...register("memoTag")} placeholder={t("modals.funds.memoPlaceholder")} className={inputClass} />
                                </FormField>
                            )}
                        </>
                    )}

                    {currentStep === 1 && (
                        <>
                            <FormField label={t("modals.funds.userTypeTitle")}>
                                <div className="flex gap-8">
                                    {["Individual", "Corporate"].map(type => (
                                        <div key={type} className="flex items-center gap-2">
                                            <Checkbox id={type} checked={form.receiverType === type} onCheckedChange={(checked) => handleReceiverTypeChange(!!checked, type as ReceiverType)} className="border-white/20 bg-white/5" />
                                            <label htmlFor={type} className="text-sm font-medium text-gray-400 cursor-pointer">{t(`modals.funds.${type.toLowerCase()}`)}</label>
                                        </div>
                                    ))}
                                </div>
                            </FormField>

                            <FormField label={isIndividual ? t("modals.funds.receiverNameIndividual") : t("modals.funds.receiverNameCorporate")} hasRequired>
                                <Input
                                    value={form.receiver}
                                    onChange={(e) => setValue("receiver", e.target.value)}
                                    disabled={isCorporateSelfOwned}
                                    className={cn(inputClass, isCorporateSelfOwned && "bg-white/[0.02] text-gray-400")}
                                />
                            </FormField>

                            <div className={cn("flex items-center gap-3", isIndividual && "opacity-50")}>
                                <Checkbox
                                    id="selfOwned"
                                    checked={form.isSelfOwned}
                                    disabled={isIndividual}
                                    onCheckedChange={(c) => setValue("isSelfOwned", !!c)}
                                    className="border-white/20 bg-white/5"
                                />
                                <label htmlFor="selfOwned" className={cn("text-sm font-medium text-gray-400", !isIndividual && "cursor-pointer")}>
                                    {t("modals.funds.isSelfOwnedLabel")}
                                </label>
                            </div>

                            {isIndividual && (
                                <FormField label={t("modals.funds.receiverBirthDateTitle")} hasRequired>
                                    <Input type="date" value={form.receiverBirthDate ?? ""} onChange={(e) => setValue("receiverBirthDate", e.target.value)} className={cn(inputClass)} />
                                </FormField>
                            )}

                            <FormField label={isIndividual ? t("modals.funds.identityNumberTitle") : t("modals.funds.taxNumberTitle")} hasRequired>
                                <Input
                                    value={isIndividual ? (form.identityNumber ?? "") : (form.taxNumber ?? "")}
                                    onChange={(e) => setValue(isIndividual ? "identityNumber" : "taxNumber", e.target.value)}
                                    disabled={isCorporateSelfOwned}
                                    className={cn(inputClass, isCorporateSelfOwned && "bg-white/[0.02] text-gray-400")}
                                />
                            </FormField>

                            <FormField label={t("modals.funds.receiverCountryTitle")} >
                                <Select value={form.receiverCountry} onValueChange={(v) => setValue("receiverCountry", v)}>
                                    <SelectTrigger size="md" className="w-full bg-white/5 border-white/10 text-white data-[placeholder]:text-gray-500"><SelectValue placeholder={t("modals.funds.receiverCountryPlaceholder")} /></SelectTrigger>
                                    <SelectContent className="bg-[#1C2425] border-white/10 text-white">
                                        {countries.map(country => (
                                            <SelectItem key={country.code} value={country.code} className="focus:bg-white/10">{country.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormField>

                            <FormField label={t("modals.funds.residenceAddressTitle")}>
                                <Textarea value={form.receiverResidenceAddress} onChange={(e) => setValue("receiverResidenceAddress", e.target.value)} placeholder={t("modals.funds.residenceAddressPlaceholder")} className="min-h-[80px] bg-white/5 border-white/10 text-white placeholder:text-gray-500" />
                            </FormField>

                            <FormField label={t("modals.funds.providerTypeTitle")} hasRequired>
                                <Select value={form.providerType} onValueChange={(v) => setValue("providerType", v as ProviderType)}>
                                    <SelectTrigger size="md" className="w-full bg-white/5 border-white/10 text-white data-[placeholder]:text-gray-500"><SelectValue /></SelectTrigger>
                                    <SelectContent className="bg-[#1C2425] border-white/10 text-white">
                                        {PROVIDER_TYPES.map(pt => (
                                            <SelectItem key={pt.value} value={pt.value} className="focus:bg-white/10">{t(`modals.funds.providerTypes.${pt.value.toLowerCase()}`)}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormField>

                            {form.providerType === "Exchange" && (
                                <FormField label={t("modals.funds.providerNameTitle")} hasRequired>
                                    <Select value={form.providerName} onValueChange={(v) => setValue("providerName", v)}>
                                        <SelectTrigger size="md" className="w-full bg-white/5 border-white/10 text-white data-[placeholder]:text-gray-500"><SelectValue placeholder={t("modals.funds.providerNamePlaceholder")} /></SelectTrigger>
                                        <SelectContent className="bg-[#1C2425] border-white/10 text-white">
                                            {[{ name: t("modals.funds.other"), id: 0 }, ...(cryptoPlatforms || [])].map(p => (
                                                <SelectItem key={p.id} value={p.id.toString()} className="focus:bg-white/10">{p.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormField>
                            )}

                            {form.providerName === "0" && form.providerType === "Exchange" && (
                                <FormField label={t("modals.funds.otherProviderNameTitle")} hasRequired>
                                    <Input value={form.otherProviderName || ""} onChange={(e) => setValue("otherProviderName", e.target.value)} placeholder={t("modals.funds.otherProviderNamePlaceholder")} className={inputClass} />
                                </FormField>
                            )}
                        </>
                    )}

                    {currentStep === 2 && (
                        <div className="flex flex-col h-full justify-between gap-4">
                            <div className="flex flex-col gap-4">
                                <p className="text-sm font-medium text-gray-200">
                                    {t("modals.funds.tfaDescription")}
                                </p>
                                <TwoFactorVerification
                                    onVerificationSuccess={() => setIsVerified(true)}
                                    defaultExpanded="Email"
                                    tfaConfig={initResponse!}
                                    variant="dark"
                                />
                            </div>
                        </div>
                    )}
                </form>
            </div >

            {currentStep !== 2 && (
                <Button onClick={handleNext} disabled={loading} className="w-full rounded-[28px] bg-white text-[#0F1415] font-semibold hover:bg-white/90">
                    {t(`modals.funds.${currentStep === 0 ? 'continueToDeclaration' : 'continueToTfa'}`)}
                </Button>
            )
            }
            {currentStep === 2 && (
                <Button onClick={handleComplete} disabled={!isVerified || loading} className="w-full rounded-[28px] bg-white text-[#0F1415] font-semibold hover:bg-white/90">
                    {t(`modals.funds.complete`)}
                </Button>
            )}
        </div >
    );
}
