"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DashboardNavigation } from "./sidebar";
import { Link } from "@/i18n/navigation";
import { Bell, Home, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/use-auth";

export function Header() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const closeOnDesktop = () => { if (desktop.matches) setMenuOpen(false); };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  return (
    <header className="admin-header flex h-20 items-center justify-between px-4 md:px-8">
      <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
        <DialogTrigger render={<Button variant="ghost" size="icon" className="shrink-0 text-teal-300 md:hidden" />} aria-label="باز کردن منوی مدیریت">
          <Menu className="h-5 w-5" />
        </DialogTrigger>
        <DialogContent className="admin-mobile-nav w-[calc(100%-2rem)] max-w-sm p-4">
          <DialogHeader>
            <DialogTitle>منوی مدیریت</DialogTitle>
          </DialogHeader>
          <DashboardNavigation onNavigate={() => setMenuOpen(false)} />
        </DialogContent>
      </Dialog>
      <div className="hidden text-xs text-slate-500 md:block">فضای مدیریت / <span className="text-slate-300">پیشخوان</span></div>
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <Link
          href="/"
          className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-teal-500/30 px-3 py-2 text-sm text-teal-300 transition-colors hover:bg-teal-500/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-400"
        >
          <Home className="h-4 w-4" aria-hidden="true" />
          صفحهٔ اصلی
        </Link>
        <button className="admin-icon-button" title="اعلان‌ها" type="button"><Bell className="h-4 w-4" /></button>
        <div className="hidden text-end text-sm sm:block">
          <div className="font-semibold text-slate-100">{user?.name}</div>
          <div className="text-xs text-slate-500">{user?.email}</div>
        </div>
        <div className="admin-avatar hidden shrink-0 sm:grid">{user?.name?.charAt(0) ?? "U"}</div>
        <Button className="text-slate-400 hover:bg-rose-500/10 hover:text-rose-300" variant="ghost" size="icon" onClick={logout} title="خروج" aria-label="خروج">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
