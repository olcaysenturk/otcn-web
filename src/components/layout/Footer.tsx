"use client";

import { ArrowRight } from "lucide-react";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/I18nProvider";

const COLUMNS: { title: string; links: string[] }[] = [
  { title: "About OTCN", links: ["About", "Careers", "Announcements", "Legal"] },
  { title: "Products", links: ["Exchange", "Buy Crypto"] },
  {
    title: "Buy Crypto",
    links: ["Buy USDT", "Buy Bitcoin", "Buy Ethereum", "Buy XRP", "Buy ADA"],
  },
  {
    title: "Price",
    links: ["Dogecoin Price", "Shiba Price", "Floki Price", "Bitcoin Price", "Ethereum Price"],
  },
  { title: "Support", links: ["Support Center", "Live", "Contact Us"] },
];

const SOCIALS: { src: string; alt: string }[] = [
  { src: "/assets/otcn/footer/social-facebook.svg", alt: "Facebook" },
  { src: "/assets/otcn/footer/social-twitter.svg", alt: "Twitter" },
  { src: "/assets/otcn/footer/social-instagram.svg", alt: "Instagram" },
  { src: "/assets/otcn/footer/social-linkedin.svg", alt: "LinkedIn" },
  { src: "/assets/otcn/footer/social-youtube.svg", alt: "YouTube" },
];

const CONTACT_APPS: { src: string; alt: string }[] = [
  { src: "/assets/otcn/footer/social-whatsapp.svg", alt: "WhatsApp" },
  { src: "/assets/otcn/footer/social-telegram.svg", alt: "Telegram" },
];

// Mock contact values (language-independent placeholder data).
const PHONE = "444 44 44";
const EMAIL = "info@otcn.com";

const LABEL = "font-sora text-[10px] font-semibold uppercase leading-3 tracking-[0.1em] text-foreground/50";
const VALUE = "font-sora text-[12px] font-semibold leading-[1.35] tracking-[-0.01em] text-foreground";

export function Footer() {
  const { t } = useI18n();
  const pathname = usePathname() || "/";
  const isAccountPage = pathname.includes("/account");

  const legalLinks = [
    t("footer.privacyPolicy"),
    t("footer.terms"),
    t("footer.userEngagement"),
    t("footer.cookiePolicy"),
  ];

  return (
    <footer
      className={[
        "relative w-full overflow-hidden bg-surface pb-5 pt-10",
        isAccountPage ? "hidden lg:block" : "",
      ].join(" ")}
    >
      {/* Brand watermark — Figma logo (52610-37703), 50% */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/otcn/footer/footer-logo.svg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 z-0 w-228.25 max-w-full opacity-50"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-348 flex-col gap-12 px-3">
        <div className="flex flex-col gap-20 xl:flex-row">
          {/* Link columns */}
          <div className="grid flex-1 grid-cols-2 gap-8 pt-6 sm:grid-cols-3 lg:grid-cols-5">
            {COLUMNS.map((col) => (
              <div key={col.title} className="flex flex-col gap-3">
                <h3 className="font-sora text-[18px] font-semibold leading-7 tracking-[-0.015em] text-foreground">
                  {col.title}
                </h3>
                <ul className="flex flex-col">
                  {col.links.map((link) => (
                    <li key={link} className="py-1">
                      <a
                        href="#"
                        className="font-sora text-[13px] font-normal leading-[1.4] tracking-[-0.015em] text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Contact card */}
          <div className="flex flex-col gap-8 rounded-[22px] bg-card/40 px-6.25 py-6 xl:w-90">
            <Button variant="secondary" size="sm" className="self-start rounded-[12px]">
              <ArrowRight />
              {t("footer.contactUs")}
            </Button>

            <div className="flex flex-col gap-5">
              <div className="flex gap-8">
                <div className="flex w-32.5 flex-col gap-2">
                  <span className={LABEL}>{t("footer.contact")}</span>
                  <div className="flex">
                    {CONTACT_APPS.map((app) => (
                      <span key={app.alt} className="flex size-8 items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={app.src} alt={app.alt} width={24} height={24} className="size-6" />
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className={LABEL}>{t("footer.socialMedia")}</span>
                  <div className="flex items-center">
                    {SOCIALS.map((s) => (
                      <span key={s.alt} className="flex size-8 items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={s.src} alt={s.alt} width={24} height={24} className="size-6 rounded-full" />
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-8">
                <div className="flex w-32.5 flex-col gap-2">
                  <span className={LABEL}>{t("footer.callCenter")}</span>
                  <span className={VALUE}>{PHONE}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className={LABEL}>{t("footer.email")}</span>
                  <span className={VALUE}>{EMAIL}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className={LABEL}>{t("footer.location")}</span>
                <span className={VALUE}>{t("footer.locationText")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <nav className="flex flex-wrap gap-x-5 gap-y-2">
            {legalLinks.map((link) => (
              <a
                key={link}
                href="#"
                className="font-sora text-[12px] font-normal tracking-[-0.01em] text-muted-foreground transition-colors hover:text-foreground"
              >
                {link}
              </a>
            ))}
          </nav>
          <span className="font-sora text-[12px] font-normal tracking-[-0.01em] text-foreground">
            {t("footer.rights")}
          </span>
        </div>
      </div>
    </footer>
  );
}
