"use client";

import { useEffect, useState } from "react";
import { GripVertical, Pencil, Plus, Share2, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getErrorMessage } from "@/lib/api/error";
import { useCreateSocialLink, useDeleteSocialLink, useReorderSocialLinks, useSocialLinks, useUpdateSocialLink } from "@/lib/hooks/use-social-links";
import type { SocialLink, SocialLinkInput } from "@/lib/types/social-links";

const emptyValues: SocialLinkInput = { platform: "", url: "", iconKey: "", isActive: true };

function SocialLinkDialog({ link, open, onOpenChange }: { link: SocialLink | null; open: boolean; onOpenChange: (open: boolean) => void }) {
  const createLink = useCreateSocialLink();
  const updateLink = useUpdateSocialLink();
  const form = useForm<SocialLinkInput>({ defaultValues: emptyValues });
  useEffect(() => { form.reset(link ? { platform: link.platform, url: link.url, iconKey: link.iconKey, isActive: link.isActive } : emptyValues); }, [form, link, open]);
  async function submit(values: SocialLinkInput) { try { if (link) await updateLink.mutateAsync({ id: link.id, input: values }); else await createLink.mutateAsync(values); toast.success(link ? "لینک به‌روزرسانی شد." : "لینک اضافه شد."); onOpenChange(false); } catch (error) { toast.error(getErrorMessage(error)); } }
  const saving = createLink.isPending || updateLink.isPending;
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="w-[calc(100%-1rem)] max-w-xl p-6 sm:p-8"><DialogHeader><DialogTitle>{link ? "ویرایش شبکه اجتماعی" : "افزودن شبکه اجتماعی"}</DialogTitle></DialogHeader><form className="space-y-5" onSubmit={form.handleSubmit(submit)}><div className="grid gap-5 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor="social-platform">نام پلتفرم</Label><Input id="social-platform" placeholder="linkedin" dir="ltr" {...form.register("platform", { required: "نام پلتفرم الزامی است." })} />{form.formState.errors.platform && <p className="text-xs text-destructive">{form.formState.errors.platform.message}</p>}</div><div className="space-y-2"><Label htmlFor="social-icon-key">کلید آیکون</Label><Input id="social-icon-key" placeholder="linkedin" dir="ltr" {...form.register("iconKey", { required: "کلید آیکون الزامی است." })} />{form.formState.errors.iconKey && <p className="text-xs text-destructive">{form.formState.errors.iconKey.message}</p>}</div></div><div className="space-y-2"><Label htmlFor="social-url">آدرس لینک</Label><Input id="social-url" placeholder="https://linkedin.com/in/..." dir="ltr" type="url" {...form.register("url", { required: "آدرس لینک الزامی است.", pattern: { value: /^https?:\/\/.+|^mailto:.+/, message: "یک URL معتبر وارد کنید." } })} />{form.formState.errors.url && <p className="text-xs text-destructive">{form.formState.errors.url.message}</p>}</div><label className="flex cursor-pointer items-center gap-2 text-sm"><input type="checkbox" {...form.register("isActive")} /> در سایت فعال باشد</label><div className="flex justify-end"><Button type="submit" disabled={saving}>{saving ? "در حال ذخیره…" : "ذخیره لینک"}</Button></div></form></DialogContent></Dialog>;
}

export default function SocialLinksPage() {
  const { data, isLoading, isError } = useSocialLinks();
  const remove = useDeleteSocialLink();
  const reorder = useReorderSocialLinks();
  const [linkOrder, setLinkOrder] = useState<string[] | null>(null);
  const [editing, setEditing] = useState<SocialLink | null>(null);
  const [open, setOpen] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const links = data && linkOrder ? linkOrder.map((id) => data.find((link) => link.id === id)).filter((link): link is SocialLink => Boolean(link)) : data ?? [];
  function deleteLink(link: SocialLink) { if (!confirm(`«${link.platform}» حذف شود؟`)) return; remove.mutate(link.id, { onSuccess: () => toast.success("لینک حذف شد."), onError: (error) => toast.error(getErrorMessage(error)) }); }
  async function dropOn(targetId: string) { if (!draggedId || draggedId === targetId) return; const from = links.findIndex((item) => item.id === draggedId); const to = links.findIndex((item) => item.id === targetId); const next = [...links]; const [item] = next.splice(from, 1); next.splice(to, 0, item); const ids = next.map((link) => link.id); setLinkOrder(ids); setDraggedId(null); try { await reorder.mutateAsync(ids); toast.success("ترتیب لینک‌ها ذخیره شد."); } catch (error) { setLinkOrder(null); toast.error(getErrorMessage(error)); } }
  if (isLoading) return <p className="text-muted-foreground">در حال دریافت…</p>;
  if (isError) return <p className="text-destructive">دریافت شبکه‌های اجتماعی ناموفق بود.</p>;
  return <div className="space-y-6"><div className="flex flex-wrap items-start justify-between gap-4"><div><h1 className="text-2xl font-bold">شبکه‌های اجتماعی</h1><p className="text-muted-foreground">لینک‌ها، کلید آیکون و وضعیت نمایش شبکه‌های اجتماعی را مدیریت کنید.</p></div><Button onClick={() => { setEditing(null); setOpen(true); }}><Plus /> افزودن لینک</Button></div><Card><CardHeader><CardTitle>لینک‌ها</CardTitle><p className="text-sm text-muted-foreground">برای تغییر ترتیب، ردیف‌ها را بکشید و رها کنید.</p></CardHeader><CardContent className="space-y-3">{links.length ? links.map((link) => <div key={link.id} draggable onDragStart={() => setDraggedId(link.id)} onDragOver={(event) => event.preventDefault()} onDrop={() => dropOn(link.id)} className="flex items-center gap-3 rounded-xl border bg-card p-4 transition-colors hover:border-primary/50"><GripVertical className="h-5 w-5 shrink-0 text-muted-foreground" /><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><Share2 className="h-5 w-5" /></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className="font-medium">{link.platform}</p><span className="rounded bg-muted px-2 py-0.5 font-mono text-xs">{link.iconKey}</span><span className={`rounded px-2 py-0.5 text-xs ${link.isActive ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" : "bg-muted text-muted-foreground"}`}>{link.isActive ? "فعال" : "غیرفعال"}</span></div><p className="truncate font-mono text-xs text-muted-foreground" dir="ltr">{link.url}</p></div><Button variant="ghost" size="icon-sm" aria-label="ویرایش" onClick={() => { setEditing(link); setOpen(true); }}><Pencil /></Button><Button variant="destructive" size="icon-sm" aria-label="حذف" disabled={remove.isPending} onClick={() => deleteLink(link)}><Trash2 /></Button></div>) : <div className="py-16 text-center text-muted-foreground">هنوز لینکی ثبت نشده است.</div>}</CardContent></Card><SocialLinkDialog link={editing} open={open} onOpenChange={setOpen} /></div>;
}
