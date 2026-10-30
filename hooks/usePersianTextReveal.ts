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
    let mounted = true;

    const triggers = Array.from(
      root.querySelectorAll<HTMLElement>(".fa-word-reveal"),
    ).flatMap((block) => {
      const words = Array.from(
        block.querySelectorAll<HTMLElement>(".fa-scroll-word"),
      );
      if (!words.length) return [];

      gsap.set(words, { color: "#6b7280" });
      let revealedCount = 0;
      const trigger = ScrollTrigger.create({
        trigger: block,
        start: "top 88%",
        end: "top 34%",
        onUpdate: (self) => {
          const nextCount = Math.round(self.progress * words.length);
          if (nextCount === revealedCount) return;

          if (nextCount > revealedCount) {
            gsap.set(words.slice(revealedCount, nextCount), {
              color: "#e5e7eb",
            });
          } else {
            gsap.set(words.slice(nextCount, revealedCount), {
              color: "#6b7280",
            });
          }

          revealedCount = nextCount;
        },
        onLeaveBack: () => {
          revealedCount = 0;
          gsap.set(words, { color: "#6b7280" });
        },
        invalidateOnRefresh: true,
      });
      return [trigger];
    });

    document.fonts.ready.then(() => {
      if (mounted) ScrollTrigger.refresh();
    });
    return () => {
      mounted = false;
      triggers.forEach((trigger) => {
        trigger.kill();
      });
    };
  }, [isPersian, scope, contentKey]);
}
