"use client";

import { X, Loader2 } from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { useModalStore } from "@/stores/useModalStore";
import { useEffect, useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AppInput } from "@/components/ui/form/AppInput";
import { getAccountInfo, getCities, getDistricts } from "@/services/account";
import { getCryptoPlatforms, addDepositDeclaration } from "@/services/crypto";
import { CryptoPlatform, AddDepositDeclarationPayload, FormValues } from "@/types/crypto";
import { getDeclareTransactionSchema } from "@/lib/validation/CryptoSchema";
import { toast } from "sonner";

type TransactionMode = "deposit" | "withdraw";
type RegionItem = { id: number; name: string };
const getFieldContainerId = (name: keyof FormValues) => `declare-field-${name}`;
const FIELD_SCROLL_ORDER: Array<keyof FormValues> = [
  "persona",
  "senderName",
  "isOwnAddress",
  "informationType",
  "birthCityId",
  "birthDistrictId",
  "birthDate",
  "identityInfo",
  "externalCustomerNo",
  "address",
  "addressType",
  "providerName",
  "otherProviderName",
  "description",
];

export function DeclareTransactionModal() {
  const { t } = useI18n();
  const { data, closeModal, isClosing } = useModalStore();
  const [platforms, setPlatforms] = useState<CryptoPlatform[]>([]);
  const [cities, setCities] = useState<RegionItem[]>([]);
  const [districts, setDistricts] = useState<RegionItem[]>([]);
  const [isLoadingPlatforms, setIsLoadingPlatforms] = useState(true);
  const [isLoadingCities, setIsLoadingCities] = useState(true);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mode: TransactionMode =
    (data as { mode?: TransactionMode } | undefined)?.mode ?? "deposit";
  const transactionId = (data as { transactionId?: number } | undefined)?.transactionId;

  const title =
    mode === "withdraw"
      ? t("crypto.declareModal.withdrawTitle")
      : t("crypto.declareModal.depositTitle");

  const {
    control,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(getDeclareTransactionSchema(t)),
    defaultValues: {
      persona: "individual",
      senderName: "",
      isOwnAddress: false,
      informationType: "BIRTHPLACE",
      addressType: "CORPORATE",
      address: "",
      birthCityId: null,
      birthDistrictId: null,
      birthDate: null,
      identityInfo: "",
      externalCustomerNo: "",
      providerName: "",
      otherProviderName: "",
      description: "",
    },
  });

  const persona = useWatch({ control, name: "persona" });
  const isOwnAddress = useWatch({ control, name: "isOwnAddress" });
  const informationType = useWatch({ control, name: "informationType" });
  const birthCityId = useWatch({ control, name: "birthCityId" });
  const addressType = useWatch({ control, name: "addressType" });
  const providerName = useWatch({ control, name: "providerName" });

  useEffect(() => {
    async function init() {
      setIsLoadingPlatforms(true);
      setIsLoadingCities(true);
      const [platformList, cityList] = await Promise.all([
        getCryptoPlatforms(),
        getCities()
      ]);

      const defaultPlatforms = [
        { id: -1, name: "Binance", isActive: true },
        { id: -2, name: "Gate.io", isActive: true },
        { id: -3, name: "Huobi", isActive: true },
        { id: -4, name: "Kraken", isActive: true },
        { id: -5, name: "OKX", isActive: true },
      ];

      const mergedPlatforms = platformList && platformList.length > 0 ? platformList : defaultPlatforms;
      const seen = new Set<string>();
      const uniquePlatforms = mergedPlatforms
        .filter((p) => p?.isActive !== false)
        .filter((p) => {
          const normalizedName = p.name.trim().toUpperCase();
          if (!normalizedName || seen.has(normalizedName)) return false;
          seen.add(normalizedName);
          return true;
        });

      const hasOther = uniquePlatforms.some((p) => p.name.trim().toUpperCase() === "OTHER");
      setPlatforms(hasOther ? uniquePlatforms : [...uniquePlatforms, { id: 0, name: "OTHER", isActive: true }]);

      setCities(cityList);
      setIsLoadingPlatforms(false);
      setIsLoadingCities(false);
    }
    init();
  }, []);

  useEffect(() => {
    async function loadDistricts() {
      if (birthCityId) {
        setIsLoadingDistricts(true);
        const list = await getDistricts(birthCityId);
        setDistricts(list);
        setIsLoadingDistricts(false);
      } else {
        setDistricts([]);
      }
    }
    loadDistricts();
  }, [birthCityId]);

  useEffect(() => {
    // Individual declarations cannot be submitted as self-owned.
    if (persona === "individual" && isOwnAddress) {
      setValue("isOwnAddress", false);
      setValue("senderName", "");
      if (!informationType) {
        setValue("informationType", "BIRTHPLACE");
      }
    }
  }, [persona, isOwnAddress, informationType, setValue]);

  useEffect(() => {
    async function checkOwnAddress() {
      if (isOwnAddress) {
        const info = await getAccountInfo();
        if (info) {
          // Corporate + self-owned: sender name must be company's legal name and read-only.
          if (persona === "corporate") {
            setValue("senderName", info.companyName || "");
          } else {
            setValue("isOwnAddress", false);
            return;
          }
          setValue("informationType", null);
          clearErrors(["senderName", "informationType", "address", "birthCityId", "birthDistrictId", "birthDate", "identityInfo", "externalCustomerNo"]);
        }
      } else if (!informationType) {
        setValue("informationType", "BIRTHPLACE");
      }
    }
    checkOwnAddress();
  }, [isOwnAddress, persona, informationType, setValue, clearErrors]);

  useEffect(() => {
    const firstInvalidField = FIELD_SCROLL_ORDER.find((fieldName) => Boolean(errors[fieldName]));
    if (!firstInvalidField) return;

    requestAnimationFrame(() => {
      const fieldEl = document.getElementById(getFieldContainerId(firstInvalidField));
      fieldEl?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }, [errors]);

  const onSubmit = async (values: FormValues) => {
    if (!transactionId) {
      toast.error(t("crypto.declareModal.idError"));
      return;
    }

    setIsSubmitting(true);
    const finalProviderName = values.providerName === "OTHER" ? values.otherProviderName : values.providerName;
    const resolvedInformationType = values.isOwnAddress ? null : (values.informationType ?? null);

    let declarationDetail: AddDepositDeclarationPayload["cryptoDepositDeclarationDetail"] = null;
    if (!values.isOwnAddress && resolvedInformationType) {
      declarationDetail = {
        address: resolvedInformationType === "ADDRESS" ? (values.address || null) : null,
        birthCityId: resolvedInformationType === "BIRTHPLACE" ? (values.birthCityId || null) : null,
        birthDistrictId: resolvedInformationType === "BIRTHPLACE" ? (values.birthDistrictId || null) : null,
        birthDate: resolvedInformationType === "BIRTHPLACE" ? (values.birthDate || null) : null,
        identityInfo: resolvedInformationType === "IDENTITY" ? (values.identityInfo || null) : null,
        externalCustomerNo: resolvedInformationType === "EXTERNAL_CUSTOMER_NO" ? (values.externalCustomerNo || null) : null,
      };
    }

    const payload: AddDepositDeclarationPayload = {
      depositTransactionId: transactionId,
      addressType: values.addressType,
      senderName: values.senderName,
      senderType: values.persona === "individual" ? "PERSONAL" : "CORPORATE",
      isOwnAddress: values.isOwnAddress,
      providerName: values.addressType === "CORPORATE" ? (finalProviderName || "") : "",
      informationType: resolvedInformationType,
      cryptoDepositDeclarationDetail: declarationDetail,
      description: values.description,
    };

    const result = await addDepositDeclaration(payload);
    setIsSubmitting(false);

    if (result.success) {
      toast.success(t("crypto.declareModal.successMessage"));
      closeModal();
      // Trigger refresh if needed
      window.dispatchEvent(new Event("transaction-updated"));
    } else {
      toast.error(result.message || t("crypto.declareModal.errorMessage"));
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
          "relative min-h-150 z-20 flex w-full h-full max-h-[95vh] max-w-130 flex-col overflow-hidden rounded-3xl rounded-b-20 shadow-2xl ring-1 ring-black/5 lg:ml-auto bg-[#6941C6]",
          isClosing ? "animate-slide-out-to-right" : "animate-slide-in-from-right"
        )}
      >
        {/* Header */}
        <div className="relative flex items-center justify-between px-6 py-4 text-white shrink-0">
          <h3 className="text-base font-semibold">{title}</h3>
          <button
            type="button"
            onClick={closeModal}
            className="rounded-full p-2 text-white hover:bg-white/20 transition backdrop-blur-sm"
            aria-label={t("common.close")}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Area */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 min-h-0 flex p-1 pb-1">
          <div className="flex-1 flex flex-col bg-white rounded-2xl overflow-hidden">
            {/* Scrollable Form Fields */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pt-6 pb-24 space-y-6">

              {/* Persona Toggle */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">{t("crypto.declareModal.asset")}</Label>
                <div className="flex items-center gap-8">
                  <Controller
                    name="persona"
                    control={control}
                    render={({ field }) => (
                      <div className="flex items-center gap-8">
                        <div className="flex items-center gap-3 cursor-pointer group">
                          <Checkbox
                            id="persona-individual"
                            checked={field.value === "individual"}
                            onCheckedChange={() => field.onChange("individual")}
                            className="h-5 w-5 rounded border-gray-300 data-[state=checked]:bg-[#101828] data-[state=checked]:border-[#101828]"
                          />
                          <Label
                            htmlFor="persona-individual"
                            className={cn(
                              "text-sm font-medium cursor-pointer",
                              field.value === "individual" ? "text-[#101828]" : "text-gray-600"
                            )}
                          >
                            {t("crypto.declareModal.individual")}
                          </Label>
                        </div>
                        <div className="flex items-center gap-3 cursor-pointer group">
                          <Checkbox
                            id="persona-corporate"
                            checked={field.value === "corporate"}
                            onCheckedChange={() => field.onChange("corporate")}
                            className="h-5 w-5 rounded border-gray-300 data-[state=checked]:bg-[#101828] data-[state=checked]:border-[#101828]"
                          />
                          <Label
                            htmlFor="persona-corporate"
                            className={cn(
                              "text-sm font-medium cursor-pointer",
                              field.value === "corporate" ? "text-[#101828]" : "text-gray-600"
                            )}
                          >
                            {t("crypto.declareModal.corporate")}
                          </Label>
                        </div>
                      </div>
                    )}
                  />
                </div>
              </div>

              {/* Dynamic Fields */}
              <div className="space-y-6">
                <Controller
                  name="senderName"
                  control={control}
                  render={({ field }) => (
                    <div id={getFieldContainerId("senderName")}>
                      <AppInput
                        {...field}
                        label={persona === "individual" ? t("crypto.declareModal.senderNameIndividual") : t("crypto.declareModal.senderNameCorporate")}
                        placeholder={t("common.enter")}
                        className="h-[45px] min-h-[45px] rounded-xl border-gray-200 shadow-none"
                        error={errors.senderName?.message}
                        disabled={persona === "corporate" && isOwnAddress}
                      />
                    </div>
                  )}
                />

                <Controller
                  name="isOwnAddress"
                  control={control}
                  render={({ field }) => (
                    <div className={cn("flex items-center gap-3", persona === "individual" && "opacity-50")}>
                      <Checkbox
                        id="isOwnAddress"
                        checked={field.value}
                        disabled={persona === "individual"}
                        onCheckedChange={field.onChange}
                        className="h-5 w-5 rounded border-gray-300 data-[state=checked]:bg-[#101828] data-[state=checked]:border-[#101828]"
                      />
                      <label
                        htmlFor="isOwnAddress"
                        className={cn("text-sm text-gray-600", persona !== "individual" && "cursor-pointer")}
                      >
                        {t("crypto.declareModal.isOwnAddress")}
                      </label>
                    </div>
                  )}
                />

                {!isOwnAddress && (
                  <Controller
                    name="informationType"
                    control={control}
                    render={({ field }) => (
                      <div id={getFieldContainerId("informationType")} className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">{t("crypto.declareModal.informationType")}</Label>
                        <Select value={field.value || ""} onValueChange={field.onChange}>
                          <SelectTrigger className="h-[45px] w-full rounded-xl border-gray-200 bg-white text-sm transition-colors hover:border-gray-300">
                            <SelectValue placeholder={t("crypto.declareModal.select")} />
                          </SelectTrigger>
                          <SelectContent className="z-10010">
                            <SelectItem value="ADDRESS">{t("crypto.declareModal.address")}</SelectItem>
                            <SelectItem value="BIRTHPLACE">{persona === "individual" ? t("crypto.declareModal.birthplaceIndividual") : t("crypto.declareModal.birthplaceCorporate")}</SelectItem>
                            <SelectItem value="IDENTITY">{persona === "individual" ? t("crypto.declareModal.identityIndividual") : t("crypto.declareModal.identityCorporate")}</SelectItem>
                            <SelectItem value="EXTERNAL_CUSTOMER_NO">{t("crypto.declareModal.customerNo")}</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.informationType && <p className="text-xs text-red-500">{errors.informationType.message}</p>}
                      </div>
                    )}
                  />
                )}

                {!isOwnAddress && informationType === "BIRTHPLACE" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <Controller
                        name="birthCityId"
                        control={control}
                        render={({ field }) => (
                          <div id={getFieldContainerId("birthCityId")} className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">{persona === "individual" ? t("crypto.declareModal.cityLabelIndividual") : t("crypto.declareModal.cityLabelCorporate")}</Label>
                            <Select
                              value={field.value?.toString() || ""}
                              onValueChange={(val) => {
                                field.onChange(parseInt(val));
                                setValue("birthDistrictId", null);
                              }}
                            >
                              <SelectTrigger className="h-[45px] w-full rounded-xl border-gray-200 bg-white text-sm transition-colors hover:border-gray-300">
                                <SelectValue placeholder={isLoadingCities ? t("crypto.declareModal.loading") : t("crypto.declareModal.cityPlaceholder")} />
                              </SelectTrigger>
                              <SelectContent className="z-10010">
                                {cities.map(city => (
                                  <SelectItem key={city.id} value={city.id.toString()}>{city.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {errors.birthCityId && <p className="text-xs text-red-500">{errors.birthCityId.message}</p>}
                          </div>
                        )}
                      />
                      <Controller
                        name="birthDistrictId"
                        control={control}
                        render={({ field }) => (
                          <div id={getFieldContainerId("birthDistrictId")} className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">{persona === "individual" ? t("crypto.declareModal.districtLabelIndividual") : t("crypto.declareModal.districtLabelCorporate")}</Label>
                            <Select
                              value={field.value?.toString() || ""}
                              onValueChange={(val) => field.onChange(parseInt(val))}
                              disabled={!birthCityId}
                            >
                              <SelectTrigger className="h-[45px] w-full rounded-xl border-gray-200 bg-white text-sm transition-colors hover:border-gray-300">
                                <SelectValue placeholder={isLoadingDistricts ? t("crypto.declareModal.loading") : t("crypto.declareModal.districtPlaceholder")} />
                              </SelectTrigger>
                              <SelectContent className="z-10010">
                                {districts.map(dst => (
                                  <SelectItem key={dst.id} value={dst.id.toString()}>{dst.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {errors.birthDistrictId && <p className="text-xs text-red-500">{errors.birthDistrictId.message}</p>}
                          </div>
                        )}
                      />
                    </div>

                    <Controller
                      name="birthDate"
                      control={control}
                      render={({ field }) => (
                        <div id={getFieldContainerId("birthDate")}>
                          <AppInput
                            {...field}
                            value={field.value || ""}
                            label={persona === "individual" ? t("crypto.declareModal.dateLabelIndividual") : t("crypto.declareModal.dateLabelCorporate")}
                            type="date"
                            className="h-[45px] min-h-[45px] rounded-xl border-gray-200 shadow-none"
                            error={errors.birthDate?.message}
                          />
                        </div>
                      )}
                    />
                  </>
                )}

                {!isOwnAddress && informationType === "ADDRESS" && (
                  <Controller
                    name="address"
                    control={control}
                    render={({ field }) => (
                      <div id={getFieldContainerId("address")} className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">{t("crypto.declareModal.address")}</Label>
                        <textarea
                          {...field}
                          placeholder={t("crypto.declareModal.addressPlaceholder")}
                          className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#101828]/5"
                          rows={3}
                        />
                        {errors.address && <p className="text-xs text-red-500">{errors.address.message}</p>}
                      </div>
                    )}
                  />
                )}

                {!isOwnAddress && informationType === "IDENTITY" && (
                  <Controller
                    name="identityInfo"
                    control={control}
                    render={({ field }) => (
                      <div id={getFieldContainerId("identityInfo")}>
                        <AppInput
                          {...field}
                          value={field.value || ""}
                          label={persona === "individual" ? t("crypto.declareModal.identityIndividual") : t("crypto.declareModal.identityCorporate")}
                          placeholder={t("common.enter")}
                          className="h-[45px] min-h-[45px] rounded-xl border-gray-200 shadow-none"
                          error={errors.identityInfo?.message}
                        />
                      </div>
                    )}
                  />
                )}

                {!isOwnAddress && informationType === "EXTERNAL_CUSTOMER_NO" && (
                  <Controller
                    name="externalCustomerNo"
                    control={control}
                    render={({ field }) => (
                      <div id={getFieldContainerId("externalCustomerNo")}>
                        <AppInput
                          {...field}
                          value={field.value || ""}
                          label={t("crypto.declareModal.customerNo")}
                          placeholder={t("crypto.declareModal.customerNoPlaceholder")}
                          className="h-[45px] min-h-[45px] rounded-xl border-gray-200 shadow-none"
                          error={errors.externalCustomerNo?.message}
                        />
                      </div>
                    )}
                  />
                )}

                <Controller
                  name="addressType"
                  control={control}
                  render={({ field }) => (
                    <div id={getFieldContainerId("addressType")} className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">{t("crypto.declareModal.addressType")}</Label>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="h-[45px] w-full rounded-xl border-gray-200 bg-white text-sm transition-colors hover:border-gray-300">
                          <SelectValue placeholder={t("crypto.declareModal.select")} />
                        </SelectTrigger>
                        <SelectContent className="z-10010">
                          <SelectItem value="CORPORATE">{t("crypto.declareModal.vaspOption")}</SelectItem>
                          <SelectItem value="PERSONAL">{t("crypto.declareModal.personalOption")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                />

                {addressType === "CORPORATE" && (
                  <div className="space-y-6">
                    <Controller
                      name="providerName"
                      control={control}
                      render={({ field }) => (
                        <div id={getFieldContainerId("providerName")} className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">{t("crypto.declareModal.provider")}</Label>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="h-[45px] w-full rounded-xl border-gray-200 bg-white text-sm transition-colors hover:border-gray-300">
                              <SelectValue placeholder={isLoadingPlatforms ? t("crypto.declareModal.loading") : t("crypto.declareModal.select")} />
                            </SelectTrigger>
                            <SelectContent className="z-10010">
                              {platforms.map((p) => (
                                <SelectItem key={`${p.id}-${p.name}`} value={p.name}>
                                  {p.name === "OTHER" ? t("crypto.declareModal.otherOption") : p.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.providerName && <p className="text-xs text-red-500">{errors.providerName.message}</p>}
                        </div>
                      )}
                    />

                    {providerName === "OTHER" && (
                      <Controller
                        name="otherProviderName"
                        control={control}
                        render={({ field }) => (
                          <div id={getFieldContainerId("otherProviderName")}>
                            <AppInput
                              {...field}
                              label={t("crypto.declareModal.otherProviderLabel")}
                              placeholder={t("crypto.declareModal.otherProviderPlaceholder")}
                              className="h-[45px] min-h-[45px] rounded-xl border-gray-200 shadow-none"
                              error={errors.otherProviderName?.message}
                            />
                          </div>
                        )}
                      />
                    )}
                  </div>
                )}

                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <div id={getFieldContainerId("description")} className="space-y-2 scroll-mt-24">
                      <Label className="text-sm font-medium text-gray-700">{t("crypto.declareModal.descriptionLabel")}</Label>
                      <textarea
                        {...field}
                        placeholder={t("crypto.declareModal.descriptionPlaceholder")}
                        className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#101828]/5"
                        rows={3}
                      />
                      {errors.description && (
                        <p className="text-xs text-red-500" role="alert">
                          {errors.description.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>
            </div>

            {/* Fixed Footer */}
            <div className="p-6 border-t border-gray-100 bg-white shrink-0">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#101828] hover:bg-[#101828]/90 text-white rounded-full h-12 text-sm font-semibold flex gap-2"
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {t("crypto.declareModal.submit")}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
