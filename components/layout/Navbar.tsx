"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import HamburgerButton from "./HamburgerButton";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const t = useTranslations("Hero");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="relative z-30 flex items-center justify-between px-5 py-5 sm:px-8 sm:py-6 md:px-12 lg:px-[60px] lg:py-8 xl:px-[80px]">
        {/* Logo */}
        <div className="flex items-center gap-1.5">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-5 w-5 text-teal-500 sm:h-6 sm:w-6"
          >
            <path
              d="M12 2L21 7.5V16.5L12 22L3 16.5V7.5L12 2Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M12 2V22M3 7.5L21 16.5M21 7.5L3 16.5"
              stroke="currentColor"
              strokeWidth="1"
              strokeOpacity="0.5"
            />
          </svg>
          <span className="text-lg font-semibold italic tracking-tight text-teal-500 sm:text-xl md:text-2xl">
            {t("logo")}
          </span>
        </div>

        <nav className="hidden items-center gap-9 text-[15px] sm:flex md:text-base">
          <a
            href="#"
            className="text-white/90 transition-colors hover:text-teal-400"
          >
            {t("nav.portfolio")}
          </a>
          <a
            href="#"
            className="text-white/90 transition-colors hover:text-teal-400"
          >
            {t("nav.about")}
          </a>
          <a
            href="#"
            className="text-white/90 transition-colors hover:text-teal-400"
          >
            {t("nav.contact")}
          </a>
        </nav>

        <HamburgerButton
          isOpen={isMenuOpen}
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="sm:hidden"
        />
      </header>

      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
