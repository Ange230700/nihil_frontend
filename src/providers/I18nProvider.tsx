// src\providers\I18nProvider.tsx

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { IntlProvider } from "react-intl";
import {
  addLocale as addPRLocale,
  locale as setPRLocale,
} from "primereact/api";
import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  type Locale,
} from "@nihil_frontend/i18n/locales";
import { I18nContext } from "@nihil_frontend/contexts/I18nContext";

type Messages = Record<string, string>;

const CATALOGS: Record<Locale, () => Promise<Messages>> = {
  en: () =>
    import("@nihil_frontend/i18n/en.json", {
      with: { type: "json" },
    }) as unknown as Promise<Messages>,
  fr: () =>
    import("@nihil_frontend/i18n/fr.json", {
      with: { type: "json" },
    }) as unknown as Promise<Messages>,
};

// Minimal PrimeReact locales (extend later if needed)
addPRLocale("en", { startsWith: "Starts with", contains: "Contains" });
addPRLocale("fr", {
  startsWith: "Commence par",
  contains: "Contient",
});

function detectLocale(): Locale {
  const stored = localStorage.getItem("locale");
  if (stored && SUPPORTED_LOCALES.includes(stored as Locale))
    return stored as Locale;
  const nav = navigator.language.toLowerCase();
  if (nav.startsWith("fr")) return "fr";
  return DEFAULT_LOCALE;
}

export function I18nProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [locale, setLocale] = useState<Locale>(detectLocale);
  const [messages, setMessages] = useState<Messages>({});

  // wrapper that persists to localStorage
  const changeLocale = useCallback((l: Locale) => {
    setLocale(l);
    localStorage.setItem("locale", l);
  }, []);

  // Load catalog + sync PrimeReact locale on change
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const mod = await CATALOGS[locale]();
        if (!cancelled) setMessages(mod);
      } catch (err) {
        console.error("🔴 Failed to load i18n catalog:", err);
        if (!cancelled && locale !== DEFAULT_LOCALE) {
          try {
            await CATALOGS[DEFAULT_LOCALE]();
          } catch (err2) {
            console.error("🔴 Failed to load fallback i18n catalog:", err2);
          }
        }
      }
    };

    void load(); // satisfies no-floating-promises
    setPRLocale(locale);

    return () => {
      cancelled = true;
    };
  }, [locale]);

  const ctx = useMemo(
    () => ({ locale, setLocale: changeLocale }),
    [locale, changeLocale],
  );

  if (Object.keys(messages).length === 0) return null; // first load flash-free

  return (
    <I18nContext value={ctx}>
      <IntlProvider
        locale={locale}
        messages={messages}
        defaultLocale={DEFAULT_LOCALE}
      >
        {children}
      </IntlProvider>
    </I18nContext>
  );
}
