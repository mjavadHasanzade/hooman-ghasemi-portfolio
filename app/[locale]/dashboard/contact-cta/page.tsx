"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronUp, GripVertical, Pencil, Plus, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { LocaleTabs } from "@/components/shared/locale-tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getErrorMessage } from "@/lib/api/error";
import { useContactCta, useCreateTypewriterPhrase, useDeleteTypewriterPhrase, useReorderTypewriterPhrases, useUpdateContactCta, useUpdateTypewriterPhrase } from "@/lib/hooks/use-contact-cta";
import type { Locale } from "@/lib/types/api";
import type { ContactCtaTranslationInput, TypewriterPhrase, TypewriterPhraseTranslationInput } from "@/lib/types/contact-cta";

const emptyTranslation = (locale: Locale): ContactCtaTranslationInput => ({ locale, heading: "", description: "", connectLabel: "" });
const emptyPhraseTranslation = (locale: Locale): TypewriterPhraseTranslationInput => ({ locale, text: "" });

type PhraseForm = { translations: Record<Locale, TypewriterPhraseTranslationInput> };

function phraseToForm(phrase?: TypewriterPhrase): PhraseForm {
  const translations = { fa: emptyPhraseTranslation("fa"), en: emptyPhraseTranslation("en") };
  phrase?.translations.forEach((item) => { translations[item.locale] = { locale: item.locale, text: item.text }; });
  return { translations };
}

function PhraseDialog({ phrase, open, onOpenChange }: { phrase: TypewriterPhrase | null; open: boolean; onOpenChange: (open: boolean) => void }) {
  const [locale, setLocale] = useState<Locale>("fa");
  const createPhrase = useCreateTypewriterPhrase();
  const updatePhrase = useUpdateTypewriterPhrase();
  const form = useForm<PhraseForm>({ defaultValues: phraseToForm() });
  useEffect(() => { if (open) form.reset(phraseToForm(phrase ?? undefined)); }, [form, open, phrase]);
  const path = `translations.${locale}` as const;
  const isSaving = createPhrase.isPending || updatePhrase.isPending;
  async function submit(values: PhraseForm) {
    const translations = Object.values(values.translations).filter((item) => item.text.trim());
    if (!translations.length) { toast.error("حداقل یک ترجمه برای عبارت وارد کنید."); return; }
    try {
      if (phrase) await updatePhrase.mutateAsync({ id: phrase.id, input: { translations } });
      else await createPhrase.mutateAsync({ translations });
      toast.success(phrase ? "عبارت به‌روزرسانی شد." : "عبارت اضافه شد."); onOpenChange(false);
    } catch (error) { toast.error(getErrorMessage(error)); }
  }
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="max-h-[90vh] w-[calc(100%-1rem)] max-w-2xl overflow-y-auto p-6 sm:p-8"><DialogHeader><DialogTitle>{phrase ? "ویرایش عبارت تایپ‌رایتر" : "افزودن عبارت تایپ‌رایتر"}</DialogTitle></DialogHeader><form className="space-y-6" onSubmit={form.handleSubmit(submit)}><LocaleTabs value={locale} onChange={setLocale} availableLocales={[]} /><div className="space-y-2"><Label htmlFor={`phrase-${locale}`}>متن عبارت</Label><textarea id={`phrase-${locale}`} dir={locale === "fa" ? "rtl" : "ltr"} className="min-h-32 w-full resize-y rounded-xl border border-input bg-muted/20 px-4 py-3 text-sm leading-7 outline-none focus:border-primary focus:ring-3 focus:ring-primary/15" placeholder={locale === "fa" ? "مثلاً: بیایید ایده‌ی شما را زنده کنیم" : "For example: Let’s bring your vision to life"} {...form.register(`${path}.text`)} /></div><div className="flex justify-end"><Button type="submit" disabled={isSaving}>{isSaving ? "در حال ذخیره…" : "ذخیره عبارت"}</Button></div></form></DialogContent></Dialog>;
}

