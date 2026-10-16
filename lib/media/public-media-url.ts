import type { Media } from "../types/media";

/**
 * این تابع باید هم در Server Component و هم در Client Component قابل استفاده باشه،
 * پس اینجا نباید "server-only" ایمپورت بشه.
 *
 * مسیر نسبی باعث می‌شود مرورگر موبایل تصویر را از همان host سایت بگیرد؛
 * Next.js این مسیر را به backend محلی proxy می‌کند.
 */
export function publicMediaUrl(media: Media | null | undefined) {
  if (!media?.path) return null;

  const path = media.path.startsWith("/") ? media.path : `/${media.path}`;
  const origin = process.env.NEXT_PUBLIC_BACKEND_ORIGIN?.replace(/\/$/, "");
  return origin ? `${origin}${path}` : path;
}
