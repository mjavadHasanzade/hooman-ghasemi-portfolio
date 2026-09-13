"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useForm, useWatch } from "react-hook-form";
import { Check, ChevronDown, ChevronUp, GripVertical, ImageOff, Pencil, Plus, Sparkles, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { ImagePicker } from "@/components/media/image-picker";
import { LocaleTabs } from "@/components/shared/locale-tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { getErrorMessage } from "@/lib/api/error";
import { useCreateProject, useDeleteProject, useProjects, useReorderProjects, useTechIcons, useUpdateProject } from "@/lib/hooks/use-projects";
import type { Locale } from "@/lib/types/api";
import { mediaUrl, type Media } from "@/lib/types/media";
import type { Project, ProjectInput, ProjectTranslationInput, TechIcon } from "@/lib/types/projects";

type ProjectForm = {
  slug: string;
  isPublished: boolean;
  liveUrl: string;
  image: Media | null;
  translations: Record<Locale, ProjectTranslationInput>;
  techIconIds: string[];
};

const emptyTranslation = (locale: Locale): ProjectTranslationInput => ({ locale, title: "", description: "" });
const initialValues: ProjectForm = { slug: "", isPublished: true, liveUrl: "", image: null, translations: { fa: emptyTranslation("fa"), en: emptyTranslation("en") }, techIconIds: [] };
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9-])*$/;

function projectToForm(project: Project): ProjectForm {
  const translations = { fa: emptyTranslation("fa"), en: emptyTranslation("en") };
  for (const item of project.translations) translations[item.locale] = { locale: item.locale, title: item.title, description: item.description };
  return { slug: project.slug, isPublished: project.isPublished, liveUrl: project.liveUrl ?? "", image: project.image, translations, techIconIds: [...project.techIcons].sort((a, b) => a.order - b.order).map((item) => item.techIcon.id) };
}

