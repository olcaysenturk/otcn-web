"use client";

import {
  Controller,
  useForm,
  type SubmitErrorHandler,
  type SubmitHandler,
} from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { handleBackendError } from "@/lib/utils/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppInput } from "@/components/ui/form/AppInput";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getApplicationSchema, type ApplicationFormValues } from "@/lib/validation/ApplicationSchema";
import { useApplicationStore } from "@/stores/useApplicationStore";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { cn } from "@/lib/utils";

export function ApplicationForm({
  className,
  variant = "light",
  showSubmit = true,
}: {
  className?: string;
  variant?: "light" | "dark";
  showSubmit?: boolean;
}) {
  const { t } = useI18n();
  const router = useRouter();
  const isDark = variant === "dark";
  const labelClassName = isDark ? "text-[#C5C9CC]" : "text-slate-700";
  const fieldLabelClassName = cn(
    "mb-2 block text-xs font-medium",
    isDark ? "text-[#C5C9CC]" : "text-slate-700",
  );
  const inputClassName = isDark
    ? "h-12 rounded-xl border-[#3A4043]/70 bg-[#0E0F10] px-4 text-[#F4F7F8] shadow-none placeholder:text-[#5E666A] focus-visible:border-[#F4F7F8]/60 focus-visible:ring-0"
    : undefined;
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(getApplicationSchema(t)),
    defaultValues: {
      companyName: "",
      firstName: "",
      lastName: "",
      phoneCountryCode: "+90",
      phoneNumber: "",
      email: "",
      averageVolume: "",
      kvkk: false,
    },
  });

  const setFormValues = useApplicationStore((state) => state.setFormValues);

  const onSubmit: SubmitHandler<ApplicationFormValues> = async (values) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email,
          phoneNumber: values.phoneNumber,
          companyName: values.companyName,
          firstName: values.firstName,
          lastName: values.lastName,
          averageVolume: values.averageVolume,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        handleBackendError(data, t, undefined, t("form.registrationFailed"));
        return;
      }

      setFormValues(values);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("registration_form_data", JSON.stringify(values));
      }

      toast.success(t("form.successTitle"), {
        description: t("form.successDescription"),
      });

      // Clear the form after success
      reset();

      // Redirect to activation page with the user registration ID
      const userRegistrationId = data?.userRegisterNotification || data?.id;
      if (userRegistrationId) {
        router.push(`/auth/activation?user-registration-id=${userRegistrationId}`);
      }
    } catch {
      toast.error(t("form.registrationFailed"));
    }
  };

  const onInvalid: SubmitErrorHandler<ApplicationFormValues> = (formErrors) => {
    const messages = Object.values(formErrors)
      .map((error) => error?.message)
      .filter((msg): msg is string => Boolean(msg));

    toast.error(
      messages.length ? (
        <ul className="mt-1 space-y-1 text-xs">
          {messages.map((msg, index) => (
            <li key={index} className="flex gap-1">
              <span>•</span>
              <span>{msg}</span>
            </li>
          ))}
        </ul>
      ) : (
        t("form.errorDescription")
      ),
    );
  };

  return (
    <form
      id="application-form"
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      className={cn(
        "rounded-2xl border p-6 text-sm shadow-sm",
        isDark
          ? "border-white/10 bg-transparent text-white"
          : "border-slate-200 bg-white text-slate-900",
        className,
      )}
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Controller
          name="companyName"
          control={control}
          render={({ field }) => (
            <div>
              <label className={fieldLabelClassName}>
                {t("form.companyTitle")}
              </label>
              <AppInput
                className={inputClassName}
                placeholder={t("form.companyPlaceholder")}
                mode="text"
                {...field}
              />
            </div>
          )}
        />
        <Controller
          name="averageVolume"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <div>
              <label className={fieldLabelClassName}>
                {t("form.estimatedVolume")}
              </label>
              <Select
                value={field.value ?? ""}
                onValueChange={(val) => field.onChange(val)}
              >
                <SelectTrigger
                  className={cn(
                    "min-h-12 w-full rounded-xl px-4 text-sm",
                    isDark
                      ? "border-[#3A4043]/70 bg-[#0E0F10] text-[#F4F7F8] shadow-none focus:ring-0"
                      : "border-slate-300 bg-white text-slate-900 shadow-sm focus:ring-2 focus:ring-[#373b45]/40 focus:ring-offset-0",
                  )}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  className={cn(
                    "text-xs",
                    isDark
                      ? "border-[#3A4043] bg-[#191D1E] text-[#F4F7F8]"
                      : "bg-white text-slate-900",
                  )}
                >
                  <SelectItem value="0 - 50.000 USD">
                    {t("form.avgVolumeOptions.0-50k")}
                  </SelectItem>
                  <SelectItem value="50.000 - 250.000 USD">
                    {t("form.avgVolumeOptions.50k-250k")}
                  </SelectItem>
                  <SelectItem value="250.000 - 1.000.000 USD">
                    {t("form.avgVolumeOptions.250k-1m")}
                  </SelectItem>
                  <SelectItem value="1.000.000 USD +">
                    {t("form.avgVolumeOptions.1mPlus")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        />
        <Controller
          name="firstName"
          control={control}
          render={({ field }) => (
            <div>
              <label className={fieldLabelClassName}>
                {t("form.authorizedName")}
              </label>
              <AppInput
                className={inputClassName}
                placeholder={t("form.namePlaceholder")}
                mode="text"
                {...field}
              />
            </div>
          )}
        />
        <Controller
          name="lastName"
          control={control}
          render={({ field }) => (
            <div>
              <label className={fieldLabelClassName}>
                {t("form.authorizedSurname")}
              </label>
              <AppInput
                className={inputClassName}
                placeholder={t("form.surnamePlaceholder")}
                mode="text"
                {...field}
              />
            </div>
          )}
        />
        <Controller
          name="phoneNumber"
          control={control}
          render={({ field }) => {
            const { onChange, value, ...rest } = field;
            return (
              <div>
                <label className={fieldLabelClassName}>
                  {t("form.phoneNumber")}
                </label>
                <AppInput
                  className={inputClassName}
                  placeholder={t("form.phoneInputPlaceholder")}
                  mode="phone"
                  maxLengthOverride={10}
                  value={value ?? ""}
                  onValueChange={(val) => {
                    const next = val.replace(/^0+/, "");
                    onChange(next);
                  }}
                  {...rest}
                />
              </div>
            );
          }}
        />
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <div>
              <label className={fieldLabelClassName}>{t("form.email")}</label>
              <AppInput
                placeholder={t("form.emailPlaceholder")}
                className={inputClassName}
                type="email"
                mode="text"
                {...field}
              />
            </div>
          )}
        />
      </div>

      <div className="mt-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <Controller
          name="kvkk"
          control={control}
          render={({ field }) => (
            <label className={cn("flex items-center gap-2 text-xs", labelClassName)}>
              <Checkbox
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
                className={cn(
                  "mt-0.5 size-5 rounded border-slate-300 bg-white data-[state=checked]:text-white",
                  isDark
                    ? "border-[#3A4043] bg-[#0E0F10] data-[state=checked]:border-[#C7F022] data-[state=checked]:bg-[#C7F022] data-[state=checked]:text-[#0E0F10]"
                    : "data-[state=checked]:bg-[#373b45]",
                )}
              />
              <span className="flex items-center">{t("form.consentText")}</span>
            </label>
          )}
        />
      </div>

      {showSubmit ? (
        <div className="mt-8 flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "h-12 w-full rounded-[14px] px-6 py-2 text-sm font-bold shadow-none disabled:opacity-70 md:text-base",
              isDark
                ? "border-0 bg-[#C7F022] text-[#0E0F10] hover:bg-[#D2FA32]"
                : "bg-[#373b45] hover:bg-gray-800",
            )}
          >
            {isSubmitting ? (
              t("form.submitting")
            ) : t("form.submit")}
          </Button>
        </div>
      ) : null}
    </form>
  );
}
