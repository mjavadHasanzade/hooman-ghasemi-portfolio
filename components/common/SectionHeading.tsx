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
    let mounted = true;
    const ctx = gsap.context(() => {
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
    }, descriptionRef);
    document.fonts.ready.then(() => { if (mounted) ScrollTrigger.refresh(); });
    return () => { mounted = false; ctx.revert(); };
  }, [descriptionKey]);

  return (
    <div className={`section-heading max-w-3xl ${isPersian && align === "center" ? "fa-heading-centered" : ""} ${className}`}>
      <h2
        className={`section-heading-label block ltr:font-mono font-bold uppercase tracking-[0.7rem] leading-[1.4] text-[25px] text-teal-500 ${labelClassName}`}
      >
        {label}
      </h2>

      <div role="heading" aria-level={3}
        className={`section-heading-title ltr:font-mono font-bold tracking-tight rtl:tracking-normal ${headingClassName}`}
      >
        {heading.map((line, lineIndex) => (
          <div key={lineIndex} className="block">
            {line.map((segment, segIndex) => (
              <RichText key={segIndex} value={segment.text}
                className={`${line.length === 1 ? "block" : "inline-block"}`} />
            ))}
          </div>
        ))}
      </div>

      {description && description.length > 0 && (
        <div
          ref={descriptionRef}
          className={`section-heading-description max-w-2xl ${descriptionClassName}`}
        >
          {description.map((line, i) => (
            <div key={i} data-line={i} className="block">
              <RichText value={line} />
            </div>
          ))}
        </div>
      )}

      {children}
    </div>
  );
}
