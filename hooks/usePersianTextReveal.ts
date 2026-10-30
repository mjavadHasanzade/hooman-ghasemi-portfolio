"use client";

import { useEffect, type RefObject } from "react";
import { useLocale } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/** Brighten whole rich-text blocks with scroll, preserving Persian letter shaping. */
export function usePersianTextReveal(
  scope: RefObject<HTMLElement | null>,
  contentKey: string,
  selector: string,
  lift = true,
) {
  const isPersian = useLocale() === "fa";

  useEffect(() => {
    if (!isPersian || !scope.current) return;
    const root = scope.current;
    const media = gsap.matchMedia();
    let mounted = true;

    media.add("(prefers-reduced-motion: no-preference)", () => {
      root.querySelectorAll<HTMLElement>(selector).forEach((block) => {
        gsap.fromTo(block, { color: "#6b7280", ...(lift ? { y: 14 } : {}) }, {
          color: "#e5e7eb",
          ...(lift ? { y: 0 } : {}),
          ease: "none",
          scrollTrigger: {
            trigger: block,
            start: "top 90%",
            end: "top 55%",
            scrub: 0.25,
            invalidateOnRefresh: true,
          },
        });
      });
    });

    // Font loading can move the trigger positions, especially in Persian.
    document.fonts.ready.then(() => {
      if (mounted) ScrollTrigger.refresh();
    });

    return () => {
      mounted = false;
      media.revert();
    };
  }, [isPersian, scope, contentKey, selector, lift]);
}

/** Source order is reading order in RTL. Reversing the words would start on the left. */
export function usePersianWordReveal(scope: RefObject<HTMLElement | null>, contentKey: string) {
  const isPersian = useLocale() === "fa";

  useEffect(() => {
    if (!isPersian || !scope.current) return;
    const root = scope.current;
    const media = gsap.matchMedia();
    let mounted = true;

    media.add("(prefers-reduced-motion: no-preference)", () => {
      root.querySelectorAll<HTMLElement>(".fa-word-reveal").forEach((block) => {
        const words = Array.from(block.querySelectorAll<HTMLElement>(".fa-scroll-word"));
        if (!words.length) return;
        gsap.set(words, { color: "#6b7280" });
        gsap.to(words, {
          color: "#e5e7eb",
          duration: 0.15,
          stagger: 0.15,
          ease: "none",
          scrollTrigger: {
            trigger: block,
            start: "top 85%",
            end: "top 30%",
            scrub: 0.2,
            invalidateOnRefresh: true,
          },
        });
      });
    });

    document.fonts.ready.then(() => {
      if (mounted) ScrollTrigger.refresh();
    });
    return () => {
      mounted = false;
      media.revert();
    };
  }, [isPersian, scope, contentKey]);
}
