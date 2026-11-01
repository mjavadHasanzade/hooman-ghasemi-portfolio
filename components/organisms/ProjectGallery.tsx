"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

type ProjectGalleryProps = {
  images: string[];
  alt: string;
  projectNumberLabel: string;
};

export default function ProjectGallery({
  images,
  alt,
  projectNumberLabel,
}: ProjectGalleryProps) {
  const t = useTranslations("ProjectGallery");
  const isPersian = useLocale() === "fa";
  const imageNumber = (number: number, padded = false) => isPersian
    ? new Intl.NumberFormat("fa-IR", { useGrouping: false, minimumIntegerDigits: padded ? 2 : 1 }).format(number)
    : padded ? String(number).padStart(2, "0") : String(number);
  const [active, setActive] = useState(0);
  const hasSlides = images.length > 1;
  const imageUrl = images[active];

  if (!imageUrl) {
    return <div className="flex aspect-16/10 items-center justify-center rounded-[6px] border border-white/10 bg-gray-950 text-gray-500">{alt}</div>;
  }

  const previous = () => setActive((index) => (index - 1 + images.length) % images.length);
  const next = () => setActive((index) => (index + 1) % images.length);

  return (
    <div className="group relative rounded-[6px] border border-white/10 bg-gray-950 shadow-[0_28px_100px_rgba(0,0,0,0.52)]">
      <div className="relative aspect-16/10 overflow-hidden rounded-[6px] bg-gray-950">
        <div className={`absolute inset-0 ${hasSlides ? "bottom-8 sm:bottom-10" : ""}`}>
        <Image
          key={imageUrl}
          src={imageUrl}
          alt={alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 58vw"
          className="object-contain"
          unoptimized
        />
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-3 sm:p-4">
          <span className="h-px w-16 bg-teal-300/70 sm:w-24" />
          <span className="font-mono text-[10px] uppercase tracking-[0.24em] rounded bg-black/65 px-2 py-1 text-white/80">
            {projectNumberLabel} {imageNumber(active + 1, true)}
          </span>
        </div>
        {hasSlides && (
          <>
            <button type="button" onClick={previous} aria-label={t("previousImage")} className="absolute start-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-black/45 p-2 text-white backdrop-blur transition hover:border-teal-300 hover:text-teal-200">
              <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
            </button>
            <button type="button" onClick={next} aria-label={t("nextImage")} className="absolute end-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-black/45 p-2 text-white backdrop-blur transition hover:border-teal-300 hover:text-teal-200">
              <ChevronRight className="h-4 w-4 rtl:rotate-180" />
            </button>
          </>
        )}
      </div>
      {hasSlides && (
        <div className="relative z-10 mx-3 -mt-8 mb-3 rounded-lg border border-white/15 bg-black/85 p-3 shadow-xl backdrop-blur-md sm:mx-5 sm:-mt-10 sm:mb-5 sm:p-4">
          <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
            {images.map((url, index) => (
              <button
                key={url}
                type="button"
                aria-label={t("goToImage", { number: imageNumber(index + 1) })}
                aria-current={index === active ? "true" : undefined}
                onClick={() => setActive(index)}
                className={`relative h-14 w-20 shrink-0 overflow-hidden rounded border transition sm:h-16 sm:w-24 ${
                  index === active
                    ? "border-teal-300 ring-1 ring-teal-300/70"
                    : "border-white/15 opacity-55 hover:border-white/45 hover:opacity-100"
                }`}
              >
                <Image
                  src={url}
                  alt={`${alt} — ${imageNumber(index + 1)}`}
                  fill
                  sizes="96px"
                  className="object-contain"
                  unoptimized
                />
                {index === active && (
                  <span className="absolute inset-0 bg-teal-300/10" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
