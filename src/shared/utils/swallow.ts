// src\shared\utils\swallow.ts

export const swallow =
  <A extends unknown[]>(fn: (...args: A) => Promise<unknown>) =>
  (...args: A) => {
    void fn(...args);
  };
