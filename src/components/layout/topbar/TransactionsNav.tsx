"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { NavDropdownCard } from "./NavDropdownCard";
import { NavDropdownItem } from "./NavDropdownItem";

export type TransactionsNavLink = {
  href: string;
  title: string;
  description: string;
};

export type TransactionsNavProps = {
  label: string;
  active?: boolean;
  links: TransactionsNavLink[];
  onNavigate?: () => void;
};

export function TransactionsNav({ label, active, links, onNavigate }: TransactionsNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        type="button"
        className={cn(
          "relative flex h-[42px] items-center gap-1.5 whitespace-nowrap text-[16px] font-medium text-white/90 transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-[#8F84FF] xl:gap-2",
          active ? "text-[#9B91FF] after:w-full" : "hover:text-white after:w-0",
        )}
      >
        {label}
        <ChevronDown
          className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 pt-2">
          <NavDropdownCard>
            {links.map((link) => (
              <NavDropdownItem
                key={link.href}
                href={link.href}
                title={link.title}
                description={link.description}
                onClick={() => {
                  setIsOpen(false);
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
