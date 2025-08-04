// src\hooks\useTheme.tsx

import { use } from "react";
import { ThemeContext } from "@nihil_frontend/contexts/ThemeContext";

export default function useTheme() {
  const ctx = use(ThemeContext);
  if (!ctx) throw new Error("useTheme must be inside ThemeProvider");
  return ctx;
}
