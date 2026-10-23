import "server-only";

import type { Locale, SuccessResponse } from "../types/api";
import type {
  PublicAbout,
  PublicFooter,
  PublicHome,
  PublicHero,
  PublicProject,
  PublicSiteSettings,
} from "../types/public-content";

export type {
  PublicAbout,
  PublicFooter,
  PublicHome,
  PublicHero,
  PublicProject,
  PublicSiteSettings,
} from "../types/public-content";

// تابع client-safe رو از فایل جدا re-export می‌کنیم
// تا کدهای سرور که قبلاً از اینجا ایمپورتش می‌کردن نشکنن
export { publicMediaUrl } from "../media/public-media-url";

function getApiUrl() {
  const apiUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    console.error("[public-content] Missing API_URL configuration.");
    throw new Error("API_URL must be configured for public content fetching.");
  }

  return apiUrl.replace(/\/$/, "");
}

function errorDetails(error: unknown) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      cause: error.cause instanceof Error ? error.cause.message : error.cause,
    };
  }

  return { message: String(error) };
}

async function getPublicData<T>(path: string): Promise<T> {
  const apiUrl = getApiUrl();
  const url = `${apiUrl}${path}`;
  const startedAt = performance.now();

  console.info("[public-content] Request started", { path, apiUrl });

  let response: Response;
  try {
    response = await fetch(url, { cache: "no-store" });
  } catch (error) {
    console.error("[public-content] Request failed before receiving a response", {
      path,
      apiUrl,
      durationMs: Math.round(performance.now() - startedAt),
      error: errorDetails(error),
    });
    throw error;
  }

  if (!response.ok) {
    const responseBody = await response.text().catch(() => "<unreadable response body>");

    console.error("[public-content] Backend returned an error response", {
      path,
      apiUrl,
      status: response.status,
      statusText: response.statusText,
      durationMs: Math.round(performance.now() - startedAt),
      responseBody: responseBody.slice(0, 1_000),
    });
    throw new Error(`Could not fetch public content (${response.status}): ${path}`);
  }

  try {
    const payload = (await response.json()) as SuccessResponse<T>;

    console.info("[public-content] Request succeeded", {
      path,
      apiUrl,
      status: response.status,
      durationMs: Math.round(performance.now() - startedAt),
    });

    return payload.data;
  } catch (error) {
    console.error("[public-content] Response body could not be parsed", {
      path,
      apiUrl,
      status: response.status,
      durationMs: Math.round(performance.now() - startedAt),
      error: errorDetails(error),
    });
    throw error;
  }
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

export function getPublicProjects(locale: Locale) {
  return getPublicData<PublicProject[]>(`/projects?locale=${locale}`);
}

export function getPublicHome(locale: Locale) {
  return getPublicData<PublicHome>(`/page/home?locale=${locale}`);
}
