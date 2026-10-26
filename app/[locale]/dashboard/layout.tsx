"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import Footer from "@/components/organisms/Footer";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { useAuthStore } from "@/lib/auth/auth-store";
import { useFooter } from "@/lib/hooks/use-content";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const status = useAuthStore((s) => s.status);
  const { data: footer } = useFooter();
  const footerTranslation = footer?.translations.find(
    (translation) => translation.locale === locale,
  );

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(`/${locale}/login`);
    }
  }, [status, router, locale]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="admin-shell dark flex min-h-screen flex-col">
      <div className="flex min-h-screen flex-1">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Header />
          <main className="admin-main min-w-0 flex-1 p-4 md:p-8">{children}</main>
        </div>
      </div>
      {footerTranslation ? (
        <Footer footer={{ copyrightText: footerTranslation.copyrightText }} />
      ) : null}
    </div>
  );
}
