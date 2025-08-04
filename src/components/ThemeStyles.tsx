// src\components\ThemeStyles.tsx

import { useEffect } from "react";
import useTheme from "@nihil_frontend/hooks/useTheme";

export default function ThemeStyles() {
  const { theme } = useTheme();

  useEffect(() => {
    // remove the old theme link if present
    const prev = document.getElementById("pr-theme") as HTMLLinkElement | null;
    if (prev) prev.remove();

    // create & append the new one
    const link = document.createElement("link");
    link.id = "pr-theme";
    link.rel = "stylesheet";
    link.href = `/themes/soho-${theme}/theme.css`;
    document.head.appendChild(link);
  }, [theme]);

  return null;
}
