// src\pwa\PWAStatus.tsx

import { useEffect } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import { useToast } from "@nihil_frontend/contexts/ToastContext";

export default function PWAStatus() {
  const toast = useToast();

  const {
    offlineReady, // boolean | undefined
    needRefresh, // boolean | undefined
    updateServiceWorker, // (reloadPage?: boolean) => void
  } = useRegisterSW({
    onRegisteredSW(_url, reg) {
      // keep the SW fresh in background
      if (reg)
        setInterval(
          () => {
            // Handle the promise to satisfy no-floating-promises
            reg.update().catch((err: unknown) => {
              console.error("SW background update failed", err);
            });
          },
          60 * 60 * 1000,
        );
    },
    onRegisterError(err) {
      // non-fatal: just log

      console.error("SW registration failed", err);
    },
  });

  useEffect(() => {
    toast.show({
      severity: "success",
      summary: "Offline ready",
      detail: "Assets cached. You can use the app offline.",
    });
  }, [offlineReady, toast]);

  useEffect(() => {
    toast.show({
      severity: "info",
      summary: "Update available",
      detail: "A new version is ready. Refreshing…",
      life: 4000,
    });
    updateServiceWorker(true).catch((err: unknown) => {
      console.error("Failed to activate new SW", err);
    });
  }, [needRefresh, updateServiceWorker, toast]);

  return null;
}
