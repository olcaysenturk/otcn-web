"use client";

import { useState } from "react";
import { useModalStore } from "@/stores/useModalStore";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { X, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { clientFetch } from "@/lib/api/clientFetch";
import { getApiBase } from "@/lib/api/getApiBase";
import { handleBackendError } from "@/lib/utils/toast";

export function ChangePasswordModal() {
    const { t } = useI18n();
    const { closeModal, isClosing } = useModalStore();

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Password validation rules aligned with PasswordSetupForm.tsx
    const passwordChecks = [
        { label: t("auth.password.requirements.uppercase"), met: /[A-Z]/.test(newPassword) },
        { label: t("auth.password.requirements.lowercase"), met: /[a-z]/.test(newPassword) },
        { label: t("auth.password.requirements.special"), met: /[^A-Za-z0-9]/.test(newPassword) },
        { label: t("auth.password.requirements.number"), met: /[0-9]/.test(newPassword) },
        { label: t("auth.password.requirements.minLength"), met: newPassword.length >= 8 },
    ];

    const handleSave = async () => {
        setError(null);

        // Basic validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error(t("auth.loginPage.errorTitle"), {
                description: t("auth.loginPage.errorDescription")
            });
            return;
        }

        // Password requirements validation
        const allRequirementsMet = passwordChecks.every(check => check.met);
        if (!allRequirementsMet) {
            toast.error(t("auth.loginPage.errorTitle"), {
                description: t("auth.password.helper")
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("confirmPassword");
            toast.error(t("auth.password.mismatchError"));
            return;
        }

        setIsSubmitting(true);
        try {
            const base = getApiBase();
            const url = `${base}/v3/account/change-password-initiate`;

            const res = await clientFetch(url, {
                method: "POST",
                body: JSON.stringify({
                    oldPassword: currentPassword,
                    newPassword,
                    confirmPassword
                })
            });

            const data = await res.json().catch(() => null);

            if (!res.ok) {
                handleBackendError(data, t);
                return;
            }

            // Transition to verification step
            const { openModal } = useModalStore.getState();
            openModal("password-change-verify", data);
        } catch (err) {
            handleBackendError(null, t);
            console.error("Password change failed:", err);
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
                    <h3 className="text-base font-semibold text-white">{t("modals.security.changePassword.title")}</h3>
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
                <div className="custom-scrollbar flex-1 overflow-y-auto bg-[#0F1415] flex flex-col justify-between">
                        <div className="px-6 pt-6 pb-3 space-y-6">

                            {/* Current Password */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-400">{t("modals.security.changePassword.currentPassword")}</Label>
                                <div className="relative">
                                    <Input
                                        type={showCurrentPassword ? "text" : "password"}
                                        placeholder="••••••••••••"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="rounded-xl bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-11 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                                    >
                                        {showCurrentPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* New Password */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-400">{t("modals.security.changePassword.newPassword")}</Label>
                                <div className="relative">
                                    <Input
                                        type={showNewPassword ? "text" : "password"}
                                        placeholder="••••••••••••"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="rounded-xl bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-11 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                                    >
                                        {showNewPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>

                                {/* Validation Indicators */}
                                <div className="grid grid-cols-2 lg:flex lg:flex-wrap gap-x-4 gap-y-2 pt-2">
                                    {passwordChecks.map((check, idx) => (
                                        <div
                                            key={idx}
                                            className={cn(
                                                "flex items-center gap-1.5 transition-colors",
                                                check.met ? "text-[#25B88A]" : "text-gray-500"
                                            )}
                                        >
                                            <CheckCircle2 className={cn("h-4 w-4", check.met ? "fill-[#25B88A]/10" : "")} />
                                            <span className="text-[11px] md:text-xs font-medium leading-4 whitespace-nowrap">{check.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Confirm New Password */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-400">{t("modals.security.changePassword.confirmPassword")}</Label>
                                <div className="relative">
                                    <Input
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="••••••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => {
                                            setConfirmPassword(e.target.value);
                                            if (error === "confirmPassword") setError(null);
                                        }}
                                        variant={error === "confirmPassword" ? "auth" : "default"}
                                        aria-invalid={error === "confirmPassword"}
                                        className={cn("rounded-xl bg-white/5 text-white placeholder:text-gray-500 h-11 pr-10", error !== "confirmPassword" && "border-white/10")}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                        </div>

                        {/* Footer */}
                        <div className="p-6 pt-3 mt-auto">
                            <Button
                                className="w-full bg-white hover:bg-white/90 text-[#0F1415] rounded-full h-12 text-sm font-semibold"
                                onClick={handleSave}
                                disabled={isSubmitting || !currentPassword || !newPassword || !confirmPassword}
                            >
                                {isSubmitting
                                    ? t("modals.security.changePassword.saving")
                                    : t("modals.security.changePassword.saveAction")}
                            </Button>
                        </div>
                </div>
            </div>
        </div>
    );
}
