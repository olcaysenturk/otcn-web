"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import {
  Controller,
  useForm,
  type SubmitErrorHandler,
  type SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { handleBackendError } from "@/lib/utils/toast";

import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { AuthLabel } from "./AuthLabel";
import { AuthPrompt } from "./AuthPrompt";
import { AuthHeading } from "./AuthHeading";
import { invalidateSession } from "@/lib/api/session";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { withLocale } from "@/lib/i18n/href";
import { getLoginSchema, type LoginFormValues } from "@/lib/validation/AuthSchema";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const { t } = useI18n();
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const basePath = `/${locale}`;

  const [passwordVisible, setPasswordVisible] = React.useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(getLoginSchema(t)),
    criteriaMode: "all",
    defaultValues: {
      username: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async (values) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: values.username,
          password: values.password,
          remember: values.remember,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        handleBackendError(data, t);
        return;
      }

      invalidateSession();

      // Handle initiation vs successful login
      if (data?.data?.flowId) {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("user-login-flow-id", data.data.flowId);
          sessionStorage.setItem("user-email", data.data.email || "");
          sessionStorage.setItem("user-phone", data.data.phone || "");
          sessionStorage.setItem("user-remember", String(values.remember));
          sessionStorage.setItem("is-email-required", String(data.data.isEmailRequired ?? false));
          sessionStorage.setItem("is-phone-required", String(data.data.isPhoneRequired ?? false));
          sessionStorage.setItem("is-2fa-required", String(data.data.isAuthenticatorRequired ?? false));
        }

        toast.info(t("auth.loginPage.initiationTitle"), {
          description: t("auth.loginPage.initiationDescription"),
        });

        if (data.data.isEmailRequired) {
          router.push(`${basePath}/auth/security/email`);
        } else if (data.data.isPhoneRequired) {
          router.push(`${basePath}/auth/security/phone`);
        } else if (data.data.isAuthenticatorRequired) {
          router.push(`${basePath}/auth/security/2fa`);
        }
        return;
      }

      toast.success(t("auth.loginPage.successTitle"), {
        description: t("auth.loginPage.successDescription"),
      });
      router.push(withLocale("/dashboard", locale));
      router.refresh();
    } catch {
      handleBackendError(null, t);
    }
  };

  const onInvalid: SubmitErrorHandler<LoginFormValues> = (formErrors) => {
    let description = t("auth.loginPage.errorDescription");

    if (formErrors.username && !formErrors.password) {
      description = formErrors.username.message || description;
    } else if (formErrors.password && !formErrors.username) {
      description = formErrors.password.message || description;
    } else if (formErrors.username?.message === t("validation.auth.emailInvalid")) {
      description = t("validation.auth.emailInvalid");
    }

    toast.error(t("auth.loginPage.errorTitle"), {
      description,
    });
  };

  return (
    <div className="mx-auto flex h-full w-full max-w-[500px] flex-col justify-between py-5 lg:h-auto lg:justify-start lg:py-0">
      <div className="mb-12 flex flex-col items-center md:mb-16">
        <AuthHeading
          title={t("auth.loginPage.title")}
          description={t("auth.loginPage.description")}
        />
      </div>

      <form
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        noValidate
        className="flex flex-1 flex-col gap-14 lg:flex-none"
      >
        <div className="flex-1 space-y-7 md:space-y-9">
          <div className="space-y-2">
            <AuthLabel htmlFor="username">
              {t("auth.loginPage.emailLabel")}
            </AuthLabel>
            <Input
              id="username"
              type="text"
              placeholder={t("auth.loginPage.emailPlaceholder")}
              aria-invalid={Boolean(errors.username)}
              variant="auth"
              {...register("username")}
            />
          </div>

          <div className="space-y-2">
            <AuthLabel htmlFor="password">
              {t("auth.loginPage.passwordLabel")}
            </AuthLabel>
            <div className="relative">
              <Input
                id="password"
                type={passwordVisible ? "text" : "password"}
                placeholder={t("auth.loginPage.passwordPlaceholder")}
                aria-invalid={Boolean(errors.password)}
                variant="auth"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setPasswordVisible((prev) => !prev)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-[#8A9296] transition-colors hover:text-[#F4F7F8]"
                aria-label={passwordVisible ? t("auth.loginPage.hidePasswordAria") : t("auth.loginPage.showPasswordAria")}
              >
                {passwordVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex cursor-pointer items-center gap-3">
              <Controller
                control={control}
                name="remember"
                render={({ field }) => (
                  <Checkbox
                    className="h-6 w-6 rounded-md border-2 border-[#3A4043] bg-[#0E0F10] data-[state=checked]:border-[#C7F70A] data-[state=checked]:bg-[#C7F70A] data-[state=checked]:text-[#0E0F10]"
                    checked={field.value}
                    onCheckedChange={(val) => field.onChange(val === true)}
                  />
                )}
              />
              <span className="text-[13px] leading-5 text-[#C5C9CC] md:text-sm">{t("auth.loginPage.remember")}</span>
            </label>
            <Link
              href={withLocale("/auth/forgot-password", locale)}
              className="text-[13px] font-medium leading-5 text-[#F4F7F8] md:text-sm"
            >
              {t("auth.loginPage.forgot")}
            </Link>
          </div>
        </div>

        <div>
          <Button
            type="submit"
            size="xl"
            className="min-w-22.5 h-14 w-full rounded-[18px] border-0 bg-[#C7F70A]! bg-none! text-base font-bold text-[#080A0B] shadow-none hover:bg-[#D5FF28]! md:h-[58px]"
            disabled={isSubmitting}
          >
            {t("auth.loginPage.submit")}
          </Button>
          <AuthPrompt
            prompt={t("auth.loginPage.noAccount")}
            buttonText={t("auth.loginPage.apply")}
            onAction={() => router.push(withLocale("/auth/register", locale))}
            className="mt-6"
          />
        </div>
      </form>
    </div>
  );
}
