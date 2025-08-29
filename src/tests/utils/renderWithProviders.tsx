// src\tests\utils\renderWithProviders.tsx

import { render } from "@testing-library/react";
import { IntlProvider } from "react-intl";
import en from "@nihil_frontend/i18n/en.json";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function renderWithProviders(ui: React.ReactElement) {
  const qc = new QueryClient();
  return render(
    <IntlProvider locale="en" messages={en}>
      <QueryClientProvider client={qc}>{ui}</QueryClientProvider>
    </IntlProvider>,
  );
}
