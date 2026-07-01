import type { Metadata } from "next";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/lib/theme/ThemeProvider";
import { DEFAULT_LOCALE } from "@/lib/i18n/config";
import { SessionChecker } from "@/components/auth/SessionChecker";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "Nextbit OTC",
  description:
    "Nextbit OTC ile kurumsal kripto alım satım işlemleri. Yüksek hacimli işlemler için özel fiyat, hızlı mutabakat ve uzman destek.",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
    languages: {
      tr: "/",
      en: "/en",
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={DEFAULT_LOCALE} data-scroll-behavior="smooth">
      <head>
        <link
          rel="preload"
          href="/fonts/Satoshi-Variable.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-theme-bg font-satoshi">
        <ThemeProvider>
          <SessionChecker />
          {children}
          <Toaster
            richColors
            closeButton
            position="bottom-right"
            expand
            visibleToasts={4}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
