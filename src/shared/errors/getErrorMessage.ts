// src\shared\errors\getErrorMessage.ts

import axios from "axios";

export function getErrorMessage(
  err: unknown,
  fallback = "Failed to load users",
): string {
  const fromAxios = pickFromAxios(err);
  if (fromAxios) return fromAxios;

  const fromPlain = pickFromPlainError(err);
  if (fromPlain) return fromPlain;

  return fallback;
}

/* ----------------- helpers ----------------- */

function pickFromAxios(err: unknown): string | null {
  if (!axios.isAxiosError(err)) return null;

  // 1) axios top-level message
  if (isNonEmptyString(err.message)) return err.message;

  // 2) response.data common shapes
  const data = err.response?.data as unknown;
  const msg = pickFromData(data);
  return msg ?? null;
}

function pickFromPlainError(err: unknown): string | null {
  return err instanceof Error && isNonEmptyString(err.message)
    ? err.message
    : null;
}

/**
 * Tries to extract a human readable message from typical backend payloads:
 * - { error: { message | detail } }
 * - { message | detail }
 * - { errors: [ "str" | { msg|message|detail } ] }
 * - { error: { errors: [...] } }
 */
function pickFromData(data: unknown): string | null {
  if (!isRecord(data)) return null;

  const nested = isRecord(data.error) ? data.error : data;

  // Prefer direct message/detail
  if (isNonEmptyString((nested as { message?: unknown }).message))
    return String((nested as { message?: unknown }).message);

  if (isNonEmptyString((nested as { detail?: unknown }).detail))
    return String((nested as { detail?: unknown }).detail);

  // Try arrays: errors or issues (fallback)
  const arraysToCheck: unknown[][] = [];
  const maybeErrors = (nested as { errors?: unknown }).errors;
  const maybeIssues = (nested as { issues?: unknown }).issues; // e.g., zod-like

  if (Array.isArray(maybeErrors)) arraysToCheck.push(maybeErrors);
  if (Array.isArray(maybeIssues)) arraysToCheck.push(maybeIssues);

  // Also allow top-level arrays if some APIs return array as the payload
  if (Array.isArray(data)) arraysToCheck.push(data);

  for (const arr of arraysToCheck) {
    const first = pickFirstMessageFromArray(arr);
    if (first) return first;
  }

  return null;
}

/** Extract a first string message from mixed arrays like:
 * ["msg", { msg: "m" }, { message: "m" }, { detail: "m" }]
 */
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
