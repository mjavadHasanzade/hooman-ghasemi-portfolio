"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { RefreshCw, WifiOff } from "lucide-react";

type ErrorPageProps = {
  error: Error & { digest?: string };
  unstable_retry: () => void;
};

export default function LocaleError({ error, unstable_retry }: ErrorPageProps) {
  const pathname = usePathname();
  const isPersian = pathname?.startsWith("/fa");
  const isDevelopment = process.env.NODE_ENV === "development";

  useEffect(() => {
    if (isDevelopment) {
      console.error("Unable to load the website content:", error);
    }
  }, [error, isDevelopment]);

  const copy = isPersian
    ? {
        eyebrow: "اتصال به سرویس برقرار نشد",
        title: "فعلاً نمی‌توانیم سایت را بارگذاری کنیم.",
        description:
          "احتمالاً سرویس بک‌اند در دسترس نیست. چند لحظه دیگر دوباره تلاش کنید.",
        retry: "تلاش مجدد",
        details: "جزئیات خطا در محیط توسعه",
      }
    : {
        eyebrow: "Service unavailable",
        title: "We can’t load the website right now.",
        description:
          "The backend service may be unavailable. Please try again in a moment.",
        retry: "Try again",
        details: "Development error details",
      };

  return (
    <main
      dir={isPersian ? "rtl" : "ltr"}
      className="flex min-h-screen items-center justify-center bg-black px-5 py-10 text-white"
    >
      <section className="w-full max-w-xl rounded-2xl border border-teal-400/20 bg-white/[0.03] p-7 text-center shadow-[0_0_80px_rgba(45,212,191,0.08)] sm:p-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-teal-400/35 bg-teal-400/10 text-teal-300">
          <WifiOff className="h-6 w-6" strokeWidth={1.6} />
        </div>

        <p className="mt-6 text-sm font-medium text-teal-300">{copy.eyebrow}</p>
        <h1 className="mt-3 text-2xl font-bold leading-relaxed text-gray-100 sm:text-3xl">
          {copy.title}
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-gray-400 sm:text-base">
          {copy.description}
        </p>

        {isDevelopment && (
          <details className="mt-6 rounded-lg border border-white/10 bg-black/40 p-4 text-start">
            <summary className="cursor-pointer text-xs text-gray-400">
              {copy.details}
            </summary>
            <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-words text-xs leading-6 text-rose-300" dir="ltr">
              {error.message || "Unknown error"}
            </pre>
          </details>
        )}

        <button
          type="button"
          onClick={unstable_retry}
          className="mx-auto mt-7 inline-flex items-center gap-2 rounded-full border border-teal-300/60 bg-teal-300 px-5 py-3 text-sm font-bold text-black transition-colors hover:bg-teal-200"
        >
          <RefreshCw className="h-4 w-4" />
          {copy.retry}
        </button>
      </section>
    </main>
  );
}
