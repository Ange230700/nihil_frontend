// src\contexts\ThemeContext.tsx

import { createContext } from "react";
import type { Theme } from "@nihil_frontend/types/theme";

export interface ThemeContextType {
  theme: Theme;
  toggle: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined,
);
