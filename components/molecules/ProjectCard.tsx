import Image from "next/image";
import { ReactNode } from "react";
import OutlinedButton from "../common/OutlinedButton";
import ProjectTechMarquee from "./ProjectTechMarquee";
import { htmlToPlainTextWithBreaks } from "@/utils/html";

interface ProjectCardProps {
  image: string | null;
  title: string;
  description: string;
  visitSiteLabel: string;
  viewProjectLabel: string;
  viewProjectIcon?: ReactNode;
  techIcons: ReactNode[];
  liveUrl?: string | null;
  slug?: string;
}

export default function ProjectCard({
  image,
  title,
  description,
  visitSiteLabel,
  viewProjectLabel,
  viewProjectIcon,
  techIcons,
  liveUrl,
  slug,
}: ProjectCardProps) {
  const plainDescription = htmlToPlainTextWithBreaks(description);

  return (
    <div className="group relative flex h-full flex-col z-10 overflow-hidden rounded-[6px] border border-white/10 bg-[linear-gradient(160deg,rgba(20,25,32,1)_0%,rgba(8,10,14,1)_55%,rgba(5,7,10,1)_100%)] shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset] backdrop-blur-sm transition-colors duration-300 hover:border-teal-500/50">
      {/* ambient glow, subtle, fits site's teal theme */}
      <div className="pointer-events-none absolute -top-24 left-1/2 z-0 h-48 w-48 -translate-x-1/2 rounded-full bg-teal-500/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

      {/* تصویر پروژه */}
      <div className="relative aspect-16/10.5 w-full shrink-0 overflow-hidden bg-gray-900">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 90vw, (max-width: 1280px) 45vw, 30vw"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-500">
            {title}
          </div>
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-black/80 to-transparent" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col px-5 pb-5 pt-4 sm:px-6 sm:pb-6 sm:pt-5">
        <h3 className="mb-2 ltr:font-mono text-lg font-bold leading-snug text-gray-100 sm:text-xl">
          {title}
        </h3>

        <p className="mb-5 line-clamp-3 flex-1 whitespace-pre-line text-base leading-wider text-gray-400 sm:text-lg">
          {plainDescription}
        </p>

        <div className="mt-auto flex min-w-0 items-center justify-between gap-3">
          <OutlinedButton
            icon={viewProjectIcon}
            size="sm"
            className="shrink-0 whitespace-nowrap"
            href={`/project/${slug}`}
          >
            {viewProjectLabel}
          </OutlinedButton>

          <ProjectTechMarquee icons={techIcons} />
        </div>
      </div>
    </div>
  );
}
