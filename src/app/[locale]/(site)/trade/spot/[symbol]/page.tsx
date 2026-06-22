import Link from "next/link";

import { getMessages } from "@/lib/i18n/getMessages";
import { withLocale } from "@/lib/i18n/href";
import { resolveLocale } from "@/lib/seo/homepage";

type SpotDetailPageProps = {
  params: Promise<{
    locale: string;
    symbol: string;
  }>;
};

export default async function SpotDetailPage({ params }: SpotDetailPageProps) {
  const { locale, symbol } = await params;
  const resolvedLocale = resolveLocale(locale);
  const messages = await getMessages(resolvedLocale, ["common"]);
  const t = (key: string) => {
    const direct = messages[key];
    if (typeof direct === "string") return direct;

    const value = key.split(".").reduce<unknown>((current, part) => {
      if (!current || typeof current !== "object") return undefined;
      return (current as Record<string, unknown>)[part];
    }, messages);

    return typeof value === "string" ? value : key;
  };
  const normalizedSymbol = symbol.toUpperCase();

  return (
    <section className="min-h-[520px] rounded-[28px] border border-white/10 bg-[#0e0f10] px-6 py-8 text-white md:px-10 md:py-12">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[#C8FF00]">
              {t("home.coinDetail.eyebrow")}
            </div>
            <h1 className="mt-3 text-[42px] font-black leading-none md:text-[64px]">
              {normalizedSymbol}
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-white/55">
              {t("home.coinDetail.description")}
            </p>
          </div>

          <Link
            href={withLocale("/markets", locale)}
            className="inline-flex h-11 items-center justify-center rounded-full border border-white/20 px-5 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            {t("home.coinDetail.back")}
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            [t("home.coinDetail.stats.lastPrice"), "$2907.56"],
            [t("home.coinDetail.stats.change24h"), "+0.29"],
            [t("home.coinDetail.stats.marketStatus"), t("home.coinDetail.stats.mockData")],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-[18px] border border-white/10 bg-white/[0.04] p-5"
            >
              <div className="text-xs font-semibold uppercase tracking-[0.12em] text-white/35">
                {label}
              </div>
              <div className="mt-4 text-2xl font-semibold text-white">
                {value}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-[22px] border border-white/10 bg-black/30 p-6">
          <div className="h-[220px] rounded-[16px] border border-dashed border-white/15 bg-[linear-gradient(180deg,rgba(200,255,0,0.08),rgba(28,87,255,0.04))]" />
        </div>
      </div>
    </section>
  );
}
