"use client";

import RichText from "./RichText";
import { useLocale } from "next-intl";
import { ReactNode, useLayoutEffect, useRef } from "react";
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
  animate?: boolean;
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
  animate = true,
}: SectionHeadingProps) {
  const isPersian = useLocale() === "fa";
  const headingRef = useRef<HTMLDivElement>(null);
  const contentKey = JSON.stringify([label, heading, description]);

  useLayoutEffect(() => {
    const element = headingRef.current;
    if (!element || !animate) return;
    let mounted = true;
    const ctx = gsap.context(() => {
      const parts = element.querySelectorAll(
        ":scope > .section-heading-label, :scope > .section-heading-title, :scope > .section-heading-description",
      );
      gsap.set(parts, { autoAlpha: 0, y: 48 });
      gsap.fromTo(parts, { autoAlpha: 0, y: 48 }, {
        autoAlpha: 1,
        y: 0,
        duration: 0.65,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start: "top 88%",
          end: "bottom top",
          toggleActions: "play reset play reset",
          invalidateOnRefresh: true,
        },
      });
    }, element);
    document.fonts.ready.then(() => { if (mounted) ScrollTrigger.refresh(); });
    return () => { mounted = false; ctx.revert(); };
  }, [contentKey, animate]);

  return (
    <div ref={headingRef} className={`section-heading max-w-3xl ${isPersian && align === "center" ? "fa-heading-centered" : ""} ${className}`}>
      <h2
        style={{ opacity: 0, visibility: "hidden" }}
        className={`section-heading-label block ltr:font-mono font-bold uppercase tracking-[0.7rem] leading-[1.4] text-[25px] text-teal-500 ${labelClassName}`}
      >
        {label}
      </h2>

      <div role="heading" aria-level={3}
        style={{ opacity: 0, visibility: "hidden" }}
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
          style={{ opacity: 0, visibility: "hidden" }}
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
