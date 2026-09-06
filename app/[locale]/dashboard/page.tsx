"use client";

import { useAuthStore } from "@/lib/auth/auth-store";

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div>
      <h1 className="text-2xl font-bold">خوش آمدید, {user?.name}</h1>
      <p className="mt-2 text-muted-foreground">
        از منوی کناری بخش موردنظر برای مدیریت محتوا را انتخاب کنید.
      </p>
    </div>
  );
}