// src\shared\prefetch.ts

import { useEffect } from "react";

export function usePrefetchOnVisible(
  ref: React.RefObject<Element>,
  prefetch: () => void,
  options?: IntersectionObserverInit,
) {
  useEffect(() => {
    const el = ref.current;
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          prefetch();
          io.disconnect();
        }
      },
      { rootMargin: "200px", ...options },
    );
    io.observe(el);
    return () => {
      io.disconnect();
    };
  }, [prefetch, ref, options]);
}

export function prefetchOnHover<T extends HTMLElement>(prefetch: () => void) {
  return {
    onMouseEnter: () => {
      prefetch();
    },
    onFocus: () => {
      prefetch();
    },
    onTouchStart: () => {
      prefetch();
    },
  } as React.HTMLAttributes<T>;
}
