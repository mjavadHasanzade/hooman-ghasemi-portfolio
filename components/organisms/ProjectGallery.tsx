"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
      <div className="relative aspect-16/10 overflow-hidden bg-gray-950">
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
        <div className="pointer-events-none absolute inset-0 bg-linear-to-tr from-black/45 via-transparent to-teal-400/12" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 sm:p-7">
          <span className="h-px w-16 bg-teal-300/70 sm:w-24" />
          <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/55">
            {projectNumberLabel} {String(active + 1).padStart(2, "0")}
          </span>
        </div>
        {hasSlides && (
          <>
            <button type="button" onClick={previous} aria-label="Previous image" className="absolute start-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-black/45 p-2 text-white backdrop-blur transition hover:border-teal-300 hover:text-teal-200">
              <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
            </button>
            <button type="button" onClick={next} aria-label="Next image" className="absolute end-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-black/45 p-2 text-white backdrop-blur transition hover:border-teal-300 hover:text-teal-200">
              <ChevronRight className="h-4 w-4 rtl:rotate-180" />
            </button>
          </>
        )}
      </div>
      {hasSlides && (
        <div className="relative border-t border-white/10 bg-black/85 p-3 sm:p-4">
          <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
            {images.map((url, index) => (
              <button
                key={url}
                type="button"
                aria-label={`Go to image ${index + 1}`}
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
                  alt={`${alt} — ${index + 1}`}
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
