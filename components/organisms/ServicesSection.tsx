"use client";
import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Gauge } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ServiceCard from "../molecules/ServiceCard";
import SectionHeading from "../common/SectionHeading";
import type { PublicService } from "@/lib/types/public-content";
import type { PublicSectionHeadings } from "@/lib/types/public-content";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export default function ServicesSection({
  services,
  sectionHeadings,
}: {
  services: PublicService[];
  sectionHeadings: PublicSectionHeadings;
}) {
  const t = useTranslations("Services");
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardsRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardsRef.current!.children,
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            once: true,
          },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [services.length]);

  function iconFor(key: string) {
    if (key === "web-design" || key === "design")
      return <WebDesignIcon className="h-full w-full" />;
    if (key === "webflow" || key === "development")
      return <WebflowIcon className="h-full w-full" />;
    return <Gauge className="h-full w-full" strokeWidth={1.5} />;
  }

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-black py-16 text-white sm:py-20 md:py-24 lg:py-28"
    >
      <div className="relative z-10 px-5 sm:px-8 md:px-12 lg:px-15 xl:px-20">
        <SectionHeading
          label={t("label")}
          heading={[[{ text: sectionHeadings.servicesTitle, emphasis: true }]]}
          description={[sectionHeadings.servicesSubtitle]}
        />

        <div
          ref={cardsRef}
          className="
            relative mt-14 grid grid-cols-1 gap-6
            sm:mt-16 sm:gap-7
            md:grid-cols-2
            lg:mt-20 lg:grid-cols-3 lg:gap-8
          "
        >
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              icon={iconFor(service.iconKey)}
              title={service.title}
              description={service.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function WebDesignIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className}>
      <rect
        x="6"
        y="10"
        width="32"
        height="23"
        rx="1"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <path
        d="M14 40H30"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path d="M22 33V40" stroke="currentColor" strokeWidth="2.5" />
      <path
        d="M33 28L50 11C51.3 9.7 53.4 9.7 54.7 11C56 12.3 56 14.4 54.7 15.7L37.7 32.7L31 34.5L33 28Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function WebflowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className}>
      <circle cx="32" cy="32" r="23" stroke="currentColor" strokeWidth="2.5" />
      <path
        d="M20 23L25 41L32 27L39 41L44 23"
        stroke="currentColor"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
