"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  Image as ImageIcon,
  User,
  FileText,
  Wrench,
  Briefcase,
  MessageSquare,
  Share2,
  Layers3,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "داشبورد", icon: LayoutDashboard },
  { href: "/site-settings", label: "تنظیمات سایت", icon: Settings },
  { href: "/hero", label: "بخش Hero", icon: ImageIcon },
  { href: "/about", label: "درباره من", icon: User },
  { href: "/footer", label: "فوتر", icon: FileText },
  { href: "/tech-icons", label: "آیکون‌های تکنولوژی", icon: Wrench },
  { href: "/projects", label: "پروژه‌ها", icon: Briefcase },
  { href: "/services", label: "سرویس‌ها", icon: Layers3 },
  { href: "/contact-cta", label: "دعوت به اقدام", icon: MessageSquare },
  { href: "/social-links", label: "شبکه‌های اجتماعی", icon: Share2 },
  { href: "/media", label: "کتابخانه‌ی رسانه", icon: ImageIcon },
];

export function Sidebar() {
  const pathname = usePathname();
  const params = useParams<{ locale: string }>();

  return (
    <aside className="admin-sidebar hidden w-72 shrink-0 md:block">
      <div className="admin-brand flex h-20 items-center gap-3 px-6">
        <span className="admin-brand-mark">E</span>
        <div>
          <div className="text-sm font-bold tracking-wide text-white">nova</div>
          <div className="text-xxs uppercase tracking-[0.22em] text-slate-500">Control room</div>
        </div>
      </div>
      <div className="px-6 pb-3 pt-7 text-xxs font-semibold uppercase tracking-[0.2em] text-slate-500">مدیریت محتوا</div>
      <nav className="flex flex-col gap-1 px-3">
        {navItems.map((item) => {
          const href = `/${params.locale}/dashboard${item.href}`;
          const isActive = pathname === href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={href}
              className={cn(
                "admin-nav-item flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors",
                isActive
                  ? "admin-nav-active text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-white",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
