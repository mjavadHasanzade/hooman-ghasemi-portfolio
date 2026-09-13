"use client";

import { useEffect, useRef } from "react";
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
      const boxes = gridRef.current!.querySelectorAll(".tech-box");

      gsap.to(boxes, {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.set(boxes, { y: 24 });
    }, gridRef);

    return () => ctx.revert();
  }, []);

  console.log({ techIcons });

  return (
    <section className="relative w-full overflow-hidden bg-black py-16 text-white sm:py-20 md:py-24 lg:py-28">
      <div className="relative z-10 px-5 sm:px-8 md:px-12 lg:px-15 xl:px-20">
        <SectionHeading
          label={t("label")}
          heading={[
            [{ text: sectionHeadings.technologiesTitle, emphasis: true }],
          ]}
          description={[sectionHeadings.technologiesSubtitle]}
          className="mx-auto text-center"
        />

        <div
          ref={gridRef}
          className="
            mx-auto mt-14 flex max-w-4xl flex-wrap
            justify-center gap-8
            sm:mt-16 sm:gap-10
            lg:mt-20 lg:flex-nowrap lg:gap-12
          "
        >
          {techIcons.map((tool) => {
            const path = publicMediaUrl(tool.image ?? "");
            console.log({ path });

            return (
              <TechBox
                key={tool.key}
                icon={
                  tool.image ? (
                    <img
                      src={path}
                      alt={tool.label}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    getTechIcon(tool.key)
                  )
                }
                name={tool.label}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
