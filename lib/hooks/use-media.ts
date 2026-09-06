import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteMedia, getMediaList, uploadMedia } from "../api/media";

export const mediaKeys = {
  all: ["media"] as const,
  list: (page: number, limit: number) =>
    [...mediaKeys.all, "list", page, limit] as const,
};

export function useMediaList(page: number, limit = 20) {
  return useQuery({
    queryKey: mediaKeys.list(page, limit),
    queryFn: () => getMediaList(page, limit),
  });
}

export function useUploadMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      file,
      altText,
      onProgress,
    }: {
      file: File;
      altText?: string;
      onProgress?: (percent: number) => void;
    }) => uploadMedia(file, altText, onProgress),
    onSuccess: () => {
      // بعد از آپلود موفق، تمام کوئری‌های لیست مدیا را invalid می‌کنیم
      // تا صفحه‌ی اول لیست دوباره fetch شود و آیتم جدید نشان داده شود.
      queryClient.invalidateQueries({ queryKey: mediaKeys.all });
    },
  });
}

export function useDeleteMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMedia(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.all });
    },
  });
}
