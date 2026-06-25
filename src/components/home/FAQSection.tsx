"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { LightSection } from "@/components/home/LightSection";
import { useI18n } from "@/lib/i18n/I18nProvider";

export function FAQSection() {
  const { t, get } = useI18n();
  const items =
    (get("faq.items") as { q: string; a: string }[] | undefined) ?? [];

  return (
    <LightSection innerClassName="mx-auto max-w-237 px-6 py-16 lg:p-20">
      <h2 className="text-center font-sora text-[28px] font-bold tracking-tighter text-foreground sm:text-[36px] md:text-[44px]">
        {t("home.faq.basicsTitle")}
      </h2>

      <Accordion type="single" collapsible defaultValue="item-0" className="mt-14">
        {items.slice(0, 5).map((item, index) => (
          <AccordionItem
            key={`${item.q}-${index}`}
            value={`item-${index}`}
            className="border-b border-border last:border-b-0"
          >
            <AccordionTrigger className="py-5 text-left font-sora text-[16px] font-semibold leading-snug tracking-[-0.015em] text-muted-foreground no-underline hover:text-foreground hover:no-underline data-[state=open]:text-primary md:py-6 [&>svg]:size-7 [&>svg]:rounded-full [&>svg]:border [&>svg]:border-muted-foreground [&>svg]:p-1.5 [&>svg]:text-muted-foreground data-[state=open]:[&>svg]:border-primary data-[state=open]:[&>svg]:bg-background data-[state=open]:[&>svg]:text-primary">
              {item.q}
            </AccordionTrigger>
            <AccordionContent className="pb-6 font-sora text-[14px] font-normal leading-normal tracking-[-0.015em] text-foreground">
              {index === 0 ? t("home.faq.firstAnswer") : item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </LightSection>
  );
}
