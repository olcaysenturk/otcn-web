import { cn } from "@/lib/utils";
import type { LightSectionProps } from "@/types/home";

export function LightSection({ children, className, innerClassName }: LightSectionProps) {
  return (
    <section className={cn("overflow-hidden rounded-[28px] bg-[#0e0f10] shadow-[0_2px_8px_0.3px_rgba(58,64,67,0.2)]", className)}>
      <div className={cn("bg-transparent", innerClassName)}>
        {children}
      </div>
    </section>
  );
}
