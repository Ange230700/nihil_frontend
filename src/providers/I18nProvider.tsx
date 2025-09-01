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
import { I18N_VERSION } from "virtual:i18n-version";

type Messages = Record<string, string>;
interface JsonMod<T> {
  default: T;
}

const CATALOGS: Record<Locale, () => Promise<Messages>> = {
  en: () =>
    import("@nihil_frontend/i18n/en.json").then(
      (m: JsonMod<Messages>) => m.default,
    ),
  fr: () =>
    import("@nihil_frontend/i18n/fr.json").then(
      (m: JsonMod<Messages>) => m.default,
    ),
};

// Minimal PrimeReact locales
addPRLocale("en", { startsWith: "Starts with", contains: "Contains" });
addPRLocale("fr", { startsWith: "Commence par", contains: "Contient" });

/* -------------------- cache helpers -------------------- */
const STORAGE_VERSION_KEY = "i18n:version";
const STORAGE_MSGS_PREFIX = "i18n:messages:"; // + locale

function getCacheKey(locale: Locale) {
  return `${STORAGE_MSGS_PREFIX}${locale}`;
}

function ensureCacheVersion() {
  try {
    const v = localStorage.getItem(STORAGE_VERSION_KEY);
    if (v !== I18N_VERSION) {
      // purge old message caches
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const k = localStorage.key(i);
        if (k?.startsWith(STORAGE_MSGS_PREFIX)) {
          localStorage.removeItem(k);
        }
      }
      localStorage.setItem(STORAGE_VERSION_KEY, I18N_VERSION);
    }
  } catch {
    // ignore (private mode / SSR)
  }
}

function readCachedMessages(locale: Locale): Messages | null {
  try {
    const raw = localStorage.getItem(getCacheKey(locale));
    return raw ? (JSON.parse(raw) as Messages) : null;
  } catch {
    return null;
  }
}

function writeCachedMessages(locale: Locale, msgs: Messages) {
  try {
    localStorage.setItem(getCacheKey(locale), JSON.stringify(msgs));
  } catch {
    // quota/full; ignore
  }
}

/* -------------------- locale detection -------------------- */
function detectLocale(): Locale {
  try {
    const stored = localStorage.getItem("locale");
    if (stored && SUPPORTED_LOCALES.includes(stored as Locale))
      return stored as Locale;
  } catch {
    /* ignore */
  }

  const nav = navigator.language.toLowerCase();
  if (nav.startsWith("fr")) return "fr";
  return DEFAULT_LOCALE;
}

/* -------------------- provider -------------------- */
export function I18nProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [locale, setLocale] = useState<Locale>(detectLocale);

  // seed messages from cache synchronously to avoid initial flash
  const [messages, setMessages] = useState<Messages>(() => {
    try {
      ensureCacheVersion();
    } catch {
      // ignore (private mode / SSR)
    }
    return readCachedMessages(locale) ?? {};
  });

  const changeLocale = useCallback((l: Locale) => {
    setLocale(l);
    try {
      localStorage.setItem("locale", l);
    } catch {
      // quota/full; ignore
    }
  }, []);

  useEffect(() => {
    // ensure version & hydrate from cache immediately (if changed locales)
    ensureCacheVersion();
    const cached = readCachedMessages(locale);
    if (cached) setMessages(cached);

    // then fetch fresh (code-split import) and update cache
    (async () => {
      try {
        const mod = await CATALOGS[locale]();
        setMessages(mod);
        writeCachedMessages(locale, mod);
      } catch (err) {
        console.error("🔴 Failed to load i18n catalog:", err);
        if (locale !== DEFAULT_LOCALE) {
          try {
            const fb = await CATALOGS[DEFAULT_LOCALE]();
            setMessages(fb);
            writeCachedMessages(DEFAULT_LOCALE, fb);
          } catch (err2) {
            console.error("🔴 Failed to load fallback i18n catalog:", err2);
          }
        }
      }
    })().catch((err: unknown) => {
      console.error("🔴 Failed to load i18n catalog:", err);
    });

    setPRLocale(locale);
    return () => {
      // noop
    };
  }, [locale]);

  const ctx = useMemo(
    () => ({ locale, setLocale: changeLocale }),
    [locale, changeLocale],
  );

  if (Object.keys(messages).length === 0) return null; // flash-free first load

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
