import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frontend project Company |   فرانت اند",
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

export default async function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  return (
    <>
      {/* <Navbar /> */}
      <main className="min-h-screen dark:bg-background-dark">{children}</main>
    </>
  );
}
