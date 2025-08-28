// src\app\bootstrap\CsrfBootstrap.tsx

import { useEffect } from "react";
import { ensureCsrf } from "@nihil_frontend/shared/api/csrf";

export default function CsrfBootstrap() {
  useEffect(() => {
    void ensureCsrf(import.meta.env.VITE_USER_SERVICE_API_URL);
  }, []);
  return null;
}