function TranslationForm({ locale, contactCta }: { locale: Locale; contactCta: NonNullable<ReturnType<typeof useContactCta>["data"]> }) {
  const update = useUpdateContactCta();
  const current = contactCta.translations.find((item) => item.locale === locale);
  const form = useForm<ContactCtaTranslationInput>({ defaultValues: current ? { locale, heading: current.heading, description: current.description, connectLabel: current.connectLabel } : emptyTranslation(locale) });
  useEffect(() => { form.reset(current ? { locale, heading: current.heading, description: current.description, connectLabel: current.connectLabel } : emptyTranslation(locale)); }, [current, form, locale]);
  async function submit(values: ContactCtaTranslationInput) { try { await update.mutateAsync({ translations: [values] }); form.reset(values); toast.success("ترجمه ذخیره شد."); } catch (error) { toast.error(getErrorMessage(error)); } }
  return <form className="space-y-6 pt-6" onSubmit={form.handleSubmit(submit)}><div className="space-y-2"><Label htmlFor={`cta-heading-${locale}`}>عنوان</Label><Input id={`cta-heading-${locale}`} {...form.register("heading", { required: "عنوان الزامی است." })} /></div><div className="space-y-2"><Label htmlFor={`cta-description-${locale}`}>توضیحات</Label><textarea id={`cta-description-${locale}`} className="min-h-36 w-full resize-y rounded-xl border border-input bg-muted/20 px-4 py-3 text-sm leading-7 outline-none focus:border-primary focus:ring-3 focus:ring-primary/15" {...form.register("description", { required: "توضیحات الزامی است." })} /></div><div className="space-y-2"><Label htmlFor={`cta-connect-label-${locale}`}>متن دکمه</Label><Input id={`cta-connect-label-${locale}`} {...form.register("connectLabel", { required: "متن دکمه الزامی است." })} /></div><div className="flex justify-end"><Button type="submit" disabled={update.isPending || !form.formState.isDirty}>{update.isPending ? "در حال ذخیره…" : "ذخیره ترجمه"}</Button></div></form>;
}

