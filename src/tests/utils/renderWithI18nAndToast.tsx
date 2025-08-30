// src\tests\utils\renderWithI18nAndToast.tsx

import { render } from "@testing-library/react";
import { IntlProvider } from "react-intl";
import en from "@nihil_frontend/i18n/en.json";
import { ToastProvider } from "@nihil_frontend/providers/ToastProvider";

export function renderWithI18nAndToast(ui: React.ReactElement) {
  return render(
    <IntlProvider locale="en" messages={en}>
      <ToastProvider>{ui}</ToastProvider>
    </IntlProvider>,
  );
}
