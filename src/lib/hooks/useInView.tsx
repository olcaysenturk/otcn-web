"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type UseInViewOptions = IntersectionObserverInit & {
  once?: boolean;
};

export function useInView<T extends HTMLElement>(options?: UseInViewOptions) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  const { once = true, root, rootMargin, threshold } = options ?? {};

  const ioOptions = useMemo(
    () => ({ root, rootMargin, threshold }),
    [root, rootMargin, threshold]
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(([entry]) => {
      const isIntersecting = entry.isIntersecting;
      if (isIntersecting) setInView(true);
      else if (!once) setInView(false);

      if (isIntersecting && once) io.disconnect();
    }, ioOptions);

    io.observe(el);
    return () => io.disconnect();
  }, [ioOptions, once]);

  return { ref, inView };
}
