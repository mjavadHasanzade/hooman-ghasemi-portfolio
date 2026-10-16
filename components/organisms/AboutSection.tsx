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
        );
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
                  className="object-cover"
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
          <p className="about-item font-mono text-base tracking-[0.5em] text-teal-400 sm:text-lg">
            {about.label}
          </p>

          <h2 className="about-item mt-3 font-mono text-4xl font-bold text-gray-400 sm:text-5xl">
            {about.heading}
          </h2>

          <p className="about-item relative z-10 mt-10 font-mono text-2xl text-gray-100 sm:mt-12 sm:text-3xl">
            {about.greeting}
          </p>

          <div
            className="about-item mt-5 max-w-2xl text-justify text-lg leading-relaxed text-gray-200 sm:text-xl [&_p+p]:mt-4 [&_strong]:font-semibold [&_ul]:my-4 [&_ul]:list-disc [&_ul]:ps-6 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:ps-6"
            dangerouslySetInnerHTML={{ __html: about.description }}
          />

          <a
            href={`mailto:${about.email}`}
            className="about-item mt-6 flex items-center gap-3 transition-colors hover:opacity-80"
          >
            <Mail className="h-5 w-5 text-gray-300" strokeWidth={1.75} />
            <span className="font-mono text-lg text-teal-400 sm:text-xl">
              {about.email}
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
