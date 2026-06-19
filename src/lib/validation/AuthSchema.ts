import { z } from "zod";

export const getLoginSchema = (t: (key: string) => string) =>
  z.object({
    username: z.string().min(1, t("auth.loginPage.errorDescription")).email(t("validation.auth.emailInvalid")),
    password: z.string().min(1, t("auth.loginPage.errorDescription")),
    remember: z.boolean().optional(),
  });

export type LoginFormValues = z.infer<ReturnType<typeof getLoginSchema>>;

export const getForgotPasswordSchema = (t: (key: string) => string) =>
  z.object({
    email: z.string().min(1, t("validation.required")).email(t("validation.auth.emailInvalid")),
  });

export type ForgotPasswordFormValues = z.infer<ReturnType<typeof getForgotPasswordSchema>>;

export const getPasswordResetSchema = (t: (key: string) => string) =>
  z.object({
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

export type PasswordResetFormValues = z.infer<ReturnType<typeof getPasswordResetSchema>>;
