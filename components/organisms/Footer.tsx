"use client";

import { richTextHtml } from "@/lib/rich-text";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { PublicFooter } from "@/lib/types/public-content";

export default function Footer({
  footer,
  logoUrl,
}: {
  footer: PublicFooter;
  logoUrl?: string | null;
}) {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = footerRef.current;
    if (!element) return;

    // The shared footer survives route changes. Observe its actual visibility
    // instead of retaining a scroll position calculated for the previous page.
    // Content remains visible by default, even if animation cannot run.
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches) return;
    let animations: Animation[] = [];
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      if (motion.matches) return;
      animations = Array.from(element.querySelectorAll<HTMLElement>(".footer-item"))
        .filter((item) => typeof item.animate === "function")
        .map((item, index) => item.animate([
          { opacity: 0, transform: "translateY(16px)" },
          { opacity: 1, transform: "translateY(0)" },
        ], {
          duration: 700,
          delay: index * 150,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          fill: "backwards",
        }));
    }, { rootMargin: "0px 0px -10% 0px" });
    const stopMotion = () => {
      if (!motion.matches) return;
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
    };
    observer.observe(element);
    motion.addEventListener("change", stopMotion);
    return () => {
      observer.disconnect();
      motion.removeEventListener("change", stopMotion);
      animations.forEach((animation) => animation.cancel());
    };
  }, []);

  return (
    <footer
      ref={footerRef}
      className="site-footer relative w-full bg-black text-white"
    >
      <div className="mx-auto max-w-4xl px-5 text-center sm:px-8 flex flex-col justify-center items-center">
        <div className="footer-logo footer-item relative mx-auto h-52 w-full max-w-lg sm:h-56">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt=""
              fill
              sizes="(max-width: 640px) 100vw, 512px"
              unoptimized
              className="object-cover object-center"
            />
          ) : null}
        </div>
        <div
          className="cms-rich-text footer-copyright footer-item mt-2 pb-4 ltr:font-mono text-sm text-gray-500 sm:mt-3 sm:pb-5 sm:text-base"
          dangerouslySetInnerHTML={{
            __html: richTextHtml(footer.copyrightText),
          }}
        />
      </div>
    </footer>
  );
}
