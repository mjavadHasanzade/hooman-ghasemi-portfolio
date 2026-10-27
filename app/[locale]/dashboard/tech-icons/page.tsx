"use client";

import Image from "next/image";
import { moveTechIcon, sortTechIcons } from "@/lib/tech-icon-order";
import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { GripVertical, Pencil, Plus, Trash2, Wrench } from "lucide-react";
import { toast } from "sonner";
import { ReorderControls } from "@/components/shared/reorder-controls";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { ImagePicker } from "@/components/media/image-picker";
import { getErrorMessage } from "@/lib/api/error";
import { useCreateTechIcon, useDeleteTechIcon, useTechIcons, useUpdateTechIcon, useReorderTechIcons } from "@/lib/hooks/use-projects";
import type { TechIcon, TechIconInput } from "@/lib/types/projects";
import { mediaUrl, type Media } from "@/lib/types/media";

type TechIconForm = Pick<TechIconInput, "key" | "label"> & {
  sortOrder: number;
  image: Media | null;
  imageChanged: boolean;
};

const emptyValues: TechIconForm = { key: "", label: "", sortOrder: 0, image: null, imageChanged: false };
const keyPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export default function TechIconsPage() {
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<TechIcon | null>(null);
  const [open, setOpen] = useState(false);
  const { data, isLoading, isError } = useTechIcons(page);
  const createIcon = useCreateTechIcon();
  const updateIcon = useUpdateTechIcon();
  const deleteIcon = useDeleteTechIcon();
  const reorderIcons = useReorderTechIcons();
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [preview, setPreview] = useState<TechIcon[] | null>(null);
  const reordering = useRef(false);
  const icons = preview ?? sortTechIcons(data?.items ?? []);

  async function moveIcon(sourceId: string, targetId: string) {
    if (reordering.current || sourceId === targetId) return;
    reordering.current = true;
    setDraggedId(null);
    try {
      setPreview(moveTechIcon(icons, sourceId, targetId));
      await reorderIcons.mutateAsync({ sourceId, targetId });
      toast.success("ترتیب آیکون‌ها ذخیره شد.");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setPreview(null);
      reordering.current = false;
    }
  }
  const form = useForm<TechIconForm>({ defaultValues: emptyValues });
  const image = useWatch({ control: form.control, name: "image" });

  useEffect(() => {
    if (!open) return;
    form.reset(editing ? { key: editing.key, label: editing.label, sortOrder: editing.sortOrder ?? 0, image: editing.image, imageChanged: false } : emptyValues);
  }, [editing, form, open]);

  function showCreate() { setEditing(null); setOpen(true); }
  function showEdit(icon: TechIcon) { setEditing(icon); setOpen(true); }

  async function onSubmit(values: TechIconForm) {
    try {
      const imageInput = values.imageChanged ? { imageMediaId: values.image?.id ?? null } : {};
      const input: TechIconInput = { key: values.key, label: values.label, sortOrder: values.sortOrder, ...imageInput };
      if (editing) await updateIcon.mutateAsync({ id: editing.id, input });
      else await createIcon.mutateAsync(input);
      toast.success(editing ? "آیکون به‌روزرسانی شد." : "آیکون اضافه شد.");
      setOpen(false);
    } catch (error) { toast.error(getErrorMessage(error)); }
  }

  function onDelete(icon: TechIcon) {
    if (!confirm(`«${icon.label}» حذف شود؟`)) return;
    deleteIcon.mutate(icon.id, {
      onSuccess: () => toast.success("آیکون حذف شد."),
      onError: (error) => toast.error(getErrorMessage(error)),
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div><h1 className="text-2xl font-bold">آیکون‌های تکنولوژی</h1><p className="text-muted-foreground">تکنولوژی‌هایی که به پروژه‌ها متصل می‌شوند را مدیریت کنید.</p></div>
        <Button disabled={reorderIcons.isPending} onClick={showCreate}><Plus /> افزودن آیکون</Button>
      </div>

      {isError ? <p className="text-destructive">دریافت آیکون‌ها ناموفق بود.</p> : isLoading ? <p className="text-muted-foreground">در حال دریافت…</p> : data?.items.length ? (
        <div className="space-y-3" aria-busy={reorderIcons.isPending}>
          <p className="text-sm text-muted-foreground">برای تغییر ترتیب، دستگیرهٔ آیکون را بکشید یا از دکمه‌های بالا و پایین استفاده کنید.</p>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {icons.map((icon, index) => <Card key={icon.id} size="sm"
              onDragOver={(event) => { if (draggedId) { event.preventDefault(); event.dataTransfer.dropEffect = "move"; } }}
              onDrop={(event) => { event.preventDefault(); if (draggedId) void moveIcon(draggedId, icon.id); }}
              className={draggedId === icon.id ? "opacity-50" : ""}
            >
              <CardContent className="flex items-center gap-2.5">
                <button type="button" draggable={!reorderIcons.isPending} disabled={reorderIcons.isPending}
                  aria-label={`جابجایی ${icon.label}`} title="برای جابجایی بکشید"
                  className="shrink-0 cursor-grab rounded p-1 text-muted-foreground hover:text-teal-300 active:cursor-grabbing disabled:opacity-40"
                  onDragStart={(event) => { setDraggedId(icon.id); event.dataTransfer.effectAllowed = "move"; event.dataTransfer.setData("text/plain", icon.id); }}
                  onDragEnd={() => setDraggedId(null)}>
                  <GripVertical className="h-4 w-4" />
                </button>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-slate-950/60 text-cyan-300">
                  {mediaUrl(icon.image)
                    ? <Image src={mediaUrl(icon.image)!} alt="" width={40} height={40} unoptimized className="h-10 w-10 object-contain p-1.5" />
                    : <Wrench className="h-4 w-4" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium" title={icon.label}>{icon.label}</p>
                  <p className="truncate font-mono text-xs text-muted-foreground" title={icon.key}>{icon.key}</p>
                </div>
              </CardContent>
              <CardFooter className="justify-between gap-2 px-3 py-2">
                <span className="text-xs text-muted-foreground">ترتیب: {icon.sortOrder ?? 0}</span>
                <div className="flex items-center gap-1">
                  <ReorderControls compact index={index} count={icons.length} disabled={reorderIcons.isPending} onMove={(target) => void moveIcon(icon.id, icons[target].id)} />
                  <Button disabled={reorderIcons.isPending} variant="ghost" size="icon-sm" aria-label="ویرایش" onClick={() => showEdit(icon)}><Pencil /></Button>
                  <Button variant="destructive" size="icon-sm" aria-label="حذف" disabled={deleteIcon.isPending || reorderIcons.isPending} onClick={() => onDelete(icon)}><Trash2 /></Button>
                </div>
              </CardFooter>
            </Card>)}
          </div>
        </div>
      ) : <div className="py-16 text-center text-muted-foreground">هنوز آیکونی ثبت نشده است.</div>}
      {data && <PaginationControls page={data.meta.page} totalPages={data.meta.totalPages} onPageChange={(nextPage) => { if (!reordering.current) setPage(nextPage); }} />}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent><DialogHeader><DialogTitle>{editing ? "ویرایش آیکون" : "افزودن آیکون"}</DialogTitle></DialogHeader>
          <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-2"><Label htmlFor="tech-label">نام نمایشی</Label><Input id="tech-label" {...form.register("label", { required: "نام الزامی است." })} />{form.formState.errors.label && <p className="text-xs text-destructive">{form.formState.errors.label.message}</p>}</div>
            <div className="space-y-2"><Label htmlFor="tech-key">کلید</Label><Input id="tech-key" dir="ltr" placeholder="next-js" {...form.register("key", { required: "کلید الزامی است.", pattern: { value: keyPattern, message: "فقط حروف کوچک، عدد و خط تیره بین کلمات مجاز است." } })} />{form.formState.errors.key && <p className="text-xs text-destructive">{form.formState.errors.key.message}</p>}</div>
            <div className="space-y-2">
              <Label htmlFor="tech-sort-order">ترتیب نمایش</Label>
              <Input id="tech-sort-order" type="number" step={1} dir="ltr"
                {...form.register("sortOrder", { valueAsNumber: true, validate: (value) => (Number.isSafeInteger(value) && value >= 0 && value <= 2147483647) || "یک عدد صحیح بین صفر و ۲۱۴۷۴۸۳۶۴۷ وارد کنید." })} />
              <p className="text-xs text-muted-foreground">عدد کمتر ابتدا نمایش داده می‌شود؛ اعداد برابر بر اساس نام مرتب می‌شوند.</p>
              {form.formState.errors.sortOrder && <p role="alert" className="text-xs text-destructive">{form.formState.errors.sortOrder.message}</p>}
            </div>
            <ImagePicker label="تصویر تکنولوژی" value={image} onChange={(media) => { form.setValue("image", media, { shouldDirty: true }); form.setValue("imageChanged", true); }} />
            <div className="flex justify-end"><Button type="submit" disabled={createIcon.isPending || updateIcon.isPending}>{editing ? "ذخیره تغییرات" : "افزودن"}</Button></div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
