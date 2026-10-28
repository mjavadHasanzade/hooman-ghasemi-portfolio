"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { LayoutDashboard } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useAuthStore } from "@/lib/auth/auth-store";
import HamburgerButton from "./HamburgerButton";
import MobileMenu from "./MobileMenu";
import LanguageSwitcher from "./LanguageSwitcher";

type NavbarProps = {
  siteName?: string;
  logoUrl: string | null;
};

export default function Navbar({ siteName, logoUrl }: NavbarProps) {
  const t = useTranslations("SiteNavigation");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isAuthenticated = useAuthStore(
    (state) => state.status === "authenticated",
  );

  return (
    <>
      <header className="relative z-30 flex items-center justify-between gap-3 px-5 py-5 sm:px-8 sm:py-6 md:px-12 lg:px-[60px] lg:py-8 xl:px-[80px]">
        {/* Logo */}
        <Link
          href="/"
          aria-label={siteName || t("brandFallback")}
          className="flex min-w-0 items-center"
        >
          {logoUrl ? (
            <>
              <Image
                src={logoUrl}
                alt={siteName || t("brandFallback")}
                width={64}
                height={64}
                priority
                unoptimized
                className="h-12 w-12 shrink-0 object-contain sm:h-14 sm:w-14"
              />
              <span className="truncate text-lg font-semibold italic text-teal-500 sm:text-xl md:text-2xl">
                {siteName || t("brandFallback")}
              </span>
            </>
          ) : (
            <span className="truncate text-lg font-semibold italic text-teal-500 sm:text-xl md:text-2xl">
              {siteName || t("brandFallback")}
            </span>
          )}
        </Link>

        <div className="flex shrink-0 items-center gap-3 sm:gap-5">
        <nav className="hidden items-center gap-4 text-sm sm:flex lg:gap-9 lg:text-base">
          <Link
            href="/#portfolio"
            className="text-white/90 transition-colors hover:text-teal-400"
          >
            {t("portfolio")}
          </Link>
          <Link
            href="/#about"
            className="text-white/90 transition-colors hover:text-teal-400"
          >
            {t("about")}
          </Link>
          <Link
            href="/#contact"
            className="text-white/90 transition-colors hover:text-teal-400"
          >
            {t("contact")}
          </Link>
          {isAuthenticated && (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded border border-teal-500/70 px-3 py-1.5 text-sm font-medium text-teal-300 transition-colors hover:bg-teal-500/15 hover:text-white"
            >
              <LayoutDashboard className="h-4 w-4" />
              {t("panel")}
            </Link>
          )}
        </nav>

        <LanguageSwitcher />
        <HamburgerButton
          isOpen={isMenuOpen}
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="sm:hidden"
        />
        </div>
      </header>

      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        siteName={siteName}
      />
    </>
  );
}
