"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { ChevronLeft, ChevronRight, Circle } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import SectionHeading from "../common/SectionHeading";
import ProjectCard from "../molecules/ProjectCard";
import type { PublicProject } from "@/lib/types/public-content";
import { mediaUrl } from "@/lib/types/media";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function PortfolioSection({ projects }: { projects: PublicProject[] }) {
  const t = useTranslations("Portfolio");

  const portfolioRef = useRef<HTMLElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  const [prevEl, setPrevEl] = useState<HTMLButtonElement | null>(null);
  const [nextEl, setNextEl] = useState<HTMLButtonElement | null>(null);

  useLayoutEffect(() => {
    const section = portfolioRef.current;
    const container = cardsContainerRef.current;

    if (!section || !container) return;

    const cards = Array.from(
      container.querySelectorAll<HTMLElement>(".portfolio-project-card"),
    );

    if (!cards.length) return;

    const ctx = gsap.context(() => {
      let hasScrolled = false;

      const animation = gsap.timeline({
        paused: true,
      });

      animation.fromTo(
        cards,
        {
          opacity: 0,
          y: 50,
          scale: 0.97,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.65,
          stagger: 0.1,
          ease: "power3.out",
        },
      );

      const trigger = ScrollTrigger.create({
        trigger: container,

        start: "top 80%",
        end: "bottom 20%",

        onEnter: () => {
          hasScrolled = true;
          animation.play();
        },

        onLeaveBack: () => {
          if (!hasScrolled) return;

          animation.reverse();
        },
      });

      if (window.scrollY === 0) {
        animation.progress(1);
      }

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });

      return () => {
        trigger.kill();
        animation.kill();
      };
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={portfolioRef}
      className="relative w-full overflow-hidden bg-black py-16 text-white sm:py-20 md:py-24 lg:py-28"
    >
      {/* Heading */}
      <div className="px-5 sm:px-8 md:px-12 lg:px-15 xl:px-20">
        <SectionHeading
          label={t("label")}
          heading={[[{ text: t("heading"), emphasis: true }]]}
          description={[t("description")]}
        />
      </div>

      {/* Projects */}
      <div ref={cardsContainerRef} className="relative mt-10 sm:mt-12 lg:mt-14">
        <Swiper
          modules={[Navigation, Pagination]}
          slidesPerView={1.08}
          spaceBetween={16}
          breakpoints={{
            480: {
              slidesPerView: 1.25,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 1.8,
              spaceBetween: 24,
            },
            1024: {
              slidesPerView: 2.3,
              spaceBetween: 28,
            },
            1280: {
              slidesPerView: 2.5,
              spaceBetween: 32,
            },
          }}
          navigation={{
            prevEl,
            nextEl,
          }}
          pagination={{
            clickable: true,
            el: ".portfolio-pagination",
            renderBullet: (_, className) =>
              `<span class="${className} portfolio-bullet"></span>`,
          }}
          className="px-5! pb-2! sm:px-8! md:px-12! lg:px-15! xl:px-20!"
        >
          {projects
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((project) => {
              return (
                <SwiperSlide
                  key={project.id}
                  className="portfolio-project-card h-auto"
                >
                  <ProjectCard
                    image={mediaUrl(project.image)}
                    title={project.title || project.slug}
                    description={project.description}
                    visitSiteLabel={t("visitSite")}
                    viewProjectLabel={t("viewProject")}
                    viewProjectIcon={
                      <Circle className="h-3.5 w-3.5 fill-teal-500 text-teal-500" />
                    }
                    liveUrl={project.liveUrl}
                    techIcons={project.techIcons
                      .slice()
                      .sort((a, b) => a.order - b.order)
                      .map((techIcon) => (
                        <span
                          key={techIcon.key}
                          className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-700 text-xxs text-teal-400"
                          title={techIcon.label}
                        >
                          {techIcon.label.slice(0, 1).toUpperCase()}
                        </span>
                      ))}
                  />
                </SwiperSlide>
              );
            })}
        </Swiper>

        {/* Controls */}
        <div className="mt-8 grid grid-cols-[1fr_auto_1fr] items-center px-5 sm:px-8 md:px-12 lg:px-15 xl:px-20">
          <div />

          <div className="portfolio-pagination flex items-center justify-center gap-1.5" />

          <div className="flex items-center justify-end gap-3">
            <button
              ref={setPrevEl}
              type="button"
              aria-label="Previous project"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-700 text-gray-400 transition-colors duration-200 hover:border-teal-500 hover:text-teal-400"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <button
              ref={setNextEl}
              type="button"
              aria-label="Next project"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-700 text-gray-400 transition-colors duration-200 hover:border-teal-500 hover:text-teal-400"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
