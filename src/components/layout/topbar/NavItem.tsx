"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { NavDropdownCard } from "./NavDropdownCard";
import { NavDropdownItem } from "./NavDropdownItem";

export type NavDropdownEntry = {
  href: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  active?: boolean;
};

type NavItemCommon = {
  label: string;
  active?: boolean;
  className?: string;
};

export type NavItemProps =
  | (NavItemCommon & { variant?: "link"; href: string; onClick?: () => void })
  | (NavItemCommon & { variant: "button"; onClick: () => void; icon?: ReactNode })
  | (NavItemCommon & { variant: "dropdown"; items: NavDropdownEntry[]; onNavigate?: () => void });

function triggerClass(active?: boolean, className?: string) {
  return cn(
    "relative flex h-[42px] items-center gap-1.5 whitespace-nowrap text-[16px] font-semibold leading-none tracking-[-0.01em] text-foreground outline-none transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-primary",
    active ? "text-primary after:w-full" : "hover:text-white after:w-0",
    className,
  );
}

export function NavItem(props: NavItemProps) {
  if (props.variant === "dropdown") {
    return <DropdownNavItem {...props} />;
  }

  if (props.variant === "button") {
    return (
      <button
        type="button"
        onClick={props.onClick}
        className={triggerClass(props.active, props.className)}
      >
        {props.icon}
        {props.label}
      </button>
    );
  }

  return (
    <Link
      href={props.href}
      onClick={props.onClick}
      className={triggerClass(props.active, props.className)}
    >
      {props.label}
    </Link>
  );
}

function DropdownNavItem({
  label,
  active,
  items,
  onNavigate,
  className,
}: NavItemCommon & { items: NavDropdownEntry[]; onNavigate?: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button type="button" aria-expanded={open} className={triggerClass(active, className)}>
        {label}
        <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 pt-2">
          <NavDropdownCard>
            {items.map((item) => (
              <NavDropdownItem
                key={item.href}
                href={item.href}
                title={item.title}
                description={item.description}
                icon={item.icon}
                active={item.active}
                onClick={() => {
                  setOpen(false);
                  onNavigate?.();
                }}
              />
            ))}
          </NavDropdownCard>
        </div>
      )}
    </div>
  );
}
