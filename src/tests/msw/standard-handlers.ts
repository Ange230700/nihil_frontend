// src\tests\msw\standard-handlers.ts

import { http, HttpResponse } from "msw";

/**
 * Handlers that are safe for all tests.
 * We stub the CSRF bootstrap call so tests don't error/noise.
 */
export const defaultHandlers = [
  // Accept any origin + both '/auth/csrf' and '/api/auth/csrf'
  http.get("*/auth/csrf", () => new HttpResponse(null, { status: 204 })),
  http.get("*/api/auth/csrf", () => new HttpResponse(null, { status: 204 })),
];
