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
  params: Promise<{ locale: "fa" | "en" }>;
}) {
  const { locale } = await params;
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
        {/* <defs>
          <filter id="site-backdrop-remove-white">
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 -0.333 -0.333 -0.333 0 1"
            />
          </filter>
          <radialGradient id="hero-main-star-glow">
            <stop offset="0" stopColor="#fffde4" stopOpacity="0.95" />
            <stop offset="0.18" stopColor="#ffd66e" stopOpacity="0.7" />
            <stop offset="1" stopColor="#ffae2d" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="hero-cyan-star-glow">
            <stop offset="0" stopColor="#e9ffff" />
            <stop offset="0.2" stopColor="#24e8f4" stopOpacity="0.9" />
            <stop offset="1" stopColor="#0ed9eb" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="hero-amber-star-glow">
            <stop offset="0" stopColor="#fff9d9" />
            <stop offset="0.2" stopColor="#ffb832" stopOpacity="0.9" />
            <stop offset="1" stopColor="#ffa11b" stopOpacity="0" />
          </radialGradient>
        </defs> */}
        {showBackgroundImage && backgroundImageUrl && (
          <image
            href={backgroundImageUrl}
            x="0"
            y="0"
            width="1671"
            height="941"
            opacity="1"
            filter="url(#site-backdrop-remove-white)"
          />
        )}
        <g className="hero-star hero-star-main">
          <circle cx="1462" cy="340" r="44" fill="url(#hero-main-star-glow)" />
          <path
            d="M1462 298C1466 328 1474 336 1504 340C1474 344 1466 352 1462 382C1458 352 1450 344 1420 340C1450 336 1458 328 1462 298Z"
            fill="#ffe28a"
          />
          <circle cx="1462" cy="340" r="3" fill="#fffef0" />
        </g>
        <g className="hero-star hero-star-cyan">
          <circle cx="470" cy="502" r="25" fill="url(#hero-cyan-star-glow)" />
          <circle cx="470" cy="502" r="3.5" fill="#eaffff" />
        </g>
        <g className="hero-star hero-star-amber">
          <circle cx="1322" cy="413" r="20" fill="url(#hero-amber-star-glow)" />
          <path
            d="M1322 401C1323.2 410 1325 411.8 1334 413C1325 414.2 1323.2 416 1322 425C1320.8 416 1319 414.2 1310 413C1319 411.8 1320.8 410 1322 401Z"
            fill="#ffe28a"
          />
        </g>
      </svg>
      <div className="site-content" style={{ position: "relative", zIndex: 2 }}>
        <main className="min-h-screen">{children}</main>
        <Footer footer={footer} logoUrl={logoUrl} />
      </div>
    </div>
  );
}
