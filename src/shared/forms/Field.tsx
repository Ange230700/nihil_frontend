// src\shared\forms\Field.tsx

import { type ReactNode } from "react";

export function Field({
  id,
  label,
  error,
  children,
}: Readonly<{
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}>) {
  const errId = `${id}-error`;
  return (
    <span className="min-w-[14rem]">
      <label className="block text-sm" htmlFor={id}>
        {label}
      </label>
      {children}
      {error && (
        <small
          id={errId}
          role="alert"
          aria-label={label}
          className="block pt-1 text-sm text-red-600"
        >
          {error}
        </small>
      )}
    </span>
  );
}
