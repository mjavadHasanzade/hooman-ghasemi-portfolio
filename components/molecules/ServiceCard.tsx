import { ReactNode } from "react";

interface ServiceCardProps {
  icon: ReactNode;
  titleThin: string;
  titleBold: string;
  description: string;
}

export default function ServiceCard({
  icon,
  titleThin,
  titleBold,
  description,
}: ServiceCardProps) {
  return (
    <div
      className="
        group border-fade-teal relative flex min-h-80 flex-col
        overflow-hidden bg-black
        px-8 py-9
        transition-transform duration-500 ease-out
        hover:-translate-y-1
        sm:min-h-100 sm:px-9 sm:py-10
        lg:min-h-120 lg:px-10 lg:py-10
      "
    >
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute inset-0
          bg-[radial-gradient(120%_70%_at_18%_-8%,rgba(255,255,255,0.22),transparent_62%)]
        "
      />
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute inset-0
          bg-[radial-gradient(75%_50%_at_88%_0%,rgba(125,211,235,0.20),transparent_68%)]
        "
      />
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute inset-0
          bg-[radial-gradient(65%_45%_at_10%_100%,rgba(125,211,235,0.12),transparent_65%)]
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute inset-0
          bg-[radial-gradient(130%_75%_at_18%_-8%,rgba(255,255,255,0.16),transparent_65%)]
          opacity-0 transition-opacity duration-500
          group-hover:opacity-100
        "
      />
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute inset-0
          bg-[radial-gradient(85%_55%_at_88%_0%,rgba(125,211,235,0.16),transparent_70%)]
          opacity-0 transition-opacity duration-500
          group-hover:opacity-100
        "
      />
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute inset-0
          bg-[radial-gradient(75%_50%_at_10%_100%,rgba(125,211,235,0.14),transparent_68%)]
          opacity-0 transition-opacity duration-500
          group-hover:opacity-100
        "
      />

      <div className="relative mb-8 h-14 w-14 transition-transform duration-500 group-hover:scale-105 sm:mb-9 sm:h-16 sm:w-16 lg:h-[72px] lg:w-[72px]">
        {icon}
      </div>

      <h3 className="relative mb-5 ltr:font-mono text-3xl font-bold leading-[1.15] tracking-tight sm:text-4xl lg:text-[40px]">
        <span className="font-normal text-gray-400">{titleThin}</span>{" "}
        <span className="text-gray-100">{titleBold}</span>
      </h3>

      <p className="relative max-w-75 text-[15px] leading-relaxed text-gray-300 sm:text-base lg:text-lg">
        {description}
      </p>
    </div>
  );
}
