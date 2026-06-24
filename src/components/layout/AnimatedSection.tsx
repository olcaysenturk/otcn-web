"use client";

import * as React from "react";

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
  const ref = React.useRef<HTMLElement>(null);
  const [shown, setShown] = React.useState(true);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const inViewNow = rect.top < window.innerHeight && rect.bottom > 0;
    if (inViewNow) return;

    setShown(false);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          if (once) io.disconnect();
        } else if (!once) {
          setShown(false);
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once]);

  return (
    <section
      ref={ref}
      className={[
        "transition-all duration-700 ease-out will-change-transform",
        shown ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </section>
  );
}
