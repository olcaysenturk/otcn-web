"use client";

import { AccountHeader } from "@/components/account/AccountHeader";
import { AccountSecuritySkeleton } from "@/components/account/AccountSkeleton";
import { AccountTabs } from "@/components/account/AccountTabs";
import { TwoFactorVerificationProps } from "@/components/modals/tfa/Tfa";
import { Button } from "@/components/ui/button";
import { PageCard } from "@/components/ui/page-card";
import { ResponsivePageWrapper } from "@/components/ui/responsive-page-wrapper";
import { Switch } from "@/components/ui/switch";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { withLocale } from "@/lib/i18n/href";
import {
  completeTfaSetting,
  getAccountInfo,
  getTfaOptions,
  initiateTfaSetting
} from "@/services/account";
import { useModalStore } from "@/stores/useModalStore";
import { AccountInfo } from "@/types/account";
import { TfaInitiateResponse, TfaOptions } from "@/types/auth";
import { TfaType } from "@/types/tfa";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AccountSecurityPage() {
  const { t, locale } = useI18n();
  const { openModal, closeModal } = useModalStore();
  const [isLoading, setIsLoading] = useState(true);
  const [tfaOptions, setTfaOptions] = useState<TfaOptions | null>(null);
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);

  const fetchData = async () => {
    try {
      const [optionsRes, accountRes] = await Promise.all([
        getTfaOptions(),
        getAccountInfo()
      ]);
      setTfaOptions(optionsRes);
      setAccountInfo(accountRes);
    } catch (error) {
      toast.error(t("common.error"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggle = async (type: TfaType, newValue: boolean) => {
    if (!tfaOptions) return;

    const isSmsOrEmail = type === "Sms" || type === "Email";
    const isDisableAction = !newValue;
    const isCurrentlyEnabled =
      type === "Sms"
        ? !!tfaOptions.phone
        : type === "Email"
          ? !!tfaOptions.email
          : !!tfaOptions.authenticator;

    if (isSmsOrEmail && isDisableAction && isCurrentlyEnabled) {
      const activeOtpCount = [tfaOptions.phone, tfaOptions.email, tfaOptions.authenticator].filter(Boolean).length;
      if (activeOtpCount <= 1) {
        toast.error(t("security.atLeastOneOtpRequired"));
        return;
      }
    }

    const initRes = await initiateTfaSetting(type, newValue)
    if (!initRes.flowId) {
      toast.error(initRes.message || t("common.error"));
      return;
    }
    const flowData = initRes as TfaInitiateResponse;
    const flowId = flowData.flowId;

    const prop = {
      flowId: flowId,
      onVerificationSuccess: () => handleVerificationSuccess(type, flowId),
      tfaConfig: flowData,
      isMainModal: true,
      infoText: t("security.tfaModalInfo", { type: type.toUpperCase() }),
      title: t("security.tfaModalTitle", { type: type.toUpperCase() }),
      variant: "dark",
    } as TwoFactorVerificationProps;

    openModal("tfa-verification", prop);
  };

  const handleVerificationSuccess = async (type: TfaType, flowId: string) => {
    const res = await completeTfaSetting(type, flowId);
    if (!res.success) {
      toast.error(res.message || t("common.error"));
      closeModal();
      return;
    } else {
      toast.success(t("common.success"));
    }
    fetchData();
    closeModal();
  };

  return (
    <PageCard>
      <ResponsivePageWrapper>
        {/* Mobile Header */}
        <div className="flex items-center gap-3 bg-[#0F1415] p-4 text-white lg:hidden mb-6">
          <Link href={withLocale("/account", locale)} className="rounded p-1 hover:bg-white/10">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <span className="text-lg font-semibold">{t("account.security.title")}</span>
        </div>

        {/* Desktop Header */}
        <AccountHeader
          title={t("accountHeader.title")}
          description={t("accountHeader.description")}
        />

        <div className="hidden lg:block">
          <AccountTabs active="security" />
        </div>

        {/* Security Content Card */}
        <div className="bg-[#1C2425] rounded-3xl p-6 lg:p-8 border border-white/10 min-h-[calc(100vh-94px)] space-y-6">
          {isLoading ? (
            <AccountSecuritySkeleton />
          ) : (
            <>
              {/* Login Management Section */}
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-white">{t("security.loginManagement")}</h2>

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-12">
                  <div className="min-w-[120px]">
                    <span className="text-[#9B91FF] font-medium">{t("security.password_label")}</span>
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="font-semibold text-white tracking-widest">****************</p>
                    <p className="text-sm text-gray-400">
                      {t("security.password_description")}
                    </p>
                  </div>
                  <div>
                    <Button
                      variant="outline"
                      className="rounded-full border-white/20 text-white hover:bg-white/5 h-11 px-6 font-semibold bg-transparent"
                      onClick={() => openModal("change-password")}
                    >
                      {t("security.password_changeButton")}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Account Authorization Section */}
              <div className="space-y-6 pt-6 border-t border-white/10">
                <h2 className="text-lg font-semibold text-white">{t("security.accountAuthority")}</h2>

                <div className="space-y-6">
                  {/* SMS OTP */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-12">
                    <div className="min-w-[200px] shrink-0">
                      <span className="text-[#9B91FF] font-medium">{t("security.smsOtp_label")}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-400">
                        {t("security.smsOtp_description")}
                      </p>
                    </div>
                    <div className="flex justify-end lg:justify-start">
                      <Switch
                        checked={tfaOptions?.phone ?? false}
                        onCheckedChange={(checked) => handleToggle("Sms", checked)}
                        className="data-[state=checked]:bg-[#12B76A] data-[state=unchecked]:bg-white/15 border-0"
                      />
                    </div>
                  </div>

                  <div className="h-px bg-white/10 w-full" />

                  {/* Email OTP */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-12">
                    <div className="min-w-[200px] shrink-0">
                      <span className="text-[#9B91FF] font-medium">{t("security.emailOtp_label")}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-400">
                        {t("security.emailOtp_description")}
                      </p>
                    </div>
                    <div className="flex justify-end lg:justify-start">
                      <Switch
                        checked={tfaOptions?.email ?? false}
                        onCheckedChange={(checked) => handleToggle("Email", checked)}
                        className="data-[state=checked]:bg-[#12B76A] data-[state=unchecked]:bg-white/15 border-0"
                      />
                    </div>
                  </div>

                  <div className="h-px bg-white/10 w-full" />

                  {/* Authenticator */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-12">
                    <div className="min-w-[200px] shrink-0">
                      <span className="text-[#9B91FF] font-medium">{t("security.authenticator_label")}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-400">
                        {t("security.authenticator_description")}
                      </p>
                    </div>
                    <div className="flex justify-end lg:justify-start">
                      <Switch
                        checked={tfaOptions?.authenticator ?? false}
                        onCheckedChange={(checked) => handleToggle("Authenticator", checked)}
                        className="data-[state=checked]:bg-[#12B76A] data-[state=unchecked]:bg-white/15 border-0"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </ResponsivePageWrapper>
    </PageCard>
  );
}
