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

function pickFromData(data: unknown): string | null {
  if (!isRecord(data)) return null;

  // prefer nested { error: { message | detail } }
  const nested = isRecord(data.error) ? data.error : data;

  if (isNonEmptyString(nested.message)) return nested.message;
  if (isNonEmptyString((nested as { detail?: unknown }).detail))
    return String((nested as { detail?: unknown }).detail);

  return null;
}

/* ----------------- tiny type guards ----------------- */

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}
