"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Gauge } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ServiceCard from "../molecules/ServiceCard";
import SectionHeading from "../common/SectionHeading";
import { publicMediaUrl } from "@/lib/media/public-media-url";
import type {
  PublicService,
  PublicSectionHeadings,
} from "@/lib/types/public-content";

import "swiper/css";
import "swiper/css/pagination";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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
        cardsRef.current!.querySelectorAll(".service-card-item"),
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
    if (key === "web-design" || key === "design") {
      return <WebDesignIcon className="h-full w-full" />;
    }

    if (key === "webflow" || key === "development") {
      return <WebflowIcon className="h-full w-full" />;
    }

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
          heading={[
            [
              {
                text: sectionHeadings.servicesTitle,
                emphasis: true,
              },
            ],
          ]}
          description={[sectionHeadings.servicesSubtitle]}
        />

        <div ref={cardsRef} className="relative mx-auto mt-12 sm:mt-14 lg:mt-16">
          <div className="sm:hidden">
            <Swiper
              modules={[Pagination]}
              slidesPerView={1.08}
              spaceBetween={14}
              pagination={{ clickable: true, el: ".services-pagination" }}
              className="overflow-visible! pb-9!"
            >
              {services.map((service) => (
                <SwiperSlide key={service.id} className="service-card-item h-auto">
                  <ServiceCard
                    icon={iconFor(service.iconKey)}
                    image={publicMediaUrl(service.image)}
                    title={service.title}
                    description={service.description}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
            {services.length > 1 && (
              <div className="services-pagination mt-5 flex justify-center gap-1.5" />
            )}
          </div>

          <div className="hidden max-w-6xl flex-wrap items-center justify-center gap-5 sm:flex xl:gap-4">
            {services.map((service) => (
              <div
                key={service.id}
                className="service-card-item w-[calc(50%-0.625rem)] lg:w-[calc(33.333333%-0.667rem)]"
              >
                <ServiceCard
                  icon={iconFor(service.iconKey)}
                  image={publicMediaUrl(service.image)}
                  title={service.title}
                  description={service.description}
                />
              </div>
            ))}
          </div>
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
