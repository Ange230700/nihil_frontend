// src\components\ThemeStyles.tsx

import { useEffect, useRef } from "react";
import useTheme from "@nihil_frontend/hooks/useTheme";

export default function ThemeStyles() {
  const { theme, setTheme } = useTheme();
  const reqIdRef = useRef(0);

  useEffect(() => {
    const href = `/themes/soho-${theme}/theme.css`;
    const current = document.getElementById(
      "pr-theme",
    ) as HTMLLinkElement | null;

    // No-op if already applied
    if (current?.href.endsWith(href)) return;

    const requestId = ++reqIdRef.current;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.id = `pr-theme-${String(requestId).padStart(2, "0")}`;

    let settled = false;
    const timeoutId = window.setTimeout(() => {
      onError(new Event("timeout"));
    }, 4000);

    const cleanup = () => {
      link.onload = null;
      link.onerror = null;
      window.clearTimeout(timeoutId);
    };

    const onLoad = () => {
      if (settled || reqIdRef.current !== requestId) return;
      settled = true;
      cleanup();
      // Apply new theme atomically, then drop the old one → no FOUC
      link.id = "pr-theme";
      if (current && current !== link) current.remove();
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const onError = (_e: Event) => {
      if (settled || reqIdRef.current !== requestId) return;
      settled = true;
      cleanup();
      console.warn(`Theme CSS failed to load: ${href}. Falling back to light.`);
      // Keep previous link if it exists; otherwise try light fallback
      if (!current && theme !== "light") {
        setTheme?.("light"); // triggers another attempt with light file
      } else {
        link.remove();
      }
    };

    link.addEventListener("load", onLoad);
    link.addEventListener("error", onError);

    // Append new link WITHOUT removing the old one first → avoids FOUC
    document.head.appendChild(link);

    // If a newer request supersedes this one, remove the pending link
    return () => {
      window.clearTimeout(timeoutId);
      link.removeEventListener("load", onLoad);
      link.removeEventListener("error", onError);
      // If this request never “won” (not renamed to pr-theme), discard it.
      if (link.id !== "pr-theme" && link.parentNode) {
        link.parentNode.removeChild(link);
      }
    };
  }, [theme, setTheme]);

  return null;
}
