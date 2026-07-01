"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type NavDropdownItemProps = {
  href: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  active?: boolean;
  onClick?: () => void;
};

export function NavDropdownItem({
  href,
  title,
  description,
  icon,
  active,
  onClick,
}: NavDropdownItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex w-full whitespace-nowrap rounded-[12px] p-[10px] transition-colors",
        icon ? "items-start gap-3" : "flex-col items-start gap-[6px]",
        active ? "bg-border/50" : "hover:bg-white/[0.04]",
      )}
    >
      {icon && (
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          {icon}
        </span>
      )}
      <span className="flex flex-col items-start gap-[6px]">
        <span
          className={cn(
            "text-[14px] font-medium leading-[18px]",
            active ? "text-primary" : "text-foreground",
          )}
        >
          {title}
        </span>
        {description && (
          <span className="text-[12px] font-normal leading-[16px] text-muted-foreground">
            {description}
          </span>
        )}
      </span>
    </Link>
  );
}
