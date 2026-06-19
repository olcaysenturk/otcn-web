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
import { addShareholders } from "@/services/account";
import { toast } from "sonner";

type ShareholderFormValues = {
    name: string;
    surname: string;
    identityNumber: string;
    birthDate: string;
};

export function AddShareholderModal() {
    const { closeModal, isClosing, data: modalData } = useModalStore();
    const { t } = useI18n();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const shareholderSchema = useMemo(
        () =>
            z.object({
                name: z.string().min(2, t("modals.corporate.validation.firstNameMin")),
                surname: z.string().min(2, t("modals.corporate.validation.lastNameMin")),
                identityNumber: z.string().length(11, t("modals.corporate.validation.identityNumberLength")),
                birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, t("modals.corporate.validation.birthDateFormat")),
            }),
        [t]
    );

    // Assuming modalData contains the applicationId
    const applicationId = (modalData as { applicationId?: number })?.applicationId || 0;

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<ShareholderFormValues>({
        resolver: zodResolver(shareholderSchema),
        defaultValues: {
            name: "",
            surname: "",
            identityNumber: "",
            birthDate: "",
        },
    });

    const onSubmit = async (values: ShareholderFormValues) => {
        if (!applicationId) {
            toast.error(t("modals.corporate.validation.applicationIdMissing"));
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await addShareholders({
                applicationId,
                hasAnyShareholder: true,
                shareHolders: [{
                    name: values.name,
                    surname: values.surname,
                    identityNumber: values.identityNumber,
                    birthDate: new Date(values.birthDate).toISOString(),
                }],
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
                    "relative z-20 flex w-full h-full max-h-[95vh] max-w-130 flex-col overflow-hidden rounded-3xl rounded-b-20 shadow-2xl ring-1 ring-black/5 lg:ml-auto bg-[#6941C6]",
                    isClosing ? "animate-slide-out-to-right" : "animate-slide-in-from-right"
                )}
            >
                {/* Header */}
                <div className="relative flex items-center justify-between px-6 py-4 text-white shrink-0">
                    <h3 className="text-base font-semibold">{t("modals.corporate.addShareholder.title")}</h3>
                    <button
                        type="button"
                        onClick={closeModal}
                        className="rounded-full p-2 text-white hover:bg-white/20 transition backdrop-blur-sm"
                        aria-label={t("common.close")}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit(onSubmit)} className="h-full flex p-1 rounded-3xl pb-1">
                    <div className="custom-scrollbar flex-1 overflow-y-auto bg-white rounded-2xl h-full flex flex-col justify-between">
                        <div className="px-6 py-6 space-y-6">

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">{t("modals.corporate.addShareholder.fields.name")}</Label>
                                <Controller
                                    name="name"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder={t("modals.corporate.addShareholder.placeholders.name")}
                                            className={cn("rounded-xl border-gray-200 h-11", errors.name && "border-red-500")}
                                        />
                                    )}
                                />
                                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">{t("modals.corporate.addShareholder.fields.surname")}</Label>
                                <Controller
                                    name="surname"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder={t("modals.corporate.addShareholder.placeholders.surname")}
                                            className={cn("rounded-xl border-gray-200 h-11", errors.surname && "border-red-500")}
                                        />
                                    )}
                                />
                                {errors.surname && <p className="text-xs text-red-500">{errors.surname.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">{t("modals.corporate.addShareholder.fields.identityNumber")}</Label>
                                <Controller
                                    name="identityNumber"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder={t("modals.corporate.addShareholder.placeholders.identityNumber")}
                                            className={cn("rounded-xl border-gray-200 h-11", errors.identityNumber && "border-red-500")}
                                        />
                                    )}
                                />
                                {errors.identityNumber && <p className="text-xs text-red-500">{errors.identityNumber.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">{t("modals.corporate.addShareholder.fields.birthDate")}</Label>
                                <Controller
                                    name="birthDate"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field} type="date" className={cn("rounded-xl border-gray-200 h-11", errors.birthDate && "border-red-500")} />
                                    )}
                                />
                                {errors.birthDate && <p className="text-xs text-red-500">{errors.birthDate.message}</p>}
                            </div>

                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-gray-100 mt-auto">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-[#101828] hover:bg-[#101828]/90 text-white rounded-full h-12 text-sm font-semibold"
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
