"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

type ProjectGalleryProps = {
  images: string[];
  alt: string;
};

export default function ProjectGallery({
  images,
  alt,
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
    <div className="group relative overflow-hidden rounded-[6px] border border-white/10 bg-gray-950 shadow-[0_28px_100px_rgba(0,0,0,0.52)]">
      <div className="relative aspect-16/10 overflow-hidden rounded-[6px] bg-gray-950">
        <div className="absolute inset-0">
        <Image
          key={imageUrl}
          src={imageUrl}
          alt={alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 58vw"
          className="object-cover"
          unoptimized
        />
        </div>
        <div dir="ltr" className="pointer-events-none absolute end-3 top-3 z-10 flex min-w-20 flex-col gap-2 rounded-md border border-white/30 bg-black/40 px-3 py-2 text-white shadow-[0_2px_12px_rgba(0,0,0,0.5)] backdrop-blur-md sm:end-4 sm:top-4">
          <span className="font-mono text-[10px] leading-none tracking-[0.18em]" aria-live="polite" aria-atomic="true">
            IMG {String(active + 1).padStart(2, "0")}
          </span>
          <span aria-hidden="true" className="h-px w-full bg-teal-200 shadow-[0_0_4px_rgba(94,234,212,0.6)]" />
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
        <div className="absolute inset-x-0 bottom-0 z-10 border-t border-white/20 bg-black/30 p-2 backdrop-blur-sm sm:p-3">
          <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
            {images.map((url, index) => (
              <button
                key={url}
                type="button"
                aria-label={t("goToImage", { number: imageNumber(index + 1) })}
                aria-current={index === active ? "true" : undefined}
                onClick={() => setActive(index)}
                className={`relative h-10 w-14 shrink-0 overflow-hidden rounded border transition sm:h-16 sm:w-24 ${
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
