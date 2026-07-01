"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { useForm, type SubmitHandler, type SubmitErrorHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { handleBackendError } from "@/lib/utils/toast";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { withLocale } from "@/lib/i18n/href";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AuthLabel } from "./AuthLabel";
import { AuthHeading } from "./AuthHeading";
import { cn } from "@/lib/utils";

type Translate = (key: string, params?: Record<string, string | number>) => string;

const getPasswordSchema = (t: Translate) => z.object({
  password: z.string()
    .min(8, t("auth.password.requirements.minLength"))
    .regex(/[A-Z]/, t("auth.password.requirements.uppercase"))
    .regex(/[a-z]/, t("auth.password.requirements.lowercase"))
    .regex(/[0-9]/, t("auth.password.requirements.number"))
    .regex(/[^A-Za-z0-9]/, t("auth.password.requirements.special")),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: t("auth.password.mismatchError"),
  path: ["confirmPassword"],
});

type PasswordSetupFormValues = z.infer<ReturnType<typeof getPasswordSchema>>;

export function PasswordSetupForm() {
  const { t } = useI18n();
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const userRegistrationId = sessionStorage.getItem("user-registration-id");

      if (!userRegistrationId) {
        toast.error(t("auth.verification.missingParams"), {
          description: t("auth.verification.missingParamsDesc"),
        });
        router.push(withLocale("/auth/login", locale));
      }
    }
  }, [locale, router, t]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<PasswordSetupFormValues>({
    resolver: zodResolver(getPasswordSchema(t)),
    criteriaMode: "all",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const watchPassword = watch("password");

  const passwordChecks = [
    { key: "uppercase", label: t("auth.password.requirements.uppercase"), met: /[A-Z]/.test(watchPassword || "") },
    { key: "lowercase", label: t("auth.password.requirements.lowercase"), met: /[a-z]/.test(watchPassword || "") },
    { key: "special", label: t("auth.password.requirements.special"), met: /[^A-Za-z0-9]/.test(watchPassword || "") },
    { key: "number", label: t("auth.password.requirements.number"), met: /[0-9]/.test(watchPassword || "") },
    { key: "minLength", label: t("auth.password.requirements.minLength"), met: (watchPassword || "").length >= 8 },
  ];

  const onSubmit: SubmitHandler<PasswordSetupFormValues> = async (values) => {
    const registerNotificationId = typeof window !== "undefined" ? sessionStorage.getItem("user-registration-id") : null;

    if (!registerNotificationId) {
      toast.error(t("auth.loginPage.errorTitle"), {
        description: t("error.missingSession") || "Missing session data.",
      });
      return;
    }

    try {
      const res = await fetch("/api/auth/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registerNotificationId,
          password: values.password,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        handleBackendError(data, t);
        return;
      }

      toast.success(t("auth.success.title"), {
        description: t("auth.verification.redirecting") || "Redirecting...",
      });
      router.push(withLocale("/auth/password-success", locale));
    } catch {
      handleBackendError(null, t);
    }
  };

  const onInvalid: SubmitErrorHandler<PasswordSetupFormValues> = (formErrors) => {
    const messages: string[] = [];

    Object.values(formErrors).forEach((error) => {
      if (error?.types) {
        Object.values(error.types).forEach((msg) => {
          if (typeof msg === "string") messages.push(msg);
          else if (Array.isArray(msg)) messages.push(...msg);
        });
      } else if (error?.message) {
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
      <div className="mb-9 flex flex-col items-center gap-7 md:mb-12 md:gap-8">
        <div className="relative h-[160px] w-[160px] md:h-[190px] md:w-[190px]">
          <Image
            src="/assets/images/password-shield-transparent.png"
            alt="Password Icon"
            fill
            sizes="(min-width: 768px) 190px, 160px"
            className="h-full w-full object-contain mix-blend-screen"
          />
        </div>
        <AuthHeading
          title={t("auth.password.title")}
          description={t("auth.password.description")}
          className="[&_h2]:text-[24px] [&_h2]:leading-8 md:[&_h2]:text-[28px] md:[&_h2]:leading-9"
        />
      </div>

      <form
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        noValidate
        className="flex flex-1 flex-col lg:flex-none"
      >
        <div className="flex flex-col gap-6 md:gap-7">
          <div>
            <AuthLabel htmlFor="password">
              {t("auth.password.newLabel")}
            </AuthLabel>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="************"
                aria-invalid={Boolean(errors.password)}
                variant="auth"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8A9296] hover:text-[#F4F7F8]"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <div className="flex flex-wrap gap-x-3 gap-y-2 pt-2">
              {passwordChecks.map((check) => (
                <div
                  key={check.key}
                  className={cn(
                    "flex items-center gap-1.5 transition-colors",
                    check.met ? "text-[#22E6AE]" : "text-[#5E666A]"
                  )}
                >
                  <CheckCircle2 className={cn("h-3.5 w-3.5", check.met ? "fill-[#22E6AE]/10" : "")} />
                  <span className="whitespace-nowrap text-xs font-medium leading-4">{check.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <AuthLabel htmlFor="confirmPassword">
              {t("auth.password.confirmLabel")}
            </AuthLabel>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="************"
                aria-invalid={Boolean(errors.confirmPassword)}
                variant="auth"
                {...register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8A9296] hover:text-[#F4F7F8]"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-[#FF4D6D]">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>

        <div className="mt-auto pt-8 md:pt-16">
          <Button
            type="submit"
            size="xl"
            className="min-w-22.5 h-14 w-full rounded-[18px] border-0 bg-[#C7F70A]! bg-none! font-bold text-[#080A0B] shadow-none hover:bg-[#D5FF28]!"
            disabled={isSubmitting}
          >
            {t("auth.password.submit")}
          </Button>
        </div>
      </form>
    </div>
  );
}
