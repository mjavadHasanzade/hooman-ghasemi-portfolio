import type { Media } from "../types/media";

/**
 * Builds a Media URL consistently for the public site and the admin panel.
 * Direct backend access is preferred in production; the asset origin preserves
 * deployments that expose uploads through a dedicated asset host.
 */
export function mediaUrl(media: Media | null | undefined): string | null {
  if (!media?.path) return null;

  const path = media.path.startsWith("/") ? media.path : `/${media.path}`;
  const origin = (
    process.env.NEXT_PUBLIC_BACKEND_ORIGIN ??
    process.env.NEXT_PUBLIC_ASSET_ORIGIN
  )?.replace(/\/$/, "");

  return origin ? `${origin}${path}` : path;
}
