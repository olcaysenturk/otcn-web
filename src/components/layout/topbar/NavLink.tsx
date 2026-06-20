"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";

export type NavLinkProps = {
  href: string;
  label: string;
  active?: boolean;
  onClick?: () => void;
};

export function NavLink({ href, label, active, onClick }: NavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "relative flex h-[42px] items-center whitespace-nowrap text-[16px] font-medium text-white/90 transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-[#8F84FF]",
        active ? "text-[#9B91FF] after:w-full" : "hover:text-white after:w-0",
      )}
    >
      {label}
    </Link>
  );
}
