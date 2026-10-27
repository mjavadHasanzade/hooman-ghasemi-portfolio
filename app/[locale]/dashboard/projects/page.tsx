"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
  Check,
  ChevronDown,
  ChevronUp,
  GripVertical,
  ImageOff,
  Pencil,
  Plus,
  Sparkles,
  Trash2,
  Wand2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { ImagePicker } from "@/components/media/image-picker";
import { LocaleTabs } from "@/components/shared/locale-tabs";
import { ReorderControls } from "@/components/shared/reorder-controls";
import { sortTechIcons } from "@/lib/tech-icon-order";
import { richTextPlainText } from "@/lib/rich-text";
import { RichTextField } from "@/components/shared/rich-text-field";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { getErrorMessage } from "@/lib/api/error";
import {
  useCreateProject,
  useDeleteProject,
  useProjects,
  useReorderProjects,
  useAllTechIcons,
  useUpdateProject,
} from "@/lib/hooks/use-projects";
import type { Locale } from "@/lib/types/api";
import { mediaUrl, type Media } from "@/lib/types/media";
import type {
  Project,
  ProjectInput,
  ProjectTranslationInput,
  TechIcon,
} from "@/lib/types/projects";
import {
  RichTextEditor,
  stripHtml,
} from "@/components/shared/rich-text-editor";

type ProjectForm = {
  slug: string;
  isPublished: boolean;
  liveUrl: string;
  image: Media | null;
  galleryImages: Media[];
  translations: Record<Locale, ProjectTranslationInput>;
  techIconIds: string[];
};

const emptyTranslation = (locale: Locale): ProjectTranslationInput => ({
  locale,
  title: "",
  description: "",
});
const initialValues: ProjectForm = {
  slug: "",
  isPublished: true,
  liveUrl: "",
  image: null,
  galleryImages: [],
  translations: { fa: emptyTranslation("fa"), en: emptyTranslation("en") },
  techIconIds: [],
};

// Fixed: previously `(?:-[a-z0-9-])*` only matched a single character
// after each hyphen, so multi-letter segments like "hello-world" failed.
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function slugify(input: string): string {
  return input
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents/diacritics
    .replace(/[\u0600-\u06FF]/g, "") // strip Persian/Arabic script (slugs are Latin-only)
    .replace(/[^a-z0-9]+/g, "-") // non-alphanumeric -> hyphen
    .replace(/-{2,}/g, "-") // collapse consecutive hyphens
    .replace(/^-+|-+$/g, ""); // trim leading/trailing hyphens
}

function projectToForm(project: Project): ProjectForm {
  const translations = {
    fa: emptyTranslation("fa"),
    en: emptyTranslation("en"),
  };
  for (const item of project.translations)
    translations[item.locale] = {
      locale: item.locale,
      title: item.title,
      description: item.description,
    };
  return {
    slug: project.slug,
    isPublished: project.isPublished,
    liveUrl: project.liveUrl ?? "",
    image: project.image,
    galleryImages: [...project.galleryImages]
      .sort((a, b) => a.order - b.order)
      .map((item) => item.media),
    translations,
    techIconIds: [...project.techIcons]
      .sort((a, b) => a.order - b.order)
      .map((item) => item.techIcon.id),
  };
}

