"use client";

import { useLocale } from "next-intl";
import { Languages } from "lucide-react";
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
      className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-teal-500/40 px-2.5 py-2 text-xs font-medium text-teal-200 transition-colors hover:border-teal-300 hover:bg-teal-500/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-300 sm:text-sm"
      onClick={(event) => {
        onNavigate?.();
        const suffix = window.location.search + window.location.hash;
        if (suffix && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey && event.button === 0) {
          event.preventDefault();
          router.replace(`${pathname}${suffix}`, { locale: nextLocale });
        }
      }}
    >
      <Languages className="h-4 w-4" aria-hidden="true" />
      {nextLocale === "fa" ? "فارسی" : "English"}
    </Link>
  );
}
