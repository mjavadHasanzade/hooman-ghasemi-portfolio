import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, MoveUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import { getPublicProjects } from "@/lib/api/public-content";
import { publicMediaUrl } from "@/lib/media/public-media-url";
import type { Locale } from "@/lib/types/api";
import ProjectGallery from "@/components/organisms/ProjectGallery";

const copy = {
  fa: {
    back: "بازگشت به صفحه اصلی",
    technologies: "تکنولوژی‌های استفاده‌شده",
    selectedWork: "نمونه‌کار منتخب",
    projectNumber: "پروژه",
    visit: "مشاهده پروژه",
    project: "پروژه",
  },
  en: {
    back: "Back to home",
    technologies: "Technologies used",
    selectedWork: "Selected work",
    projectNumber: "Project",
    visit: "Visit project",
    project: "Project",
  },
} as const;

function projectDescriptionHtml(value: string) {
  // Project descriptions created with the editor are HTML. Older records may
  // contain Markdown, so render those too instead of showing `**` literally.
  if (/<[a-z][\s\S]*>/i.test(value)) return value;

  const escape = (text: string) =>
    text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const inline = (text: string) =>
    escape(text)
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/`(.+?)`/g, "<code>$1</code>");

  return value
    .trim()
    .split(/\n{2,}/)
    .map((block) => {
      const lines = block.split("\n");
      if (lines.every((line) => /^[-*]\s+/.test(line))) {
        return `<ul>${lines.map((line) => `<li>${inline(line.replace(/^[-*]\s+/, ""))}</li>`).join("")}</ul>`;
      }
      return `<p>${lines.map(inline).join("<br />")}</p>`;
    })
    .join("");
}

async function getProject(locale: Locale, slug: string) {
  const projects = await getPublicProjects(locale);
  return projects.find((project) => project.slug === slug) ?? null;
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const project = await getProject(locale, slug);

  if (!project) notFound();

  const labels = copy[locale];
  const imageUrl = publicMediaUrl(project.image);
  const galleryImageUrls = project.galleryImages
    .slice()
    .sort((first, second) => first.order - second.order)
    .map((item) => publicMediaUrl(item.media))
    .filter((url): url is string => Boolean(url));
  const projectImages = imageUrl ? [imageUrl, ...galleryImageUrls] : galleryImageUrls;
  const techIcons = project.techIcons
    .slice()
    .sort((first, second) => first.order - second.order);
  const BackIcon = locale === "fa" ? ArrowRight : ArrowLeft;

  return (
    <article
      dir={locale === "fa" ? "rtl" : "ltr"}
      className="min-h-screen overflow-hidden bg-black text-white"
    >
      <div className="mx-auto max-w-[90rem] px-5 py-7 sm:px-8 sm:py-10 lg:px-14 lg:py-14">
        <Link
          href={`/${locale}`}
          className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500 transition-colors hover:text-teal-300"
        >
          <BackIcon className="h-4 w-4 transition-transform group-hover:-translate-x-1 rtl:group-hover:translate-x-1" />
          {labels.back}
        </Link>

        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1.18fr)_minmax(22rem,0.82fr)] lg:items-center lg:gap-20 lg:py-10">
          <div className="group relative overflow-hidden rounded-[10px] p-px">
            <div aria-hidden="true" className="absolute inset-[-55%] animate-[spin_11s_linear_infinite] bg-[conic-gradient(from_171deg,transparent_0deg,transparent_100deg,rgba(45,212,191,0.22)_140deg,rgba(94,234,212,0.95)_234deg,rgba(45,212,191,0.22)_290deg,transparent_360deg)]" />
            <div className="relative z-10 rounded-[9px] bg-black p-1.5">
              <ProjectGallery
                images={projectImages}
                alt={project.title}
                projectNumberLabel={labels.projectNumber}
              />
            </div>
          </div>

          <div className="max-w-xl lg:pb-3">
            <p className="flex items-center gap-3 font-mono text-[10px] font-semibold uppercase tracking-[0.3em] text-teal-400">
              <span className="h-px w-8 bg-teal-400/70" />
              {labels.selectedWork}
            </p>
            <h1 className="mt-5 max-w-2xl text-4xl font-bold leading-[1.08] tracking-tight text-gray-100 sm:text-6xl lg:text-7xl">
              {project.title}
            </h1>
            <p className="mt-5 font-mono text-xs uppercase tracking-[0.18em] text-gray-600">
              {labels.project} / {project.slug}
            </p>

            <div
              className="mt-8 max-w-lg border-s-2 border-teal-400/40 ps-5 text-base leading-8 text-gray-400 [&_strong]:font-semibold [&_strong]:text-gray-200 [&_p+p]:mt-4"
              dangerouslySetInnerHTML={{ __html: projectDescriptionHtml(project.description) }}
            />

            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="group mt-9 inline-flex items-center gap-3 rounded-full border border-teal-300/60 bg-teal-300 px-5 py-3 text-sm font-bold text-black transition-all hover:bg-teal-200 hover:shadow-[0_0_32px_rgba(94,234,212,0.2)]"
              >
                {labels.visit}
                <MoveUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            ) : null}
          </div>
        </div>

        {techIcons.length > 0 ? (
          <section className="mt-10 border-t border-white/10 pt-7 sm:mt-16 sm:pt-9">
            <h2 className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gray-500">
              {labels.technologies}
            </h2>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {techIcons.map((techIcon) => {
                const iconUrl = publicMediaUrl(techIcon.image);
                return (
                  <div
                    key={techIcon.key}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/4 px-3 py-2 text-xs text-gray-300 transition-colors hover:border-teal-300/40 hover:text-teal-200"
                  >
                    {iconUrl ? (
                      <Image
                        src={iconUrl}
                        alt=""
                        width={24}
                        height={24}
                        className="h-6 w-6 object-contain"
                        unoptimized
                      />
                    ) : (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-400/10 text-xs text-teal-300">
                        {techIcon.label.trim().slice(0, 1).toUpperCase()}
                      </span>
                    )}
                    {techIcon.label.trim()}
                  </div>
                );
              })}
            </div>
          </section>
        ) : null}
      </div>
    </article>
  );
}
