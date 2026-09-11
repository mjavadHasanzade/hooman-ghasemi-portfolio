import type { Media } from "./media";

export type PublicTechIcon = {
  id: string;
  key: string;
  label: string;
  createdAt: string;
  updatedAt: string;
};

export type PublicProjectTechIcon = PublicTechIcon & {
  order: number;
};

export type PublicProject = {
  id: string;
  slug: string;
  order: number;
  isPublished: boolean;
  liveUrl: string | null;
  image: Media | null;
  title: string;
  description: string;
  techIcons: PublicProjectTechIcon[];
};

export type PublicHome = {
  projects: PublicProject[];
  techIcons: PublicTechIcon[];
};

export type PublicSiteSettings = {
  siteName: string;
  contactEmail: string;
  defaultLocale: "en" | "fa";
  faviconMedia: Media | null;
  ogImageMedia: Media | null;
};

export type PublicHero = {
  backgroundImage: Media | null;
  title: string;
  subtitle: string;
  ctaLabel: string;
};

export type PublicAbout = {
  email: string;
  image: Media | null;
  label: string;
  heading: string;
  greeting: string;
  description: string;
};

export type PublicFooter = {
  copyrightText: string;
};
