import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type NavDropdownCardProps = {
  className?: string;
  children: ReactNode;
};

export function NavDropdownCard({ className, children }: NavDropdownCardProps) {
  return (
    <div
      className={cn(
        "flex w-max flex-col items-start gap-[12px] rounded-[20px] border border-solid border-[#3A4043] bg-[#0E0F10] p-[12px] drop-shadow-[0px_2px_4px_rgba(58,64,67,0.2)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
