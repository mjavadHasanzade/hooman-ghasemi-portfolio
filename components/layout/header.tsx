"use client";

import { Bell, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/use-auth";

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="admin-header flex h-20 items-center justify-between px-4 md:px-8">
      <div className="hidden text-xs text-slate-500 md:block">فضای مدیریت / <span className="text-slate-300">پیشخوان</span></div>
      <div className="flex items-center gap-3">
        <button className="admin-icon-button" title="اعلان‌ها" type="button"><Bell className="h-4 w-4" /></button>
        <div className="hidden text-end text-sm sm:block">
          <div className="font-semibold text-slate-100">{user?.name}</div>
          <div className="text-xs text-slate-500">{user?.email}</div>
        </div>
        <div className="admin-avatar">{user?.name?.charAt(0) ?? "U"}</div>
        <Button className="text-slate-400 hover:bg-rose-500/10 hover:text-rose-300" variant="ghost" size="icon" onClick={logout} title="خروج">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
