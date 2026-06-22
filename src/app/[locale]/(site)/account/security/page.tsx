"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { TwoFactorVerificationProps } from "@/components/modals/tfa/Tfa";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { completeTfaSetting, getTfaOptions, initiateTfaSetting } from "@/services/account";
import { useModalStore } from "@/stores/useModalStore";
import { TfaInitiateResponse, TfaOptions } from "@/types/auth";
import { TfaType } from "@/types/tfa";

const CARD = "rounded-[22px] bg-[#0E0F10] p-6 shadow-[0px_2px_8px_0.3px_rgba(58,64,67,0.2)]";

export default function AccountSecurityPage() {
  const { t } = useI18n();
  const { openModal, closeModal } = useModalStore();
  const [isLoading, setIsLoading] = useState(true);
  const [tfaOptions, setTfaOptions] = useState<TfaOptions | null>(null);

  const fetchData = async () => {
    try {
      const optionsRes = await getTfaOptions();
      setTfaOptions(optionsRes);
    } catch {
      toast.error(t("common.error"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleVerificationSuccess = async (type: TfaType, flowId: string) => {
    const res = await completeTfaSetting(type, flowId);
    if (!res.success) {
      toast.error(res.message || t("common.error"));
      closeModal();
      return;
    }
    toast.success(t("common.success"));
    fetchData();
    closeModal();
  };

  const handleToggle = async (type: TfaType, newValue: boolean) => {
    if (!tfaOptions) return;

    const isSmsOrEmail = type === "Sms" || type === "Email";
    const isDisableAction = !newValue;
    const isCurrentlyEnabled =
      type === "Sms" ? !!tfaOptions.phone : type === "Email" ? !!tfaOptions.email : !!tfaOptions.authenticator;

    if (isSmsOrEmail && isDisableAction && isCurrentlyEnabled) {
      const activeOtpCount = [tfaOptions.phone, tfaOptions.email, tfaOptions.authenticator].filter(Boolean).length;
      if (activeOtpCount <= 1) {
        toast.error(t("security.atLeastOneOtpRequired"));
        return;
      }
    }

    const initRes = await initiateTfaSetting(type, newValue);
    if (!initRes.flowId) {
      toast.error(initRes.message || t("common.error"));
      return;
    }
    const flowData = initRes as TfaInitiateResponse;
    const flowId = flowData.flowId;

    openModal("tfa-verification", {
      flowId,
      onVerificationSuccess: () => handleVerificationSuccess(type, flowId),
      tfaConfig: flowData,
      isMainModal: true,
      infoText: t("security.tfaModalInfo", { type: type.toUpperCase() }),
      title: t("security.tfaModalTitle", { type: type.toUpperCase() }),
      variant: "dark",
    } as TwoFactorVerificationProps);
  };

  const otpRows: { type: TfaType; label: string; description: string; checked: boolean }[] = [
    {
      type: "Sms",
      label: t("security.smsOtp_label"),
      description: t("security.smsOtp_description"),
      checked: tfaOptions?.phone ?? false,
    },
    {
      type: "Email",
      label: t("security.emailOtp_label"),
      description: t("security.emailOtp_description"),
      checked: tfaOptions?.email ?? false,
    },
    {
      type: "Authenticator",
      label: t("security.authenticator_label"),
      description: t("security.authenticator_description"),
      checked: tfaOptions?.authenticator ?? false,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Login Management */}
      <div className={CARD}>
        <h2 className="text-lg font-medium text-[#F4F7F8]">{t("security.loginManagement")}</h2>
        <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:gap-[120px]">
          <span className="w-[200px] shrink-0 text-[18px] font-medium tracking-[-0.27px] text-[#8F93FE]">
            {t("security.password_label")}
          </span>
          {isLoading ? (
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-40 bg-white/10" />
              <Skeleton className="h-4 w-80 bg-white/10" />
            </div>
          ) : (
            <div className="flex-1 space-y-1.5">
              <p className="text-base font-medium tracking-widest text-[#F4F7F8]">****************</p>
              <p className="text-base text-[#C5C9CC]">{t("security.password_description")}</p>
            </div>
          )}
          <button
            type="button"
            onClick={() => openModal("change-password")}
            className="shrink-0 whitespace-nowrap rounded-[12px] border border-[#F4F7F8] px-4 py-2.5 text-xs font-bold text-[#F4F7F8] transition hover:border-[#C7F022] hover:text-[#C7F022]"
          >
            {t("security.password_changeButton")}
          </button>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className={CARD}>
        <h2 className="text-lg font-medium text-[#F4F7F8]">{t("security.twoFaTitle")}</h2>
        <div className="flex flex-col py-3">
          {otpRows.map((row) => (
            <div
              key={row.type}
              className="flex flex-col gap-3 border-b border-[#3A4043] py-5 last:border-b-0 md:flex-row md:items-center md:gap-[120px]"
            >
              <span className="w-[200px] shrink-0 text-[18px] font-medium tracking-[-0.27px] text-[#8F93FE]">
                {row.label}
              </span>
              <p className="flex-1 text-base text-[#C5C9CC]">{row.description}</p>
              {isLoading ? (
                <Skeleton className="h-6 w-11 rounded-full bg-white/10" />
              ) : (
                <Switch
                  checked={row.checked}
                  onCheckedChange={(checked) => handleToggle(row.type, checked)}
                  className="shrink-0 border-0 data-[state=checked]:bg-[#27E9A6] data-[state=unchecked]:bg-white/15"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
