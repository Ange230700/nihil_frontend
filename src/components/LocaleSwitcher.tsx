// src\components\LocaleSwitcher.tsx

import { Dropdown } from "primereact/dropdown";
import type { DropdownChangeEvent } from "primereact/dropdown";
import { useMemo } from "react";
import { useI18n } from "@nihil_frontend/hooks/useI18n";
import { useIntl } from "react-intl";
import { type Locale } from "@nihil_frontend/i18n/locales";

const isLocale = (x: unknown): x is Locale => x === "en" || x === "fr";

export default function LocaleSwitcher() {
  const { locale, setLocale } = useI18n();
  const intl = useIntl();

  const options = useMemo(
    () =>
      [
        { label: intl.formatMessage({ id: "locale.english" }), value: "en" },
        { label: intl.formatMessage({ id: "locale.french" }), value: "fr" },
      ] satisfies { label: string; value: Locale }[],
    [intl],
  );

  const handleChange = (e: DropdownChangeEvent) => {
    const v: unknown = e.value; // avoid 'any'
    if (isLocale(v)) setLocale(v);
  };

  return (
    <Dropdown
      value={locale}
      options={options}
      optionLabel="label"
      optionValue="value"
      onChange={handleChange}
      className="w-28"
      aria-label={intl.formatMessage({
        id: "theme.toggle",
        defaultMessage: "Toggle theme",
      })}
    />
  );
}
