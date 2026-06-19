"use client";

import * as React from "react";
import { useInView } from "@/lib/hooks/useInView";

type Props = React.HTMLAttributes<HTMLElement> & {
  children: React.ReactNode;
  once?: boolean;
};

export function AnimatedSection({
  children,
  className = "",
  once = true,
  ...props
}: Props) {
  const { ref, inView } = useInView<HTMLElement>({ threshold: 0.15, once });

  return (
    <section
      ref={ref}
      className={[
        "transition-all duration-700 ease-out will-change-transform ",
        inView ? "translate-y-0" : "translate-y-6",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </section>
  );
}
