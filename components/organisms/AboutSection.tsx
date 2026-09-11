"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Mail } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { PublicAbout } from "@/lib/types/public-content";
import { mediaUrl } from "@/lib/types/media";

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection({ about }: { about: PublicAbout }) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const imageUrl = mediaUrl(about.image);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      });

      tl.from(imageWrapRef.current, {
        opacity: 0,
        x: -70,
        scale: 0.92,
        duration: 0.9,
        ease: "power3.out",
      })
        .from(
          ".about-item",
          {
            opacity: 0,
            y: 24,
            duration: 0.6,
            stagger: 0.14,
            ease: "power3.out",
          },
          "-=0.5",
        )
        .from(
          ".about-orb",
          {
            opacity: 0,
            scale: 0.4,
            duration: 0.6,
            stagger: 0.2,
            ease: "back.out(1.8)",
          },
          "-=0.35",
        );

      gsap.to(".teal-orb", {
        y: -12,
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".glass-orb", {
        y: 12,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.4,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-black py-16 text-white sm:py-20 md:py-24 lg:py-28"
    >
      <div className="flex flex-col gap-12 px-5 sm:px-8 md:px-12 lg:flex-row lg:items-stretch lg:gap-0 lg:px-15 xl:px-20">
        <div className="flex w-full shrink-0 items-center justify-center lg:w-1/3">
          <div
            ref={imageWrapRef}
            className="relative aspect-[4/5] w-full max-w-[220px] sm:max-w-[260px] lg:max-w-[280px] xl:max-w-[300px]"
          >
            <div
              className="absolute -inset-3 -z-10 -translate-x-2 -translate-y-2 bg-gray-700/40 blur-md sm:-inset-4"
              style={{
                borderRadius: "58% 42% 45% 55% / 45% 40% 60% 55%",
              }}
            />

            <div
              className="relative h-full w-full overflow-hidden"
              style={{
                borderRadius: "62% 38% 55% 45% / 48% 55% 45% 52%",
              }}
            >
              {imageUrl && (
                <Image
                  src={imageUrl}
                  alt={about.heading}
                  fill
                  sizes="(max-width: 1024px) 60vw, 300px"
                  className="object-cover grayscale"
                  unoptimized
                />
              )}
              <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
          </div>
        </div>

        <div className="hidden shrink-0 justify-center lg:flex lg:w-20 xl:w-28">
          <div className="h-full w-px bg-gray-800" />
        </div>

        <div className="relative w-full lg:w-2/3 lg:pt-1">
          <div className="pointer-events-none absolute inset-0 hidden sm:block">
            <div
              className="about-orb glass-orb absolute end-[8%] top-0 h-28 w-28 rounded-full sm:h-32 sm:w-32"
              style={{
                border: "1px solid rgba(255,255,255,0.12)",
                background:
                  "radial-gradient(circle at 30% 26%, #6b7280 0%, #374151 28%, #111827 62%, #000000 100%)",
                boxShadow:
                  "inset -10px -10px 22px rgba(0,0,0,0.65), inset 8px 8px 16px rgba(255,255,255,0.1), 0 12px 32px -6px rgba(0,0,0,0.6)",
              }}
            >
              <div
                className="absolute rounded-full"
                style={{
                  top: "10%",
                  left: "14%",
                  width: "34%",
                  height: "22%",
                  background:
                    "radial-gradient(circle, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.15) 45%, transparent 75%)",
                  filter: "blur(2px)",
                }}
              />
              <div
                className="absolute rounded-full"
                style={{
                  bottom: "10%",
                  right: "14%",
                  width: "26%",
                  height: "12%",
                  background:
                    "radial-gradient(circle, rgba(148,163,184,0.25) 0%, transparent 70%)",
                  filter: "blur(2px)",
                }}
              />
            </div>

            <div
              className="about-orb teal-orb absolute end-[26%] top-[88px] h-24 w-24 rounded-full sm:h-28 sm:w-28"
              style={{
                background:
                  "radial-gradient(circle at 32% 28%, #99f6e4 0%, #2dd4bf 22%, #0d9488 50%, #0f3d3a 78%, #041b19 100%)",
                boxShadow:
                  "inset -10px -10px 24px rgba(0,0,0,0.55), inset 8px 8px 18px rgba(255,255,255,0.18), 0 18px 40px -8px rgba(20,184,166,0.55), 0 0 60px -10px rgba(45,212,191,0.4)",
              }}
            >
              <div
                className="absolute rounded-full"
                style={{
                  top: "10%",
                  left: "16%",
                  width: "38%",
                  height: "26%",
                  background:
                    "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.35) 45%, transparent 75%)",
                  filter: "blur(2px)",
                }}
              />
              <div
                className="absolute rounded-full"
                style={{
                  bottom: "8%",
                  right: "12%",
                  width: "30%",
                  height: "14%",
                  background:
                    "radial-gradient(circle, rgba(153,246,228,0.35) 0%, transparent 70%)",
                  filter: "blur(3px)",
                }}
              />
            </div>
          </div>

          <p className="about-item font-mono text-sm tracking-[0.5em] text-teal-400 sm:text-base">
            {about.label}
          </p>

          <h2 className="about-item mt-3 font-mono text-4xl font-bold text-gray-400 sm:text-5xl">
            {about.heading}
          </h2>

          <p className="about-item relative z-10 mt-10 font-mono text-xl text-gray-300 sm:mt-12 sm:text-2xl">
            {about.greeting}
          </p>

          <p className="about-item mt-5 max-w-2xl text-base leading-relaxed text-gray-500 sm:text-lg">
            {about.description}
          </p>

          <a
            href={`mailto:${about.email}`}
            className="about-item mt-6 flex items-center gap-3 transition-colors hover:opacity-80"
          >
            <Mail className="h-5 w-5 text-gray-300" strokeWidth={1.75} />
            <span className="font-mono text-base text-teal-400 sm:text-lg">
              {about.email}
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
