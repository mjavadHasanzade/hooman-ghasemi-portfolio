import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMessages } from "next-intl/server";
import "../globals.css";
import { vazirFont } from "@/utils";
import { Providers } from "../providers";
import {
  getPublicSiteSettings,
  publicMediaUrl,
} from "@/lib/api/public-content";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await getPublicSiteSettings();
    const faviconUrl = publicMediaUrl(settings.faviconMedia);
    const ogImageUrl = publicMediaUrl(settings.ogImageMedia);

    return {
      title: settings.siteName,
      icons: faviconUrl ? { icon: faviconUrl } : undefined,
      openGraph: ogImageUrl ? { images: [{ url: ogImageUrl }] } : undefined,
    };
  } catch {
    return {
      title: "Frontend project | پروژه فرانت اند",
      icons: { icon: "/favicon.png" },
    };
  }
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== "fa" && locale !== "en") {
    notFound();
  }
  const messages = await getMessages();

  const rtlLocales = ["fa", "ar"];
  const dir = rtlLocales.includes(locale) ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      className={`h-full ${vazirFont.variable} ss01`}
      dir={dir}
    >
      <body className="min-h-full flex flex-col">
        <Providers locale={locale} messages={messages}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
