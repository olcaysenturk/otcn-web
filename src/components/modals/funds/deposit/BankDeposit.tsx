"use client";
import { Copy } from "lucide-react";
import Image from "next/image";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { InfoBox } from "@/components/ui/infobox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { DepositBankItem } from "@/types/bank";
import { useState } from "react";
import { toast } from "sonner";

type BankDepositProps = {
  bankList: DepositBankItem[];
  t: (key: string) => string;
};

export function BankDeposit({
  bankList,
  t,
}: BankDepositProps) {
  const [currency, setCurrency] = useState("TRY");
  const availableCurrencies = new Set(bankList.map((b) => b.currency));
  const filteredBanks = bankList.filter((b) => b.currency === currency);

  const handleCopy = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    toast.success(text + " " + t("modals.funds.copySuccess"));
  };

  return (
    <div className="space-y-4">
      <InfoBox variant="info-dark">
        <p className="text-sm text-gray-200">
          {t("modals.funds.depositDesc")}
        </p>
      </InfoBox>

      {/* Currency Tabs */}
      <Tabs value={currency} onValueChange={setCurrency} variant="subtle">
        <TabsList animated>
          {(["TRY", "USD", "EUR"] as const).map((code) => (
            <TabsTrigger
              key={code}
              value={code}
              disabled={!availableCurrencies.has(code) && bankList.length > 0}
            >
              {code}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Bank List */}
      <div className="space-y-3">
        {bankList.length > 0 ? (
          filteredBanks?.map((bank) => (
            <Accordion key={bank.id} type="single" collapsible className="w-full">
              <AccordionItem
                value={bank.id.toString()}
                className="border border-white/10 rounded-[20px] last:border-b bg-white/5 overflow-hidden
                [&_button]:focus-visible:ring-0"
              >
                <AccordionTrigger
                  className="px-4 py-4 hover:no-underline hover:bg-white/[0.07] transition-colors w-full"
                >
                  <div className="flex items-center justify-between w-full gap-3">
                    <div className="flex flex-col items-start gap-2">
                      <div className="relative w-[130px] h-10">
                        <Image
                          src={`/assets/images/banks/${bank.slug}.png`}
                          alt={bank.accountName}
                          fill
                          className="object-contain object-left"
                        />
                      </div>

                      {/* Badges */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-blue-300 border-blue-400/40 border rounded-full bg-blue-500/10 px-2 py-1.5">
                          {t("modals.funds.eftHavale")}
                        </span>
                        <span className="text-xs text-purple-300 border-purple-400/40 border rounded-full bg-purple-500/10 px-2 py-1.5">
                          {t("modals.funds.mobileBanking")}
                        </span>
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="px-4 pb-4">
                  <div className="flex flex-col gap-3">
                    {[{ "title": "accountNameTitle", "value": bank.accountName }, { "title": "ibanTitle", "value": bank.accountNo }].map((key) => (
                      <div key={key.title} className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-gray-400">
                          {t(`modals.funds.${key.title}`)}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-white text-right tracking-tight">
                            {key.value}
                          </span>
                          <button
                            onClick={(e) => handleCopy(key.value || "", e)}
                            aria-label={t("modals.funds.copy")}
                          >
                            <Copy className="w-3.5 h-3.5 text-gray-400" />
                          </button>
                        </div>
                      </div>
                    ))}

                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))
        ) : (
          <div className="flex justify-center p-4">
            <span className="text-sm text-gray-400">{t("modals.funds.noBankFound")}</span>
          </div>
        )}
      </div>
    </div>
  );
}
