import type { Media } from "../types/media";

/**
 * این تابع باید هم در Server Component و هم در Client Component قابل استفاده باشه،
 * پس اینجا نباید "server-only" ایمپورت بشه.
 *
 * نکته: در کلاینت فقط env varهایی که با NEXT_PUBLIC_ شروع می‌شن inline می‌شن.
 * پس اینجا فقط از NEXT_PUBLIC_ASSET_ORIGIN استفاده می‌کنیم (نه BACKEND_ORIGIN)
 * تا رفتار در سرور و کلاینت یکسان و قابل پیش‌بینی باشه.
 */
export function publicMediaUrl(media: Media | null | undefined) {
  if (!media?.path) return null;

  const assetOrigin = process.env.NEXT_PUBLIC_ASSET_ORIGIN;

  return assetOrigin ? `${assetOrigin}${media.path}` : null;
}
