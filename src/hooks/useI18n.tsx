// src\hooks\useI18n.tsx

import {
  I18nContext,
  type I18nCtx,
} from "@nihil_frontend/contexts/I18nContext";
import { use } from "react";

export function useI18n(): I18nCtx {
  const ctx = use(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
