"use client";

import { useRef, type KeyboardEvent } from "react";
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
  const tabs = Object.keys(localeLabels) as Locale[];
  const buttons = useRef<Partial<Record<Locale, HTMLButtonElement | null>>>({});

  function navigateTabs(event: KeyboardEvent<HTMLButtonElement>, locale: Locale) {
    const index = tabs.indexOf(locale);
    const nextIndex = event.key === "ArrowLeft" ? (index + 1) % tabs.length
      : event.key === "ArrowRight" ? (index - 1 + tabs.length) % tabs.length
      : event.key === "Home" ? 0
      : event.key === "End" ? tabs.length - 1 : undefined;
    if (nextIndex === undefined) return;
    event.preventDefault();
    const nextLocale = tabs[nextIndex];
    onChange(nextLocale);
    buttons.current[nextLocale]?.focus();
  }

  return (
    <div
      data-locale-tabs={value}
      dir="rtl"
      className="flex gap-2 border-b"
      role="tablist"
      aria-label="زبان محتوا"
    >
      {tabs.map((locale) => {
        const isSelected = locale === value;
        const isAvailable = safeAvailableLocales.includes(locale);

        return (
          <button
            key={locale}
            type="button"
            role="tab"
            aria-selected={isSelected}
            tabIndex={isSelected ? 0 : -1}
            ref={(element) => { buttons.current[locale] = element; }}
            onKeyDown={(event) => navigateTabs(event, locale)}
            onClick={() => onChange(locale)}
            className={cn(
              "relative inline-flex min-h-11 shrink-0 items-center justify-center gap-2 whitespace-nowrap px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary",
              isSelected &&
                "text-primary after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-primary",
            )}
          >
            <bdi dir={locale === "fa" ? "rtl" : "ltr"}>{localeLabels[locale]}</bdi>
            {!isAvailable && (
              <span className="text-xs font-normal">(جدید)</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
