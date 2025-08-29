// src\contexts\I18nContext.tsx

import { createContext } from "react";
import type { Locale } from "@nihil_frontend/i18n/locales";

export interface I18nCtx {
  locale: Locale;
  setLocale: (l: Locale) => void;
}

export const I18nContext = createContext<I18nCtx | undefined>(undefined);
