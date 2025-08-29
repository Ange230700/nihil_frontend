// src\main.tsx

import interWoff2Url from "@fontsource-variable/inter/files/inter-latin-wght-normal.woff2?url";

const link = document.createElement("link");
link.rel = "preload";
link.as = "font";
link.type = "font/woff2";
link.href = interWoff2Url;
link.crossOrigin = "";
document.head.appendChild(link);

import "@fontsource-variable/inter/wght.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import ThemeStyles from "@nihil_frontend/components/ThemeStyles.tsx";
import { ThemeProvider } from "@nihil_frontend/providers/ThemeProvider.tsx";
import { ToastProvider } from "@nihil_frontend/providers/ToastProvider.tsx";
import CsrfBootstrap from "@nihil_frontend/app/bootstrap/CsrfBootstrap";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider } from "react-router-dom";
import { router } from "@nihil_frontend/routes/router";
import { auditThemeContrast } from "@nihil_frontend/a11y/contrast";
import { I18nProvider } from "@nihil_frontend/providers/I18nProvider";
import "@nihil_frontend/shared/config/env";

const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const rootEl = document.getElementById("root");
if (!rootEl) {
  throw new Error("Root element not found");
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
  },
});

if (import.meta.env.DEV) {
  // wait for theme link injection to resolve computed vars
  requestAnimationFrame(() => {
    auditThemeContrast();
  });
}

createRoot(rootEl).render(
  <StrictMode>
    <PrimeReactProvider value={{ ripple: !prefersReducedMotion }}>
      <I18nProvider>
        <ThemeProvider>
          <ToastProvider>
            <QueryClientProvider client={queryClient}>
              <CsrfBootstrap />
              <ThemeStyles />
              <RouterProvider router={router} />
              <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
          </ToastProvider>
        </ThemeProvider>
      </I18nProvider>
    </PrimeReactProvider>
  </StrictMode>,
);
