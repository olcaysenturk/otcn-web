"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cleanIBAN, extractBankIdFromIBAN, formatIBAN, validateIBAN } from "@/lib/utils/bank";
import { addBank } from "@/services/bank";
import type { AddBankRequest, Bank } from "@/types/bank";
import { useRef, useState } from "react";
import { toast } from "sonner";

type AddBankAccountProps = {
  banks: Bank[];
  onSuccess: (bank: AddBankRequest) => void;
  t: (key: string, params?: Record<string, string>) => string;
};

const FIELD_CLASS =
  "h-12 w-full rounded-[14px] border border-[#3A4043] bg-transparent px-4 text-sm text-[#F4F7F8] placeholder:text-[#5E666A] focus:border-[#5E666A]";

export function AddBankAccount({ banks, onSuccess, t }: AddBankAccountProps) {
  const [iban, setIban] = useState("");
  const [accountName, setAccountName] = useState("");
  const [loading, setLoading] = useState(false);
  const ibanInputRef = useRef<HTMLInputElement>(null);

  const handleIbanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const cursorPos = input.selectionStart || 0;
    const oldValue = input.value;
    const newValue = formatIBAN(oldValue);
    const beforeCursor = oldValue.slice(0, cursorPos).replace(/\s/g, '');

    let newCursorPos = 0;
    let charCount = 0;

    for (let i = 0; i < newValue.length; i++) {
      if (newValue[i] !== ' ') {
        charCount++;
      }
      if (charCount === beforeCursor.length) {
        newCursorPos = i + 1;
        break;
      }
    }

    if (cursorPos >= oldValue.length) {
      newCursorPos = newValue.length;
    }

    setIban(newValue);
    requestAnimationFrame(() => {
      if (ibanInputRef.current) {
        ibanInputRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedIban = cleanIBAN(iban);
    const ibanValidation = validateIBAN(cleanedIban);
    if (!ibanValidation.isValid) {
      toast.error(ibanValidation.error || t("validation.invalidIBAN"));
      return;
    }
    const bankId = extractBankIdFromIBAN(cleanedIban, banks);
    if (!bankId) {
      toast.error(t("validation.unsupportedBankCode"));
      return;
    }
    if (!accountName.trim()) {
      toast.error(t("validation.accountNameRequired"));
      return;
    }

    setLoading(true);
    try {
      const newBank: AddBankRequest = {
        label: accountName.trim(),
        iban: cleanedIban,
        currency: "TRY",
        bankId: bankId,
      };
      const res = await addBank(newBank);
      if (res.ok) {
        toast.success(t("bank.successAdd"));
        onSuccess(newBank);
      } else {
        const resJson = await res.json();
        toast.error(resJson.message || t("bank.errorAdd"));
      }
    }
    catch {
      toast.error(t("bank.errorAdd"));
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex h-full w-full flex-col justify-between gap-6">
      <div className="flex w-full flex-col gap-5">
        <div className="flex w-full flex-col gap-2">
          <label className="text-sm font-medium text-[#F4F7F8]">{t("modals.funds.accountNameTitle")}</label>
          <Input
            type="text"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            placeholder={t("bank.accountNamePlaceholder")}
            className={FIELD_CLASS}
            disabled={loading}
          />
        </div>

        <div className="flex w-full flex-col gap-2">
          <label className="text-sm font-medium text-[#F4F7F8]">{t("modals.funds.ibanTitle")}</label>
          <Input
            ref={ibanInputRef}
            type="text"
            value={iban}
            onChange={handleIbanChange}
            placeholder={t("bank.ibanPlaceholder")}
            className={FIELD_CLASS}
            maxLength={32}
            disabled={loading}
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full rounded-full bg-white px-4 py-3 text-sm font-semibold text-[#0F1415] shadow-md transition hover:bg-white/90"
        disabled={loading}
      >
        {loading ? t("bank.adding") : t("account.address.form.save")}
      </Button>
    </form>
  );
}
