"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, GripVertical, Pencil, Plus, Trash2, Wrench } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { LocaleTabs } from "@/components/shared/locale-tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { getErrorMessage } from "@/lib/api/error";
import { useCreateService, useDeleteService, useReorderServices, useServices, useUpdateService } from "@/lib/hooks/use-services";
import type { Locale } from "@/lib/types/api";
import type { Service, ServiceInput, ServiceTranslationInput } from "@/lib/types/services";

const emptyTranslation = (locale: Locale): ServiceTranslationInput => ({ locale, title: "", description: "" });
type ServiceForm = ServiceInput & { translationsByLocale: Record<Locale, ServiceTranslationInput> };

function serviceToForm(service?: Service): ServiceForm {
  const translationsByLocale = { fa: emptyTranslation("fa"), en: emptyTranslation("en") };
  service?.translations.forEach((item) => { translationsByLocale[item.locale] = { locale: item.locale, title: item.title, description: item.description }; });
  return { iconKey: service?.iconKey ?? "", isPublished: service?.isPublished ?? true, translations: [], translationsByLocale };
}

function ServiceDialog({ service, open, onOpenChange }: { service: Service | null; open: boolean; onOpenChange: (open: boolean) => void }) {
  const [locale, setLocale] = useState<Locale>("fa");
  const create = useCreateService();
  const update = useUpdateService();
  const form = useForm<ServiceForm>({ defaultValues: serviceToForm() });
  const translations = useWatch({ control: form.control, name: "translationsByLocale" });
  useEffect(() => { if (open) form.reset(serviceToForm(service ?? undefined)); }, [form, open, service]);
  const availableLocales = useMemo(() => (Object.keys(translations ?? {}).filter((item) => { const value = translations?.[item as Locale]; return Boolean(value?.title.trim() || value?.description.trim()); }) as Locale[]), [translations]);
  async function submit(values: ServiceForm) {
    const validTranslations = Object.values(values.translationsByLocale).filter((item) => item.title.trim() && item.description.trim());
    if (!validTranslations.length) { toast.error("حداقل یک ترجمه را کامل کنید."); return; }
    if (Object.values(values.translationsByLocale).some((item) => (item.title.trim() || item.description.trim()) && (!item.title.trim() || !item.description.trim()))) { toast.error("عنوان و توضیحات هر ترجمه باید کامل باشد."); return; }
    const input: ServiceInput = { iconKey: values.iconKey.trim(), isPublished: values.isPublished, translations: validTranslations };
    try { if (service) await update.mutateAsync({ id: service.id, input }); else await create.mutateAsync(input); toast.success(service ? "سرویس به‌روزرسانی شد." : "سرویس اضافه شد."); onOpenChange(false); } catch (error) { toast.error(getErrorMessage(error)); }
  }
  const path = `translationsByLocale.${locale}` as const;
  const saving = create.isPending || update.isPending;
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="max-h-[92vh] w-[calc(100%-1rem)] max-w-3xl overflow-y-auto p-6 sm:p-8"><DialogHeader><DialogTitle>{service ? "ویرایش سرویس" : "افزودن سرویس"}</DialogTitle></DialogHeader><form className="space-y-6" onSubmit={form.handleSubmit(submit)}><div className="grid gap-5 rounded-xl border bg-card p-5 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor="service-icon-key">کلید آیکون</Label><Input id="service-icon-key" dir="ltr" placeholder="web-design" {...form.register("iconKey", { required: "کلید آیکون الزامی است." })} />{form.formState.errors.iconKey && <p className="text-xs text-destructive">{form.formState.errors.iconKey.message}</p>}</div><label className="flex cursor-pointer items-center gap-2 self-end text-sm"><input type="checkbox" {...form.register("isPublished")} /> در سایت منتشر شود</label></div><div className="space-y-5 rounded-xl border border-primary/20 bg-card p-5"><div><Label className="text-base">محتوای چندزبانه</Label><p className="mt-1 text-sm text-muted-foreground">برای هر زبان عنوان و توضیحات مستقل وارد کنید.</p></div><LocaleTabs value={locale} onChange={setLocale} availableLocales={availableLocales} /><div className="space-y-5"><div className="space-y-2"><Label htmlFor={`service-title-${locale}`}>عنوان سرویس</Label><Input id={`service-title-${locale}`} className="h-10" {...form.register(`${path}.title`)} /></div><div className="space-y-2"><Label htmlFor={`service-description-${locale}`}>توضیحات سرویس</Label><textarea id={`service-description-${locale}`} dir={locale === "fa" ? "rtl" : "ltr"} className="min-h-40 w-full resize-y rounded-xl border border-input bg-muted/20 px-4 py-3 text-sm leading-7 outline-none focus:border-primary focus:ring-3 focus:ring-primary/15" {...form.register(`${path}.description`)} /></div></div></div><div className="flex justify-end"><Button type="submit" disabled={saving}>{saving ? "در حال ذخیره…" : "ذخیره سرویس"}</Button></div></form></DialogContent></Dialog>;
}

