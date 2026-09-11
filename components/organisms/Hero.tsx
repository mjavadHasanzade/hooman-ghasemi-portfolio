"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Navbar from "../layout/Navbar";
import type { PublicHero } from "@/lib/api/public-content";
import { publicMediaUrl } from "@/lib/media/public-media-url";

type HeroProps = {
  hero: PublicHero;
  siteName: string;
};

function buildSineWavePath(
  width: number,
  height: number,
  amplitude: number,
  cycles: number,
  verticalOffset: number,
) {
  const steps = 240;
  const points: string[] = [];

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = width * t;
    const damping = 0.15 + t * 0.85;
    const y =
      verticalOffset + amplitude * damping * Math.sin(t * Math.PI * 2 * cycles);

    points.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }

  return `M${points.join(" L")}`;
}

type WaveParams = { amplitude: number; cycles: number };

// یک پله‌ی میانی برای تبلت اضافه شد تا موج بین موبایل و دسکتاپ به‌طور طبیعی رشد کنه
function getWaveParamsForWidth(width: number): WaveParams {
  if (width < 640) return { amplitude: 30, cycles: 1.8 };
  if (width < 768) return { amplitude: 42, cycles: 2.2 };
  if (width < 1024) return { amplitude: 56, cycles: 2.7 };
  return { amplitude: 70, cycles: 3.2 };
}

export default function Hero({ hero, siteName }: HeroProps) {
  const backgroundImageUrl = publicMediaUrl(hero.backgroundImage);

  const sectionRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const wavePathRef = useRef<SVGPathElement>(null);

  const [mounted, setMounted] = useState(false);
  const [waveParams, setWaveParams] = useState<WaveParams>({
    amplitude: 70,
    cycles: 3.2,
  });

  useEffect(() => {
    const update = () =>
      setWaveParams(getWaveParamsForWidth(window.innerWidth));
    update();
    setMounted(true);

    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const wavePath = buildSineWavePath(
    1600,
    500,
    waveParams.amplitude,
    waveParams.cycles,
    260,
  );

  useEffect(() => {
    if (!mounted) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // بازه‌ی تبلت (640px تا 1023px) به‌عنوان یک شرط مستقل اضافه شد
      // تا انیمیشن‌های ورودی هم متناسب با فضای تبلت تنظیم بشن، نه فقط موبایل/دسکتاپ خام
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

          if (wavePathRef.current) {
            const length = wavePathRef.current.getTotalLength();
            gsap.set(wavePathRef.current, {
              strokeDasharray: length,
              strokeDashoffset: length,
              opacity: 0.7,
            });
            tl.to(
              wavePathRef.current,
              {
                strokeDashoffset: 0,
                duration: isMobile ? 1.5 : isTablet ? 1.8 : 2.2,
              },
              0,
            );
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

          if (wavePathRef.current) {
            gsap.to(wavePathRef.current, {
              x: isMobile ? -8 : isTablet ? -14 : -22,
              y: isMobile ? 3 : isTablet ? 5 : 7,
              duration: isMobile ? 6 : isTablet ? 7.5 : 9,
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
              delay: isMobile ? 1.4 : isTablet ? 1.7 : 2,
            });
          }

          return () => {
            tl.kill();
          };
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [mounted]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen w-full flex-col overflow-hidden bg-black text-white"
      style={
        backgroundImageUrl
          ? {
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.82)), url(${backgroundImageUrl})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
            }
          : undefined
      }
    >
      <Navbar siteName={siteName} />

      <div
        ref={glowRef}
        className="pointer-events-none absolute left-0 top-0 z-0 h-[320px] w-[320px] -translate-x-1/4 -translate-y-1/4 xxs:h-[380px] xxs:w-[380px] sm:h-[520px] sm:w-[520px] md:h-[650px] md:w-[650px] lg:h-[850px] lg:w-[850px]"
        style={{
          background:
            "radial-gradient(circle, rgba(45,212,191,0.20) 0%, rgba(45,212,191,0.08) 42%, rgba(45,212,191,0) 72%)",
        }}
      />

      {/*
        ارتفاع موج در بازه‌ی تبلت (sm/md) به‌تدریج بزرگ می‌شه، نه یکهو
        تا از حالت موبایل به دسکتاپ گذار نرمی داشته باشه
      */}
      {mounted && (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[62%] overflow-hidden xxs:h-[58%] sm:h-[56%] md:h-[62%] lg:h-[70%]"
          style={{
            maskImage: "linear-gradient(to bottom, transparent 0%, black 35%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, black 35%)",
          }}
        >
          <svg
            className="absolute bottom-0 left-0 h-full w-full"
            viewBox="0 0 1600 500"
            preserveAspectRatio="none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient
                id="waveGradient"
                x1="100%"
                y1="0%"
                x2="0%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.9" />
                <stop offset="55%" stopColor="#2dd4bf" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0" />
              </linearGradient>
              <filter
                id="waveGlow"
                x="-20%"
                y="-50%"
                width="140%"
                height="200%"
              >
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <path
              ref={wavePathRef}
              d={wavePath}
              stroke="url(#waveGradient)"
              strokeWidth="2.5"
              filter="url(#waveGlow)"
            />
          </svg>
        </div>
      )}

      {/*
        justify-center تا md ادامه پیدا می‌کنه (یعنی موبایل + تبلت)
        و فقط از lg به بعد (دسکتاپ واقعی) به justify-start با pt بزرگ برمی‌گرده.
        این باعث می‌شه در تبلت هم محتوا به‌جای چسبیدن به بالا، به‌طور متعادل
        در ارتفاع صفحه پخش بشه.
      */}
      <div className="relative z-10 flex flex-1 flex-col justify-center px-5 pb-20 pt-24 sm:px-8 sm:pb-16 md:px-12 md:pb-14 lg:justify-start lg:px-15 lg:pb-0 lg:pt-32.5 xl:px-20 xl:pt-37.5">
        <div className="flex max-w-75 flex-col gap-6 xxs:max-w-sm sm:max-w-xl sm:gap-7 md:max-w-2xl md:gap-8 lg:max-w-180 lg:gap-0 xl:max-w-200">
          <h1
            ref={titleRef}
            className="font-mono text-[26px] font-bold uppercase leading-[1.2] tracking-wide text-teal-200 xxs:text-[30px] sm:text-[38px] sm:leading-[1.18] md:text-[46px] lg:text-[52px] xl:text-[58px]"
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
