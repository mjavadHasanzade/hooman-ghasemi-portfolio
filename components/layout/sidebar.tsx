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
  { href: "/contact-cta", label: "دعوت به اقدام", icon: MessageSquare },
  { href: "/social-links", label: "شبکه‌های اجتماعی", icon: Share2 },
  { href: "/media", label: "کتابخانه‌ی رسانه", icon: ImageIcon },
];

export function Sidebar() {
  const pathname = usePathname();
  const params = useParams<{ locale: string }>();

  return (
    <aside className="hidden w-64 shrink-0 border-e bg-background md:block">
      <div className="flex h-14 items-center border-b px-4 font-bold">
        پنل مدیریت
      </div>
      <nav className="flex flex-col gap-1 p-3">
        {navItems.map((item) => {
          const href = `/${params.locale}/dashboard${item.href}`;
          const isActive = pathname === href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
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
