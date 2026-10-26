"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ReorderControls({ index, count, disabled, onMove }: {
  index: number;
  count: number;
  disabled?: boolean;
  onMove: (targetIndex: number) => void;
}) {
  return (
    <div className="flex shrink-0 items-center gap-1">
      <Button type="button" variant="ghost" size="icon" aria-label="انتقال به بالا" disabled={disabled || index === 0} onClick={() => onMove(index - 1)}>
        <ChevronUp className="h-4 w-4" />
      </Button>
      <Button type="button" variant="ghost" size="icon" aria-label="انتقال به پایین" disabled={disabled || index === count - 1} onClick={() => onMove(index + 1)}>
        <ChevronDown className="h-4 w-4" />
      </Button>
    </div>
  );
}
