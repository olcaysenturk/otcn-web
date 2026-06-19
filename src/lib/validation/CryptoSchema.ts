import { z } from "zod";

export const getDeclareTransactionSchema = (t: (key: string) => string) =>
  z.object({
    persona: z.enum(["individual", "corporate"]),
    senderName: z.string().min(1, t("validation.required")),
    isOwnAddress: z.boolean(),
    informationType: z.enum(["ADDRESS", "BIRTHPLACE", "IDENTITY", "EXTERNAL_CUSTOMER_NO"]).nullable().optional(),
    address: z.string().optional(),
    birthCityId: z.number().optional().nullable(),
    birthDistrictId: z.number().optional().nullable(),
    birthDate: z.string().optional().nullable(),
    identityInfo: z.string().optional().nullable(),
    externalCustomerNo: z.string().optional().nullable(),
    addressType: z.enum(["PERSONAL", "CORPORATE"]),
    providerName: z.string().optional(),
    otherProviderName: z.string().optional(),
    description: z.string()
      .min(1, t("validation.required"))
      .min(20, t("validation.descriptionMin")),
  }).superRefine((data, ctx) => {
    if (!data.isOwnAddress) {
      if (!data.informationType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("validation.selectRequired"),
          path: ["informationType"],
        });
        return;
      }

      if (data.informationType === "ADDRESS" && !data.address) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("validation.required"),
          path: ["address"],
        });
      }
      if (data.informationType === "BIRTHPLACE") {
        if (!data.birthCityId) ctx.addIssue({ code: z.ZodIssueCode.custom, message: t("validation.required"), path: ["birthCityId"] });
        if (!data.birthDistrictId) ctx.addIssue({ code: z.ZodIssueCode.custom, message: t("validation.required"), path: ["birthDistrictId"] });
        if (!data.birthDate) ctx.addIssue({ code: z.ZodIssueCode.custom, message: t("validation.required"), path: ["birthDate"] });
      }
      if (data.informationType === "IDENTITY" && !data.identityInfo) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: t("validation.required"), path: ["identityInfo"] });
      }
      if (data.informationType === "EXTERNAL_CUSTOMER_NO" && !data.externalCustomerNo) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: t("validation.required"), path: ["externalCustomerNo"] });
      }
    }
    if (data.addressType === "CORPORATE") {
      if (!data.providerName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("validation.selectRequired"),
          path: ["providerName"],
        });
      } else if (data.providerName === "OTHER" && !data.otherProviderName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("validation.required"),
          path: ["otherProviderName"],
        });
      }
    }
  });
