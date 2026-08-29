"use client";
import { useTranslations } from "next-intl";
import { Gauge } from "lucide-react";
import ServiceCard from "../molecules/ServiceCard";
import SectionHeading from "../common/SectionHeading";

export default function ServicesSection() {
  const t = useTranslations("Services");

  return (
    <section className="relative w-full overflow-hidden bg-black py-16 text-white sm:py-20 md:py-24 lg:py-28">
      <div className="relative z-10 px-5 sm:px-8 md:px-12 lg:px-15 xl:px-20">
        <SectionHeading
          label={t("label")}
          heading={[
            [
              { text: t("headingLight") },
              { text: t("headingBold"), emphasis: true },
            ],
          ]}
          description={[t("description1")]}
        />

        <div className="relative mt-14 grid grid-cols-1 sm:mt-16 md:grid-cols-2 lg:mt-20 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-8 xl:gap-x-8">
          <ServiceCard
            icon={<WebDesignIcon className="h-full w-full" />}
            titleThin={t("card1.titleThin")}
            titleBold={t("card1.titleBold")}
            description={t("card1.description")}
          />

          <div className="lg:-ml-px">
            <ServiceCard
              icon={<WebflowIcon className="h-full w-full" />}
              titleThin={t("card2.titleThin")}
              titleBold={t("card2.titleBold")}
              description={t("card2.description")}
            />
          </div>

          <div className="lg:-ml-px">
            <ServiceCard
              icon={<Gauge className="h-full w-full" strokeWidth={1.8} />}
              titleThin={t("card3.titleThin")}
              titleBold={t("card3.titleBold")}
              description={t("card3.description")}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
export function WebDesignIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className}>
      <rect
        x="6"
        y="10"
        width="32"
        height="23"
        rx="1"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <path
        d="M14 40H30"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path d="M22 33V40" stroke="currentColor" strokeWidth="2.5" />
      <path
        d="M33 28L50 11C51.3 9.7 53.4 9.7 54.7 11C56 12.3 56 14.4 54.7 15.7L37.7 32.7L31 34.5L33 28Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
export function WebflowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className}>
      <circle cx="32" cy="32" r="23" stroke="currentColor" strokeWidth="2.5" />
      <path
        d="M20 23L25 41L32 27L39 41L44 23"
        stroke="currentColor"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
