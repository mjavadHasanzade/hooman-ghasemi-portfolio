"use client";

import { ReactNode } from "react";

interface ServiceCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export default function ServiceCard({
  icon,
  title,
  description,
}: ServiceCardProps) {
  const [firstWord, ...rest] = title.split(" ");
  const restOfTitle = rest.join(" ");

  return (
    <div className="group relative overflow-hidden rounded p-px">
      <div
        aria-hidden="true"
        className="
          absolute inset-[-55%]
          animate-[spin_11s_linear_infinite]
          bg-[conic-gradient(from_171deg,transparent_0deg,transparent_100deg,rgba(45,212,191,0.22)_140deg,rgba(94,234,212,0.95)_234deg,rgba(45,212,191,0.22)_290deg,transparent_360deg)]
        "
      />

      <div
        className="
          relative z-10 flex h-full min-h-80 flex-col
          overflow-hidden rounded
          bg-[#050505] px-8 py-9
          transition-transform duration-500 ease-out
          hover:-translate-y-1
          sm:min-h-88 sm:px-9 sm:py-10
          lg:min-h-96
        "
      >
        <div
          aria-hidden="true"
          className="
            pointer-events-none absolute inset-0
            bg-[radial-gradient(60%_50%_at_82%_8%,rgba(255,255,255,0.055),transparent_70%)]
          "
        />

        <div className="relative mb-8 h-20 w-20 sm:mb-9 sm:h-24 sm:w-24">
          {icon}
        </div>

        <h3 className="relative mb-5 font-mono text-3xl font-bold leading-[1.2] tracking-tight sm:text-4xl">
          <span className="font-normal text-gray-400">{firstWord}</span>
          {restOfTitle && (
            <>
              {" "}
              <span className="text-gray-100">{restOfTitle}</span>
            </>
          )}
        </h3>

        <p className="relative max-w-xs text-base leading-relaxed text-gray-300 sm:text-lg">
          {description}
        </p>
      </div>
    </div>
  );
}
