import "server-only";

import type { Locale, SuccessResponse } from "../types/api";
import type { Media } from "../types/media";
import type {
  PublicAbout,
  PublicFooter,
  PublicHero,
  PublicSiteSettings,
} from "../types/public-content";

export type {
  PublicAbout,
  PublicFooter,
  PublicHero,
  PublicSiteSettings,
} from "../types/public-content";

function getApiUrl() {
  const apiUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error("API_URL must be configured for public content fetching.");
  }

  return apiUrl.replace(/\/$/, "");
}

async function getPublicData<T>(path: string): Promise<T> {
  const response = await fetch(`${getApiUrl()}${path}`, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`Could not fetch public content: ${path}`);
  }

  const payload = (await response.json()) as SuccessResponse<T>;
  return payload.data;
}

export function getPublicSiteSettings() {
  return getPublicData<PublicSiteSettings>("/site-settings");
}

export function getPublicHero(locale: Locale) {
  return getPublicData<PublicHero>(`/hero?locale=${locale}`);
}

export function getPublicAbout(locale: Locale) {
  return getPublicData<PublicAbout>(`/about?locale=${locale}`);
}

export function getPublicFooter(locale: Locale) {
  return getPublicData<PublicFooter>(`/footer?locale=${locale}`);
}

export function publicMediaUrl(media: Media | null | undefined) {
  if (!media?.path) return null;

  const backendOrigin =
    process.env.BACKEND_ORIGIN ?? process.env.NEXT_PUBLIC_ASSET_ORIGIN;

  return backendOrigin ? `${backendOrigin}${media.path}` : null;
}