export default function ContactCtaPage() {
  const { data, isLoading, isError } = useContactCta();
  const update = useUpdateContactCta();
  const reorder = useReorderTypewriterPhrases();
  const remove = useDeleteTypewriterPhrase();
  const [locale, setLocale] = useState<Locale>("fa");
  const [phraseDialog, setPhraseDialog] = useState(false);
  const [editing, setEditing] = useState<TypewriterPhrase | null>(null);
  const [phraseOrder, setPhraseOrder] = useState<string[] | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const hrefForm = useForm<{ connectHref: string }>({ defaultValues: { connectHref: "" } });
  useEffect(() => { if (data) hrefForm.reset({ connectHref: data.connectHref }); }, [data, hrefForm]);
  const phrases = useMemo(() => {
    if (!data) return [];
    if (!phraseOrder) return data.phrases;
    const byId = new Map(data.phrases.map((phrase) => [phrase.id, phrase]));
    return phraseOrder.map((id) => byId.get(id)).filter((phrase): phrase is TypewriterPhrase => Boolean(phrase));
  }, [data, phraseOrder]);
  const availableLocales = useMemo(() => data?.availableLocales ?? [], [data]);
  async function saveHref(values: { connectHref: string }) { try { await update.mutateAsync({ connectHref: values.connectHref }); hrefForm.reset(values); toast.success("لینک ارتباط ذخیره شد."); } catch (error) { toast.error(getErrorMessage(error)); } }
  function editPhrase(phrase: TypewriterPhrase) { setEditing(phrase); setPhraseDialog(true); }
  function deletePhrase(phrase: TypewriterPhrase) { if (!confirm("این عبارت حذف شود؟")) return; remove.mutate(phrase.id, { onSuccess: () => toast.success("عبارت حذف شد."), onError: (error) => toast.error(getErrorMessage(error)) }); }
  async function dropPhrase(targetId: string) { if (!draggedId || draggedId === targetId) return; const from = phrases.findIndex((item) => item.id === draggedId); const to = phrases.findIndex((item) => item.id === targetId); const next = [...phrases]; const [item] = next.splice(from, 1); next.splice(to, 0, item); const ids = next.map((phrase) => phrase.id); setPhraseOrder(ids); setDraggedId(null); try { await reorder.mutateAsync(ids); toast.success("ترتیب عبارت‌ها ذخیره شد."); } catch (error) { setPhraseOrder(null); toast.error(getErrorMessage(error)); } }
  if (isLoading) return <p className="text-muted-foreground">در حال دریافت…</p>;
  if (isError || !data) return <p className="text-destructive">دریافت بخش دعوت به اقدام ناموفق بود.</p>;
  return <div className="max-w-4xl space-y-6"><div><h1 className="text-2xl font-bold">دعوت به اقدام</h1><p className="text-muted-foreground">محتوای چندزبانه، لینک ارتباط و عبارت‌های تایپ‌رایتر را مدیریت کنید.</p></div><Card><CardHeader><CardTitle>تنظیمات ارتباط</CardTitle></CardHeader><CardContent><form className="flex flex-col gap-3 sm:flex-row sm:items-end" onSubmit={hrefForm.handleSubmit(saveHref)}><div className="flex-1 space-y-2"><Label htmlFor="cta-connect-href">شماره تلفن یا لینک ارتباط</Label><Input id="cta-connect-href" dir="ltr" placeholder="tel:+989121234567" {...hrefForm.register("connectHref", { required: "لینک ارتباط الزامی است.", pattern: { value: /^(tel:|mailto:|https?:\/\/)/i, message: "از tel:، mailto: یا لینک https استفاده کنید." } })} /><p className="text-xs text-muted-foreground">برای اتصال تلفنی از tel:+989… استفاده کنید؛ شماره زیر عنوان سایت با بولت نمایش داده می‌شود.</p></div><Button type="submit" disabled={update.isPending || !hrefForm.formState.isDirty}>ذخیره لینک</Button></form></CardContent></Card><Card><CardHeader><CardTitle>محتوای چندزبانه</CardTitle></CardHeader><CardContent><LocaleTabs value={locale} onChange={setLocale} availableLocales={availableLocales} /><TranslationForm key={locale} locale={locale} contactCta={data} /></CardContent></Card><Card><CardHeader className="flex-row items-center justify-between"><div><CardTitle>عبارت‌های تایپ‌رایتر</CardTitle><p className="mt-1 text-sm text-muted-foreground">برای تغییر ترتیب، عبارت‌ها را بکشید و رها کنید.</p></div><Button onClick={() => { setEditing(null); setPhraseDialog(true); }}><Plus /> افزودن عبارت</Button></CardHeader><CardContent className="space-y-2">{phrases.length ? phrases.map((phrase) => <div key={phrase.id} draggable onDragStart={() => setDraggedId(phrase.id)} onDragOver={(event) => event.preventDefault()} onDrop={() => dropPhrase(phrase.id)} className="flex items-center gap-3 rounded-lg border bg-card p-3"><GripVertical className="h-4 w-4 shrink-0 text-muted-foreground" /><div className="min-w-0 flex-1"><p className="truncate">{phrase.translations.find((item) => item.locale === "fa")?.text ?? phrase.translations[0]?.text}</p><p className="text-xs text-muted-foreground">{phrase.availableLocales.join("، ")}</p></div><Button variant="ghost" size="icon-sm" aria-label="بالا" disabled={phrase.order === 0} onClick={() => { const index = phrases.findIndex((item) => item.id === phrase.id); if (index > 0) dropPhrase(phrases[index - 1].id); }}><ChevronUp /></Button><Button variant="ghost" size="icon-sm" aria-label="پایین" disabled={phrase.order === phrases.length - 1} onClick={() => { const index = phrases.findIndex((item) => item.id === phrase.id); if (index < phrases.length - 1) dropPhrase(phrases[index + 1].id); }}><ChevronDown /></Button><Button variant="ghost" size="icon-sm" aria-label="ویرایش" onClick={() => editPhrase(phrase)}><Pencil /></Button><Button variant="destructive" size="icon-sm" aria-label="حذف" onClick={() => deletePhrase(phrase)}><Trash2 /></Button></div>) : <p className="py-8 text-center text-muted-foreground">هنوز عبارتی ثبت نشده است.</p>}</CardContent><CardFooter /></Card><PhraseDialog phrase={editing} open={phraseDialog} onOpenChange={setPhraseDialog} /></div>;
}
