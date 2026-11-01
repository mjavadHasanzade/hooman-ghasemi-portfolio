"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { scrollToHomeSection } from "@/lib/section-navigation";

export default function HomeSectionNavigation() {
  const pathname = usePathname();
  useEffect(() => {
    let cancel = scrollToHomeSection(window.location.href);
    const restore = () => { cancel(); cancel = scrollToHomeSection(window.location.href); };
    window.addEventListener("hashchange", restore);
    window.addEventListener("popstate", restore);
    return () => {
      cancel();
      window.removeEventListener("hashchange", restore);
      window.removeEventListener("popstate", restore);
    };
  }, [pathname]);
  return null;
}
