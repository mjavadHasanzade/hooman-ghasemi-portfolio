"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { LayoutDashboard } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useAuthStore } from "@/lib/auth/auth-store";
import HamburgerButton from "./HamburgerButton";
import MobileMenu from "./MobileMenu";

type NavbarProps = {
  siteName?: string;
  logoUrl: string | null;
};

export default function Navbar({ siteName, logoUrl }: NavbarProps) {
  const t = useTranslations("SiteNavigation");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isAuthenticated = useAuthStore(
    (state) => state.status === "authenticated",
  );

  useEffect(() => {
    const updateScrollState = () => setIsScrolled(window.scrollY > 12);

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-5 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 sm:px-8 sm:py-6 md:px-12 lg:px-[60px] lg:py-8 xl:px-[80px] ${
          isScrolled
            ? "border-b border-white/8 bg-[#05070a]/68 shadow-[0_12px_34px_rgba(0,0,0,0.2)] backdrop-blur-xl supports-backdrop-filter:bg-[#05070a]/48"
            : "border-b border-transparent bg-transparent shadow-none backdrop-filter-none"
        }`}
      >
        {/* Logo */}
        <Link
          href="/"
          aria-label={siteName || t("brandFallback")}
          className="flex shrink-0 items-center"
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
                className="h-12 w-12 object-contain sm:h-14 sm:w-14"
              />
              <span className="text-lg font-semibold italic text-teal-500 sm:text-xl md:text-2xl">
                {siteName || t("brandFallback")}
              </span>
            </>
          ) : (
            <span className="text-lg font-semibold italic text-teal-500 sm:text-xl md:text-2xl">
              {siteName || t("brandFallback")}
            </span>
          )}
        </Link>

        <nav className="hidden items-center gap-9 text-[15px] sm:flex md:text-base">
          <a
            href="#"
            className="text-white/90 transition-colors hover:text-teal-400"
          >
            {t("portfolio")}
          </a>
          <a
            href="#"
            className="text-white/90 transition-colors hover:text-teal-400"
          >
            {t("about")}
          </a>
          <a
            href="#"
            className="text-white/90 transition-colors hover:text-teal-400"
          >
            {t("contact")}
          </a>
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

        <HamburgerButton
          isOpen={isMenuOpen}
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="sm:hidden"
        />
      </header>

      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        siteName={siteName}
      />
    </>
  );
}
