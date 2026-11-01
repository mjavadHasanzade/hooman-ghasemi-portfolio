"use client";

import { useState } from "react";
import { Menu } from "@base-ui/react/menu";
import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export default function LanguageSwitcher({ onNavigate }: { onNavigate?: () => void }) {
  const locale = useLocale();
  const pathname = usePathname();
  const [suffix, setSuffix] = useState("");
  const label = locale === "fa" ? "انتخاب زبان" : "Select language";

  return (
    <Menu.Root modal={false} onOpenChange={(open) => {
      if (open) setSuffix(window.location.search + window.location.hash);
    }}>
      <Menu.Trigger
        aria-label={`${label}: ${locale.toUpperCase()}`}
        dir="ltr"
        className="inline-flex h-9 min-w-12 shrink-0 items-center justify-center rounded-[3px] border border-white/15 bg-black/20 px-2.5 font-mono text-[11px] font-normal tracking-[0.04em] text-teal-200 transition-colors duration-200 hover:border-teal-400/40 hover:bg-teal-500/5 data-popup-open:border-teal-400/40 data-popup-open:bg-teal-500/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-300 sm:text-xs"
      >
        {locale.toUpperCase()}
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner side="bottom" align="center" sideOffset={6} className="z-[80] outline-none">
          <Menu.Popup
            aria-label={label}
            dir="ltr"
            className="min-w-14 overflow-hidden rounded-[3px] border border-teal-400/25 bg-[#080f16]/95 p-1 font-mono text-xs shadow-[0_8px_24px_rgba(0,0,0,0.4)] backdrop-blur-xl outline-none"
          >
            {routing.locales.map((option) => (
              <Menu.LinkItem
                key={option}
                label={option.toUpperCase()}
                closeOnClick
                render={<Link href={`${pathname}${suffix}`} locale={option} hrefLang={option} lang={option} />}
                aria-current={option === locale ? "true" : undefined}
                className={`flex min-h-9 items-center justify-center rounded-[2px] px-3 tracking-[0.04em] outline-none transition-colors data-highlighted:bg-teal-400/10 data-highlighted:text-teal-100 ${option === locale ? "bg-teal-400/5 text-teal-200" : "text-gray-300"}`}
                onClick={(event) => {
                  if (option === locale) {
                    event.preventDefault();
                    return;
                  }
                  onNavigate?.();
                }}
              >
                {option.toUpperCase()}
              </Menu.LinkItem>
            ))}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
