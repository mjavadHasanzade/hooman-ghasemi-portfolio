"use client";

import { useTranslations } from "next-intl";
import { Settings } from "lucide-react";
import Navbar from "../layout/Navbar";

export default function Hero() {
  const t = useTranslations("Hero");

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      <Navbar />

      <div className="relative z-10 px-5 pt-16 sm:px-8 sm:pt-20 md:px-12 md:pt-24 lg:px-15 lg:pt-32.5 xl:px-20 xl:pt-37.5">
        <div className="max-w-75 xxs:max-w-sm sm:max-w-xl md:max-w-2xl lg:max-w-180 xl:max-w-200">
          <h1 className="text-[28px] font-bold uppercase leading-[1.15] tracking-tight xxs:text-[32px] sm:text-[40px] md:text-[48px] lg:text-[52px] xl:text-[58px]">
            <span className="block">
              <span className="text-teal-600">{t("headingDark1")}</span>{" "}
              <span className="text-teal-200">{t("headingLight1")}</span>
            </span>
            <span className="block">
              <span className="text-teal-600">{t("headingDark2")}</span>{" "}
              <span className="text-teal-200">{t("headingLight2")}</span>
            </span>
          </h1>

          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-gray-300 sm:mt-7 sm:text-lg md:text-xl lg:max-w-lg">
            {t("description1")}
            <br />
            {t("description2")}
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
              <span>{t("cta")}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
