import Image from "next/image";
import { ReactNode } from "react";
import OutlinedButton from "../common/OutlinedButton";
import TechBadge from "../atoms/TechBadge";

interface ProjectCardProps {
  image: string;
  title: string;
  description: string;
  visitSiteLabel: string;
  viewProjectLabel: string;
  viewProjectIcon?: ReactNode;
  techIcons: ReactNode[];
}

export default function ProjectCard({
  image,
  title,
  description,
  visitSiteLabel,
  viewProjectLabel,
  viewProjectIcon,
  techIcons,
}: ProjectCardProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[6px] border border-gray-800 bg-black transition-colors duration-300 hover:border-teal-500/60">
      {/* تصویر پروژه */}
      <div className="relative aspect-[16/10.5] w-full overflow-hidden bg-gray-900">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover object-top"
          sizes="(max-width: 768px) 90vw, (max-width: 1280px) 45vw, 30vw"
        />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/80 to-transparent" />

        <a
          href="#"
          className="absolute bottom-2.5 right-3 flex items-center gap-1 text-xs font-medium text-teal-300 underline decoration-teal-300/50 underline-offset-2 transition-colors hover:text-teal-200 sm:text-sm"
        >
          {visitSiteLabel}
          <span aria-hidden="true">↗</span>
        </a>
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5 pt-4 sm:px-6 sm:pb-6 sm:pt-5">
        <h3 className="mb-2 font-mono text-lg font-bold leading-snug text-gray-200 sm:text-xl">
          {title}
        </h3>

        <p className="mb-5 line-clamp-2 flex-1 text-[13px] leading-relaxed text-gray-400 sm:text-sm">
          {description}
        </p>

        <div className="flex items-center justify-between gap-3">
          <OutlinedButton icon={viewProjectIcon} size="sm">
            {viewProjectLabel}
          </OutlinedButton>

          <div className="flex items-center gap-1.5">
            {techIcons.map((icon, i) => (
              <TechBadge key={i} icon={icon} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
