"use client";

import { useState } from "react";
import Image from "next/image";
import { ImagePlus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MediaUploader } from "./media-uploader";
import { MediaGrid } from "./media-grid";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { useMediaList } from "@/lib/hooks/use-media";
import { Media, mediaUrl } from "@/lib/types/media";

type ImagePickerProps = {
  value: Media | null;
  onChange: (media: Media | null) => void;
  label?: string;
};

/**
 * انتخابگر تصویر reusable: یک پیش‌نمایش کوچک + دکمه‌ی باز کردن Dialog
 * برای انتخاب از کتابخانه‌ی رسانه یا آپلود مستقیم. این کامپوننت مستقل
 * از هر فرم خاصی است و در Hero/About/SiteSettings/Projects استفاده می‌شود.
 */
export function ImagePicker({ value, onChange, label }: ImagePickerProps) {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const { data, isLoading } = useMediaList(page, 20);

  const previewUrl = mediaUrl(value);

  return (
    <div className="space-y-2">
      {label && <p className="text-sm font-medium">{label}</p>}

      <div className="flex items-center gap-4">
        <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-lg border bg-muted">
          {previewUrl ? (
            <>
              <Image
                src={previewUrl}
                alt={value?.altText ?? ""}
                fill
                sizes="96px"
                className="object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute end-1 top-1 h-6 w-6"
                onClick={() => onChange(null)}
              >
                <X className="h-3 w-3" />
              </Button>
            </>
          ) : (
            <ImagePlus className="h-6 w-6 text-muted-foreground" />
          )}
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button type="button" variant="outline">
              انتخاب تصویر
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>انتخاب تصویر</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <MediaUploader />

              <MediaGrid
                items={data?.items ?? []}
                isLoading={isLoading}
                selectable
                selectedId={value?.id}
                showDelete={false}
                onSelect={(media) => {
                  onChange(media);
                  setOpen(false);
                }}
              />

              {data && (
                <PaginationControls
                  page={data.meta.page}
                  totalPages={data.meta.totalPages}
                  onPageChange={setPage}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
