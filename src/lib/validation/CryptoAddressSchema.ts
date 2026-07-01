"use client";

import { ProviderType, ReceiverType } from "@/types/crypto";
import { z } from "zod";

export const getAddCryptoAddressSchema = (t: (key: string) => string) =>
    z.object({
        // Step 0
        accountId: z.number().int(),
        assetSymbol: z.string().min(1, t("validation.assetRequired")),
        networkName: z.string().min(1, t("validation.networkRequired")),
        name: z.string().min(2, t("validation.labelMinLength")),
        address: z.string().min(10, t("validation.invalidAddress")),
        memoTag: z.string().optional(),

        // Step 1
        receiverType: z.enum(["Individual", "Corporate"] as ReceiverType[]),
        receiver: z.string().min(2, t("validation.receiverNameRequired")),
        isSelfOwned: z.boolean(),
        receiverBirthDate: z.string().nullable(),
        identityNumber: z.string().nullable(),
        taxNumber: z.string().nullable(),
        receiverResidenceAddress: z.string().optional(),
        receiverCountry: z.string().optional(),
        providerType: z.enum(["Wallet", "Exchange"] as ProviderType[]),
        providerName: z.string(),
        otherProviderName: z.string().optional(),
    })
        .superRefine((values, ctx) => {
            // Individual için TC kimlik kontrolü
            if (values.receiverType === "Individual") {
                if (!values.receiverBirthDate) {
                    ctx.addIssue({
                        code: "custom",
                        path: ["receiverBirthDate"],
                        message: t("validation.birthDateRequired"),
                    });
                }
                if (!values.identityNumber || !/^\d{11}$/.test(values.identityNumber)) {
                    ctx.addIssue({
                        code: "custom",
                        path: ["identityNumber"],
                        message: t("validation.invalidIdentityNumber"),
                    });
                }
            }

            // Corporate için VKN kontrolü
            if (values.receiverType === "Corporate") {
                if (!values.taxNumber || !/^\d{10}$/.test(values.taxNumber)) {
                    ctx.addIssue({
                        code: "custom",
                        path: ["taxNumber"],
                        message: t("validation.invalidTaxNumber"),
                    });
                }
            }

            // Exchange seçiliyse provider name zorunlu
            if (values.providerType === "Exchange" && !values.providerName) {
                ctx.addIssue({
                    code: "custom",
                    path: ["providerName"],
                    message: t("validation.providerRequired"),
                });
            }

            // "Diğer" seçiliyse otherProviderName zorunlu
            if (values.providerName === "0" && !values.otherProviderName) {
                ctx.addIssue({
                    code: "custom",
                    path: ["otherProviderName"],
                    message: t("validation.platformNameRequired"),
                });
            }
        });

export type AddCryptoAddressFormValues = z.infer<ReturnType<typeof getAddCryptoAddressSchema>>;