function ProjectDialog({ project, open, onOpenChange, techIcons }: { project: Project | null; open: boolean; onOpenChange: (open: boolean) => void; techIcons: TechIcon[] }) {
  const [activeLocale, setActiveLocale] = useState<Locale>("fa");
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const form = useForm<ProjectForm>({ defaultValues: initialValues });
  const image = useWatch({ control: form.control, name: "image" });
  const selectedIds = useWatch({ control: form.control, name: "techIconIds" }) ?? [];
  const translations = useWatch({ control: form.control, name: "translations" });

  useEffect(() => { if (open) form.reset(project ? projectToForm(project) : initialValues); }, [form, open, project]);
  const availableLocales = useMemo(() => (Object.keys(translations ?? {}).filter((locale) => { const item = translations?.[locale as Locale]; return Boolean(item?.title.trim() || item?.description.trim()); }) as Locale[]), [translations]);

  function setTechIconIds(ids: string[]) { form.setValue("techIconIds", ids, { shouldDirty: true }); }
  function moveTechIcon(id: string, direction: -1 | 1) { const index = selectedIds.indexOf(id); const next = index + direction; if (next < 0 || next >= selectedIds.length) return; const ids = [...selectedIds]; [ids[index], ids[next]] = [ids[next], ids[index]]; setTechIconIds(ids); }
  function toggleTechIcon(id: string) { setTechIconIds(selectedIds.includes(id) ? selectedIds.filter((item) => item !== id) : [...selectedIds, id]); }

  async function onSubmit(values: ProjectForm) {
    const validTranslations = (Object.values(values.translations) as ProjectTranslationInput[]).filter((item) => item.title.trim() && item.description.trim());
    if (!validTranslations.length) { toast.error("عنوان و توضیحات حداقل یک زبان را وارد کنید."); return; }
    if (Object.values(values.translations).some((item) => (item.title.trim() || item.description.trim()) && (!item.title.trim() || !item.description.trim()))) { toast.error("برای هر ترجمه، عنوان و توضیحات را کامل کنید."); return; }
    const input: ProjectInput = { slug: values.slug, isPublished: values.isPublished, liveUrl: values.liveUrl.trim() || null, imageId: values.image?.id ?? null, translations: validTranslations, techIconIds: values.techIconIds };
    try {
      if (project) await updateProject.mutateAsync({ id: project.id, input }); else await createProject.mutateAsync(input);
      toast.success(project ? "پروژه به‌روزرسانی شد." : "پروژه اضافه شد."); onOpenChange(false);
    } catch (error) { toast.error(getErrorMessage(error)); }
  }

  const translationPath = `translations.${activeLocale}` as const;
  const isSaving = createProject.isPending || updateProject.isPending;
  const activeDescription = translations?.[activeLocale]?.description ?? "";
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="admin-project-dialog max-h-[96vh] w-[calc(100%-1rem)] max-w-6xl border-primary/20 bg-popover/95 p-4 shadow-2xl sm:p-8"><DialogHeader className="rounded-xl border border-primary/20 bg-primary/5 p-5"><div className="flex items-center gap-3"><div className="rounded-lg bg-primary p-2 text-primary-foreground"><Sparkles className="h-5 w-5" /></div><div><DialogTitle className="text-xl">{project ? "ویرایش پروژه" : "افزودن پروژه"}</DialogTitle><p className="mt-1 text-sm text-muted-foreground">اطلاعات پروژه را کامل کنید و محتوای هر زبان را جداگانه بنویسید.</p></div></div></DialogHeader>
    <form dir={activeLocale === "fa" ? "rtl" : "ltr"} onSubmit={form.handleSubmit(onSubmit)} className="admin-project-form space-y-6">
      <div className="grid gap-6 rounded-xl border bg-card p-5 shadow-sm sm:grid-cols-2"><div className="space-y-2"><Label htmlFor="project-slug">Slug</Label><Input id="project-slug" dir="ltr" placeholder="demo یا a-b" {...form.register("slug", { required: "Slug الزامی است.", pattern: { value: slugPattern, message: "فرمت slug معتبر نیست." } })} />{form.formState.errors.slug ? <p className="text-xs text-destructive">{form.formState.errors.slug.message}</p> : <p className="text-xs leading-5 text-muted-foreground">فقط حروف/عدد با یک خط تیره بین کلمات، بدون خط تیره‌ی متوالی (نمونه: demo، a-b)</p>}</div>
        <div className="space-y-2"><Label htmlFor="project-live-url">لینک پروژه</Label><Input id="project-live-url" dir="ltr" type="url" placeholder="https://example.com" {...form.register("liveUrl", { validate: (value) => !value || /^https?:\/\/.+/.test(value) || "یک URL معتبر وارد کنید." })} />{form.formState.errors.liveUrl && <p className="text-xs text-destructive">{form.formState.errors.liveUrl.message}</p>}</div></div>
      <div className="flex items-center justify-between rounded-xl border bg-card p-5 shadow-sm"><div><p className="text-sm font-medium">وضعیت انتشار</p><p className="mt-1 text-xs text-muted-foreground">پروژه‌های منتشرشده در سایت نمایش داده می‌شوند.</p></div><label className="flex cursor-pointer items-center gap-2 text-sm"><input type="checkbox" {...form.register("isPublished")} /> منتشر شده</label></div>
      <div className="rounded-xl border bg-card p-5 shadow-sm"><ImagePicker label="تصویر پروژه" value={image} onChange={(media) => form.setValue("image", media, { shouldDirty: true })} /></div>
      <div className="space-y-6 rounded-xl border border-primary/20 bg-card p-5 shadow-sm sm:p-6"><div><Label className="text-base">محتوای چندزبانه</Label><p className="mt-1 text-sm text-muted-foreground">برای هر زبان عنوان و توضیحات مستقل وارد کنید.</p></div><LocaleTabs value={activeLocale} onChange={setActiveLocale} availableLocales={availableLocales} /><div className="space-y-5 pt-1"><div className="space-y-2"><Label htmlFor={`title-${activeLocale}`}>عنوان پروژه</Label><Input id={`title-${activeLocale}`} className="h-10" placeholder={activeLocale === "fa" ? "عنوان فارسی پروژه" : "Project title"} {...form.register(`${translationPath}.title`)} /></div><div className="space-y-2"><div className="flex items-center justify-between"><Label htmlFor={`description-${activeLocale}`}>توضیحات پروژه</Label><span className="text-xs text-muted-foreground">{activeDescription.length} کاراکتر</span></div><textarea id={`description-${activeLocale}`} dir={activeLocale === "fa" ? "rtl" : "ltr"} placeholder={activeLocale === "fa" ? "درباره‌ی پروژه، مسئله و نتیجه‌ی کار بنویسید..." : "Describe the project, challenge, and outcome..."} className="min-h-52 w-full resize-y rounded-xl border border-input bg-muted/20 px-4 py-3 text-sm leading-7 outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary focus:bg-background focus:ring-3 focus:ring-primary/15" {...form.register(`${translationPath}.description`)} /><p className="text-xs text-muted-foreground">توضیحات کامل‌تر به بازدیدکننده کمک می‌کند ارزش این پروژه را بهتر درک کند.</p></div></div></div>
      <div className="admin-tech-section space-y-4 rounded-xl border bg-card p-5 shadow-sm"><div><Label className="text-base">تکنولوژی‌های پروژه</Label><p className="mt-1 text-sm text-muted-foreground">تکنولوژی‌ها را انتخاب کنید و ترتیب نمایش آن‌ها را تنظیم کنید.</p></div><div className="admin-tech-picker flex max-h-40 flex-wrap gap-2 overflow-y-auto rounded-lg p-3">{techIcons.map((icon) => { const selected = selectedIds.includes(icon.id); return <button key={icon.id} type="button" onClick={() => toggleTechIcon(icon.id)} className={`admin-tech-option rounded-md border px-3 py-1.5 text-sm transition-colors ${selected ? "is-selected" : ""}`}>{selected && <Check className="me-1 inline h-3.5 w-3.5" />}{icon.label}</button>; })}</div>{selectedIds.length > 0 && <div className="admin-selected-tech space-y-1 rounded-lg border p-3">{selectedIds.map((id, index) => { const icon = techIcons.find((item) => item.id === id); return <div key={id} className="flex items-center gap-2 rounded px-2 py-1.5 text-sm"><GripVertical className="h-4 w-4 shrink-0 text-slate-500" /><span className="flex-1">{icon?.label ?? "آیکون انتخاب‌شده"}</span><Button className="admin-tech-control" type="button" variant="ghost" size="icon-xs" disabled={index === 0} onClick={() => moveTechIcon(id, -1)}><ChevronUp /></Button><Button className="admin-tech-control" type="button" variant="ghost" size="icon-xs" disabled={index === selectedIds.length - 1} onClick={() => moveTechIcon(id, 1)}><ChevronDown /></Button><Button className="admin-tech-remove" type="button" variant="ghost" size="icon-xs" onClick={() => toggleTechIcon(id)}><X /></Button></div>; })}</div>}</div>
      <div className="flex justify-end border-t pt-6"><Button type="submit" className="min-w-32" disabled={isSaving}>{isSaving ? "در حال ذخیره…" : "ذخیره پروژه"}</Button></div>
    </form>
  </DialogContent></Dialog>;
}

