"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ContentFormSkeleton } from "@/components/content/content-form-skeleton";
import { LocaleTabs } from "@/components/shared/locale-tabs";
import { RichTextField } from "@/components/shared/rich-text-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { getErrorMessage } from "@/lib/api/error";
import { useFooter, useUpdateFooter } from "@/lib/hooks/use-content";
import type { Locale } from "@/lib/types/api";
import type { FooterTranslationInput } from "@/lib/types/content";

const emptyTranslation = (locale: Locale): FooterTranslationInput => ({
  locale,
  copyrightText: "",
});

function FooterTranslationForm({ locale }: { locale: Locale }) {
  const { data: footer } = useFooter();
  const updateFooter = useUpdateFooter();
  const form = useForm<FooterTranslationInput>({
    defaultValues: emptyTranslation(locale),
  });

  useEffect(() => {
    if (form.formState.isDirty) return;
    const translation = footer?.translations.find(
      (item) => item.locale === locale,
    );
    form.reset(
      translation
        ? { locale, copyrightText: translation.copyrightText }
        : emptyTranslation(locale),
    );
  }, [footer, form, locale]);

  async function onSubmit(values: FooterTranslationInput) {
    try {
      await updateFooter.mutateAsync({ translations: [values] });
      form.reset(values);
      toast.success("ترجمه فوتر ذخیره شد.");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  return (
    <form dir={locale === "fa" ? "rtl" : "ltr"} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-6">
      <div className="space-y-2">
        <Label id={`footer-copyright-${locale}-label`} htmlFor={`footer-copyright-${locale}`}>متن کپی‌رایت</Label>
        <RichTextField control={form.control} name={"copyrightText"} id={`footer-copyright-${locale}`} locale={locale} />
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={updateFooter.isPending || !form.formState.isDirty}>
          {updateFooter.isPending ? "در حال ذخیره…" : "ذخیره تغییرات"}
        </Button>
      </div>
    </form>
  );
}

export default function FooterPage() {
  const { data: footer, isLoading, isError } = useFooter();
  const [activeLocale, setActiveLocale] = useState<Locale>("fa");

  if (isLoading) return <ContentFormSkeleton />;
  if (isError || !footer) {
    return <p className="text-destructive">دریافت اطلاعات فوتر ناموفق بود.</p>;
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">فوتر</h1>
        <p className="text-muted-foreground">متن کپی‌رایت هر زبان را جداگانه ذخیره کنید.</p>
      </div>

      <Card>
        <CardHeader><CardTitle>محتوای چندزبانه</CardTitle></CardHeader>
        <CardContent>
          <LocaleTabs value={activeLocale} onChange={setActiveLocale} availableLocales={footer.availableLocales} />
          <FooterTranslationForm key={activeLocale} locale={activeLocale} />
        </CardContent>
      </Card>
    </div>
  );
}
