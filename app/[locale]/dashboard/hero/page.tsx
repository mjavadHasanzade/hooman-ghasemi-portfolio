"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { ContentFormSkeleton } from "@/components/content/content-form-skeleton";
import { LocaleTabs } from "@/components/shared/locale-tabs";
import { ImagePicker } from "@/components/media/image-picker";
import { RichTextField } from "@/components/shared/rich-text-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { getErrorMessage } from "@/lib/api/error";
import { useHero, useUpdateHero } from "@/lib/hooks/use-content";
import type { Locale } from "@/lib/types/api";
import type { HeroTranslationInput } from "@/lib/types/content";
import type { Media } from "@/lib/types/media";

type HeroForm = {
  backgroundImage: Media | null;
  translations: Record<Locale, HeroTranslationInput>;
};

const emptyTranslation = (locale: Locale): HeroTranslationInput => ({
  locale,
  title: "",
  subtitle: "",
  ctaLabel: "",
});

export default function HeroPage() {
  const { data: hero, isLoading, isError } = useHero();
  const updateHero = useUpdateHero();
  const [activeLocale, setActiveLocale] = useState<Locale>("fa");
  const form = useForm<HeroForm>({
    defaultValues: {
      backgroundImage: null,
      translations: { fa: emptyTranslation("fa"), en: emptyTranslation("en") },
    },
  });
  const backgroundImage = useWatch({ control: form.control, name: "backgroundImage" });

  useEffect(() => {
    if (form.formState.isDirty) return;
    if (!hero) return;

    const translations = { fa: emptyTranslation("fa"), en: emptyTranslation("en") };
    for (const translation of hero.translations) {
      translations[translation.locale] = {
        locale: translation.locale,
        title: translation.title,
        subtitle: translation.subtitle,
        ctaLabel: translation.ctaLabel,
      };
    }
    form.reset({ backgroundImage: hero.backgroundImage, translations });
  }, [form, hero]);

  const availableLocales = useMemo(() => hero?.availableLocales ?? [], [hero]);

  async function onSubmit(values: HeroForm) {
    try {
      const updatedHero = await updateHero.mutateAsync({
        backgroundImageId: values.backgroundImage?.id ?? null,
        translations: [values.translations.fa, values.translations.en],
      });
      const translations = { fa: emptyTranslation("fa"), en: emptyTranslation("en") };
      for (const translation of updatedHero.translations) {
        translations[translation.locale] = {
          locale: translation.locale,
          title: translation.title,
          subtitle: translation.subtitle,
          ctaLabel: translation.ctaLabel,
        };
      }
      form.reset({ backgroundImage: updatedHero.backgroundImage, translations });
      toast.success("بخش Hero ذخیره شد.");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  if (isLoading) return <ContentFormSkeleton />;
  if (isError || !hero) {
    return <p className="text-destructive">دریافت اطلاعات Hero ناموفق بود.</p>;
  }

  const translationPath = `translations.${activeLocale}` as const;

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">بخش Hero</h1>
        <p className="text-muted-foreground">تصویر پس‌زمینه و محتوای چندزبانه‌ی بخش اول سایت را مدیریت کنید.</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader><CardTitle>محتوای Hero</CardTitle></CardHeader>
          <CardContent key={activeLocale} dir={activeLocale === "fa" ? "rtl" : "ltr"} className="space-y-6">
            <ImagePicker label="تصویر پس‌زمینه" value={backgroundImage} onChange={(media) => form.setValue("backgroundImage", media, { shouldDirty: true })} />
            <LocaleTabs value={activeLocale} onChange={setActiveLocale} availableLocales={availableLocales} />
            <div key={activeLocale} className="space-y-2">
              <Label id="hero-title-label" htmlFor="hero-title">عنوان</Label>
              <RichTextField control={form.control} name={`${translationPath}.title`} id={"hero-title"} locale={activeLocale} required />
              <p className="text-xs text-muted-foreground">برای تعیین محل شکست تیتر از Enter یا Shift+Enter استفاده کنید؛ این شکست خط در سایت حفظ می‌شود.</p>
            </div>
            <div className="space-y-2">
              <Label id="hero-subtitle-label" htmlFor="hero-subtitle">زیرعنوان</Label>
              <RichTextField control={form.control} name={`${translationPath}.subtitle`} id={"hero-subtitle"} locale={activeLocale} required />
            </div>
            <div className="space-y-2">
              <Label id="hero-cta-label" htmlFor="hero-cta">متن دکمه</Label>
              <RichTextField control={form.control} name={`${translationPath}.ctaLabel`} id={"hero-cta"} locale={activeLocale} required />
            </div>
          </CardContent>
          <CardFooter className="justify-end">
            <Button type="submit" disabled={updateHero.isPending || !form.formState.isDirty}>
              {updateHero.isPending ? "در حال ذخیره…" : "ذخیره تغییرات"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
