"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/auth/auth-provider";
import { NextIntlClientProvider, type AbstractIntlMessages } from "next-intl";

export function Providers({
  children,
  locale,
  messages,
}: {
  children: React.ReactNode;
  locale: "en" | "fa";
  // next-intl به‌صورت پیش‌فرض آرایه را در پیام‌ها پشتیبانی نمی‌کند (تایپش
  // اجازه نمی‌دهد)، در حالی که در عمل کاملاً کار می‌کند. برای همین اینجا
  // تایپ را آزادتر می‌گیریم و فقط موقع پاس دادن به Provider، cast می‌زنیم.
  messages: Record<string, unknown>;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000 * 2,
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <NextIntlClientProvider
        locale={locale}
        messages={messages as AbstractIntlMessages}
      >
        <AuthProvider>
          {children}
          <Toaster richColors position="top-center" />
        </AuthProvider>
      </NextIntlClientProvider>
    </QueryClientProvider>
  );
}