export default function ProjectsPage() {
  const [page, setPage] = useState(1); const [open, setOpen] = useState(false); const [editing, setEditing] = useState<Project | null>(null); const [ordered, setOrdered] = useState<Project[]>([]); const [draggedId, setDraggedId] = useState<string | null>(null);
  const { data, isLoading, isError } = useProjects(page); const { data: techIcons } = useTechIcons(1, 100); const deleteProject = useDeleteProject(); const reorderProjects = useReorderProjects();
  const projects = useMemo(() => {
    const items = data?.items ?? [];
    return ordered.length === items.length && ordered.every((project) => items.some((item) => item.id === project.id)) ? ordered : items;
  }, [data?.items, ordered]);
  function showCreate() { setEditing(null); setOpen(true); } function showEdit(project: Project) { setEditing(project); setOpen(true); }
  function remove(project: Project) { if (!confirm(`«${project.slug}» حذف شود؟`)) return; deleteProject.mutate(project.id, { onSuccess: () => toast.success("پروژه حذف شد."), onError: (error) => toast.error(getErrorMessage(error)) }); }
  async function dropOn(targetId: string) { if (!draggedId || draggedId === targetId) return; const from = projects.findIndex((item) => item.id === draggedId); const to = projects.findIndex((item) => item.id === targetId); const next = [...projects]; const [item] = next.splice(from, 1); next.splice(to, 0, item); setOrdered(next); setDraggedId(null); try { await reorderProjects.mutateAsync(next.map((project) => project.id)); toast.success("ترتیب پروژه‌ها ذخیره شد."); } catch (error) { toast.error(getErrorMessage(error)); setOrdered([]); } }
  return <div className="space-y-6"><div className="flex flex-wrap items-start justify-between gap-4"><div><h1 className="text-2xl font-bold">پروژه‌ها</h1><p className="text-muted-foreground">پروژه‌ها، ترجمه‌ها، تصویر و تکنولوژی‌های هر پروژه را مدیریت کنید.</p></div><Button onClick={showCreate}><Plus /> افزودن پروژه</Button></div>
    {isError ? <p className="text-destructive">دریافت پروژه‌ها ناموفق بود.</p> : isLoading ? <p className="text-muted-foreground">در حال دریافت…</p> : projects.length ? <><p className="text-sm text-muted-foreground">برای تغییر ترتیب، کارت‌ها را بکشید و رها کنید.</p><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{projects.map((project) => { const url = mediaUrl(project.image); const title = project.translations.find((item) => item.locale === "fa")?.title ?? project.translations[0]?.title ?? project.slug; return <Card key={project.id} draggable onDragStart={() => setDraggedId(project.id)} onDragOver={(event) => event.preventDefault()} onDrop={() => dropOn(project.id)} className="cursor-grab active:cursor-grabbing"><div className="relative aspect-[16/9] bg-muted">{url ? <Image src={url} alt={title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" unoptimized /> : <div className="flex h-full items-center justify-center text-muted-foreground"><ImageOff /></div>}<span className="absolute start-3 top-3 rounded bg-background/90 p-1.5"><GripVertical className="h-4 w-4" /></span><span className={`absolute end-3 top-3 rounded px-2 py-1 text-xs ${project.isPublished ? "bg-emerald-600 text-white" : "bg-muted text-muted-foreground"}`}>{project.isPublished ? "منتشرشده" : "پیش‌نویس"}</span></div><CardHeader><CardTitle className="truncate">{title}</CardTitle><p className="font-mono text-xs text-muted-foreground">{project.slug}</p></CardHeader><CardContent className="space-y-3"><p className="line-clamp-2 text-muted-foreground">{project.translations.find((item) => item.locale === "fa")?.description ?? project.translations[0]?.description}</p><div className="flex flex-wrap gap-1">{[...project.techIcons].sort((a, b) => a.order - b.order).map(({ techIcon }) => <span className="rounded bg-muted px-2 py-1 text-xs" key={techIcon.id}>{techIcon.label}</span>)}</div></CardContent><CardFooter className="justify-end gap-2"><Button variant="outline" size="sm" onClick={() => showEdit(project)}><Pencil /> ویرایش</Button><Button variant="destructive" size="sm" disabled={deleteProject.isPending} onClick={() => remove(project)}><Trash2 /> حذف</Button></CardFooter></Card>; })}</div></> : <div className="py-16 text-center text-muted-foreground">هنوز پروژه‌ای ثبت نشده است.</div>}
    {data && <PaginationControls page={data.meta.page} totalPages={data.meta.totalPages} onPageChange={setPage} />}<ProjectDialog project={editing} open={open} onOpenChange={setOpen} techIcons={techIcons?.items ?? []} />
  </div>;
}
