"use client";

import { useAuthStore } from "@/lib/auth/auth-store";
import { ArrowUpRight, Layers3, Settings, Sparkles } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="admin-page max-w-6xl space-y-8">
      <section className="admin-welcome relative overflow-hidden rounded-3xl p-7 md:p-10">
        <div className="relative z-10 max-w-xl">
          <div className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300"><Sparkles className="h-4 w-4" /> مدیریت هوشمند</div>
          <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl">خوش آمدید، {user?.name}</h1>
          <p className="mt-4 text-sm leading-7 text-slate-300">همه چیز برای مدیریت یک تجربه‌ی دیجیتال متمایز آماده است.</p>
        </div>
        <div className="admin-welcome-orb" />
      </section>
      <div className="grid gap-4 md:grid-cols-2">
        <Link href="./site-settings" className="admin-quick-card group"><span className="admin-quick-icon"><Settings /></span><span><strong>تنظیمات سایت</strong><small>هویت و تنظیمات پایه</small></span><ArrowUpRight className="ms-auto h-5 w-5 text-slate-600 transition group-hover:text-cyan-300" /></Link>
        <Link href="./projects" className="admin-quick-card group"><span className="admin-quick-icon"><Layers3 /></span><span><strong>مدیریت پروژه‌ها</strong><small>نمونه‌کارهای منتخب را به‌روز کنید</small></span><ArrowUpRight className="ms-auto h-5 w-5 text-slate-600 transition group-hover:text-cyan-300" /></Link>
      </div>
    </div>
  );
}