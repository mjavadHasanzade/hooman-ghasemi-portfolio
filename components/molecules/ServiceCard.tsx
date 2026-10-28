"use client";

import { richTextHtml } from "@/lib/rich-text";

import Image from "next/image";
import { ReactNode } from "react";

interface ServiceCardProps {
  icon: ReactNode;
  image: string | null;
  title: string;
  description: string;
}

export default function ServiceCard({
  icon,
  image,
  title,
  description,
}: ServiceCardProps) {
  return (
    <div className="group relative h-full overflow-hidden rounded p-px">
      <div
        aria-hidden="true"
        className="absolute inset-[-55%] animate-[spin_11s_linear_infinite] bg-[conic-gradient(from_171deg,transparent_0deg,transparent_100deg,rgba(45,212,191,0.22)_140deg,rgba(94,234,212,0.95)_234deg,rgba(45,212,191,0.22)_290deg,transparent_360deg)]"
      />

      <div className="relative z-10 flex h-full min-h-64 flex-col overflow-hidden rounded bg-[#050505] px-5 py-6 transition-transform duration-500 ease-out hover:-translate-y-1 sm:min-h-72 sm:px-6 sm:py-7 xl:min-h-64 xl:px-5 xl:py-6">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_82%_8%,rgba(255,255,255,0.055),transparent_70%)]"
        />

        <div className="relative z-10 mb-5 h-14 w-14 overflow-hidden rounded-lg sm:mb-6 sm:h-16 sm:w-16">
          {image ? (
            <Image
              src={image}
              alt=""
              fill
              sizes="64px"
              className="object-cover"
              unoptimized
            />
          ) : (
            icon
          )}
        </div>

        <div role="heading" aria-level={3} className="cms-rich-text service-title relative z-10 mb-3 ltr:font-mono text-2xl font-bold leading-[1.15] tracking-tight text-gray-100 rtl:leading-[1.4] sm:text-3xl xl:text-2xl" dangerouslySetInnerHTML={{ __html: richTextHtml(title) }} />

        <div className="cms-rich-text service-description relative z-10 mt-2 max-w-xs text-base leading-7 tracking-wider text-gray-200 sm:text-lg xl:text-base" dangerouslySetInnerHTML={{ __html: richTextHtml(description) }} />
      </div>
    </div>
  );
}
