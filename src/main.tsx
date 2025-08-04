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

const rootEl = document.getElementById("root");
if (!rootEl) {
  throw new Error("Root element not found");
}

createRoot(rootEl).render(
  <StrictMode>
    <BrowserRouter>
      <PrimeReactProvider>
        <ThemeProvider>
          <ToastProvider>
            <ThemeStyles />
            <App />
          </ToastProvider>
        </ThemeProvider>
      </PrimeReactProvider>
    </BrowserRouter>
  </StrictMode>,
);
