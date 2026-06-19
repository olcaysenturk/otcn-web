import { AuthGate } from "@/components/auth/guards/AuthGate";
import type { Locale } from "@/lib/i18n/config";
import {
  I18nProvider,
  type Messages,
} from "@/lib/i18n/I18nProvider";
import dynamic from "next/dynamic";
import { cookies } from "next/headers";
import type { ReactNode } from "react";
import { ModalRoot } from "../modals/ModalRoot";
import { DataInitializer } from "./DataInitializer";
import { Footer } from "./Footer";
import { LocaleLangSetter } from "./LocaleLangSetter";

const Topbar = dynamic(async () => {
  const mod = await import("./TopBar");
  return { default: mod.Topbar };
});

type AppShellProps = {
  children: ReactNode;
  locale: Locale;
  messages: Messages;
  requireAuth?: boolean;
};

export async function AppShell({ children, locale, messages, requireAuth = true }: AppShellProps) {
  const cookieStore = await cookies();
  // TEMP DEV BYPASS — remove the `|| true` to restore real auth check
  const isAuthenticated = Boolean(
    cookieStore.get("access_token")?.value,
  ) || true;

  return (
    <I18nProvider locale={locale} messages={messages}>
      <LocaleLangSetter locale={locale} />
      <DataInitializer locale={locale} />
      <AuthGate isAuthenticated={isAuthenticated} requireAuth={requireAuth}>
        <div className="flex min-h-screen w-full max-w-full overflow-x-hidden">
          <div className="flex flex-1 flex-col min-w-0">
            <Topbar isAuthenticated={isAuthenticated} />
            <main className="mx-auto w-full max-w-348 min-w-0 overflow-x-hidden px-3 py-3 ">
              {children}
            </main>
            <Footer />
            <ModalRoot />
          </div>
        </div>
      </AuthGate>
    </I18nProvider>
  );
}
