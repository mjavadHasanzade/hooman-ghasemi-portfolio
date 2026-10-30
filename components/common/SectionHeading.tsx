"use client";

import RichText from "./RichText";
import { usePersianWordReveal } from "@/hooks/usePersianTextReveal";
import { richTextPlainText } from "@/lib/rich-text";
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

const DIM_COLOR = "rgba(75, 85, 99, 0.35)";

function splitIntoWordSpans(text: string, lineIndex: number) {
  return text.split(" ").map((word, i) => (
    <span
      key={`${lineIndex}-${i}`}
      className="gsap-reveal-word inline-block will-change-[color]"
      style={{ color: DIM_COLOR }}
    >
      {word}
      {i < text.split(" ").length - 1 ? "\u00A0" : ""}
    </span>
  ));
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
  usePersianWordReveal(descriptionRef, JSON.stringify(description));

  useEffect(() => {
    if (!descriptionRef.current) return;

    const ctx = gsap.context(() => {
      if (isPersian) return;

      const wordElements =
        descriptionRef.current!.querySelectorAll<HTMLElement>(
          ".gsap-reveal-word",
        );

      const words = Array.from(wordElements);

      if (!words.length) return;

      gsap.set(words, {
        color: DIM_COLOR,
      });

      let revealedCount = 0;

      const trigger = ScrollTrigger.create({
        trigger: descriptionRef.current,
        start: "top 88%",
        end: "top 34%",
        onUpdate: (self) => {
          const nextCount = Math.round(self.progress * words.length);
          if (nextCount === revealedCount) return;

          if (nextCount > revealedCount) {
            gsap.set(words.slice(revealedCount, nextCount), {
              color: "rgb(229 231 235)",
            });
          } else {
            gsap.set(words.slice(nextCount, revealedCount), {
              color: DIM_COLOR,
            });
          }

          revealedCount = nextCount;
        },
        onLeaveBack: () => {
          revealedCount = 0;
          gsap.set(words, { color: DIM_COLOR });
        },
        invalidateOnRefresh: true,
      });

      return () => {
        trigger.kill();
      };
    }, descriptionRef);

    return () => ctx.revert();
  }, [description, isPersian]);

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
              {isPersian ? (
                <RichText value={line} className="text-gray-200" revealWords />
              ) : (
                splitIntoWordSpans(
                  /<\/?[a-z][^>]*>/i.test(line)
                    ? richTextPlainText(line, false)
                    : line,
                  i,
                )
              )}
            </div>
          ))}
        </div>
      )}

      {children}
    </div>
  );
}
