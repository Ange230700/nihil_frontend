// src\shared\auth\events.ts

export const AUTH_SESSION_EXPIRED = "auth:session-expired" as const;

export interface AuthSessionExpiredDetail {
  reason: "refresh_failed" | "unauthorized";
  error?: unknown;
}

export function emitAuthSessionExpired(
  detail: AuthSessionExpiredDetail = { reason: "refresh_failed" },
): void {
  window.dispatchEvent(
    new CustomEvent<AuthSessionExpiredDetail>(AUTH_SESSION_EXPIRED, { detail }),
  );
}

export function onAuthSessionExpired(
  handler: (e: CustomEvent<AuthSessionExpiredDetail>) => void,
): () => void {
  // TS-friendly wrapper for add/removeEventListener
  const listener = ((ev: Event) => {
    handler(ev as CustomEvent<AuthSessionExpiredDetail>);
  }) as EventListener;
  window.addEventListener(AUTH_SESSION_EXPIRED, listener);
  return () => {
    window.removeEventListener(AUTH_SESSION_EXPIRED, listener);
  };
}
