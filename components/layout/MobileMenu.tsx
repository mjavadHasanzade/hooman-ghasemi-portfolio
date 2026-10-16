"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { LayoutDashboard } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useAuthStore } from "@/lib/auth/auth-store";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  siteName?: string;
}

type NavKey = "portfolio" | "about" | "contact";

const navItems: { key: NavKey; href: string }[] = [
  { key: "portfolio", href: "#" },
  { key: "about", href: "#" },
  { key: "contact", href: "#" },
];

export default function MobileMenu({
  isOpen,
  onClose,
  siteName,
}: MobileMenuProps) {
  const t = useTranslations("SiteNavigation");
  const isAuthenticated = useAuthStore(
    (state) => state.status === "authenticated",
  );

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm sm:hidden"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="
              fixed right-0 top-0 z-40 h-full w-[78%] max-w-85
              border-l border-teal-500/20
              bg-black/95
              shadow-[-20px_0_60px_rgba(0,0,0,0.6)]
              sm:hidden
            "
          >
            <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-teal-950/20 via-transparent to-transparent" />

            <div className="relative flex h-full flex-col justify-between px-8 py-24">
              <nav className="flex flex-col gap-2">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.key}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 24 }}
                    transition={{
                      duration: 0.35,
                      delay: 0.15 + i * 0.08,
                      ease: "easeOut",
                    }}
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="
                        group flex items-center gap-3 py-3
                        ltr:uppercase text-2xl font-bold tracking-tight text-white rtl:tracking-normal
                        transition-colors
                      "
                    >
                      <span className="text-sm font-normal text-teal-500">
                        0{i + 1}
                      </span>
                      <span className="relative">
                        {t(item.key)}
                        <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-teal-500 transition-all duration-300 group-hover:w-full" />
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ duration: 0.35, delay: 0.45 }}
                className="flex flex-col gap-4 border-t border-white/10 pt-6"
              >
                <a
                  href="#"
                  onClick={onClose}
                  className="
                    flex items-center justify-center
                    rounded-[3px] border border-teal-500
                    bg-teal-500/10 py-3
                    text-sm font-semibold text-white
                    transition-colors hover:bg-teal-500/20
                  "
                >
                  {t("contact")}
                </a>
                {isAuthenticated && (
                  <Link
                    href="/dashboard"
                    onClick={onClose}
                    className="flex items-center justify-center gap-2 rounded-[3px] border border-white/25 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                   {t("panel")}
                  </Link>
                )}
                <span className="text-center text-xs text-gray-400">
                  {siteName || t("brandFallback")} © {new Date().getFullYear()}
                </span>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
