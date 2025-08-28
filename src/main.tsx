// src\main.tsx

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import ThemeStyles from "@nihil_frontend/components/ThemeStyles.tsx";
import { ThemeProvider } from "@nihil_frontend/providers/ThemeProvider.tsx";
import App from "./App.tsx";
import { ToastProvider } from "@nihil_frontend/providers/ToastProvider.tsx";
import CsrfBootstrap from "@nihil_frontend/app/bootstrap/CsrfBootstrap";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

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

createRoot(rootEl).render(
  <StrictMode>
    <BrowserRouter>
      <PrimeReactProvider>
        <ThemeProvider>
          <ToastProvider>
            <QueryClientProvider client={queryClient}>
              <CsrfBootstrap />
              <ThemeStyles />
              <App />
              <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
          </ToastProvider>
        </ThemeProvider>
      </PrimeReactProvider>
    </BrowserRouter>
  </StrictMode>,
);
