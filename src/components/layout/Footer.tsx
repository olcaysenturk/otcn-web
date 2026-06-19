"use client";

import { ArrowRight } from "lucide-react";
import { usePathname } from "next/navigation";

const footerColumns = [
  {
    title: "About OTCN",
    links: ["About", "Careers", "Announcements", "Legal"],
  },
  {
    title: "Products",
    links: ["Exchange", "Buy Crypto", "OTC"],
  },
  {
    title: "Buy Crypto",
    links: ["Buy USDT", "Buy Bitcoin", "Buy Ethereum", "Buy XRP", "Buy ADA"],
  },
  {
    title: "Price",
    links: ["Dogecoin Price", "Shiba Price", "Floki Price", "Bitcoin Price", "Ethereum Price"],
  },
  {
    title: "Support",
    links: ["Support Center", "Live", "Contact Us"],
  },
] as const;

const socialLinks = ["f", "x", "ig", "in", "yt"] as const;

export function Footer() {
  const pathname = usePathname() || "/";
  const isAccountPage = pathname.includes("/account");

  return (
    <footer
      className={[
        "relative w-full overflow-hidden bg-[#182121] px-6 pb-8 pt-14 text-white md:px-12 md:pb-10 md:pt-20",
        isAccountPage ? "hidden lg:block" : "",
      ].join(" ")}
    >
      <div className="pointer-events-none absolute -bottom-8 left-[-24px] select-none text-[120px] font-black leading-none text-black/35 md:text-[190px] lg:text-[250px]">
        OTCN
      </div>

      <div className="relative z-10 mx-auto grid max-w-[1392px] gap-12 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_520px]">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="text-lg font-medium text-white">{column.title}</h3>
              <ul className="mt-8 space-y-5 text-sm text-white/55">
                {column.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="transition hover:text-white">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="rounded-[28px] bg-[#101414] p-7 md:p-9">
          <button
            type="button"
            className="inline-flex h-11 items-center gap-3 rounded-[12px] bg-white px-5 text-sm font-bold text-[#101414] transition hover:bg-[#C8FF00]"
          >
            <ArrowRight className="h-4 w-4" />
            Contact Us
          </button>

          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/35">Contact</div>
              <div className="mt-4 flex gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#25D366] text-xs font-bold">w</span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2AABEE] text-xs font-bold">t</span>
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/35">Social Media</div>
              <div className="mt-4 flex flex-wrap gap-2">
                {socialLinks.map((item) => (
                  <span key={item} className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-[11px] font-bold text-white/80">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/35">Call Center</div>
              <div className="mt-4 text-sm text-white">444 44 44</div>
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/35">E-mail</div>
              <div className="mt-4 text-sm text-white">otcn@mail.com</div>
            </div>

            <div className="sm:col-span-2">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/35">Location</div>
              <p className="mt-4 max-w-md text-sm leading-5 text-white">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto mt-20 flex max-w-[1392px] justify-end text-xs text-white/65">
        Designed by Switas 2025. All rights reserved
      </div>
    </footer>
  );
}