export default function ServicesPage() {
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Service | null>(null);
  const [open, setOpen] = useState(false);
  const [order, setOrder] = useState<string[] | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const { data, isLoading, isError } = useServices(page);
  const remove = useDeleteService();
  const reorder = useReorderServices();
  const items = data && order ? order.map((id) => data.items.find((item) => item.id === id)).filter((item): item is Service => Boolean(item)) : data?.items ?? [];
  function deleteItem(service: Service) { if (!confirm(`«${service.translations[0]?.title ?? service.iconKey}» حذف شود؟`)) return; remove.mutate(service.id, { onSuccess: () => toast.success("سرویس حذف شد."), onError: (error) => toast.error(getErrorMessage(error)) }); }
  async function dropOn(targetId: string) { if (!draggedId || draggedId === targetId) return; const from = items.findIndex((item) => item.id === draggedId); const to = items.findIndex((item) => item.id === targetId); const next = [...items]; const [item] = next.splice(from, 1); next.splice(to, 0, item); const ids = next.map((service) => service.id); setOrder(ids); setDraggedId(null); try { await reorder.mutateAsync(ids); toast.success("ترتیب سرویس‌ها ذخیره شد."); } catch (error) { setOrder(null); toast.error(getErrorMessage(error)); } }
  if (isLoading) return <p className="text-muted-foreground">در حال دریافت سرویس‌ها…</p>;
  if (isError || !data) return <p className="text-destructive">دریافت سرویس‌ها ناموفق بود.</p>;
  return <div className="space-y-6"><div className="flex flex-wrap items-start justify-between gap-4"><div><h1 className="text-2xl font-bold">سرویس‌ها</h1><p className="text-muted-foreground">سرویس‌های سایت، ترجمه‌ها، آیکون و وضعیت انتشار را مدیریت کنید.</p></div><Button onClick={() => { setEditing(null); setOpen(true); }}><Plus /> افزودن سرویس</Button></div>{items.length ? <><p className="text-sm text-muted-foreground">برای تغییر ترتیب، کارت‌ها را بکشید و رها کنید.</p><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{items.map((service) => { const translation = service.translations.find((item) => item.locale === "fa") ?? service.translations[0]; return <Card key={service.id} draggable onDragStart={() => setDraggedId(service.id)} onDragOver={(event) => event.preventDefault()} onDrop={() => dropOn(service.id)} className="cursor-grab active:cursor-grabbing"><CardHeader><div className="flex items-start gap-3"><div className="rounded-lg bg-primary/10 p-2 text-primary"><Wrench /></div><div className="min-w-0 flex-1"><CardTitle className="truncate">{translation?.title ?? service.iconKey}</CardTitle><p className="font-mono text-xs text-muted-foreground">{service.iconKey}</p></div><GripVertical className="h-4 w-4 text-muted-foreground" /></div></CardHeader><CardContent className="space-y-3"><p className="line-clamp-3 text-sm text-muted-foreground">{translation?.description}</p><span className={`inline-flex items-center gap-1 rounded px-2 py-1 text-xs ${service.isPublished ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" : "bg-muted text-muted-foreground"}`}>{service.isPublished && <Check className="h-3 w-3" />}{service.isPublished ? "منتشرشده" : "پیش‌نویس"}</span></CardContent><CardFooter className="justify-end gap-2"><Button variant="outline" size="sm" onClick={() => { setEditing(service); setOpen(true); }}><Pencil /> ویرایش</Button><Button variant="destructive" size="icon-sm" aria-label="حذف" disabled={remove.isPending} onClick={() => deleteItem(service)}><Trash2 /></Button></CardFooter></Card>; })}</div></> : <div className="py-16 text-center text-muted-foreground">هنوز سرویسی ثبت نشده است.</div>}{data && <PaginationControls page={data.meta.page} totalPages={data.meta.totalPages} onPageChange={setPage} />}<ServiceDialog service={editing} open={open} onOpenChange={setOpen} /></div>;
}
