// src\shared\forms\serverError.ts

export interface ZodIssue {
  path?: (string | number)[];
  message: string;
}

interface ServerErrorData {
  error?: {
    message?: string;
    issues?: ZodIssue[];
  };
}

export function isServerErrorData(x: unknown): x is ServerErrorData {
  if (!x || typeof x !== "object") return false;
  const err = (x as ServerErrorData).error;
  if (err && typeof err !== "object") return false;
  const issues = err?.issues;
  if (issues && !Array.isArray(issues)) return false;
  return true;
}
