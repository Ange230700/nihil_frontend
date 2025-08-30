// src\tests\setup.ts

import "@testing-library/jest-dom";
import { afterAll, afterEach, beforeAll } from "vitest";
import { server } from "@nihil_frontend/tests/msw/server";

// Polyfill matchMedia for components that may read it
if (!("matchMedia" in window)) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string): MediaQueryList =>
      ({
        matches: false,
        media: query,
        onchange: null,
        // legacy API no-ops (non-empty bodies to satisfy no-empty-function)
        addListener() {
          return;
        },
        removeListener() {
          return;
        },
        // modern API no-ops
        addEventListener() {
          return;
        },
        removeEventListener() {
          return;
        },
        dispatchEvent() {
          return false;
        },
      }) as unknown as MediaQueryList,
  });
}

// Start MSW
beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
});
afterEach(() => {
  server.resetHandlers();
});
afterAll(() => {
  server.close();
});

// Quieter console for expected network/log spam in tests (optional)
// vi.spyOn(console, 'error').mockImplementation(() => {});
