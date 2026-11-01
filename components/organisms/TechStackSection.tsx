"use client";

import { sortTechIcons } from "@/lib/tech-icon-order";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeading from "../common/SectionHeading";
import TechBox from "../atoms/TechBox";
import {
  WebflowLogo,
  GsapLogo,
  FigmaLogo,
  FramerLogo,
  CodeLogo,
} from "../atoms/icons/TechIcons";
import type {
  PublicSectionHeadings,
  PublicTechIcon,
} from "@/lib/types/public-content";
import { publicMediaUrl } from "@/lib/media/public-media-url";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function getTechIcon(key: string) {
  switch (key) {
    case "webflow":
      return <WebflowLogo className="h-full w-full" />;

    case "gsap":
      return <GsapLogo className="h-full w-full" />;

    case "framer":
      return <FramerLogo className="h-full w-full" />;

    case "figma":
      return <FigmaLogo className="h-full w-full" />;

    default:
      return <CodeLogo className="h-full w-full text-teal-500" />;
  }
}

export default function TechStackSection({
  techIcons,
  sectionHeadings,
}: {
  techIcons: PublicTechIcon[];
  sectionHeadings: PublicSectionHeadings;
}) {
  const t = useTranslations("TechStack");
  const gridRef = useRef<HTMLDivElement>(null);

  const iconOrderKey = sortTechIcons(techIcons).map((icon) => icon.key).join("|");

  useEffect(() => {
    if (!gridRef.current) return;

    const grid = gridRef.current;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const cells = Array.from(grid.children);
      const marks = Array.from(grid.querySelectorAll<HTMLElement>(".tech-box-blink"));
      gsap.fromTo(cells, { opacity: 0, y: 24 }, {
        opacity: 1, y: 0, stagger: 0.06, duration: 0.6, ease: "power2.out",
        scrollTrigger: { trigger: grid, start: "top 85%", toggleActions: "play none none reverse" },
      });

      let animations: Animation[] = [];
      let timer: ReturnType<typeof setInterval> | undefined;
      const blink = () => {
        if (document.hidden) return;
        animations.forEach((animation) => animation.cancel());
        const pool = [...marks];
        const selected: HTMLElement[] = [];
        while (pool.length && selected.length < 3) {
          selected.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
        }
        animations = selected.map((mark) => mark.animate([
          { borderColor: "#1f2937", boxShadow: "0 0 0 rgb(45 212 191 / 0)" },
          { borderColor: "#5eead4", boxShadow: "0 0 20px rgb(45 212 191 / .38)", offset: 0.35 },
          { borderColor: "#2a746d", boxShadow: "0 0 5px rgb(45 212 191 / .12)", offset: 0.6 },
          { borderColor: "#5eead4", boxShadow: "0 0 16px rgb(45 212 191 / .3)", offset: 0.75 },
          { borderColor: "#1f2937", boxShadow: "0 0 0 rgb(45 212 191 / 0)" },
        ], { duration: 2400, easing: "ease-in-out" }));
      };
      const observer = new IntersectionObserver(([entry]) => {
        if (timer) clearInterval(timer);
        timer = undefined;
        if (entry.isIntersecting) {
          blink();
          timer = setInterval(blink, 3800);
        } else {
          animations.forEach((animation) => animation.cancel());
        }
      });
      observer.observe(grid);
      return () => {
        observer.disconnect();
        if (timer) clearInterval(timer);
        animations.forEach((animation) => animation.cancel());
      };
    });
    return () => media.revert();
  }, [iconOrderKey]);

  return (
    <section className="relative w-full overflow-hidden bg-black py-16 text-white sm:py-20 md:py-24 lg:py-28">
      <div className="relative z-10 px-5 sm:px-8 md:px-12 lg:px-15 xl:px-20">
        <SectionHeading
          align="center"
          label={t("label")}
          heading={[
            [
              {
                text: sectionHeadings.technologiesTitle,
                emphasis: true,
              },
            ],
          ]}
          description={[sectionHeadings.technologiesSubtitle]}
          className="mx-auto text-center"
        />

        <div
          ref={gridRef}
          className="
            mx-auto mt-14 flex max-w-5xl
            flex-wrap items-center justify-center
            gap-x-4 gap-y-10

            sm:mt-16
            sm:gap-x-8 sm:gap-y-12

            md:gap-x-10

            lg:mt-20
            lg:gap-x-6 lg:gap-y-10
          "
        >
          {sortTechIcons(techIcons).map((tool) => {
            const path = publicMediaUrl(tool.image);

            return (
              <div
                key={tool.key}
                className="
                  tech-cell
                  flex w-[calc((100%-2rem)/3)]
                  justify-center

                  sm:w-[calc((100%-4rem)/3)]

                  md:w-[calc((100%-7.5rem)/4)]

                  lg:w-[calc((100%-6rem)/5)]
                "
              >
                <TechBox
                  icon={
                    tool.image && path ? (
                      <Image
                        src={path}
                        alt={tool.label}
                        width={48}
                        height={48}
                        className="h-full w-full object-contain"
                        unoptimized
                      />
                    ) : (
                      getTechIcon(tool.key)
                    )
                  }
                  name={tool.label}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
