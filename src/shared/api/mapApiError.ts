// src\shared\api\mapApiError.ts

import axios from "axios";

export interface ToastError {
  severity: "warn" | "error" | "info";
  summary: string;
  detail: string;
}

/** Narrower check for your backend's `{ error: { message: string } }` shape */
function hasBackendErrorMessage(
  x: unknown,
): x is { error: { message: string } } {
  if (typeof x !== "object" || x === null) return false;

  const maybeObj = x as { error?: unknown };
  if (typeof maybeObj.error !== "object" || maybeObj.error === null)
    return false;

  const err = maybeObj.error as { message?: unknown };
  return typeof err.message === "string";
}

function severityFromStatus(status?: number): "warn" | "error" | "info" {
  if (!status) return "error";

  if (status >= 500) return "error"; // server-side
  if (status === 401 || status === 403) return "warn"; // auth/permission
  if (status >= 400) return "warn"; // client errors
  return "info"; // fallback / non-error
}

/**
 * Normalize API errors into a shape usable for toasts.
 */
export function mapApiError(err: unknown): ToastError {
  // Axios error
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const data = err.response?.data as unknown;

    if (hasBackendErrorMessage(data)) {
      return {
        severity: severityFromStatus(status),
        summary: "Error",
        detail: data.error.message,
      };
    }

    return {
      severity: severityFromStatus(status),
      summary: "Network Error",
      detail: err.message || "Request failed",
    };
  }

  // Native Error
  if (err instanceof Error) {
    return {
      severity: "error",
      summary: "Error",
      detail: err.message,
    };
  }

  // Fallback
  return {
    severity: "error",
    summary: "Error",
    detail: "An unknown error occurred",
  };
}
