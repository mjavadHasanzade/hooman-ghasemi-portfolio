import type { Locale } from "./api";
import type { Media } from "./media";

export type TechIcon = {
  id: string;
  key: string;
  label: string;
  sortOrder: number;
  image: Media | null;
  createdAt: string;
  updatedAt: string;
};

export type TechIconInput = Pick<TechIcon, "key" | "label"> & {
  sortOrder?: number;
  imageMediaId?: string | null;
};

export type ProjectTranslation = {
  id: string;
  projectId: string;
  locale: Locale;
  title: string;
  description: string;
};

export type ProjectTranslationInput = Pick<
  ProjectTranslation,
  "locale" | "title" | "description"
>;

export type Project = {
  id: string;
  slug: string;
  order: number;
  isPublished: boolean;
  liveUrl: string | null;
  imageId: string | null;
  image: Media | null;
  galleryImages: Array<{
    id: string;
    projectId: string;
    mediaId: string;
    order: number;
    media: Media;
  }>;
  translations: ProjectTranslation[];
  availableLocales: Locale[];
  techIcons: Array<{ order: number; techIcon: TechIcon }>;
  createdAt: string;
  updatedAt: string;
};

export type ProjectInput = {
  slug: string;
  isPublished?: boolean;
  liveUrl?: string | null;
  imageId?: string | null;
  galleryImageIds?: string[];
  translations: ProjectTranslationInput[];
  techIconIds?: string[];
};