function ProjectDialog({
  project,
  open,
  onOpenChange,
  techIcons,
}: {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  techIcons: TechIcon[];
}) {
  const [activeLocale, setActiveLocale] = useState<Locale>("fa");
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();

  // Computed directly (not via useEffect + reset) so the very first render
  // — and therefore Tiptap's initial content — already has correct data.
  // Combined with the `key` prop in the parent (which forces a fresh mount
  // per project/open), this removes the race condition that caused the
  // rich text editor (and other fields) to sometimes fill with stale data.
  const form = useForm<ProjectForm>({
    defaultValues: project ? projectToForm(project) : initialValues,
  });

  const image = useWatch({ control: form.control, name: "image" });
  const galleryImages = useWatch({ control: form.control, name: "galleryImages" }) ?? [];
  const selectedIds =
    useWatch({ control: form.control, name: "techIconIds" }) ?? [];
  const translations = useWatch({
    control: form.control,
    name: "translations",
  });

  const availableLocales = useMemo(
    () =>
      Object.keys(translations ?? {}).filter((locale) => {
        const item = translations?.[locale as Locale];
        return Boolean(item?.title.trim() || item?.description.trim());
      }) as Locale[],
    [translations],
  );

  function setTechIconIds(ids: string[]) {
    form.setValue("techIconIds", ids, { shouldDirty: true });
  }
  function setGalleryImages(images: Media[]) {
    form.setValue("galleryImages", images, { shouldDirty: true });
  }
  function addGalleryImage(media: Media | null) {
    if (!media) return;
    if (galleryImages.some((image) => image.id === media.id)) {
      toast.error("این تصویر از قبل در گالری قرار دارد.");
      return;
    }
    setGalleryImages([...galleryImages, media]);
  }
  function removeGalleryImage(id: string) {
    setGalleryImages(galleryImages.filter((image) => image.id !== id));
  }
  function moveGalleryImage(index: number, direction: -1 | 1) {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= galleryImages.length) return;
    const images = [...galleryImages];
    [images[index], images[nextIndex]] = [images[nextIndex], images[index]];
    setGalleryImages(images);
  }
  function moveTechIcon(id: string, direction: -1 | 1) {
    const index = selectedIds.indexOf(id);
    const next = index + direction;
    if (next < 0 || next >= selectedIds.length) return;
    const ids = [...selectedIds];
    [ids[index], ids[next]] = [ids[next], ids[index]];
    setTechIconIds(ids);
  }
  function toggleTechIcon(id: string) {
    setTechIconIds(
      selectedIds.includes(id)
        ? selectedIds.filter((item) => item !== id)
        : [...selectedIds, id],
    );
  }

  function generateSlugFromTitle() {
    const source =
      richTextPlainText(translations?.en?.title ?? "").trim() || richTextPlainText(translations?.fa?.title ?? "").trim();
    if (!source) {
      toast.error("ابتدا عنوان (فارسی یا انگلیسی) را وارد کنید.");
      return;
    }
    const slug = slugify(source);
    if (!slug) {
      toast.error(
        "امکان ساخت slug از این عنوان وجود ندارد؛ آن را دستی وارد کنید.",
      );
      return;
    }
    form.setValue("slug", slug, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  async function onSubmit(values: ProjectForm) {
    const validTranslations = (
      Object.values(values.translations) as ProjectTranslationInput[]
    ).filter((item) => richTextPlainText(item.title).trim() && richTextPlainText(item.description).trim());
    if (!validTranslations.length) {
      toast.error("عنوان و توضیحات حداقل یک زبان را وارد کنید.");
      return;
    }
    if (
      Object.values(values.translations).some(
        (item) =>
          (richTextPlainText(item.title).trim() || richTextPlainText(item.description).trim()) &&
          (!richTextPlainText(item.title).trim() || !richTextPlainText(item.description).trim()),
      )
    ) {
      toast.error("برای هر ترجمه، عنوان و توضیحات را کامل کنید.");
      return;
    }
    const input: ProjectInput = {
      slug: values.slug.trim(),
      isPublished: values.isPublished,
      liveUrl: values.liveUrl.trim() || null,
      imageId: values.image?.id ?? null,
      galleryImageIds: values.galleryImages.map((image) => image.id),
      translations: validTranslations,
      techIconIds: values.techIconIds,
    };
    try {
      if (project) await updateProject.mutateAsync({ id: project.id, input });
      else await createProject.mutateAsync(input);
      toast.success(project ? "پروژه به‌روزرسانی شد." : "پروژه اضافه شد.");
      onOpenChange(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  const translationPath = `translations.${activeLocale}` as const;
  const isSaving = createProject.isPending || updateProject.isPending;
  const activeDescription = translations?.[activeLocale]?.description ?? "";
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="admin-project-dialog max-h-[96vh] w-[calc(100%-1rem)] max-w-6xl border-primary/20 bg-popover/95 p-4 shadow-2xl sm:p-8">
        <DialogHeader className="rounded-xl border border-primary/20 bg-primary/5 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary p-2 text-primary-foreground">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl">
                {project ? "ویرایش پروژه" : "افزودن پروژه"}
              </DialogTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                اطلاعات پروژه را کامل کنید و محتوای هر زبان را جداگانه بنویسید.
              </p>
            </div>
          </div>
        </DialogHeader>
        <form
          dir={activeLocale === "fa" ? "rtl" : "ltr"}
          onSubmit={form.handleSubmit(onSubmit)}
          className="admin-project-form space-y-6"
        >
          <div className="grid gap-6 rounded-xl border bg-card p-5 shadow-sm sm:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label id="project-slug-label" htmlFor="project-slug">Slug</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1 px-2 text-xs"
                  onClick={generateSlugFromTitle}
                >
                  <Wand2 className="h-3.5 w-3.5" />
                  تولید از عنوان
                </Button>
              </div>
              <Input
                id="project-slug"
                dir="ltr"
                placeholder="my-project یا demo"
                {...form.register("slug", {
                  setValueAs: (value: string) => value.trim(),
                  required: "Slug الزامی است.",
                  validate: (value: string) =>
                    slugPattern.test(value.trim()) ||
                    "فرمت slug معتبر نیست. از حروف انگلیسی، عدد و خط تیره بین کلمات استفاده کنید.",
                })}
              />
              {form.formState.errors.slug ? (
                <p className="text-xs text-destructive">
                  {form.formState.errors.slug.message}
                </p>
              ) : (
                <p className="text-xs leading-5 text-muted-foreground">
                  فقط حروف/عدد انگلیسی با خط تیره بین کلمات، بدون خط تیره‌ی
                  ابتدایی/انتهایی یا متوالی (نمونه: demo، my-project)
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label id="project-live-url-label" htmlFor="project-live-url">لینک پروژه</Label>
              <Input
                id="project-live-url"
                dir="ltr"
                type="url"
                placeholder="https://example.com"
                {...form.register("liveUrl", {
                  validate: (value) =>
                    !value ||
                    /^https?:\/\/.+/.test(value) ||
                    "یک URL معتبر وارد کنید.",
                })}
              />
              {form.formState.errors.liveUrl && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.liveUrl.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between rounded-xl border bg-card p-5 shadow-sm">
            <div>
              <p className="text-sm font-medium">وضعیت انتشار</p>
              <p className="mt-1 text-xs text-muted-foreground">
                پروژه‌های منتشرشده در سایت نمایش داده می‌شوند.
              </p>
            </div>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input type="checkbox" {...form.register("isPublished")} /> منتشر
              شده
            </label>
          </div>
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <ImagePicker
              label="تصویر پروژه"
              value={image}
              onChange={(media) =>
                form.setValue("image", media, { shouldDirty: true })
              }
            />
          </div>
          <div className="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
            <div>
              <Label className="text-base">تصاویر گالری</Label>
              <p className="mt-1 text-sm text-muted-foreground">
                تصاویر را به ترتیب نمایش انتخاب کنید. تصویر اصلی جدا از گالری است.
              </p>
            </div>
            <ImagePicker
              label="افزودن تصویر گالری"
              value={null}
              onChange={addGalleryImage}
            />
            {galleryImages.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {galleryImages.map((galleryImage, index) => {
                  const url = mediaUrl(galleryImage);
                  return (
                    <div key={galleryImage.id} className="overflow-hidden rounded-xl border bg-background/40">
                      <div className="relative aspect-video bg-muted">
                        {url ? <Image src={url} alt={galleryImage.altText ?? ""} fill sizes="(max-width: 640px) 100vw, 260px" className="object-cover" unoptimized /> : null}
                        <span className="absolute start-2 top-2 rounded bg-black/70 px-2 py-1 font-mono text-xs text-white">{index + 1}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2 p-2">
                        <span className="min-w-0 truncate text-xs text-muted-foreground">{galleryImage.filename}</span>
                        <div className="flex shrink-0 gap-1">
                          <Button type="button" variant="ghost" size="icon-sm" aria-label="انتقال به بالا" disabled={index === 0} onClick={() => moveGalleryImage(index, -1)}><ChevronUp /></Button>
                          <Button type="button" variant="ghost" size="icon-sm" aria-label="انتقال به پایین" disabled={index === galleryImages.length - 1} onClick={() => moveGalleryImage(index, 1)}><ChevronDown /></Button>
                          <Button type="button" variant="destructive" size="icon-sm" aria-label="حذف تصویر" onClick={() => removeGalleryImage(galleryImage.id)}><Trash2 /></Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="rounded-lg border border-dashed p-5 text-center text-sm text-muted-foreground">هنوز تصویری برای گالری انتخاب نشده است.</p>
            )}
          </div>
          <div className="space-y-6 rounded-xl border border-primary/20 bg-card p-5 shadow-sm sm:p-6">
            <div>
              <Label className="text-base">محتوای چندزبانه</Label>
              <p className="mt-1 text-sm text-muted-foreground">
                برای هر زبان عنوان و توضیحات مستقل وارد کنید.
              </p>
            </div>
            <LocaleTabs
              value={activeLocale}
              onChange={setActiveLocale}
              availableLocales={availableLocales}
            />
            <div className="space-y-5 pt-1">
              <div className="space-y-2">
                <Label id={`title-${activeLocale}-label`} htmlFor={`title-${activeLocale}`}>عنوان پروژه</Label>
                <RichTextField control={form.control} name={`${translationPath}.title`} id={`title-${activeLocale}`} locale={activeLocale} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label id={`description-${activeLocale}-label`} htmlFor={`description-${activeLocale}`}>
                    توضیحات پروژه
                  </Label>
                  <span className="text-xs text-muted-foreground">
                    {stripHtml(activeDescription).length} کاراکتر
                  </span>
                </div>
                <Controller
                  control={form.control}
                  name={`${translationPath}.description`}
                  render={({ field }) => (
                    <RichTextEditor
                      id={`description-${activeLocale}`}
                      key={activeLocale}
                      value={field.value}
                      onChange={field.onChange}
                      dir={activeLocale === "fa" ? "rtl" : "ltr"}
                      placeholder={
                        activeLocale === "fa"
                          ? "درباره‌ی پروژه، مسئله و نتیجه‌ی کار بنویسید..."
                          : "Describe the project, challenge, and outcome..."
                      }
                    />
                  )}
                />
                <p className="text-xs text-muted-foreground">
                  توضیحات کامل‌تر به بازدیدکننده کمک می‌کند ارزش این پروژه را
                  بهتر درک کند.
                </p>
              </div>
            </div>
          </div>
          <div className="admin-tech-section space-y-4 rounded-xl border bg-card p-5 shadow-sm">
            <div>
              <Label className="text-base">تکنولوژی‌های پروژه</Label>
              <p className="mt-1 text-sm text-muted-foreground">
                تکنولوژی‌ها را انتخاب کنید و ترتیب نمایش آن‌ها را تنظیم کنید.
              </p>
            </div>
            <div className="admin-tech-picker flex max-h-40 flex-wrap gap-2 overflow-y-auto rounded-lg p-3">
              {techIcons.map((icon) => {
                const selected = selectedIds.includes(icon.id);
                return (
                  <button
                    key={icon.id}
                    type="button"
                    onClick={() => toggleTechIcon(icon.id)}
                    className={`admin-tech-option inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm transition-colors ${selected ? "is-selected" : ""}`}
                  >
                    {icon.image ? (
                      <Image
                        src={mediaUrl(icon.image)!}
                        alt=""
                        width={20}
                        height={20}
                        className="h-5 w-5 rounded object-contain"
                        unoptimized
                      />
                    ) : (
                      <span className="admin-tech-placeholder">
                        {icon.label.slice(0, 1).toUpperCase()}
                      </span>
                    )}
                    {selected && <Check className="h-3.5 w-3.5" />}
                    {icon.label}
                  </button>
                );
              })}
            </div>
            {selectedIds.length > 0 && (
              <div className="admin-selected-tech space-y-1 rounded-lg border p-3">
                {selectedIds.map((id, index) => {
                  const icon = techIcons.find((item) => item.id === id);
                  return (
                    <div
                      key={id}
                      className="flex items-center gap-2 rounded px-2 py-1.5 text-sm"
                    >
                      <GripVertical className="h-4 w-4 shrink-0 text-slate-500" />
                      <span className="flex-1">
                        {icon?.label ?? "آیکون انتخاب‌شده"}
                      </span>
                      <Button
                        className="admin-tech-control"
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        disabled={index === 0}
                        onClick={() => moveTechIcon(id, -1)}
                      >
                        <ChevronUp />
                      </Button>
                      <Button
                        className="admin-tech-control"
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        disabled={index === selectedIds.length - 1}
                        onClick={() => moveTechIcon(id, 1)}
                      >
                        <ChevronDown />
                      </Button>
                      <Button
                        className="admin-tech-remove"
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => toggleTechIcon(id)}
                      >
                        <X />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div className="flex justify-end border-t pt-6">
            <Button type="submit" className="min-w-32" disabled={isSaving}>
              {isSaving ? "در حال ذخیره…" : "ذخیره تغییرات"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function ProjectsPage() {
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  // Bumped on every open so ProjectDialog fully remounts (fresh useForm +
  // fresh RichTextEditor instances) with correct initial values — this is
  // what actually fixes the "fill from backend" bug.
  const [dialogKey, setDialogKey] = useState(0);
  const [ordered, setOrdered] = useState<Project[]>([]);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const { data, isLoading, isError } = useProjects(page);
  const { data: techIcons } = useAllTechIcons();
  const deleteProject = useDeleteProject();
  const reorderProjects = useReorderProjects();
  const projects = useMemo(() => {
    const items = data?.items ?? [];
    return ordered.length === items.length &&
      ordered.every((project) => items.some((item) => item.id === project.id))
      ? ordered
      : items;
  }, [data?.items, ordered]);
  function showCreate() {
    setEditing(null);
    setDialogKey((key) => key + 1);
    setOpen(true);
  }
  function showEdit(project: Project) {
    setEditing(project);
    setDialogKey((key) => key + 1);
    setOpen(true);
  }
  function remove(project: Project) {
    if (!confirm(`«${project.slug}» حذف شود؟`)) return;
    deleteProject.mutate(project.id, {
      onSuccess: () => toast.success("پروژه حذف شد."),
      onError: (error) => toast.error(getErrorMessage(error)),
    });
  }
  async function dropOn(targetId: string, sourceId = draggedId) {
    if (!sourceId || sourceId === targetId || reorderProjects.isPending) return;
    const from = projects.findIndex((item) => item.id === sourceId);
    const to = projects.findIndex((item) => item.id === targetId);
    if (from < 0 || to < 0) return;
    const next = [...projects];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    setOrdered(next);
    setDraggedId(null);
    try {
      await reorderProjects.mutateAsync(next.map((project) => project.id));
      toast.success("ترتیب پروژه‌ها ذخیره شد.");
    } catch (error) {
      toast.error(getErrorMessage(error));
      setOrdered([]);
    } finally {
      setOrdered([]);
    }
  }
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">پروژه‌ها</h1>
          <p className="text-muted-foreground">
            پروژه‌ها، ترجمه‌ها، تصویر و تکنولوژی‌های هر پروژه را مدیریت کنید.
          </p>
        </div>
        <Button onClick={showCreate}>
          <Plus /> افزودن پروژه
        </Button>
      </div>
      {isError ? (
        <p className="text-destructive">دریافت پروژه‌ها ناموفق بود.</p>
      ) : isLoading ? (
        <p className="text-muted-foreground">در حال دریافت…</p>
      ) : projects.length ? (
        <>
          <p className="text-sm text-muted-foreground">
            برای تغییر ترتیب از دکمه‌های بالا و پایین یا کشیدن کارت‌ها استفاده کنید.
          </p>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project, index) => {
              const url = mediaUrl(project.image);
              const title =
                project.translations.find((item) => item.locale === "fa")
                  ?.title ??
                project.translations[0]?.title ??
                project.slug;
              return (
                <Card
                  key={project.id}
                  draggable
                  onDragStart={() => setDraggedId(project.id)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => dropOn(project.id)}
                  className="cursor-grab active:cursor-grabbing"
                >
                  <div className="relative aspect-video bg-muted">
                    {url ? (
                      <Image
                        src={url}
                        alt={richTextPlainText(title)}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-muted-foreground">
                        <ImageOff />
                      </div>
                    )}
                    <span className="absolute inset-s-3 top-3 rounded bg-background/90 p-1.5">
                      <GripVertical className="h-4 w-4" />
                    </span>
                    <span
                      className={`absolute inset-e-3 top-3 rounded px-2 py-1 text-xs ${project.isPublished ? "bg-emerald-600 text-white" : "bg-muted text-muted-foreground"}`}
                    >
                      {project.isPublished ? "منتشرشده" : "پیش‌نویس"}
                    </span>
                  </div>
                  <CardHeader>
                    <CardTitle className="truncate">{richTextPlainText(title)}</CardTitle>
                    <p className="font-mono text-xs text-muted-foreground">
                      {project.slug}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="line-clamp-2 text-muted-foreground">
                      {stripHtml(
                        project.translations.find(
                          (item) => item.locale === "fa",
                        )?.description ??
                          project.translations[0]?.description ??
                          "",
                      )}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {[...project.techIcons]
                        .sort((a, b) => a.order - b.order)
                        .map(({ techIcon }) => (
                          <span
                            className="rounded bg-muted px-2 py-1 text-xs"
                            key={techIcon.id}
                          >
                            {techIcon.label}
                          </span>
                        ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex-wrap justify-end gap-2"><ReorderControls index={index} count={projects.length} disabled={reorderProjects.isPending} onMove={(target) => dropOn(projects[target].id, project.id)} />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => showEdit(project)}
                    >
                      <Pencil /> ویرایش
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={deleteProject.isPending}
                      onClick={() => remove(project)}
                    >
                      <Trash2 /> حذف
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </>
      ) : (
        <div className="py-16 text-center text-muted-foreground">
          هنوز پروژه‌ای ثبت نشده است.
        </div>
      )}
      {data && (
        <PaginationControls
          page={data.meta.page}
          totalPages={data.meta.totalPages}
          onPageChange={setPage}
        />
      )}
      <ProjectDialog
        key={dialogKey}
        project={editing}
        open={open}
        onOpenChange={setOpen}
        techIcons={sortTechIcons(techIcons ?? [])}
      />
    </div>
  );
}
