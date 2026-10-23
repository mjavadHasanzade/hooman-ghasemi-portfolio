import type { Media } from "../types/media";
import { mediaUrl } from "./media-url";

/**
 * این تابع باید هم در Server Component و هم در Client Component قابل استفاده باشه،
 * پس اینجا نباید "server-only" ایمپورت بشه.
 *
 * تمام نمایش‌های Media از resolver مشترک استفاده می‌کنند تا آدرس تصاویر
 * در public site و پنل ادمین دقیقاً یکسان باشد.
 */
export function publicMediaUrl(media: Media | null | undefined) {
  return mediaUrl(media);
}
