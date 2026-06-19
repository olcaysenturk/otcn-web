import { ApplicationStepper } from "@/components/application/ApplicationStepper";
import { getApplicationTabs } from "@/data/application-tabs";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/config";
import { withLocale } from "@/lib/i18n/href";
import { getMessages } from "@/lib/i18n/getMessages";
import { ApplicationLayoutClient } from "@/components/application/ApplicationLayoutClient";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale?: string }>;
};

export default async function ApplicationLayout({ children, params }: Props) {
  const resolved = await params;
  const locale = (resolved?.locale as Locale) ?? DEFAULT_LOCALE;

  const messages = await getMessages(locale, ["common"]);
  const t = (messages as any).application?.header;

  const basePath = `/${locale}/application`;
  const tabLinks = (await getApplicationTabs(locale)).map((tab) => ({
    ...tab,
    href: withLocale(`/application/${tab.slug ?? tab.id}`, locale),
  }));

  return (
    <div className="flex flex-col gap-6 mt-8 w-full min-w-0 overflow-hidden p-2 lg:p-6 bg-[rgba(255,255,255,0.6)] rounded-2xl lg:rounded-4xl max-w-full">
      <section className="rounded-xl border border-[#E8EDF3] bg-white p-5 lg:p-6 w-full min-w-0 overflow-hidden max-w-full">
        <div className="hidden md:flex mb-0 flex-col gap-4">
          <div>
            <h2 className="text-2xl leading-8 font-medium text-[#0F121A]">{t?.title}</h2>
            <p className="mt-1 text-base leading-6 text-[#4F5C75]">
              {t?.description}
            </p>
          </div>
        </div>
        <div className="lg:mt-12 overflow-x-auto no-scrollbar lg:overflow-x-visible">
          <div className="lg:px-6">
            <ApplicationStepper tabs={tabLinks} />
          </div>
        </div>
      </section>

      <div className="w-full min-w-0 overflow-hidden max-w-full">
        <ApplicationLayoutClient>
          {children}
        </ApplicationLayoutClient>
      </div>
    </div>
  );

}
