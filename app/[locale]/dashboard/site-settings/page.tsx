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
import { Check, Globe2, SlidersHorizontal } from "lucide-react";

type SiteSettingsForm = {
  siteName: string;
  contactEmail: string;
  phoneNumber: string;
  defaultLocale: Locale;
  faviconMedia: Media | null;
  ogImageMedia: Media | null;
  footerLogoMedia: Media | null;
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
      <div className="flex justify-end border-t border-white/10 pt-5">
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
      phoneNumber: "",
      defaultLocale: "en",
      faviconMedia: null,
      ogImageMedia: null,
      footerLogoMedia: null,
    },
  });
  const faviconMedia = useWatch({ control: form.control, name: "faviconMedia" });
  const ogImageMedia = useWatch({ control: form.control, name: "ogImageMedia" });
  const footerLogoMedia = useWatch({ control: form.control, name: "footerLogoMedia" });

  useEffect(() => {
    if (!settings) return;

    form.reset({
      siteName: settings.siteName,
      contactEmail: settings.contactEmail,
      phoneNumber: settings.phoneNumber,
      defaultLocale: settings.defaultLocale,
      faviconMedia: settings.faviconMedia,
      ogImageMedia: settings.ogImageMedia,
      footerLogoMedia: settings.footerLogoMedia,
    });
  }, [form, settings]);

  async function onSubmit(values: SiteSettingsForm) {
    try {
      const updatedSettings = await updateSettings.mutateAsync({
        siteName: values.siteName,
        contactEmail: values.contactEmail,
        phoneNumber: values.phoneNumber,
        defaultLocale: values.defaultLocale,
        faviconMediaId: values.faviconMedia?.id ?? null,
        ogImageMediaId: values.ogImageMedia?.id ?? null,
        footerLogoMediaId: values.footerLogoMedia?.id ?? null,
      });
      form.reset({
        siteName: updatedSettings.siteName,
        contactEmail: updatedSettings.contactEmail,
        phoneNumber: updatedSettings.phoneNumber,
        defaultLocale: updatedSettings.defaultLocale,
        faviconMedia: updatedSettings.faviconMedia,
        ogImageMedia: updatedSettings.ogImageMedia,
        footerLogoMedia: updatedSettings.footerLogoMedia,
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
    <div className="admin-page max-w-5xl space-y-7">
      <div className="flex flex-col justify-between gap-5 border-b border-white/10 pb-7 sm:flex-row sm:items-end">
        <div>
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300"><SlidersHorizontal className="h-4 w-4" /> تنظیمات مرکزی</div>
          <h1 className="text-3xl font-bold tracking-tight text-white">تنظیمات سایت</h1>
          <p className="mt-2 text-sm text-slate-400">هویت، زبان و تصاویر متادیتای تجربه‌ی دیجیتال را مدیریت کنید.</p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs text-emerald-300"><Check className="h-3.5 w-3.5" /> همه چیز همگام است</div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="admin-settings-card">
          <CardHeader className="border-b border-white/10 pb-5"><div className="flex items-center gap-3"><span className="admin-section-icon"><Globe2 /></span><div><CardTitle>اطلاعات عمومی</CardTitle><p className="mt-1 text-xs text-slate-500">مشخصات اصلی که در سراسر سایت استفاده می‌شوند.</p></div></div></CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="site-name">نام سایت</Label>
              <Input id="site-name" {...form.register("siteName", { required: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-email">ایمیل تماس</Label>
              <Input id="contact-email" type="email" dir="ltr" {...form.register("contactEmail", { required: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone-number">شماره تلفن</Label>
              <Input id="phone-number" type="tel" dir="ltr" placeholder="+98 912 123 4567" {...form.register("phoneNumber")} />
            </div>
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
            <ImagePicker label="لوگوی فوتر" value={footerLogoMedia} onChange={(media) => form.setValue("footerLogoMedia", media, { shouldDirty: true })} />
          </CardContent>
          <CardFooter className="justify-between gap-4">
            <span className="text-xs text-slate-500">تغییرات ذخیره‌نشده با دکمه‌ی زیر ثبت می‌شوند.</span>
            <Button type="submit" disabled={updateSettings.isPending || !form.formState.isDirty}>
              {updateSettings.isPending ? "در حال ذخیره…" : "ذخیره تغییرات"}
            </Button>
          </CardFooter>
        </Card>
      </form>

      <Card className="admin-settings-card">
        <CardHeader className="border-b border-white/10 pb-5">
          <CardTitle>متن سکشن‌های سایت</CardTitle>
          <p className="text-sm text-slate-400">عنوان و زیرعنوان سکشن‌ها را برای هر زبان جداگانه مدیریت کنید.</p>
        </CardHeader>
        <CardContent>
          <LocaleTabs value={activeLocale} onChange={setActiveLocale} availableLocales={settings.availableLocales} />
          <SectionHeadingsTranslationForm key={activeLocale} settings={settings} locale={activeLocale} />
        </CardContent>
      </Card>
    </div>
  );
}
