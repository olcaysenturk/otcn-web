"use client";

import { useState } from "react";
import { CheckCircle, X } from "lucide-react";

import { useI18n } from "@/lib/i18n/I18nProvider";
import { useModalStore } from "@/stores/useModalStore";
import { cn } from "@/lib/utils";

// Three-step flow: info -> declare -> verify
export function AddressModal() {
  const { t } = useI18n();
  const { closeModal, isClosing } = useModalStore();

  type Step = "info" | "declare" | "verify" | "success";

  const [step, setStep] = useState<Step>("info");
  const [form, setForm] = useState({
    persona: "corporate",
    asset: "",
    network: "",
    label: "",
    address: "",
    tag: "",
    corporateName: "",
    fullName: "",
    tckn: "",
    ownAddress: false,
    beneficiaryTaxId: "",
    addressType: "",
    provider: "",
    otp: "",
  });

  const canContinue =
    (step === "info" && form.asset && form.network && form.label && form.address) ||
    (step === "declare" && 
      (form.persona === "corporate" 
        ? form.corporateName && form.beneficiaryTaxId 
        : form.fullName && form.tckn) && 
      form.addressType && form.provider) ||
    (step === "verify" && form.otp.length >= 4) ||
    step === "success";

  const next = () => {
    if (step === "info") return setStep("declare");
    if (step === "declare") return setStep("verify");
    if (step === "verify") return setStep("success");
  };

  const back = () => {
    if (step === "declare") return setStep("info");
    if (step === "verify") return setStep("declare");
  };

  const stepLabels = [
    { key: "info", label: t("modals.addressModal.steps.info") },
    { key: "declare", label: t("modals.addressModal.steps.declare") },
    { key: "verify", label: t("modals.addressModal.steps.verify") },
  ] as const;

  return (
    <div 
      onClick={closeModal}
      className="absolute inset-0 z-20 flex items-start justify-center overflow-auto p-4 md:pt-6"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className={cn(
        "relative z-20 flex h-full w-full max-h-[95vh] max-w-[520px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 lg:ml-auto dark:bg-gray-900 dark:ring-white/10",
        isClosing ? "animate-slide-out-to-right" : "animate-slide-in-from-right"
      )}>
        <div className="flex items-center justify-between border-b border-[#E8EDF3] bg-modal-header-light px-6 py-4 dark:border-gray-700 dark:bg-modal-header-dark">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            {step === "declare"
              ? t("modals.addressModal.titleDeclare")
              : step === "verify"
                ? t("modals.addressModal.titleVerify")
                : t("modals.addressModal.titleInfo")}
          </h3>
          <button
            className="rounded-full p-1 text-gray-500 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            onClick={closeModal}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
          <div className="flex w-full items-center justify-between rounded-full border border-[#E8EDF3] bg-gray-50 px-1 text-[11px] font-semibold text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
            {stepLabels.map((s, idx) => (
              <div
                key={s.key}
                className={[
                  "relative flex flex-1 items-center justify-center rounded-full px-2 py-2",
                  step === s.key ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white" : "text-gray-500",
                ].join(" ")}
              >
                {s.label}
                {idx < stepLabels.length - 1 && (
                  <span className="absolute right-[-10px] top-1/2 hidden h-px w-5 -translate-y-1/2 bg-gray-200 dark:bg-gray-700 sm:block" />
                )}
              </div>
            ))}
          </div>
        </div>

        {step === "info" && (
          <div className="space-y-4 px-6 py-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">{t("modals.addressModal.fields.asset")}</label>
              <select
                value={form.asset}
                onChange={(e) => setForm((prev) => ({ ...prev, asset: e.target.value }))}
                className="w-full rounded-xl border border-[#E8EDF3] bg-white px-3 py-3 text-sm text-gray-900 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-white dark:focus:ring-white"
              >
                <option value="">{t("modals.addressModal.placeholders.asset")}</option>
                <option>USDT</option>
                <option>BTC</option>
                <option>ETH</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">{t("modals.addressModal.fields.network")}</label>
              <select
                value={form.network}
                onChange={(e) => setForm((prev) => ({ ...prev, network: e.target.value }))}
                className="w-full rounded-xl border border-[#E8EDF3] bg-white px-3 py-3 text-sm text-gray-900 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-white dark:focus:ring-white"
              >
                <option value="">{t("modals.addressModal.placeholders.network")}</option>
                <option>ERC-20</option>
                <option>TRC-20</option>
                <option>BEP-20</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">{t("modals.addressModal.fields.label")}</label>
              <input
                value={form.label}
                onChange={(e) => setForm((prev) => ({ ...prev, label: e.target.value }))}
                className="w-full rounded-xl border border-[#E8EDF3] bg-white px-3 py-3 text-sm text-gray-900 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-white dark:focus:ring-white"
                placeholder={t("modals.addressModal.placeholders.label")}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">{t("modals.addressModal.fields.address")}</label>
              <textarea
                value={form.address}
                onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
                rows={3}
                className="w-full rounded-xl border border-[#E8EDF3] bg-white px-3 py-3 text-sm text-gray-900 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-white dark:focus:ring-white"
                placeholder={t("modals.addressModal.placeholders.address")}
              />
            </div>
          </div>
        )}

        {step === "declare" && (
          <div className="space-y-4 px-6 py-6">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">{t("modals.addressModal.fields.persona")}</p>
              <div className="flex items-center gap-4">
                {[
                  { key: "individual", label: t("modals.funds.individual") },
                  { key: "corporate", label: t("modals.funds.corporate") },
                ].map((opt) => (
                  <label key={opt.key} className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
                    <input
                      type="radio"
                      checked={form.persona === opt.key}
                      onChange={() => setForm((prev) => ({ ...prev, persona: opt.key }))}
                      className="h-4 w-4 accent-gray-900 dark:accent-white"
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>

            {form.persona === "corporate" ? (
              <>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">{t("modals.addressModal.fields.corporateName")}</label>
                  <select
                    value={form.corporateName}
                    onChange={(e) => setForm((prev) => ({ ...prev, corporateName: e.target.value }))}
                    className="w-full rounded-xl border border-[#E8EDF3] bg-white px-3 py-3 text-sm text-gray-900 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-white dark:focus:ring-white"
                  >
                    <option value="">{t("modals.addressModal.placeholders.corporateName")}</option>
                    <option>EREN ELEKTRONİK</option>
                    <option>{t("modals.funds.other")}</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">{t("modals.addressModal.fields.corporateTaxId")}</label>
                  <input
                    value={form.beneficiaryTaxId}
                    onChange={(e) => setForm((prev) => ({ ...prev, beneficiaryTaxId: e.target.value }))}
                    placeholder={t("modals.addressModal.placeholders.corporateTaxId")}
                    className="w-full rounded-xl border border-[#E8EDF3] bg-white px-3 py-3 text-sm text-gray-900 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-white dark:focus:ring-white"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">{t("modals.addressModal.fields.fullName")}</label>
                  <input
                    value={form.fullName}
                    onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
                    placeholder={t("modals.addressModal.placeholders.fullName")}
                    className="w-full rounded-xl border border-[#E8EDF3] bg-white px-3 py-3 text-sm text-gray-900 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-white dark:focus:ring-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">{t("modals.addressModal.fields.tckn")}</label>
                  <input
                    value={form.tckn}
                    onChange={(e) => setForm((prev) => ({ ...prev, tckn: e.target.value }))}
                    placeholder={t("modals.addressModal.placeholders.tckn")}
                    className="w-full rounded-xl border border-[#E8EDF3] bg-white px-3 py-3 text-sm text-gray-900 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-white dark:focus:ring-white"
                  />
                </div>
              </>
            )}

            <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
              <input
                type="checkbox"
                checked={form.ownAddress}
                onChange={(e) => setForm((prev) => ({ ...prev, ownAddress: e.target.checked }))}
                className="h-4 w-4 accent-gray-900 dark:accent-white"
              />
              {t("modals.funds.isSelfOwnedLabel")}
            </label>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">{t("modals.funds.providerTypeTitle")}</label>
              <select
                value={form.addressType}
                onChange={(e) => setForm((prev) => ({ ...prev, addressType: e.target.value }))}
                className="w-full rounded-xl border border-[#E8EDF3] bg-white px-3 py-3 text-sm text-gray-900 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-white dark:focus:ring-white"
              >
                <option value="">{t("modals.funds.providerNameTitle")}</option>
                <option>{t("modals.declare.options.addressIndividual")}</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">{t("modals.funds.providerNameTitle")}</label>
              <select
                value={form.provider}
                onChange={(e) => setForm((prev) => ({ ...prev, provider: e.target.value }))}
                className="w-full rounded-xl border border-[#E8EDF3] bg-white px-3 py-3 text-sm text-gray-900 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-white dark:focus:ring-white"
              >
                <option value="">{t("modals.declare.options.placeholder")}</option>
                <option>Binance</option>
                <option>Coinbase</option>
              </select>
            </div>
          </div>
        )}

        {step === "verify" && (
          <div className="space-y-4 px-6 py-6">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{t("modals.addressModal.titleVerify")}</p>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">{t("modals.addressModal.fields.verificationCode")}</label>
              <input
                value={form.otp}
                onChange={(e) => setForm((prev) => ({ ...prev, otp: e.target.value }))}
                className="w-full rounded-xl border border-[#E8EDF3] bg-white px-3 py-3 text-sm text-gray-900 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-white dark:focus:ring-white"
                placeholder={t("modals.addressModal.placeholders.verificationCode")}
              />
            </div>
            <div className="space-y-1 text-xs text-gray-600 dark:text-gray-300">
              <p>• {t("modals.addressModal.notes.whitelist")}</p>
              <p>• {t("modals.addressModal.notes.tfaRequired")}</p>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="space-y-3 px-6 py-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-200">
              <CheckCircle className="h-8 w-8" />
            </div>
            <p className="text-base font-semibold text-gray-900 dark:text-white">{t("account.address.form.successTitle")}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">{t("account.address.form.successDesc")}</p>
          </div>
        )}

        <div className="flex items-center gap-3 border-t border-[#E8EDF3] px-6 py-3 dark:border-gray-800">
          {step !== "info" && step !== "success" ? (
            <button
              className="rounded-lg border border-[#E8EDF3] bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
              onClick={back}
            >
              {t("back")}
            </button>
          ) : (
            <span />
          )}
          <div className="flex flex-1 justify-end gap-3">
            <button
              className="rounded-lg border border-[#E8EDF3] bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
              onClick={closeModal}
            >
              {t("common.close")}
            </button>
            {step === "success" ? (
              <button
                className="rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 dark:bg-white dark:text-gray-900"
                onClick={closeModal}
              >
                {t("modals.funds.complete")}
              </button>
            ) : (
              <button
                disabled={!canContinue}
                className="rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 disabled:opacity-60 dark:bg-white dark:text-gray-900"
                onClick={next}
              >
                {step === "info"
                  ? t("modals.addressModal.actions.saveAddress")
                  : step === "declare"
                    ? t("modals.funds.continue")
                    : t("modals.tfa.verify")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
