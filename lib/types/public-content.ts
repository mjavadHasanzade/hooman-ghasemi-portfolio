import type { Media } from "./media";

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
