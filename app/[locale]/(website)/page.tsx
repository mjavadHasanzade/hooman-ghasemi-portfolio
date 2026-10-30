import AboutSection from "@/components/organisms/AboutSection";
import ContactCTASection from "@/components/organisms/ContactCTASection";
import Hero from "@/components/organisms/Hero";
import PortfolioSection from "@/components/organisms/PortfolioSection";
import ServicesSection from "@/components/organisms/ServicesSection";
import TechStackSection from "@/components/organisms/TechStackSection";
import { notFound } from "next/navigation";
import {
  getPublicAbout,
  getPublicHero,
  getPublicHome,
  getPublicSiteSettings,
} from "@/lib/api/public-content";

export async function generateStaticParams() {
  return [{ locale: "fa" }, { locale: "en" }];
}

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function Home({ params }: Props) {
  const { locale: rawLocale } = await params;
  if (rawLocale !== "fa" && rawLocale !== "en") notFound();
  const locale = rawLocale;
  const [siteSettings, hero, about, home] = await Promise.all([
    getPublicSiteSettings(),
    getPublicHero(locale),
    getPublicAbout(locale),
    getPublicHome(locale),
  ]);

  return (
    <>
      <Hero hero={hero} />
      <ServicesSection
        services={home.services}
        sectionHeadings={home.siteSettings.sectionHeadings}
      />
      <TechStackSection
        techIcons={home.techIcons}
        sectionHeadings={home.siteSettings.sectionHeadings}
      />
      <PortfolioSection
        projects={home.projects}
        sectionHeadings={home.siteSettings.sectionHeadings}
      />
      <AboutSection about={about} />
      <ContactCTASection
        contactCta={home.contactCta}
        socialLinks={home.socialLinks}
        contactEmail={siteSettings.contactEmail}
        phoneNumber={siteSettings.phoneNumber}
      />
    </>
  );
}
