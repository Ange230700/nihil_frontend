// src\shared\lazy.ts

import { lazy, type ComponentType, type LazyExoticComponent } from "react";

export function lazyWithPreload<T extends ComponentType<unknown>>(
  factory: () => Promise<{ default: T }>,
): LazyExoticComponent<T> & { preload: () => void } {
  const C = lazy(factory) as LazyExoticComponent<T> & { preload: () => void };
  C.preload = () => {
    void factory();
  };
  return C;
}
