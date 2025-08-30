// src\shared\api\unwrap.ts

export interface Envelope {
  status?: string;
  data: unknown;
}

export const hasData = (v: unknown): v is { data: unknown } =>
  typeof v === "object" &&
  v !== null &&
  "data" in (v as Record<string, unknown>);

export function unwrapData(x: unknown): unknown {
  return hasData(x) ? (x as Envelope).data : x;
}
