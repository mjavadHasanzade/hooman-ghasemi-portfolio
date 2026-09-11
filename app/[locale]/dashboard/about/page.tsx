"use client";

import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { ContentFormSkeleton } from "@/components/content/content-form-skeleton";
import { ImagePicker } from "@/components/media/image-picker";
import { LocaleTabs } from "@/components/shared/locale-tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getErrorMessage } from "@/lib/api/error";
import { useAbout, useUpdateAbout } from "@/lib/hooks/use-content";
import type { Locale } from "@/lib/types/api";
import type { AboutTranslationInput } from "@/lib/types/content";
import type { Media } from "@/lib/types/media";

type AboutSettingsForm = {
  email: string;
  image: Media | null;
};

const emptyTranslation = (locale: Locale): AboutTranslationInput => ({
  locale,
  label: "",
  heading: "",
  greeting: "",
  description: "",
});

function AboutTranslationForm({ locale }: { locale: Locale }) {
  const { data: about } = useAbout();
  const updateAbout = useUpdateAbout();
  const form = useForm<AboutTranslationInput>({
    defaultValues: emptyTranslation(locale),
  });

  useEffect(() => {
    const translation = about?.translations.find(
      (item) => item.locale === locale,
    );
    form.reset(
      translation
        ? {
            locale,
            label: translation.label,
            heading: translation.heading,
            greeting: translation.greeting,
            description: translation.description,
          }
        : emptyTranslation(locale),
    );
  }, [about, form, locale]);

  async function onSubmit(values: AboutTranslationInput) {
    try {
      await updateAbout.mutateAsync({ translations: [values] });
      form.reset(values);
      toast.success("ترجمه ذخیره شد.");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-6">
      <div className="space-y-2">
        <Label htmlFor={`about-label-${locale}`}>برچسب</Label>
        <Input id={`about-label-${locale}`} {...form.register("label")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`about-heading-${locale}`}>عنوان</Label>
        <Input id={`about-heading-${locale}`} {...form.register("heading")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`about-greeting-${locale}`}>متن خوش‌آمد</Label>
        <Input id={`about-greeting-${locale}`} {...form.register("greeting")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`about-description-${locale}`}>توضیحات</Label>
        <textarea
          id={`about-description-${locale}`}
          className="min-h-32 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          {...form.register("description")}
        />
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={updateAbout.isPending || !form.formState.isDirty}>
          {updateAbout.isPending ? "در حال ذخیره…" : "ذخیره ترجمه"}
        </Button>
      </div>
    </form>
  );
}

export default function AboutPage() {
  const { data: about, isLoading, isError } = useAbout();
  const updateAbout = useUpdateAbout();
  const [activeLocale, setActiveLocale] = useState<Locale>("fa");
  const form = useForm<AboutSettingsForm>({
    defaultValues: { email: "", image: null },
  });
  const image = useWatch({ control: form.control, name: "image" });

  useEffect(() => {
    if (about) form.reset({ email: about.email, image: about.image });
  }, [about, form]);

  async function onSettingsSubmit(values: AboutSettingsForm) {
    try {
      const updatedAbout = await updateAbout.mutateAsync({
        email: values.email,
        imageId: values.image?.id ?? null,
      });
      form.reset({ email: updatedAbout.email, image: updatedAbout.image });
      toast.success("تنظیمات درباره من ذخیره شد.");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  if (isLoading) return <ContentFormSkeleton />;
  if (isError || !about) {
    return <p className="text-destructive">دریافت اطلاعات درباره من ناموفق بود.</p>;
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">درباره من</h1>
        <p className="text-muted-foreground">اطلاعات مشترک و محتوای هر زبان را جداگانه مدیریت کنید.</p>
      </div>

      <form onSubmit={form.handleSubmit(onSettingsSubmit)}>
        <Card>
          <CardHeader><CardTitle>اطلاعات مشترک</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="about-email">ایمیل</Label>
              <Input id="about-email" type="email" dir="ltr" {...form.register("email", { required: true })} />
            </div>
            <ImagePicker label="تصویر" value={image} onChange={(media) => form.setValue("image", media, { shouldDirty: true })} />
          </CardContent>
          <CardFooter className="justify-end">
            <Button type="submit" disabled={updateAbout.isPending || !form.formState.isDirty}>
              {updateAbout.isPending ? "در حال ذخیره…" : "ذخیره اطلاعات مشترک"}
            </Button>
          </CardFooter>
        </Card>
      </form>

      <Card>
        <CardHeader><CardTitle>محتوای چندزبانه</CardTitle></CardHeader>
        <CardContent>
          <LocaleTabs value={activeLocale} onChange={setActiveLocale} availableLocales={about.availableLocales} />
          <AboutTranslationForm key={activeLocale} locale={activeLocale} />
        </CardContent>
      </Card>
    </div>
  );
}
