"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { ImagePicker } from "@/components/media/image-picker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ContentFormSkeleton } from "@/components/content/content-form-skeleton";
import { getErrorMessage } from "@/lib/api/error";
import { useSiteSettings, useUpdateSiteSettings } from "@/lib/hooks/use-content";
import type { Locale } from "@/lib/types/api";
import type { Media } from "@/lib/types/media";

type SiteSettingsForm = {
  siteName: string;
  contactEmail: string;
  defaultLocale: Locale;
  faviconMedia: Media | null;
  ogImageMedia: Media | null;
};

export default function SiteSettingsPage() {
  const { data: settings, isLoading, isError } = useSiteSettings();
  const updateSettings = useUpdateSiteSettings();
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
    </div>
  );
}
