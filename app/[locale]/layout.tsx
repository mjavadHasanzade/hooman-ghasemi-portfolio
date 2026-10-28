import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMessages, getTranslations } from "next-intl/server";
import "../globals.css";
import { vazirFont } from "@/utils";
import { Providers } from "../providers";
import {
  getPublicSiteSettings,
  publicMediaUrl,
} from "@/lib/api/public-content";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  try {
    const settings = await getPublicSiteSettings();
    const faviconUrl = publicMediaUrl(settings.faviconMedia);
    const ogImageUrl = publicMediaUrl(settings.ogImageMedia);
    const persian = locale === "fa" ? await getTranslations({ locale: "fa", namespace: "SiteNavigation" }) : null;
    const title = persian ? persian("metaTitle") : settings.metaTitle.trim() || settings.siteName;
    const description = persian ? persian("metaDescription") : settings.metaDescription.trim() || undefined;

    return {
      title,
      description,
      icons: faviconUrl ? { icon: faviconUrl } : undefined,
      openGraph: {
        title,
        description,
        images: ogImageUrl ? [{ url: ogImageUrl }] : undefined,
      },
    };
  } catch {
    return {
      title: locale === "fa" ? "مهندسی نووا" : "Frontend project | پروژه فرانت اند",
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
