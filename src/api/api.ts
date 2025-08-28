// src\api\api.ts

import type { AxiosInstance } from "axios";
import { createApi } from "@nihil_frontend/shared/api/client";
import { ensureCsrf } from "@nihil_frontend/shared/api/csrf";

const USER_BASE = import.meta.env.VITE_USER_SERVICE_API_URL;
const POST_BASE = import.meta.env.VITE_POST_SERVICE_API_URL;

// Prime CSRF cookie as early as possible (fire & forget)
void ensureCsrf(USER_BASE);

export const userApi: AxiosInstance = createApi(USER_BASE, USER_BASE);
export const postApi: AxiosInstance = createApi(POST_BASE, USER_BASE);
//            ^ uses same refresh pipeline, but refresh endpoint lives on user service
