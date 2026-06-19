"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { LightSection } from "@/components/home/LightSection";
import { useI18n } from "@/lib/i18n/I18nProvider";

export function FAQSection() {
  const { t, get } = useI18n();
  const items =
    (get("faq.items") as { q: string; a: string }[] | undefined) ?? [];

  return (
    <LightSection innerClassName="mx-auto min-h-[520px] max-w-4xl px-5 py-8  md:py-16">
      <h2 className="text-center text-[20px] font-semibold text-white/25 md:text-[42px]">
        {t("home.faq.basicsTitle")}
      </h2>

      <Accordion type="single" collapsible defaultValue="item-0" className="mt-9 md:mt-12">
        {items.slice(0, 5).map((item, index) => (
          <AccordionItem
            key={`${item.q}-${index}`}
            value={`item-${index}`}
            className="border-b border-white/10"
          >
            <AccordionTrigger className="group py-5 text-left text-[12px] font-semibold leading-snug text-white/55 no-underline hover:no-underline data-[state=open]:text-[#8F84FF] md:py-6 md:text-sm [&>svg]:rounded-full [&>svg]:border [&>svg]:border-white/30 [&>svg]:p-1 [&>svg]:text-white/60 data-[state=open]:[&>svg]:border-[#C8FF00]/60 data-[state=open]:[&>svg]:text-[#C8FF00]">
              {item.q}
            </AccordionTrigger>
            <AccordionContent className="max-w-3xl pb-6 text-[11px] leading-5 text-white/70 md:text-sm md:leading-7 md:text-white/55">
              {index === 0 ? t("home.faq.firstAnswer") : item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </LightSection>
  );
}
