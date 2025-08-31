// src\tests\types\axios-http-adapter.d.ts

// Minimal typings for Axios' internal Node adapter used only in tests.
declare module "axios/lib/adapters/http.js" {
  import type { AxiosAdapter } from "axios";
  const adapter: AxiosAdapter;
  export default adapter;
}

declare module "axios/lib/adapters/http" {
  import type { AxiosAdapter } from "axios";
  const adapter: AxiosAdapter;
  export default adapter;
}
