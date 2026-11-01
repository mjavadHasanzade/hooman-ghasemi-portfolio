"use client";

import type { ComponentProps } from "react";
import { Link } from "@/i18n/navigation";
import { scrollToHomeSection } from "@/lib/section-navigation";

export default function SectionLink({ onClick, ...props }: ComponentProps<typeof Link>) {
  return <Link {...props} scroll={false} onClick={(event) => {
    onClick?.(event);
    if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.currentTarget.target === "_blank") return;
    const destination = new URL(event.currentTarget.href);
    if (destination.pathname === window.location.pathname) {
      // Handle same-page hashes ourselves, including repeated clicks. Letting
      // the router re-navigate can preserve or append the previous fragment.
      event.preventDefault();
      if (destination.href !== window.location.href) window.history.pushState(null, "", destination.href);
    }
    scrollToHomeSection(destination.href);
  }} />;
}
