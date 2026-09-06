import type { Locale } from "./api";
import type { Media } from "./media";

export type SiteSettings = {
  id: "singleton";
  siteName: string;
  contactEmail: string;
  defaultLocale: Locale;
  faviconMediaId: string | null;
  faviconMedia: Media | null;
  ogImageMediaId: string | null;
  ogImageMedia: Media | null;
  updatedAt: string;
};

export type UpdateSiteSettingsInput = Partial<
  Pick<
    SiteSettings,
    | "siteName"
    | "contactEmail"
    | "defaultLocale"
    | "faviconMediaId"
    | "ogImageMediaId"
  >
>;

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
