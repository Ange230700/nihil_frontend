// src\vite-env.d.ts

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_USER_SERVICE_API_URL: string;
  readonly VITE_POST_SERVICE_API_URL: string;
  // Add any other custom env vars here...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
