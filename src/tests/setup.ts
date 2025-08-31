// src\tests\setup.ts

import "@testing-library/jest-dom";
import { afterAll, afterEach, beforeAll, vi, expect } from "vitest";
import axios, { type AxiosAdapter } from "axios";
import { server } from "@nihil_frontend/tests/msw/server";

/* ---------- Force Axios to Node HTTP adapter (no XHR in jsdom) ---------- */
try {
  // Type the imported module to avoid "any" + unsafe member access
  interface HttpAdapterModule {
    default: AxiosAdapter;
  }

  const mod = (await import("axios/lib/adapters/http.js")) as HttpAdapterModule;
  const httpAdapter = mod.default; // typed -> no "unsafe-member-access"
  axios.defaults.adapter = httpAdapter;
} catch {
  // Fallback: remove XHR so Axios picks Node adapter automatically
  try {
    // @ts-expect-error test override
    globalThis.XMLHttpRequest = undefined;
  } catch {
    // ignore
  }
}

/* ---------------- matchMedia polyfill (for components) ------------------ */
if (!("matchMedia" in window)) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string): MediaQueryList =>
      ({
        matches: false,
        media: query,
        onchange: null,
        addListener() {
          // noop
        },
        removeListener() {
          // noop
        },
        addEventListener() {
          // noop
        },
        removeEventListener() {
          // noop
        },
        dispatchEvent() {
          return false;
        },
      }) as unknown as MediaQueryList,
  });
}

/* --------------------- MSW lifecycle + pending drain -------------------- */
let pending = 0;

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
  server.events.on("request:start", () => {
    pending += 1;
  });
  server.events.on("request:end", () => {
    pending -= 1;
  });
  server.events.on("request:unhandled", ({ request }) => {
    throw new Error(
      `Unhandled request in test: ${request.method} ${request.url}`,
    );
  });
});

afterEach(async () => {
  // Let microtasks flush
  await new Promise((r) => setTimeout(r, 0));
  // Ensure no inflight requests before resetting handlers
  await vi.waitFor(
    () => {
      expect(pending).toBe(0);
    },
    { timeout: 2000 },
  );
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

// Optional: silence expected console noise
// vi.spyOn(console, "error").mockImplementation(() => {});
