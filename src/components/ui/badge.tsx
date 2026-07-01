import { ChevronDown, ChevronUp } from "lucide-react";

import { cn } from "@/lib/utils";

type BadgeProps = {
  direction?: "up" | "down";
  soft?: boolean;
  children: React.ReactNode;
  className?: string;
};

export function Badge({
  direction = "up",
  soft = false,
  children,
  className,
}: BadgeProps) {
  const up = direction === "up";

  const styles = soft
    ? up
      ? "border border-[#27E9A6]/50 bg-[#27E9A6]/10 text-[#27E9A6]"
      : "border border-[#FF4D6D]/50 bg-[#FF4D6D]/[0.06] text-[#FF4D6D]"
    : up
      ? "bg-[#27E9A6] text-[#0E0F10]"
      : "bg-[#FF4D6D] text-[#F4F7F8]";

  const Icon = up ? ChevronUp : ChevronDown;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none",
        styles,
        className,
      )}
    >
      <Icon className="size-2.5" strokeWidth={3} />
      {children}
    </span>
  );
}
