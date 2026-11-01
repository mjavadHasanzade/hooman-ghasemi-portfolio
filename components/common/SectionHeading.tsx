"use client";

import RichText from "./RichText";
import { useLocale } from "next-intl";
import { ReactNode, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface HeadingSegment {
  text: string;
  emphasis?: boolean;
}

interface SectionHeadingProps {
  label: string;
  heading: HeadingSegment[][];
  description?: string[];
  align?: "left" | "center";
  className?: string;
  labelClassName?: string;
  headingClassName?: string;
  descriptionClassName?: string;
  children?: ReactNode;
}

export default function SectionHeading({
  label,
  heading,
  description,
  align = "left",
  className = "",
  labelClassName = "",
  headingClassName = "",
  descriptionClassName = "",
  children,
}: SectionHeadingProps) {
  const isPersian = useLocale() === "fa";
  const descriptionRef = useRef<HTMLDivElement>(null);
  const descriptionKey = JSON.stringify(description);

  useEffect(() => {
    if (!descriptionRef.current) return;
    const media = gsap.matchMedia();
    let mounted = true;
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(descriptionRef.current, { opacity: 0, y: 28 }, {
        opacity: 1,
        y: 0,
        duration: 0.75,
        ease: "power2.out",
        scrollTrigger: {
          trigger: descriptionRef.current,
          start: "top 90%",
          toggleActions: "play none none reverse",
          invalidateOnRefresh: true,
        },
      });
    });
    document.fonts.ready.then(() => { if (mounted) ScrollTrigger.refresh(); });
    return () => { mounted = false; media.revert(); };
  }, [descriptionKey]);

  return (
    <div className={`section-heading max-w-3xl ${isPersian && align === "center" ? "fa-heading-centered" : ""} ${className}`}>
      <h2
        className={`section-heading-label block ltr:font-mono font-bold uppercase tracking-[0.7rem] leading-[1.4] text-[25px] text-teal-500 ${labelClassName}`}
      >
        {label}
      </h2>

      <div role="heading" aria-level={3}
        className={`section-heading-title ltr:font-mono text-3xl font-bold leading-[1.15] tracking-tight sm:text-4xl md:text-[2.4rem] lg:text-[52px] ${headingClassName}`}
      >
        {heading.map((line, lineIndex) => (
          <div key={lineIndex} className="block">
            {line.map((segment, segIndex) => (
              <RichText key={segIndex} value={segment.text}
                className={`${line.length === 1 ? "block" : "inline-block"} ${segment.emphasis ? "text-white" : "text-gray-400"}`} />
            ))}
          </div>
        ))}
      </div>

      {description && description.length > 0 && (
        <div
          ref={descriptionRef}
          className={`section-heading-description mt-5 max-w-2xl text-[22px] leading-[1.3] font-light [word-spacing:0.5rem] sm:mt-6 sm:leading-[1.34] ${descriptionClassName}`}
        >
          {description.map((line, i) => (
            <div key={i} data-line={i} className="block">
              <RichText value={line} className="text-gray-200" />
            </div>
          ))}
        </div>
      )}

      {children}
    </div>
  );
}
