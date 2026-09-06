import { Settings } from "lucide-react";
import Navbar from "../layout/Navbar";
import type { PublicHero } from "@/lib/api/public-content";
import { publicMediaUrl } from "@/lib/api/public-content";

type HeroProps = {
  hero: PublicHero;
  siteName: string;
};

export default function Hero({ hero, siteName }: HeroProps) {
  const backgroundImageUrl = publicMediaUrl(hero.backgroundImage);

  return (
    <section
      className="relative min-h-screen w-full overflow-hidden bg-black text-white"
      style={
        backgroundImageUrl
          ? { backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.82)), url(${backgroundImageUrl})`, backgroundPosition: "center", backgroundSize: "cover" }
          : undefined
      }
    >
      <Navbar siteName={siteName} />

      <div className="relative z-10 px-5 pt-16 sm:px-8 sm:pt-20 md:px-12 md:pt-24 lg:px-15 lg:pt-32.5 xl:px-20 xl:pt-37.5">
        <div className="max-w-75 xxs:max-w-sm sm:max-w-xl md:max-w-2xl lg:max-w-180 xl:max-w-200">
          <h1 className="text-[28px] font-bold uppercase leading-[1.15] tracking-tight text-teal-200 xxs:text-[32px] sm:text-[40px] md:text-[48px] lg:text-[52px] xl:text-[58px]">
            {hero.title}
          </h1>

          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-gray-300 sm:mt-7 sm:text-lg md:text-xl lg:max-w-lg">
            {hero.subtitle}
          </p>

          <div className="mt-8 sm:mt-9">
            <button
              className="
                group relative flex items-center gap-2.5
                rounded-[3px] border border-teal-500
                bg-black/50 px-5 py-3
                text-sm font-semibold text-white
                shadow-[0_0_18px_rgba(63,168,196,0.45)]
                transition-shadow duration-300
                hover:shadow-[0_0_28px_rgba(63,168,196,0.65)]
                sm:px-6 sm:py-3.5 sm:text-[15px]
              "
            >
              <Settings className="h-4 w-4 text-teal-500 sm:h-4.5 sm:w-4.5" />
              <span>{hero.ctaLabel}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
