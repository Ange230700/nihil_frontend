// src\contexts\ToastContext.tsx

import { createContext, use } from "react";
import type { ToastMessage } from "primereact/toast";

export interface ToastContextType {
  show: (msg: Omit<ToastMessage, "life"> & { life?: number }) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(
  undefined,
);

export function useToast() {
  const ctx = use(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}
