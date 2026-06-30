"use client";

import { useMemo, useState } from "react";
import { useModalStore } from "@/stores/useModalStore";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { updateAuthorizedUserInfo } from "@/services/account";
import { ApplicationDetail } from "@/types/application";
import { toast } from "sonner";

type AuthorityFormValues = {
    userIdentityNumber: string;
    userBirthDate: string;
    userIdentitySerialNumber: string;
};

export function UpdateAccountAuthorityModal() {
    const { closeModal, isClosing, data: modalData } = useModalStore();
    const { t } = useI18n();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const authoritySchema = useMemo(
        () =>
            z.object({
                userIdentityNumber: z.string().length(11, t("modals.corporate.validation.identityNumberLength")),
                userBirthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, t("modals.corporate.validation.birthDateFormat")),
                userIdentitySerialNumber: z.string().min(1, t("modals.corporate.validation.identitySerialRequired")),
            }),
        [t]
    );

    const application = modalData as ApplicationDetail;
    const applicationId = application?.applicationId || 0;

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<AuthorityFormValues>({
        resolver: zodResolver(authoritySchema),
        defaultValues: {
            userIdentityNumber: application?.userIdentityNumber || "",
            userBirthDate: application?.userBirthDate ? application.userBirthDate.split("T")[0] : "",
            userIdentitySerialNumber: "", // Serial number not in detail response, user needs to enter it
        },
    });

    const onSubmit = async (values: AuthorityFormValues) => {
        if (!applicationId) {
            toast.error(t("modals.corporate.validation.applicationIdMissing"));
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await updateAuthorizedUserInfo({
                applicationId,
                userIdentityNumber: values.userIdentityNumber,
                userBirthDate: new Date(values.userBirthDate).toISOString(),
                userIdentitySerialNumber: values.userIdentitySerialNumber,
            });

            if (result.success) {
                toast.success(t("common.success"));
                window.dispatchEvent(new Event("application-updated"));
                closeModal();
            } else {
                toast.error(result.message || t("common.error"));
            }
        } catch {
            toast.error(t("common.error"));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            onClick={closeModal}
            className="absolute inset-0 z-20 flex items-start justify-center overflow-auto p-4 md:items-start md:pt-6"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className={cn(
                    "relative z-20 flex w-full h-full max-h-[95vh] max-w-130 flex-col overflow-hidden rounded-[1.75rem] gap-2 bg-[#0F1415] shadow-2xl ring-1 ring-black/5 lg:ml-auto",
                    isClosing ? "animate-slide-out-to-right" : "animate-slide-in-from-right"
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between bg-primary px-6 py-4 h-14 shrink-0">
                    <h3 className="text-base font-semibold text-white">{t("modals.corporate.updateAuthority.title")}</h3>
                    <button
                        type="button"
                        onClick={closeModal}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-white transition hover:bg-white/10"
                        aria-label={t("common.close")}
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto flex flex-col">
                    <div className="custom-scrollbar flex-1 overflow-y-auto bg-[#0F1415] flex flex-col justify-between">
                        <div className="px-6 pt-6 pb-3 space-y-6">

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-400">{t("modals.corporate.updateAuthority.fields.identityNumber")}</Label>
                                <Controller
                                    name="userIdentityNumber"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder={t("modals.corporate.updateAuthority.placeholders.identityNumber")}
                                            className={cn("rounded-xl bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-11", errors.userIdentityNumber && "border-red-500")}
                                        />
                                    )}
                                />
                                {errors.userIdentityNumber && <p className="text-xs text-red-400">{errors.userIdentityNumber.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-400">{t("modals.corporate.updateAuthority.fields.birthDate")}</Label>
                                <Controller
                                    name="userBirthDate"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field} type="date" className={cn("rounded-xl bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-11", errors.userBirthDate && "border-red-500")} />
                                    )}
                                />
                                {errors.userBirthDate && <p className="text-xs text-red-400">{errors.userBirthDate.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-400">{t("modals.corporate.updateAuthority.fields.identitySerialNumber")}</Label>
                                <Controller
                                    name="userIdentitySerialNumber"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder={t("modals.corporate.updateAuthority.placeholders.identitySerialNumber")}
                                            className={cn("rounded-xl bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-11", errors.userIdentitySerialNumber && "border-red-500")}
                                        />
                                    )}
                                />
                                {errors.userIdentitySerialNumber && <p className="text-xs text-red-400">{errors.userIdentitySerialNumber.message}</p>}
                            </div>

                        </div>

                        {/* Footer */}
                        <div className="p-6 pt-3 mt-auto">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-white hover:bg-white/90 text-[#0F1415] rounded-full h-12 text-sm font-semibold"
                            >
                                {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : t("modals.corporate.actions.save")}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
