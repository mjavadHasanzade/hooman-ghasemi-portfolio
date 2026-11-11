"use client";

import {
  CSSProperties,
  MouseEvent,
  ReactNode,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useLocale, useTranslations } from "next-intl";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import SectionHeading from "../common/SectionHeading";
import PulsingDot from "../common/PulsingDot";
import ProjectCard from "../molecules/ProjectCard";
import type {
  PublicProject,
  PublicSectionHeadings,
} from "@/lib/types/public-content";
import { publicMediaUrl } from "@/lib/media/public-media-url";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function PortfolioSection({
  projects,
  sectionHeadings,
}: {
  projects: PublicProject[];
  sectionHeadings: PublicSectionHeadings;
}) {
  const locale = useLocale();
  const t = useTranslations("Portfolio");

  const portfolioRef = useRef<HTMLElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  const animationKey = JSON.stringify([locale, sectionHeadings.projectsTitle, sectionHeadings.projectsSubtitle, projects.map((project) => [project.id, project.order])]);

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
      const heading = section.querySelector(".section-heading");
      const headingParts = section.querySelectorAll(
        ".section-heading-label, .section-heading-title, .section-heading-description",
      );
      // Set every slide before constructing staggered tweens: future stagger
      // targets must not remain visible while the first card waits to animate.
      gsap.set(cards, { autoAlpha: 0, y: -64, scale: 0.97 });
      let headingComplete = false;
      let cardsInView = false;
      const cardsAnimation = gsap.to(cards, {
        paused: true,
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        stagger: (index: number) => Math.min(index, 3) * 0.12,
        ease: "power2.out",
      });
      const revealCards = () => {
        if (headingComplete && cardsInView) cardsAnimation.play();
      };
      const resetCards = () => {
        headingComplete = false;
        cardsAnimation.pause(0);
      };
      gsap.set(headingParts, { autoAlpha: 0, y: 48 });
      const headingAnimation = gsap.fromTo(
        headingParts,
        { autoAlpha: 0, y: 48 },
        {
          paused: true,
          autoAlpha: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.08,
          ease: "power2.out",
          onComplete: () => { headingComplete = true; revealCards(); },
        },
      );
      ScrollTrigger.create({
        trigger: heading ?? section,
        start: "top 88%",
        endTrigger: section,
        end: "bottom top",
        animation: headingAnimation,
        toggleActions: "restart reset restart reset",
        onLeave: resetCards,
        onLeaveBack: resetCards,
        invalidateOnRefresh: true,
      });
      ScrollTrigger.create({
        trigger: container,
        start: "top 92%",
        endTrigger: section,
        end: "bottom top",
        onToggle: (trigger) => {
          cardsInView = trigger.isActive;
          revealCards();
        },
      });
    }, section);

    let mounted = true;
    document.fonts.ready.then(() => { if (mounted) ScrollTrigger.refresh(); });
    return () => { mounted = false; ctx.revert(); };
  }, [animationKey]);

  return (
    <section
      id="portfolio"
      ref={portfolioRef}
      className="relative w-full overflow-hidden bg-black py-16 text-white sm:py-20 md:py-24 lg:py-28"
    >
      {/* Heading */}
      <div className="px-5 sm:px-8 md:px-12 lg:px-15 xl:px-20">
        <SectionHeading
          animate={projects.length === 0}
          label={t("label")}
          heading={[[{ text: sectionHeadings.projectsTitle, emphasis: true }]]}
          description={[sectionHeadings.projectsSubtitle]}
        />
      </div>

      {/* Projects */}
      <div ref={cardsContainerRef} className="relative mt-10 sm:mt-12 lg:mt-14">
        <Swiper
          key={locale}
          dir={locale === "fa" ? "rtl" : "ltr"}
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
                  className="portfolio-project-card flex h-auto!"
                  style={{ opacity: 0, visibility: "hidden" }}
                >
                  <ProjectCard
                    image={publicMediaUrl(project.image)}
                    title={project.title || project.slug}
                    description={project.description}
                    visitSiteLabel={t("visitSite")}
                    viewProjectLabel={t("viewProject")}
                    viewProjectIcon={
                      <PulsingDot />
                    }
                    liveUrl={project.liveUrl}
                    slug={project.slug}
                    techIcons={project.techIcons
                      .slice()
                      .sort((a, b) => a.order - b.order)
                      .map((techIcon) => (
                        <TechIconGlow key={techIcon.key} label={techIcon.label}>
                          {techIcon.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={publicMediaUrl(techIcon.image) ?? undefined}
                              alt=""
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <span className="text-xxs text-teal-400">
                              {techIcon.label.slice(0, 1).toUpperCase()}
                            </span>
                          )}
                        </TechIconGlow>
                      ))}
                  />
                </SwiperSlide>
              );
            })}
        </Swiper>

        {/* Controls */}
        <div className="mt-8 grid grid-cols-1 items-center gap-y-5 px-5 sm:px-8 md:px-12 lg:px-15 xl:px-20">
          <div className="portfolio-pagination flex min-w-0 flex-wrap items-center justify-center gap-1.5" />

          <div className="flex items-center justify-center gap-3">
            <button
              ref={setPrevEl}
              type="button"
              aria-label={t("previousProject")}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-700 text-gray-400 transition-colors duration-200 hover:border-teal-500 hover:text-teal-400"
            >
              <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
            </button>

            <button
              ref={setNextEl}
              type="button"
              aria-label={t("nextProject")}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-700 text-gray-400 transition-colors duration-200 hover:border-teal-500 hover:text-teal-400"
            >
              <ChevronRight className="h-4 w-4 rtl:rotate-180" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

interface TechIconGlowProps {
  children: ReactNode;
  label?: string;
}

export function TechIconGlow({ children, label }: TechIconGlowProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    el.style.setProperty("--x", `${x}px`);
    el.style.setProperty("--y", `${y}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      title={label}
      style={{ "--x": "50%", "--y": "50%" } as CSSProperties}
      className="group relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg transition-all duration-300  hover:shadow-[0_0_5px_rgba(45,212,191,0.1)]"
    >
      {/* base ambient glow — always visible */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(45, 212, 191, 0.35), transparent 70%)",
        }}
      />

      {/* cursor-tracking glow — appears on hover */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(60px circle at var(--x) var(--y), rgba(45, 212, 191, 0.6), transparent 70%)",
        }}
      />

      {/* icon content */}
      <div className="relative z-10 flex h-full w-full items-center justify-center p-1.5 text-teal-400">
        {children}
      </div>
    </div>
  );
}
