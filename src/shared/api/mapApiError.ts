// src\shared\api\mapApiError.ts

import axios from "axios";

export interface ToastError {
  severity: "warn" | "error" | "info";
  summary: string;
  detail: string;
}

function severityFromStatus(status?: number): "warn" | "error" | "info" {
  if (!status) return "error";
  if (status >= 500) return "error";
  if (status === 401 || status === 403) return "warn";
  if (status >= 400) return "warn";
  return "info";
}

/**
 * Normalize API errors into a shape usable for toasts.
 * Now supports { errors: [...] } arrays (strings or { msg|message|detail }).
 */
export function mapApiError(err: unknown): ToastError {
  // Axios error
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const data = err.response?.data as unknown;

    const extracted =
      extractBackendMessage(data) ??
      (isNonEmptyString(err.message) ? err.message : null);

    return {
      severity: severityFromStatus(status),
      summary: extracted ? "Error" : "Network Error",
      detail: extracted ?? "Request failed",
    };
  }

  // Native Error
  if (err instanceof Error && isNonEmptyString(err.message)) {
    return { severity: "error", summary: "Error", detail: err.message };
  }

  // Fallback
  return {
    severity: "error",
    summary: "Error",
    detail: "An unknown error occurred",
  };
}

/* ----------------- extraction helpers ----------------- */

function extractBackendMessage(data: unknown): string | null {
  if (!isRecord(data)) {
    // Some APIs return an array of errors directly
    if (Array.isArray(data)) return pickFirstMessageFromArray(data);
    return null;
  }

  const nested = isRecord(data.error) ? data.error : data;

  // Direct message / detail
  if (isNonEmptyString((nested as { message?: unknown }).message))
    return String((nested as { message?: unknown }).message);

  if (isNonEmptyString((nested as { detail?: unknown }).detail))
    return String((nested as { detail?: unknown }).detail);

  // Arrays under errors/issues (common shapes)
  const maybeErrors = (nested as { errors?: unknown }).errors;
  if (Array.isArray(maybeErrors)) {
    const m = pickFirstMessageFromArray(maybeErrors);
    if (m) return m;
  }

  const maybeIssues = (nested as { issues?: unknown }).issues;
  if (Array.isArray(maybeIssues)) {
    const m = pickFirstMessageFromArray(maybeIssues);
    if (m) return m;
  }

  return null;
}

function pickFirstMessageFromArray(arr: unknown[]): string | null {
  for (const item of arr) {
    if (isNonEmptyString(item)) return item;

    if (isRecord(item)) {
      const obj = item as {
        msg?: unknown;
        message?: unknown;
        detail?: unknown;
      };

      if (isNonEmptyString(obj.msg)) return String(obj.msg);
      if (isNonEmptyString(obj.message)) return String(obj.message);
      if (isNonEmptyString(obj.detail)) return String(obj.detail);
    }
  }
  return null;
}

/* ----------------- tiny type guards ----------------- */

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}
