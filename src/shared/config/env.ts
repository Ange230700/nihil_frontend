// src\shared\config\env.ts

import { z } from "zod";

/** Define exactly what your app needs at runtime */
const EnvSchema = z.object({
  VITE_USER_SERVICE_API_URL: z.url(),
  VITE_POST_SERVICE_API_URL: z.url(),
});

/** Optional: redact very long values when printing the snapshot */
const redact = (v: unknown) =>
  typeof v === "string" && v.length > 80
    ? `${v.slice(0, 30)}…${v.slice(-8)}`
    : String(v);

/**
 * Parse once at module load.
 * - In dev: Vite overlay shows the error nicely.
 * - In prod: app fails fast with a descriptive error (visible in console / error reporters).
 */
const parsed = EnvSchema.safeParse(import.meta.env);

if (!parsed.success) {
  const issues = parsed.error.issues; // typed as ZodIssue[]
  const lines: string[] = issues.map(
    (i) => `- ${i.path.join(".")}: ${i.message}`,
  );

  // Helpful snapshot of current VITE_* values
  const envEntries = Object.entries(import.meta.env as Record<string, unknown>);
  const snapshot = envEntries
    .filter(([k]) => k.startsWith("VITE_"))
    .map(([k, v]) => `  ${k}=${redact(v)}`)
    .join("\n");

  const expectedKeys = Object.keys(EnvSchema.shape)
    .map((k) => `  ${k}`)
    .join("\n");

  throw new Error(
    [
      "❌ Invalid environment configuration.",
      "Fix your .env/.env.[mode] or deployment env. Issues:",
      ...lines,
      "",
      "Current VITE_* snapshot:",
      snapshot || "  (no VITE_* variables found)",
      "",
      "Expected keys:",
      expectedKeys,
    ].join("\n"),
  );
}

/** Use this everywhere instead of import.meta.env */
export const env = parsed.data;
export type Env = typeof env;
