"use client";

import { useState } from "react";
import { MediaUploader } from "@/components/media/media-uploader";
import { MediaGrid } from "@/components/media/media-grid";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { useMediaList } from "@/lib/hooks/use-media";

export default function MediaLibraryPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useMediaList(page, 20);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">کتابخانه‌ی رسانه</h1>
        <p className="text-muted-foreground">
          مدیریت تصاویر مورد استفاده در سایت
        </p>
      </div>

      <MediaUploader />

      <MediaGrid items={data?.items ?? []} isLoading={isLoading} isError={isError} />

      {data && (
        <PaginationControls
          page={data.meta.page}
          totalPages={data.meta.totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
