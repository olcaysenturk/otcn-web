import type { Metadata } from "next";

import { getLocalizedMetadata } from "@/lib/seo/metadata";
import { getMessages } from "@/lib/i18n/getMessages";
import { resolveLocale } from "@/lib/seo/homepage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    alternates: getLocalizedMetadata("/trade/future", locale),
  };
}

export default async function TradeFuturePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const resolvedLocale = resolveLocale(locale);
  const messages = await getMessages(resolvedLocale, ["common"]);
  const t = (key: string) => {
    const value = key.split(".").reduce<unknown>((current, part) => {
      if (!current || typeof current !== "object") return undefined;
      return (current as Record<string, unknown>)[part];
    }, messages);

    return typeof value === "string" ? value : key;
  };

  return (
    <section className="flex min-h-[520px] flex-col items-center justify-center rounded-[28px] border border-white/10 bg-[#0e0f10] px-6 py-16 text-center text-white md:px-10">
      <span className="text-sm font-semibold uppercase tracking-[0.18em] text-[#C8FF00]">
        {t("trade.future.eyebrow")}
      </span>
      <h1 className="mt-4 max-w-xl text-[32px] font-black leading-tight md:text-[48px]">
        {t("trade.future.title")}
      </h1>
      <p className="mt-4 max-w-md text-sm leading-6 text-white/55">
        {t("trade.future.description")}
      </p>
    </section>
  );
}
