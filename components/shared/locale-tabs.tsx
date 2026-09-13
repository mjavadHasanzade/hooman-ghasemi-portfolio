"use client";

import type { Locale } from "@/lib/types/api";
import { cn } from "@/lib/utils";

const localeLabels: Record<Locale, string> = {
  fa: "فارسی",
  en: "English",
};

type LocaleTabsProps = {
  value: Locale;
  onChange: (locale: Locale) => void;
  availableLocales?: Locale[];
};

export function LocaleTabs({
  value,
  onChange,
  availableLocales,
}: LocaleTabsProps) {
  const safeAvailableLocales = availableLocales ?? [];

  return (
    <div
      data-locale-tabs={value}
      dir={value === "fa" ? "rtl" : "ltr"}
      className="flex gap-2 border-b"
      role="tablist"
      aria-label="زبان محتوا"
    >
      {(Object.keys(localeLabels) as Locale[]).map((locale) => {
        const isSelected = locale === value;
        const isAvailable = safeAvailableLocales.includes(locale);

        return (
          <button
            key={locale}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onChange(locale)}
            className={cn(
              "relative px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
              isSelected &&
                "text-primary after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-primary",
            )}
          >
            {localeLabels[locale]}
            {!isAvailable && (
              <span className="ms-2 text-xs font-normal">(جدید)</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
