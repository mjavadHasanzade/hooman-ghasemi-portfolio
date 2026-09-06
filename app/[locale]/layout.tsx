import { Metadata } from "next";
import { getMessages } from "next-intl/server";
import "../globals.css";
import { vazirFont } from "@/utils";
import { Providers } from "../providers";

export const metadata: Metadata = {
  title: "Frontend project | پروژه فرانت اند",
  description: "",
  keywords: [],
  icons: {
    icon: [
      { url: "/favicon.png" },
      { url: "/favicon.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/favicon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
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
