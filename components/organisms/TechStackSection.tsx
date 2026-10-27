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

  useEffect(() => {
    if (!gridRef.current) return;

    const ctx = gsap.context(() => {
      const boxes = gsap.utils.toArray<HTMLElement>(".tech-box");

      // --------------------------------------------------
      // Initial state
      // --------------------------------------------------

      gsap.set(boxes, {
        opacity: 0,
        y: 24,
      });

      // --------------------------------------------------
      // Entrance animation
      // --------------------------------------------------

      gsap.fromTo(
        boxes,
        {
          opacity: 0,
        },
        {
          opacity: 1,
          y: 0,
          stagger: {
            amount: 0.1,
            from: "start",
          },
          duration: 0.6,
          ease: "power2.out",

          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );

      // --------------------------------------------------
      // Random blinking
      // --------------------------------------------------
    }, gridRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-black py-16 text-white sm:py-20 md:py-24 lg:py-28">
      <div className="relative z-10 px-5 sm:px-8 md:px-12 lg:px-15 xl:px-20">
        <SectionHeading
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
                  tech-box
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
