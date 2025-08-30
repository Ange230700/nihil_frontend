// src/shared/api/client.ts

import axios, {
  AxiosError,
  AxiosHeaders,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";
import { getCookie } from "@nihil_frontend/shared/api/cookies";
import { CSRF_HEADER } from "@nihil_frontend/shared/api/csrf";
import { emitAuthSessionExpired } from "@nihil_frontend/shared/auth/events";

declare module "axios" {
  export interface AxiosRequestConfig {
    _retried?: boolean;
  }
}

interface RefreshState {
  refreshing: boolean;
  waiters: (() => void)[];
}
const refreshState: RefreshState = { refreshing: false, waiters: [] };

function onRefreshed() {
  refreshState.refreshing = false;
  refreshState.waiters.splice(0).forEach((fn) => {
    fn();
  });
}
function waitForRefresh(): Promise<void> {
  return new Promise((resolve) => refreshState.waiters.push(resolve));
}

/** Ensure headers is an AxiosHeaders instance, then return it */
function ensureAxiosHeaders(config: InternalAxiosRequestConfig): AxiosHeaders {
  if (!(config.headers instanceof AxiosHeaders)) {
    // Normalize any existing raw headers into an AxiosHeaders instance
    config.headers = AxiosHeaders.from(config.headers);
  }
  return config.headers as AxiosHeaders;
}

function getCsrfToken(): string | undefined {
  return getCookie(import.meta.env.VITE_CSRF_COOKIE_NAME ?? "XSRF-TOKEN");
}

async function doRefresh(userServiceBaseUrl: string, client: AxiosInstance) {
  try {
    const token = getCsrfToken();
    await client.post(`${userServiceBaseUrl}/auth/refresh`, null, {
      withCredentials: true,
      headers: token ? AxiosHeaders.from({ [CSRF_HEADER]: token }) : undefined,
    });
  } catch (e) {
    // 🔔 Tell the app that the session is gone
    emitAuthSessionExpired({ reason: "refresh_failed", error: e });
    throw e;
  } finally {
    onRefreshed();
  }
}

/**
 * Create an axios instance with:
 *  - withCredentials
 *  - CSRF header
 *  - refresh-on-401 (retry once)
 */
export function createApi(
  baseURL: string,
  userServiceBaseUrl: string,
): AxiosInstance {
  const client = axios.create({ baseURL, withCredentials: true });

  // Attach CSRF header on every request (type-safe)
  client.interceptors.request.use((config) => {
    const headers = ensureAxiosHeaders(config);
    const token = getCsrfToken();
    if (token) headers.set(CSRF_HEADER, token);
    return config;
  });

  // 401 -> refresh -> retry once
  client.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
      const status = error.response?.status;
      const original = (error.config ?? {}) as InternalAxiosRequestConfig & {
        _retried?: boolean;
      };

      if (status !== 401 || original._retried) {
        throw error;
      }

      if (refreshState.refreshing) {
        await waitForRefresh();
        original._retried = true;
        return client(original);
      }

      refreshState.refreshing = true;
      try {
        await doRefresh(userServiceBaseUrl, client);
      } catch {
        throw error; // propagate original 401 if refresh fails
      }

      original._retried = true;
      return client(original);
    },
  );

  return client;
}
