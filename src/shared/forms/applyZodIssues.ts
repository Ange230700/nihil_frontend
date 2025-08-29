// src\shared\forms\applyZodIssues.ts

import type { FieldValues, Path, UseFormSetError } from "react-hook-form";

interface ZodIssue {
  path?: (string | number)[];
  message: string;
}

export function applyZodIssuesToForm<T extends FieldValues>(
  issues: ZodIssue[] | undefined,
  setError: UseFormSetError<T>,
) {
  if (!issues?.length) return;
  for (const issue of issues) {
    const field = (issue.path?.[0] ?? "") as Path<T>;
    if (field) setError(field, { type: "server", message: issue.message });
  }
}
