"use client";

import Link from "next/link";

export type NavDropdownItemProps = {
  href: string;
  title: string;
  description: string;
  onClick?: () => void;
};

export function NavDropdownItem({ href, title, description, onClick }: NavDropdownItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex w-full flex-col items-start justify-center gap-[6px] whitespace-nowrap rounded-[12px] p-[10px] transition-colors hover:bg-white/[0.04]"
    >
      <span className="text-[14px] font-medium leading-[18px] text-[#F4F7F8]">
        {title}
      </span>
      <span className="text-[12px] font-normal leading-[16px] text-[#C5C9CC]">
        {description}
      </span>
    </Link>
  );
}
