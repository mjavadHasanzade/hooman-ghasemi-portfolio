"use client";

import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { UploadCloud, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUploadMedia } from "@/lib/hooks/use-media";
import { getErrorMessage } from "@/lib/api/error";

const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];

export function MediaUploader() {
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useUploadMedia();

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const file = files[0];

      if (!ACCEPTED_TYPES.includes(file.type)) {
        toast.error("فرمت فایل مجاز نیست (فقط JPG, PNG, WEBP, GIF, SVG)");
        return;
      }

      setProgress(0);
      uploadMutation.mutate(
        {
          file,
          onProgress: (percent) => setProgress(percent),
        },
        {
          onSuccess: () => {
            toast.success("فایل با موفقیت آپلود شد");
            setProgress(null);
          },
          onError: (error) => {
            toast.error(getErrorMessage(error));
            setProgress(null);
          },
        },
      );
    },
    [uploadMutation],
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
      onClick={() => inputRef.current?.click()}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 text-center transition-colors",
        isDragging
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25 hover:border-muted-foreground/50",
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {uploadMutation.isPending ? (
        <>
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            در حال آپلود... {progress !== null && `${progress}%`}
          </p>
        </>
      ) : (
        <>
          <UploadCloud className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            برای آپلود کلیک کنید یا فایل را اینجا رها کنید
          </p>
          <p className="text-xs text-muted-foreground/70">
            حداکثر ۵ مگابایت — JPG, PNG, WEBP, GIF, SVG
          </p>
        </>
      )}
    </div>
  );
}
