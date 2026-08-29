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

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function TechStackSection() {
  const t = useTranslations("TechStack");
  const gridRef = useRef<HTMLDivElement>(null);

  const tools = [
    { key: "webflow", icon: <WebflowLogo className="h-full w-full" /> },
    { key: "gsap", icon: <GsapLogo className="h-full w-full" /> },
    { key: "framer", icon: <FramerLogo className="h-full w-full" /> },
    { key: "figma", icon: <FigmaLogo className="h-full w-full" /> },
    { key: "code", icon: <CodeLogo className="h-full w-full text-teal-500" /> },
  ];

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

  return (
    <section className="relative w-full overflow-hidden bg-black py-16 text-white sm:py-20 md:py-24 lg:py-28">
      <div className="relative z-10 px-5 sm:px-8 md:px-12 lg:px-[60px] xl:px-[80px]">
        <SectionHeading
          label={t("label")}
          heading={[[{ text: t("heading"), emphasis: true }]]}
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
          {tools.map((tool) => (
            <TechBox
              key={tool.key}
              icon={tool.icon}
              //@ts-ignore
              name={t(`tools.${tool.key}`)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
