// src\components\StateCard.tsx

import { Button } from "primereact/button";
import { useId } from "react";

interface Props {
  title: string;
  description?: string;
  icon?: string; // PrimeIcons name, e.g. "pi pi-cloud-off"
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export default function StateCard({
  title,
  description,
  icon = "pi pi-info-circle",
  onRetry,
  retryLabel = "Retry",
  className,
}: Readonly<Props>) {
  const titleId = useId();
  return (
    <output
      aria-labelledby={titleId}
      aria-live="polite" // optional; <output> maps to role=status (polite) by default
      aria-atomic="true" // announce full message when it changes
      className={
        "flex flex-col items-center justify-center gap-2 rounded-md border p-6 text-center " +
        (className ?? "")
      }
      style={{ background: "var(--surface-card)" }}
    >
      <i className={`${icon} text-3xl`} aria-hidden />
      <h3 id={titleId} className="text-lg font-semibold">
        {title}
      </h3>
      {description ? (
        <p className="max-w-prose text-sm text-gray-500">{description}</p>
      ) : null}
      {onRetry ? (
        <Button
          type="button" // be explicit to avoid accidental form submits
          label={retryLabel}
          icon="pi pi-refresh"
          onClick={onRetry}
          className="mt-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
        />
      ) : null}
    </output>
  );
}
