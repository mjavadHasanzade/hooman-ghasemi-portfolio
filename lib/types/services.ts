import type { Locale, Paginated } from "./api";
import type { Media } from "./media";

export type ServiceTranslation = {
  id: string;
  serviceId: string;
  locale: Locale;
  title: string;
  description: string;
};

export type Service = {
  id: string;
  iconKey: string;
  image: Media | null;
  order: number;
  isPublished: boolean;
  translations: ServiceTranslation[];
  availableLocales: Locale[];
  createdAt: string;
  updatedAt: string;
};

export type ServiceTranslationInput = Pick<ServiceTranslation, "locale" | "title" | "description">;

export type ServiceInput = {
  iconKey: string;
  imageMediaId?: string | null;
  isPublished?: boolean;
  translations: ServiceTranslationInput[];
};

export type PaginatedServices = Paginated<Service>;
