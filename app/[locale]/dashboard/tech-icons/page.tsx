"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Pencil, Plus, Trash2, Wrench } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { getErrorMessage } from "@/lib/api/error";
import { useCreateTechIcon, useDeleteTechIcon, useTechIcons, useUpdateTechIcon } from "@/lib/hooks/use-projects";
import type { TechIcon, TechIconInput } from "@/lib/types/projects";
import { mediaUrl } from "@/lib/types/media";

const emptyValues: TechIconInput = { key: "", label: "", image: null };
const keyPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export default function TechIconsPage() {
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<TechIcon | null>(null);
  const [open, setOpen] = useState(false);
  const { data, isLoading, isError } = useTechIcons(page);
  const createIcon = useCreateTechIcon();
  const updateIcon = useUpdateTechIcon();
  const deleteIcon = useDeleteTechIcon();
  const form = useForm<TechIconInput>({ defaultValues: emptyValues });

  useEffect(() => {
    form.reset(editing ? { key: editing.key, label: editing.label, image: null } : emptyValues);
  }, [editing, form]);

  function showCreate() { setEditing(null); setOpen(true); }
  function showEdit(icon: TechIcon) { setEditing(icon); setOpen(true); }

  async function onSubmit(values: TechIconInput) {
    try {
      if (editing) await updateIcon.mutateAsync({ id: editing.id, input: values });
      else await createIcon.mutateAsync(values);
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
        <Button onClick={showCreate}><Plus /> افزودن آیکون</Button>
      </div>

      {isError ? <p className="text-destructive">دریافت آیکون‌ها ناموفق بود.</p> : isLoading ? <p className="text-muted-foreground">در حال دریافت…</p> : data?.items.length ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data.items.map((icon) => <Card key={icon.id}><CardContent className="flex items-center gap-3">
            {mediaUrl(icon.image) ? <img src={mediaUrl(icon.image)!} alt="" className="h-11 w-11 rounded-xl border border-white/10 bg-slate-950/60 object-contain p-2" /> : <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-dashed border-cyan-400/25 bg-cyan-400/5 text-cyan-300"><Wrench className="h-4 w-4" /></div>}
            <div className="min-w-0 flex-1"><p className="font-medium">{icon.label}</p><p className="truncate font-mono text-xs text-muted-foreground">{icon.key}</p></div>
            <Button variant="ghost" size="icon-sm" aria-label="ویرایش" onClick={() => showEdit(icon)}><Pencil /></Button>
            <Button variant="destructive" size="icon-sm" aria-label="حذف" disabled={deleteIcon.isPending} onClick={() => onDelete(icon)}><Trash2 /></Button>
          </CardContent></Card>)}
        </div>
      ) : <div className="py-16 text-center text-muted-foreground">هنوز آیکونی ثبت نشده است.</div>}
      {data && <PaginationControls page={data.meta.page} totalPages={data.meta.totalPages} onPageChange={setPage} />}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent><DialogHeader><DialogTitle>{editing ? "ویرایش آیکون" : "افزودن آیکون"}</DialogTitle></DialogHeader>
          <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-2"><Label htmlFor="tech-label">نام نمایشی</Label><Input id="tech-label" {...form.register("label", { required: "نام الزامی است." })} />{form.formState.errors.label && <p className="text-xs text-destructive">{form.formState.errors.label.message}</p>}</div>
            <div className="space-y-2"><Label htmlFor="tech-key">کلید</Label><Input id="tech-key" dir="ltr" placeholder="next-js" {...form.register("key", { required: "کلید الزامی است.", pattern: { value: keyPattern, message: "فقط حروف کوچک، عدد و خط تیره بین کلمات مجاز است." } })} />{form.formState.errors.key && <p className="text-xs text-destructive">{form.formState.errors.key.message}</p>}</div>
            <div className="space-y-2"><Label htmlFor="tech-image">تصویر تکنولوژی</Label><Input id="tech-image" type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml" onChange={(event) => form.setValue("image", event.target.files?.[0] ?? null, { shouldDirty: true })} /><p className="text-xs text-muted-foreground">اختیاری؛ برای تغییر تصویر، فایل جدید انتخاب کنید.</p></div>
            <div className="flex justify-end"><Button type="submit" disabled={createIcon.isPending || updateIcon.isPending}>{editing ? "ذخیره تغییرات" : "افزودن"}</Button></div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
