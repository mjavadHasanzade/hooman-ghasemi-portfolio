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

const LINE_FINAL_COLORS = [
  "rgb(229 231 235)", // gray-200
  "rgb(107 114 128)", // gray-500
];

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

      const orderedWords = /*isRTL ? [...words].reverse() :*/ words;

      const getFinalColor = (word: HTMLElement) => {
        const line = word.closest<HTMLElement>("[data-line]");
        const lineIndex = Number(line?.dataset.line ?? 0);

        return (
          LINE_FINAL_COLORS[lineIndex] ??
          LINE_FINAL_COLORS[LINE_FINAL_COLORS.length - 1]
        );
      };

      gsap.set(words, {
        color: DIM_COLOR,
      });

      let lastActiveCount = 0;

      const trigger = ScrollTrigger.create({
        trigger: descriptionRef.current,
        start: "top 85%",
        end: "top 30%",

        onUpdate: (self) => {
          const activeCount = Math.min(
            orderedWords.length,
            Math.floor(self.progress * orderedWords.length),
          );

          if (activeCount === lastActiveCount) return;

          // روشن شدن
          if (activeCount > lastActiveCount) {
            for (let i = lastActiveCount; i < activeCount; i++) {
              const word = orderedWords[i];

              if (!word) continue;

              gsap.to(word, {
                color: getFinalColor(word),
                duration: 0.18,
                ease: "power1.out",
                overwrite: true,
              });
            }
          } else {
            for (let i = activeCount; i < lastActiveCount; i++) {
              const word = orderedWords[i];

              if (!word) continue;

              gsap.to(word, {
                color: DIM_COLOR,
                duration: 0.12,
                ease: "power1.in",
                overwrite: true,
              });
            }
          }

          lastActiveCount = activeCount;
        },

        onLeaveBack: () => {
          lastActiveCount = 0;

          gsap.killTweensOf(words);

          gsap.set(words, {
            color: DIM_COLOR,
          });
        },
      });

      return () => {
        trigger.kill();
        gsap.killTweensOf(words);
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
          className={`section-heading-description mt-3 max-w-2xl text-[22px] leading-normal font-light [word-spacing:0.5rem] ${descriptionClassName}`}
        >
          {description.map((line, i) => (
            <div key={i} data-line={i} className="block">
              {isPersian || /<\/?[a-z][^>]*>/i.test(line)
                ? <RichText value={line} className="text-gray-200" />
                : splitIntoWordSpans(line, i)}
            </div>
          ))}
        </div>
      )}

      {children}
    </div>
  );
}
