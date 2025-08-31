// src\app\bootstrap\SessionExpiredListener.tsx

import { useEffect, useRef } from "react";
import { useToast } from "@nihil_frontend/contexts/ToastContext";
import { onAuthSessionExpired } from "@nihil_frontend/shared/auth/events";
import { userApi } from "@nihil_frontend/api/api";
import { useNavigate, useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

export default function SessionExpiredListener() {
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  // prevent duplicate toasts / logout storms
  const firing = useRef(false);

  useEffect(() => {
    return onAuthSessionExpired(() => {
      if (firing.current) return;
      firing.current = true;

      // Tell the user right away
      toast.show({
        severity: "warn",
        summary: "Session expired",
        detail: "Signing you out…",
        life: 3000,
      });

      // Best-effort server logout (ignore errors)
      userApi
        .post("/auth/logout", null, { withCredentials: true })
        .then(() => {
          toast.show({
            severity: "success",
            summary: "Signed out",
            detail: "You have been signed out.",
            life: 3000,
          });
        })
        .catch(() => {
          // swallow: server might not be available
        });

      // Clear client-side queries/cache so we don't show stale private data
      try {
        // v5 supports clear(); if you'd rather be surgical, removeQueries({ queryKey: [...] })
        queryClient.clear();
      } catch {
        // no-op
      }

      // Redirect to login (preserve where we came from)
      const from = location.pathname + location.search + location.hash;
      void Promise.resolve(
        navigate("/login", { replace: true, state: { from } }),
      );

      // allow future events after a small cooldown
      setTimeout(() => {
        firing.current = false;
      }, 5000);
    });
  }, [toast, navigate, location, queryClient]);

  return null;
}
