import { apiClient, apiDelete, apiGet } from "./client";
import { Media } from "../types/media";
import { Paginated } from "../types/api";
import { SuccessResponse } from "../types/api";

export function getMediaList(page: number, limit: number) {
  return apiGet<Paginated<Media>>("/admin/media", { page, limit });
}

export function getMediaById(id: string) {
  return apiGet<Media>(`/admin/media/${id}`);
}

export function deleteMedia(id: string) {
  return apiDelete<null>(`/admin/media/${id}`);
}

/**
 * آپلود فایل با FormData؛ چون این درخواست چندبخشی (multipart) است و
 * onUploadProgress نیاز داریم، مستقیم از apiClient استفاده می‌کنیم
 * (نه از هلپرهای apiPost عمومی که فقط JSON را در نظر گرفته‌اند).
 */
export async function uploadMedia(
  file: File,
  altText?: string,
  onProgress?: (percent: number) => void,
): Promise<Media> {
  const formData = new FormData();
  formData.append("file", file);
  if (altText) formData.append("altText", altText);

  const res = await apiClient.post<SuccessResponse<Media>>(
    "/admin/media",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (event) => {
        if (onProgress && event.total) {
          onProgress(Math.round((event.loaded / event.total) * 100));
        }
      },
    },
  );

  return res.data.data;
}
