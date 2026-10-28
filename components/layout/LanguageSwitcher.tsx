"use client";

import { useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";

export default function LanguageSwitcher({ onNavigate }: { onNavigate?: () => void }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const nextLocale = locale === "fa" ? "en" : "fa";

  return (
    <Link
      href={pathname}
      locale={nextLocale}
      hrefLang={nextLocale}
      lang={nextLocale}
      aria-label={locale === "fa" ? "تغییر زبان به انگلیسی" : "Switch language to Persian"}
      dir="ltr"
      className="group inline-flex h-9 shrink-0 items-center justify-center gap-2.5 rounded-[3px] border border-white/15 bg-black/20 px-2.5 font-mono text-[11px] font-normal tracking-[0.04em] transition-colors duration-300 hover:border-teal-400/40 hover:bg-teal-500/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-300 sm:text-xs"
      onClick={(event) => {
        onNavigate?.();
        const suffix = window.location.search + window.location.hash;
        if (suffix && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey && event.button === 0) {
          event.preventDefault();
          router.replace(`${pathname}${suffix}`, { locale: nextLocale });
        }
      }}
    >
      <span aria-hidden="true" className={locale === "fa" ? "text-teal-200" : "text-gray-400 transition-colors duration-300 group-hover:text-gray-200"}>FA</span>
      <span aria-hidden="true" className="h-2.5 w-px rotate-[18deg] bg-white/15 transition-colors duration-300 group-hover:bg-teal-300/30" />
      <span aria-hidden="true" className={locale === "en" ? "text-teal-200" : "text-gray-400 transition-colors duration-300 group-hover:text-gray-200"}>EN</span>
    </Link>
  );
}
