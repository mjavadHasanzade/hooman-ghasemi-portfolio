import HomeSectionNavigation from "@/components/common/HomeSectionNavigation";
import HomeBackdrop from "@/components/common/HomeBackdrop";
import PublicContentSync from "@/components/common/PublicContentSync";
import Footer from "@/components/organisms/Footer";
import Navbar from "@/components/layout/Navbar";
import { publicMediaUrl } from "@/lib/media/public-media-url";
import {
  getPublicFooter,
  getPublicHero,
  getPublicSiteSettings,
} from "@/lib/api/public-content";

export default async function WebsiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale === "fa" ? "fa" : "en";
  const [footer, hero, siteSettings] = await Promise.all([
    getPublicFooter(locale),
    getPublicHero(locale),
    getPublicSiteSettings(),
  ]);
  const showBackgroundImage = true;
  const backgroundImageUrl = publicMediaUrl(hero.backgroundImage);
  const footerLogoUrl = publicMediaUrl(siteSettings.footerLogoMedia);
  const navbarLogoUrl = publicMediaUrl(
    siteSettings.logoMedia ??
      siteSettings.ogImageMedia ??
      siteSettings.faviconMedia,
  );

  return (
    <div className="site-background min-h-screen">
      <PublicContentSync />
      <HomeSectionNavigation />
      {/* <Navbar /> */}
      <HomeBackdrop>
      <svg
        className="site-backdrop"
        viewBox="0 0 1671 941"
        preserveAspectRatio="xMidYMid slice"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
        aria-hidden="true"
      >
        {showBackgroundImage && backgroundImageUrl && (
          <image
            href={backgroundImageUrl}
            x="0"
            y="0"
            width="1671"
            height="941"
            opacity="1"
          />
        )}
      </svg>
      </HomeBackdrop>
      <div className="site-content" style={{ position: "relative", zIndex: 2 }}>
        <Navbar siteName={siteSettings.siteName} logoUrl={navbarLogoUrl} />
        <main className="min-h-screen">{children}</main>
        <Footer footer={footer} logoUrl={footerLogoUrl} />
      </div>
    </div>
  );
}
