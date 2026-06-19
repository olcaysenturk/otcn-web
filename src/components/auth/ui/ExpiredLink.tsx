"use client";

import * as React from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { Button } from "@/components/ui/button";

interface ExpiredLinkProps {
    onResend?: () => void;
    isResending?: boolean;
    isResendingCompleted?: boolean;
    title?: string;
    description?: string;
    buttonText?: string;
}

export function ExpiredLink({
    onResend,
    isResending,
    isResendingCompleted,
    title,
    description,
    buttonText
}: ExpiredLinkProps) {
    const { t } = useI18n();

    return (
        <div className="flex h-full flex-col items-center justify-center px-4 text-center">
            <div className="w-[150px] md:w-[200px] h-[150px] md:h-[200px] mb-10 md:mb-14">
                <img
                    src="/assets/images/activation-link-expired.png"
                    alt="Link Expired"
                    className="h-full w-full object-contain hue-rotate-[75deg] saturate-[1.7]"
                />
            </div>
            <h1 className="mb-3 text-2xl font-bold leading-8 text-[#F4F7F8] md:text-[32px] md:leading-[42px]">
                {title || t("auth.verification.linkExpiredTitle")}
            </h1>
            <p className="max-w-[440px] text-[14px] leading-6 text-[#C5C9CC] md:text-base md:leading-7">
                {description || t("auth.verification.linkExpiredDesc")}
            </p>
            {onResend && (
                <div className="flex items-center justify-center mt-14 md:mt-16 w-full md:max-w-[400px]">
                    <Button
                        onClick={onResend}
                        disabled={isResending || isResendingCompleted}
                        size="xl"
                        className="h-14 w-full max-w-[440px] rounded-[18px] bg-[#C7F70A] py-3 font-bold text-[#080A0B] hover:bg-[#D5FF28]"
                    >
                        {buttonText || t("auth.verification.resendEmailBtn")}
                    </Button>
                </div>
            )}
        </div>
    );
}
