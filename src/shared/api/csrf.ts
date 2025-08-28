// src\shared\api\csrf.ts

import axios from "axios";

const CSRF_COOKIE: string =
  import.meta.env.VITE_CSRF_COOKIE_NAME ?? "XSRF-TOKEN";

export const CSRF_HEADER: string =
  import.meta.env.VITE_CSRF_HEADER_NAME ?? "X-CSRF-TOKEN";

/**
 * Ensure the CSRF cookie is set by hitting the backend once.
 * Call this early (app bootstrap).
 */
export async function ensureCsrf(userServiceBaseUrl: string): Promise<void> {
  // If cookie already present, skip
  if (document.cookie.includes(`${CSRF_COOKIE}=`)) return;
  try {
    await axios.get(`${userServiceBaseUrl}/auth/csrf`, {
      withCredentials: true,
    });
  } catch {
    // Non-fatal; interceptor will still work if cookie appears later.
  }
}
