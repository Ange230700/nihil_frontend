// src\contexts\ToastProvider.tsx

import { useRef, useCallback, useMemo } from "react";
import type { ReactNode } from "react";
import { Toast } from "primereact/toast";
import type { ToastMessage } from "primereact/toast";
import { ToastContext } from "@nihil_frontend/contexts/ToastContext";

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const toast = useRef<Toast>(null);

  // stable callback to avoid re-creating on every render
  const show = useCallback(
    (msg: Omit<ToastMessage, "life"> & { life?: number } = {}) => {
      toast.current?.show({ life: msg.life ?? 3000, ...msg });
    },
    [],
  );

  // memoized context value to prevent unnecessary provider updates
  const contextValue = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext value={contextValue}>
      <Toast ref={toast} position="top-right" />
      {children}
    </ToastContext>
  );
};
