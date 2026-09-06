"use client";

import Image from "next/image";
import { Trash2, ImageOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Media, mediaUrl } from "@/lib/types/media";
import { useDeleteMedia } from "@/lib/hooks/use-media";
import { getErrorMessage } from "@/lib/api/error";
import { cn } from "@/lib/utils";

type MediaGridProps = {
  items: Media[];
  isLoading?: boolean;
  selectable?: boolean;
  selectedId?: string;
  onSelect?: (media: Media) => void;
  showDelete?: boolean;
};

export function MediaGrid({
  items,
  isLoading,
  selectable = false,
  selectedId,
  onSelect,
  showDelete = true,
}: MediaGridProps) {
  const deleteMutation = useDeleteMedia();

  function handleDelete(id: string) {
    if (!confirm("این فایل حذف شود؟ این عمل قابل بازگشت نیست.")) return;

    deleteMutation.mutate(id, {
      onSuccess: () => toast.success("فایل حذف شد"),
      onError: (error) => toast.error(getErrorMessage(error)),
    });
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-lg" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-muted-foreground">
        <ImageOff className="h-10 w-10" />
        <p>هنوز فایلی آپلود نشده است</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {items.map((item) => {
        
        const url = mediaUrl(item);
        console.log(url);
        const isSelected = selectedId === item.id;

        return (
          <div
            key={item.id}
            onClick={() => selectable && onSelect?.(item)}
            className={cn(
              "group relative aspect-square overflow-hidden rounded-lg border bg-muted",
              selectable && "cursor-pointer",
              isSelected && "ring-2 ring-primary ring-offset-2",
            )}
          >
            {url && (
              <Image
                src={url}
                alt={item.altText ?? item.original}
                fill
                sizes="200px"
                className="object-cover"
                unoptimized
              />
            )}

            {showDelete && (
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute end-2 top-2 h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(item.id);
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}

            <div className="absolute inset-x-0 bottom-0 truncate bg-black/60 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
              {item.original}
            </div>
          </div>
        );
      })}
    </div>
  );
}
