import type { ReactNode } from "react";
import { I18nProvider } from "@/lib/i18n/I18nProvider";
import { getMessages } from "@/lib/i18n/getMessages";
import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  type Locale,
} from "@/lib/i18n/config";
import { LocaleLangSetter } from "@/components/layout/LocaleLangSetter";
import { AuthHeader } from "@/components/auth/AuthHeader";

export default async function AuthLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const resolved = await params;
  const locale = (
    SUPPORTED_LOCALES.find((candidate) => candidate === resolved.locale) ??
    DEFAULT_LOCALE
  ) as Locale;

  const messages = await getMessages(locale, ["common", "auth"]);

  return (
    <I18nProvider locale={locale} messages={messages}>
      <LocaleLangSetter locale={locale} />
      <AuthHeader />
      <div className="relative flex min-h-screen bg-[#0D0F10] pt-20 text-[#F4F7F8]">
        {children}
      </div>
    </I18nProvider>
  );
}
