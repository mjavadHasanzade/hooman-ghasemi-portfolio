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

function getWaveParamsForWidth(width: number): WaveParams {
  if (width < 640) return { amplitude: 34, cycles: 2 };
  if (width < 1024) return { amplitude: 52, cycles: 2.6 };
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

      // نکته‌ی مهم: باید هر دو شرط رو تعریف کنیم تا حتماً یکیشون مچ بشه
      // وگرنه روی دسکتاپ (که "isMobile" فالسه) کل callback هیچ‌وقت اجرا نمی‌شه
      mm.add(
        {
          isMobile: "(max-width: 639px)",
          isDesktop: "(min-width: 640px)",
        },
        (context) => {
          const { isMobile } = context.conditions as { isMobile: boolean };

          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

          // حالت اولیه‌ی همه‌ی المان‌ها رو با JS ست می‌کنیم
          // (نه با کلاس دائمی Tailwind) تا اگه انیمیشن اجرا نشد،
          // المان‌ها به‌صورت پیش‌فرض visible بمونن، نه مخفی برای همیشه
          if (glowRef.current) {
            gsap.set(glowRef.current, { opacity: 0, scale: 0.85 });
          }
          if (titleRef.current) {
            gsap.set(titleRef.current, { opacity: 0, y: isMobile ? 20 : 36 });
          }
          if (subtitleRef.current) {
            gsap.set(subtitleRef.current, { opacity: 0, y: 18 });
          }
          if (buttonRef.current) {
            gsap.set(buttonRef.current, { opacity: 0, y: 14 });
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
              { strokeDashoffset: 0, duration: isMobile ? 1.5 : 2.2 },
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
              0.45,
            );
          }

          if (buttonRef.current) {
            tl.to(buttonRef.current, { opacity: 1, y: 0, duration: 0.7 }, 0.65);
          }

          if (wavePathRef.current) {
            gsap.to(wavePathRef.current, {
              x: isMobile ? -8 : -22,
              y: isMobile ? 3 : 7,
              duration: isMobile ? 6 : 9,
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
              delay: isMobile ? 1.4 : 2,
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
      className="relative min-h-screen w-full overflow-hidden bg-black text-white"
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

      {/* نکته: دیگه کلاس opacity-0 دائمی نداره، GSAP خودش موقع اجرا ست می‌کنه */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute left-0 top-0 z-0 h-[380px] w-[380px] -translate-x-1/4 -translate-y-1/4 xxs:h-[440px] xxs:w-[440px] sm:h-[600px] sm:w-[600px] md:h-[750px] md:w-[750px] lg:h-[850px] lg:w-[850px]"
        style={{
          background:
            "radial-gradient(circle, rgba(45,212,191,0.20) 0%, rgba(45,212,191,0.08) 42%, rgba(45,212,191,0) 72%)",
        }}
      />

      {mounted && (
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <svg
            className="absolute bottom-0 left-0 h-[45%] w-full xxs:h-[50%] sm:h-[60%] md:h-[65%] lg:h-[70%]"
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

      <div className="relative z-10 px-5 pt-16 sm:px-8 sm:pt-20 md:px-12 md:pt-24 lg:px-15 lg:pt-32.5 xl:px-20 xl:pt-37.5">
        <div className="max-w-75 xxs:max-w-sm sm:max-w-xl md:max-w-2xl lg:max-w-180 xl:max-w-200">
          <h1
            ref={titleRef}
            className="font-mono text-[28px] font-bold uppercase leading-[1.15] tracking-wide text-teal-200 xxs:text-[32px] sm:text-[40px] md:text-[48px] lg:text-[52px] xl:text-[58px]"
          >
            {hero.title}
          </h1>

          <p
            ref={subtitleRef}
            className="mt-6 max-w-md text-[15px] leading-relaxed text-gray-300 sm:mt-7 sm:text-lg md:text-xl lg:max-w-lg"
          >
            {hero.subtitle}
          </p>

          <div ref={buttonRef} className="mt-8 sm:mt-9">
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
