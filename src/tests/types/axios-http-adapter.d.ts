// src\tests\types\axios-http-adapter.d.ts

import type { AxiosAdapter } from "axios";

declare module "axios/lib/adapters/http.js" {
  const adapter: AxiosAdapter;
  export default adapter;
}
