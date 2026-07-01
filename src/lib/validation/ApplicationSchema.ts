import { z } from "zod";

export const getApplicationSchema = (t: (key: string) => string) =>
  z
    .object({
      companyName: z
        .string()
        .min(2, t("validation.application.companyNameMin")),
      firstName: z
        .string()
        .min(2, t("validation.application.firstNameMin")),
      lastName: z
        .string()
        .min(2, t("validation.application.lastNameMin")),
      phoneCountryCode: z
        .string()
        .min(1, t("validation.application.phoneCountryRequired")),
      phoneNumber: z
        .string()
        .regex(/^\d+$/, t("validation.application.phoneInvalid")),
      email: z
        .string()
        .email(t("validation.application.emailInvalid")),
      averageVolume: z
        .string()
        .min(1, t("validation.application.estimatedVolumeRequired")),
      kvkk: z.boolean().refine((val) => val === true, {
        message: t("validation.application.kvkkRequired"),
      }),
    })
    .superRefine((values, ctx) => {
      if (values.phoneCountryCode === "+90") {
        if (!/^\d{10}$/.test(values.phoneNumber)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["phoneNumber"],
            message: t("validation.application.phoneTenDigits"),
          });
        }
        return;
      }

      if (values.phoneNumber.length < 6 || values.phoneNumber.length > 14) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["phoneNumber"],
          message: t("validation.application.phoneLengthRange"),
        });
      }
    });

export type ApplicationFormValues = z.infer<
  ReturnType<typeof getApplicationSchema>
>;
