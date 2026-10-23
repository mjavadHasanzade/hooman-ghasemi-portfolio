"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { KeyRound, ShieldCheck, UserRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getErrorMessage } from "@/lib/api/error";
import { useAuth } from "@/lib/auth/use-auth";

type ProfileForm = {
  email: string;
  currentPassword: string;
  newPassword: string;
};

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const form = useForm<ProfileForm>({
    defaultValues: { email: "", currentPassword: "", newPassword: "" },
  });

  useEffect(() => {
    form.reset({
      email: user?.email ?? "",
      currentPassword: "",
      newPassword: "",
    });
  }, [form, user?.email]);

  async function onSubmit(values: ProfileForm) {
    const email = values.email.trim();
    const newPassword = values.newPassword.trim();
    const emailChanged = email !== user?.email;

    if (!emailChanged && !newPassword) {
      toast.error("برای ذخیره، ایمیل یا رمز جدید را تغییر دهید.");
      return;
    }

    try {
      const profile = await updateProfile({
        currentPassword: values.currentPassword,
        ...(emailChanged ? { email } : {}),
        ...(newPassword ? { newPassword } : {}),
      });
      form.reset({ email: profile.email, currentPassword: "", newPassword: "" });
      toast.success("اطلاعات حساب و نشست شما به‌روزرسانی شد.");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  return (
    <div className="admin-page max-w-3xl space-y-7">
      <div className="border-b border-white/10 pb-7">
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300"><UserRound className="h-4 w-4" /> حساب کاربری</div>
        <h1 className="text-3xl font-bold tracking-tight text-white">اطلاعات ورود</h1>
        <p className="mt-2 text-sm text-slate-400">ایمیل یا رمز عبور حساب فعلی خود را با تأیید رمز کنونی تغییر دهید.</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="admin-settings-card">
          <CardHeader className="border-b border-white/10 pb-5">
            <div className="flex items-center gap-3"><span className="admin-section-icon"><ShieldCheck /></span><div><CardTitle>امنیت حساب</CardTitle><p className="mt-1 text-xs text-slate-500">پس از ذخیره، tokenهای قبلی لغو می‌شوند و نشست فعلی به‌طور خودکار به‌روزرسانی می‌شود.</p></div></div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <Label htmlFor="profile-email">ایمیل ورود</Label>
              <Input id="profile-email" type="email" dir="ltr" autoComplete="email" {...form.register("email", { required: "ایمیل الزامی است." })} />
              {form.formState.errors.email && <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="current-password">رمز عبور فعلی</Label>
              <Input id="current-password" type="password" dir="ltr" autoComplete="current-password" {...form.register("currentPassword", { required: "رمز عبور فعلی الزامی است." })} />
              {form.formState.errors.currentPassword && <p className="text-xs text-destructive">{form.formState.errors.currentPassword.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">رمز عبور جدید</Label>
              <Input id="new-password" type="password" dir="ltr" autoComplete="new-password" placeholder="در صورت نیاز وارد کنید" {...form.register("newPassword", { validate: (value) => !value || value.length >= 8 || "رمز جدید باید حداقل ۸ کاراکتر باشد." })} />
              <p className="text-xs text-slate-500">اگر فقط ایمیل را تغییر می‌دهید، این فیلد را خالی بگذارید.</p>
              {form.formState.errors.newPassword && <p className="text-xs text-destructive">{form.formState.errors.newPassword.message}</p>}
            </div>
          </CardContent>
          <CardFooter className="justify-end"><Button type="submit" disabled={form.formState.isSubmitting}><KeyRound />{form.formState.isSubmitting ? "در حال ذخیره…" : "به‌روزرسانی حساب"}</Button></CardFooter>
        </Card>
      </form>
    </div>
  );
}
