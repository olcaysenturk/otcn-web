"use client";

import * as React from "react";
import Image from "next/image";
import { useForm, type SubmitHandler, type SubmitErrorHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AuthLabel } from "./AuthLabel";
import { getForgotPasswordSchema, type ForgotPasswordFormValues } from "@/lib/validation/AuthSchema";

import { handleBackendError } from "@/lib/utils/toast";

export function ForgotPasswordForm() {
    const { t } = useI18n();
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isSuccess, setIsSuccess] = React.useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(getForgotPasswordSchema(t)),
    });

    const onSubmit: SubmitHandler<ForgotPasswordFormValues> = async (values) => {
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: values.email }),
            });

            const data = await res.json().catch(() => null);

            if (!res.ok) {
                handleBackendError(data, t);
                setIsSubmitting(false);
                return;
            }

            setIsSuccess(true);
            toast.success(t("auth.forgotPassword.successTitle"), {
                description: t("auth.forgotPassword.successDesc"),
            });

        } catch {
            handleBackendError(null, t);
            setIsSubmitting(false);
        }
    };

    const onInvalid: SubmitErrorHandler<ForgotPasswordFormValues> = (formErrors) => {
        const messages: string[] = [];

        Object.values(formErrors).forEach((error) => {
            if (error?.message) {
                messages.push(error.message);
            }
        });

        toast.error(t("auth.loginPage.errorTitle"), {
            description: messages.length ? (
                <ul className="mt-1 space-y-1 text-xs">
                    {messages.map((msg, index) => (
                        <li key={index} className="flex gap-1">
                            <span>•</span>
                            <span>{msg}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                t("auth.loginPage.errorDescription")
            ),
        });
    };

    return (
        <div className="mx-auto flex h-full w-full max-w-[440px] flex-col lg:h-auto">
            <div className="mb-10 flex flex-col items-center gap-6 text-center md:mb-14 md:gap-19">
                <div className="relative h-[165px] w-[165px] md:h-[180px] md:w-[180px] md:-translate-y-2">
                    <Image
                        src="/assets/images/forgot-password-lock-transparent.png"
                        alt="Forgot Password"
                        fill
                        sizes="(min-width: 768px) 180px, 150px"
                        className="h-full w-full object-contain mix-blend-screen"
                    />
                </div>
                <div className="flex flex-col items-center gap-3">
                    <h1 className="text-[24px] font-bold leading-8 tracking-[-0.5px] text-[#F4F7F8] md:text-[28px] md:leading-9">
                        {t("auth.forgotPassword.title")}
                    </h1>
                    <p className="max-w-[420px] text-sm leading-6 text-[#D5D8DA] md:text-base">
                        {t("auth.forgotPassword.description")}
                    </p>
                </div>
            </div>

            <form
                onSubmit={handleSubmit(onSubmit, onInvalid)}
                noValidate
                className="flex flex-1 flex-col lg:flex-none"
            >
                <div className="space-y-2">
                    <AuthLabel htmlFor="email">
                        {t("auth.forgotPassword.emailLabel")}
                    </AuthLabel>
                    <Input
                        id="email"
                        type="email"
                        placeholder={t("auth.forgotPassword.emailPlaceholder")}
                        aria-invalid={Boolean(errors.email)}
                        variant="auth"
                        {...register("email")}
                    />
                </div>

                <div className="mt-auto pt-8 md:pt-12">
                    <Button
                        type="submit"
                        size="xl"
                        className="h-14 w-full rounded-[18px] border-0 bg-[#C7F70A]! bg-none! font-bold text-[#080A0B] shadow-none hover:bg-[#D5FF28]!"
                        disabled={isSubmitting || isSuccess}
                    >
                        {t("auth.forgotPassword.submit")}
                    </Button>
                </div>
            </form>
        </div>
    );
}
