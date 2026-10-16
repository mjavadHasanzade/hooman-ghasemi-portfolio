import type { Locale } from "./api";
import type { Media } from "./media";

export type SiteSettings = {
  id: "singleton";
  siteName: string;
  contactEmail: string;
  phoneNumber: string;
  defaultLocale: Locale;
  faviconMediaId: string | null;
  faviconMedia: Media | null;
  ogImageMediaId: string | null;
  ogImageMedia: Media | null;
  footerLogoMediaId: string | null;
  footerLogoMedia: Media | null;
  translations: SiteSettingsTranslation[];
  availableLocales: Locale[];
  updatedAt: string;
};

export type SiteSettingsTranslation = {
  id: string;
  siteSettingsId: string;
  locale: Locale;
  servicesTitle: string;
  servicesSubtitle: string;
  technologiesTitle: string;
  technologiesSubtitle: string;
  projectsTitle: string;
  projectsSubtitle: string;
};

export type UpdateSiteSettingsInput = Partial<
  Pick<
    SiteSettings,
    | "siteName"
    | "contactEmail"
    | "phoneNumber"
    | "defaultLocale"
    | "faviconMediaId"
    | "ogImageMediaId"
    | "footerLogoMediaId"
  >
> & {
  translations?: Array<Omit<SiteSettingsTranslation, "id" | "siteSettingsId">>;
};

export type HeroTranslation = {
  id: string;
  heroId: string;
  locale: Locale;
  title: string;
  subtitle: string;
  ctaLabel: string;
};

export type Hero = {
  id: "singleton";
  backgroundImageId: string | null;
  backgroundImage: Media | null;
  translations: HeroTranslation[];
  availableLocales: Locale[];
  updatedAt: string;
};

export type HeroTranslationInput = Pick<
  HeroTranslation,
  "locale" | "title" | "subtitle" | "ctaLabel"
>;

export type UpdateHeroInput = {
  backgroundImageId?: string | null;
  translations?: HeroTranslationInput[];
};

export type AboutTranslation = {
  id: string;
  aboutId: string;
  locale: Locale;
  label: string;
  heading: string;
  greeting: string;
  description: string;
};

export type About = {
  id: "singleton";
  email: string;
  imageId: string | null;
  image: Media | null;
  translations: AboutTranslation[];
  availableLocales: Locale[];
  updatedAt: string;
};

export type AboutTranslationInput = Pick<
  AboutTranslation,
  "locale" | "label" | "heading" | "greeting" | "description"
>;

export type UpdateAboutInput = {
  email?: string;
  imageId?: string | null;
  translations?: AboutTranslationInput[];
};

export type FooterTranslation = {
  id: string;
  footerId: string;
  locale: Locale;
  copyrightText: string;
};

export type Footer = {
  id: "singleton";
  translations: FooterTranslation[];
  availableLocales: Locale[];
  updatedAt: string;
};

export type FooterTranslationInput = Pick<
  FooterTranslation,
  "locale" | "copyrightText"
>;

export type UpdateFooterInput = {
  translations?: FooterTranslationInput[];
};
