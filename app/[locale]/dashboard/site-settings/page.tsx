"use client";

import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { ImagePicker } from "@/components/media/image-picker";
import { LocaleTabs } from "@/components/shared/locale-tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ContentFormSkeleton } from "@/components/content/content-form-skeleton";
import { getErrorMessage } from "@/lib/api/error";
import { useSiteSettings, useUpdateSiteSettings } from "@/lib/hooks/use-content";
import type { Locale } from "@/lib/types/api";
import type { Media } from "@/lib/types/media";
import type { SiteSettings, SiteSettingsTranslation } from "@/lib/types/content";

type SiteSettingsForm = {
  siteName: string;
  contactEmail: string;
  defaultLocale: Locale;
  faviconMedia: Media | null;
  ogImageMedia: Media | null;
};

type SectionHeadingsForm = Omit<SiteSettingsTranslation, "id" | "siteSettingsId" | "locale"> & { locale: Locale };

const emptySectionHeadings = (locale: Locale): SectionHeadingsForm => ({
  locale,
  servicesTitle: "",
  servicesSubtitle: "",
  technologiesTitle: "",
  technologiesSubtitle: "",
  projectsTitle: "",
  projectsSubtitle: "",
});

function SectionHeadingsTranslationForm({ settings, locale }: { settings: SiteSettings; locale: Locale }) {
  const updateSettings = useUpdateSiteSettings();
  const translation = settings.translations.find((item) => item.locale === locale);
  const form = useForm<SectionHeadingsForm>({ defaultValues: translation ? { ...translation, locale } : emptySectionHeadings(locale) });

  useEffect(() => {
    form.reset(translation ? { ...translation, locale } : emptySectionHeadings(locale));
  }, [form, locale, translation]);

  async function onSubmit(values: SectionHeadingsForm) {
    try {
      await updateSettings.mutateAsync({ translations: [values] });
      form.reset(values);
      toast.success("متن‌های سکشن ذخیره شد.");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  const fields = [
    ["servicesTitle", "Services Title", "عنوان سکشن خدمات"],
    ["servicesSubtitle", "Services Subtitle", "زیرعنوان سکشن خدمات"],
    ["technologiesTitle", "Technologies Title", "عنوان سکشن تکنولوژی‌ها"],
    ["technologiesSubtitle", "Technologies Subtitle", "زیرعنوان سکشن تکنولوژی‌ها"],
    ["projectsTitle", "Projects Title", "عنوان سکشن پروژه‌ها"],
    ["projectsSubtitle", "Projects Subtitle", "زیرعنوان سکشن پروژه‌ها"],
  ] as const;

  return (
    <form dir={locale === "fa" ? "rtl" : "ltr"} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-6">
      <div className="grid gap-5 sm:grid-cols-2">
        {fields.map(([name, englishLabel, persianLabel]) => (
          <div className="space-y-2" key={name}>
            <Label htmlFor={`section-heading-${name}-${locale}`}>{locale === "fa" ? persianLabel : englishLabel}</Label>
            <Input id={`section-heading-${name}-${locale}`} {...form.register(name)} />
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={updateSettings.isPending || !form.formState.isDirty}>
          {updateSettings.isPending ? "در حال ذخیره…" : "ذخیره ترجمه"}
        </Button>
      </div>
    </form>
  );
}

export default function SiteSettingsPage() {
  const { data: settings, isLoading, isError } = useSiteSettings();
  const updateSettings = useUpdateSiteSettings();
  const [activeLocale, setActiveLocale] = useState<Locale>("fa");
  const form = useForm<SiteSettingsForm>({
    defaultValues: {
      siteName: "",
      contactEmail: "",
      defaultLocale: "fa",
      faviconMedia: null,
      ogImageMedia: null,
    },
  });
  const faviconMedia = useWatch({ control: form.control, name: "faviconMedia" });
  const ogImageMedia = useWatch({ control: form.control, name: "ogImageMedia" });

  useEffect(() => {
    if (!settings) return;

    form.reset({
      siteName: settings.siteName,
      contactEmail: settings.contactEmail,
      defaultLocale: settings.defaultLocale,
      faviconMedia: settings.faviconMedia,
      ogImageMedia: settings.ogImageMedia,
    });
  }, [form, settings]);

  async function onSubmit(values: SiteSettingsForm) {
    try {
      const updatedSettings = await updateSettings.mutateAsync({
        siteName: values.siteName,
        contactEmail: values.contactEmail,
        defaultLocale: values.defaultLocale,
        faviconMediaId: values.faviconMedia?.id ?? null,
        ogImageMediaId: values.ogImageMedia?.id ?? null,
      });
      form.reset({
        siteName: updatedSettings.siteName,
        contactEmail: updatedSettings.contactEmail,
        defaultLocale: updatedSettings.defaultLocale,
        faviconMedia: updatedSettings.faviconMedia,
        ogImageMedia: updatedSettings.ogImageMedia,
      });
      toast.success("تنظیمات سایت ذخیره شد.");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  if (isLoading) return <ContentFormSkeleton />;
  if (isError || !settings) {
    return <p className="text-destructive">دریافت تنظیمات سایت ناموفق بود.</p>;
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">تنظیمات سایت</h1>
        <p className="text-muted-foreground">اطلاعات عمومی و تصاویر متادیتای سایت را مدیریت کنید.</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader><CardTitle>اطلاعات عمومی</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="site-name">نام سایت</Label>
              <Input id="site-name" {...form.register("siteName", { required: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-email">ایمیل تماس</Label>
              <Input id="contact-email" type="email" dir="ltr" {...form.register("contactEmail", { required: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="default-locale">زبان پیش‌فرض</Label>
              <select id="default-locale" className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm" {...form.register("defaultLocale")}>
                <option value="fa">فارسی</option>
                <option value="en">English</option>
              </select>
            </div>
            <ImagePicker label="Favicon" value={faviconMedia} onChange={(media) => form.setValue("faviconMedia", media, { shouldDirty: true })} />
            <ImagePicker label="تصویر Open Graph" value={ogImageMedia} onChange={(media) => form.setValue("ogImageMedia", media, { shouldDirty: true })} />
          </CardContent>
          <CardFooter className="justify-end">
            <Button type="submit" disabled={updateSettings.isPending || !form.formState.isDirty}>
              {updateSettings.isPending ? "در حال ذخیره…" : "ذخیره تغییرات"}
            </Button>
          </CardFooter>
        </Card>
      </form>

      <Card>
        <CardHeader>
          <CardTitle>متن سکشن‌های سایت</CardTitle>
          <p className="text-sm text-muted-foreground">عنوان و زیرعنوان سکشن‌ها را برای هر زبان جداگانه مدیریت کنید.</p>
        </CardHeader>
        <CardContent>
          <LocaleTabs value={activeLocale} onChange={setActiveLocale} availableLocales={settings.availableLocales} />
          <SectionHeadingsTranslationForm key={activeLocale} settings={settings} locale={activeLocale} />
        </CardContent>
      </Card>
    </div>
  );
}
