import PublicContentSync from "@/components/common/PublicContentSync";
import Footer from "@/components/organisms/Footer";
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
  const logoUrl = publicMediaUrl(siteSettings.footerLogoMedia);

  return (
    <div className="site-background min-h-screen">
      <PublicContentSync />
      {/* <Navbar /> */}
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
        <defs>
          <filter id="star-glow" x="-200%" y="-200%" width="400%" height="400%">
            <feGaussianBlur stdDeviation="3" result="softGlow" />
            <feMerge>
              <feMergeNode in="softGlow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="star-main-halo">
            <stop offset="0" stopColor="#fff8d8" stopOpacity="0.95" />
            <stop offset="0.12" stopColor="#ffc957" stopOpacity="0.68" />
            <stop offset="0.4" stopColor="#17d6e8" stopOpacity="0.2" />
            <stop offset="1" stopColor="#17d6e8" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="star-cyan-halo">
            <stop offset="0" stopColor="#ecffff" stopOpacity="0.95" />
            <stop offset="0.2" stopColor="#52e8f3" stopOpacity="0.52" />
            <stop offset="1" stopColor="#16a8c2" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="star-flare" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#5af4ff" stopOpacity="0" />
            <stop offset="0.42" stopColor="#c8ffff" stopOpacity="0.62" />
            <stop offset="0.5" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="0.58" stopColor="#ffd26a" stopOpacity="0.62" />
            <stop offset="1" stopColor="#ffb43e" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="star-core" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.32" stopColor="#dfffff" />
            <stop offset="0.7" stopColor="#66dce7" />
            <stop offset="1" stopColor="#d8942f" />
          </linearGradient>
        </defs>
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
        <g className="hero-star hero-star-main" transform="translate(1462 340) scale(0.7)">
          <circle r="70" fill="url(#star-main-halo)" opacity="0.7" />
          <g filter="url(#star-glow)">
            <path d="M-50 0H50" stroke="url(#star-flare)" strokeWidth="1.5" />
            <path d="M0 -48V48" stroke="url(#star-flare)" strokeWidth="1.5" />
            <path d="M-28 -28L28 28M28 -28L-28 28" stroke="#c9ffff" strokeOpacity="0.34" strokeWidth="0.8" />
            <path d="M0 -30C3 -5 5 -3 30 0C5 3 3 5 0 30C-3 5 -5 3 -30 0C-5 -3 -3 -5 0 -30Z" fill="url(#star-core)" />
            <circle r="5" fill="#ffffff" />
          </g>
          <ellipse rx="25" ry="7" fill="none" stroke="#77f6ff" strokeOpacity="0.58" strokeWidth="1" transform="rotate(-25)" />
          <ellipse rx="25" ry="7" fill="none" stroke="#ffd36d" strokeOpacity="0.45" strokeWidth="1" transform="rotate(55)" />
        </g>
        <g className="hero-star hero-star-cyan" transform="translate(470 502) scale(0.7)">
          <circle r="42" fill="url(#star-cyan-halo)" opacity="0.68" />
          <g filter="url(#star-glow)">
            <path d="M-28 0H28M0 -28V28" stroke="#bfffff" strokeOpacity="0.58" strokeWidth="1" />
            <path d="M0 -18C2 -3 3 -2 18 0C3 2 2 3 0 18C-2 3 -3 2 -18 0C-3 -2 -2 -3 0 -18Z" fill="url(#star-core)" />
            <circle r="3.5" fill="#ffffff" />
          </g>
        </g>
      </svg>
      <div className="site-content" style={{ position: "relative", zIndex: 2 }}>
        <main className="min-h-screen">{children}</main>
        <Footer footer={footer} logoUrl={logoUrl} />
      </div>
    </div>
  );
}
