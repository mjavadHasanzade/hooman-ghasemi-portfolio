import type { Media } from "./media";

export type PublicTechIcon = {
  id: string;
  key: string;
  label: string;
  image: Media | null;
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

export type PublicService = {
  id: string;
  iconKey: string;
  order: number;
  title: string;
  description: string;
};

export type PublicContactCta = {
  connectHref: string;
  heading: string;
  description: string;
  connectLabel: string;
  phrases: string[];
};

export type PublicSocialLink = {
  id: string;
  platform: string;
  url: string;
  iconKey: string;
  order: number;
};

export type PublicSectionHeadings = {
  servicesTitle: string;
  servicesSubtitle: string;
  technologiesTitle: string;
  technologiesSubtitle: string;
  projectsTitle: string;
  projectsSubtitle: string;
};

export type PublicHome = {
  siteSettings: PublicSiteSettings & { sectionHeadings: PublicSectionHeadings };
  projects: PublicProject[];
  techIcons: PublicTechIcon[];
  services: PublicService[];
  contactCta: PublicContactCta;
  socialLinks: PublicSocialLink[];
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
