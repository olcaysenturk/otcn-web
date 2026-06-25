import { cn } from "@/lib/utils";
import type { LightSectionProps } from "@/types/home";

export function LightSection({ children, className, innerClassName }: LightSectionProps) {
  return (
    <section className={cn("overflow-hidden rounded-[28px] bg-card shadow-card-dark", className)}>
      <div className={cn("bg-transparent", innerClassName)}>
        {children}
      </div>
    </section>
  );
}
