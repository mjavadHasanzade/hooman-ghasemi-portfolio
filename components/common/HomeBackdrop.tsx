"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Keep the home artwork out of project pages, including client navigation. */
export default function HomeBackdrop({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return /^\/(?:(?:fa|en)\/?)?$/.test(pathname) ? children : null;
}
