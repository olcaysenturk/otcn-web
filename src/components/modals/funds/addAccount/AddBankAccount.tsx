"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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

export function AddBankAccount({ banks, onSuccess, t }: AddBankAccountProps) {
  const [iban, setIban] = useState("");
  const [accountName, setAccountName] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
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
    if (!isConfirmed) {
      toast.error(t("validation.ibanConfirmationRequired"));
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
    catch (error) {
      toast.error(t("bank.errorAdd"));
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col justify-between w-full h-full">
      <div className="flex flex-col items-start gap-6 w-full">
        {/* Hesap Adı Input */}
        <div className="flex flex-col items-start gap-2 w-full">
          <label className="text-[14px] leading-[14px] font-medium text-gray-400">
            {t("modals.funds.accountNameTitle")}
          </label>
          <Input
            type="text"
            value={accountName}
            onChange={(e) => {
              setAccountName(e.target.value);
            }}
            placeholder={t("bank.accountNamePlaceholder")}
            className="w-full h-[45px] px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-[14px] leading-[150%] tracking-[-0.015em] font-medium text-white placeholder:text-gray-500"
            disabled={loading}
          />
        </div>

        {/* IBAN Input */}
        <div className="flex flex-col items-start gap-2 w-full">
          <label className="text-[14px] leading-[14px] font-medium text-gray-400">
            {t("modals.funds.ibanTitle")}
          </label>
          <Input
            ref={ibanInputRef}
            type="text"
            value={iban}
            onChange={handleIbanChange}
            placeholder={t("bank.ibanPlaceholder")}
            className="w-full h-[45px] px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-[14px] leading-[150%] tracking-[-0.015em] font-medium text-white placeholder:text-gray-500"
            maxLength={32}
            disabled={loading}
          />
        </div>

        {/* Checkbox */}
        <div className="flex flex-row items-start gap-3 w-full">
          <Checkbox
            id="iban-confirmation"
            onCheckedChange={(e) => setIsConfirmed(!!e)}
            defaultChecked={isConfirmed}
            disabled={loading}
            className="h-4 w-4 rounded border-white/20 mt-1 text-primary bg-white/5"
          />
          <label htmlFor="iban-confirmation" className="text-[14px] leading-[150%] tracking-[-0.015em] font-normal text-gray-400 flex-1 cursor-pointer">
            {t("bank.ibanDeclaration")}
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full bg-white px-4 py-3 text-sm font-semibold rounded-full text-[#0F1415] shadow-md transition hover:bg-white/90"
        disabled={loading || !isConfirmed}
      >
        {loading ? (
          <span>{t("bank.adding")}</span>
        ) : (
          <>
            {t("bank.addBankAccountButton")}
          </>
        )}
      </Button>
    </form>
  );
}