"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Navbar from "../layout/Navbar";
import type { PublicHero } from "@/lib/api/public-content";

type HeroProps = {
  hero: PublicHero;
  siteName: string;
  logoUrl: string | null;
};

export default function Hero({ hero, siteName, logoUrl }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          isMobile: "(max-width: 639px)",
          isTablet: "(min-width: 640px) and (max-width: 1023px)",
          isDesktop: "(min-width: 1024px)",
        },
        (context) => {
          const { isMobile, isTablet } = context.conditions as {
            isMobile: boolean;
            isTablet: boolean;
          };
          const isCompact = isMobile || isTablet;

          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

          if (glowRef.current) {
            gsap.set(glowRef.current, { opacity: 0, scale: 0.85 });
          }
          if (titleRef.current) {
            gsap.set(titleRef.current, {
              opacity: 0,
              y: isMobile ? 16 : isTablet ? 24 : 36,
            });
          }
          if (subtitleRef.current) {
            gsap.set(subtitleRef.current, {
              opacity: 0,
              y: isCompact ? 14 : 18,
            });
          }
          if (buttonRef.current) {
            gsap.set(buttonRef.current, { opacity: 0, y: isCompact ? 12 : 14 });
          }

          if (glowRef.current) {
            tl.to(glowRef.current, { opacity: 1, scale: 1, duration: 1.3 }, 0);
          }

          if (titleRef.current) {
            tl.to(titleRef.current, { opacity: 1, y: 0, duration: 0.9 }, 0.2);
          }

          if (subtitleRef.current) {
            tl.to(
              subtitleRef.current,
              { opacity: 1, y: 0, duration: 0.8 },
              0.4,
            );
          }

          if (buttonRef.current) {
            tl.to(buttonRef.current, { opacity: 1, y: 0, duration: 0.7 }, 0.58);
          }

          return () => {
            tl.kill();
          };
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [mounted]);

  function scrollToContact() {
    document.getElementById("contact")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen w-full flex-col overflow-hidden bg-transparent text-white"
    >
      <Navbar siteName={siteName} logoUrl={logoUrl} />

      <div
        ref={glowRef}
        className="pointer-events-none absolute left-0 top-0 z-0 h-[320px] w-[320px] -translate-x-1/4 -translate-y-1/4 xxs:h-[380px] xxs:w-[380px] sm:h-[520px] sm:w-[520px] md:h-[650px] md:w-[650px] lg:h-[850px] lg:w-[850px]"
        style={{
          background:
            "radial-gradient(circle, rgba(45,212,191,0.20) 0%, rgba(45,212,191,0.08) 42%, rgba(45,212,191,0) 72%)",
        }}
      />

      <div className="relative z-10 flex flex-1 flex-col justify-center px-5 pb-20 pt-24 sm:px-8 sm:pb-16 md:px-12 md:pb-14 lg:justify-start lg:px-15 lg:pb-0 lg:pt-32.5 xl:px-20 xl:pt-37.5">
        <div className="flex max-w-75 flex-col gap-6 xxs:max-w-sm sm:max-w-xl sm:gap-7 md:max-w-2xl md:gap-8 lg:max-w-180 lg:gap-0 xl:max-w-200">
          <h1
            ref={titleRef}
            className="ltr:font-mono ltr:uppercase text-[26px] font-bold leading-[1.2] tracking-wide text-teal-200 rtl:leading-[1.45] rtl:tracking-normal xxs:text-[30px] sm:text-[38px] sm:leading-[1.18] md:text-[46px] lg:text-[52px] xl:text-[58px]"
          >
            {hero.title}
          </h1>

          <p
            ref={subtitleRef}
            className="max-w-md text-[15px] leading-relaxed text-gray-300 sm:text-lg md:text-xl lg:mt-7 lg:max-w-lg"
          >
            {hero.subtitle}
          </p>

          <div ref={buttonRef} className="mt-2 sm:mt-0 lg:mt-9">
            <button
              type="button"
              onClick={scrollToContact}
              className="
                group relative flex items-center gap-3
                rounded-[3px] border border-teal-500
                bg-black/50 px-5 py-3
                text-sm font-semibold text-white
                shadow-[0_0_18px_rgba(45,212,191,0.45)]
                transition-shadow duration-300
                hover:shadow-[0_0_28px_rgba(45,212,191,0.65)]
                sm:px-6 sm:py-3.5 sm:text-[15px]
              "
            >
              <span className="relative flex h-3 w-3 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-teal-500" />
              </span>

              <span>{hero.ctaLabel}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
