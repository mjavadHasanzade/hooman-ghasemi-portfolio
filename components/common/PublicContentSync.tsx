"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { subscribeToPublicContentChanges } from "@/lib/public-content-sync";

export default function PublicContentSync() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const refresh = () => {
      clearTimeout(timer);
      timer = setTimeout(() => router.refresh(), 50);
    };
    const unsubscribe = subscribeToPublicContentChanges(refresh);
    // Re-entering a cached route must also refresh shared layouts (footer/background).
    refresh();
    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, [pathname, router]);

  return null;
}
