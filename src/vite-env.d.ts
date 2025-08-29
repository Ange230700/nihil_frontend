// src\vite-env.d.ts

/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_USER_SERVICE_API_URL: string;
  readonly VITE_POST_SERVICE_API_URL: string;

  /** name of the CSRF cookie (defaults to "XSRF-TOKEN") */
  readonly VITE_CSRF_COOKIE_NAME?: string;

  /** header to send the CSRF token in (defaults to "X-CSRF-TOKEN") */
  readonly VITE_CSRF_HEADER_NAME?: string;

  // Add any other custom env vars here...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
