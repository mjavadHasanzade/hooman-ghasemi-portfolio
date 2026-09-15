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
        className="absolute inset-[-55%] animate-[spin_11s_linear_infinite] bg-[conic-gradient(from_171deg,transparent_0deg,transparent_100deg,rgba(45,212,191,0.22)_140deg,rgba(94,234,212,0.95)_234deg,rgba(45,212,191,0.22)_290deg,transparent_360deg)]"
      />

      <div className="relative z-10 flex h-full min-h-64 flex-col overflow-hidden rounded bg-[#050505] px-5 py-6 transition-transform duration-500 ease-out hover:-translate-y-1 sm:min-h-72 sm:px-6 sm:py-7 xl:min-h-64 xl:px-5 xl:py-6">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_82%_8%,rgba(255,255,255,0.055),transparent_70%)]"
        />

        <div className="relative mb-5 h-14 w-14 sm:mb-6 sm:h-16 sm:w-16">
          {icon}
        </div>

        <h3 className="relative mb-3 font-mono text-2xl font-bold leading-[1.15] tracking-tight sm:text-3xl xl:text-2xl">
          <span className="font-normal text-gray-400">{firstWord}</span>
          {restOfTitle && (
            <>
              {" "}
              <span className="text-gray-100">{restOfTitle}</span>
            </>
          )}
        </h3>

        <p className="relative max-w-xs text-sm leading-7 text-gray-300 sm:text-base xl:text-sm">
          {description}
        </p>
      </div>
    </div>
  );
}
