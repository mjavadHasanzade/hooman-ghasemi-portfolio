import AboutSection from "@/components/organisms/AboutSection";
import ContactCTASection from "@/components/organisms/ContactCTASection";
import Footer from "@/components/organisms/Footer";
import Hero from "@/components/organisms/Hero";
import PortfolioSection from "@/components/organisms/PortfolioSection";
import ServicesSection from "@/components/organisms/ServicesSection";
import TechStackSection from "@/components/organisms/TechStackSection";
import {
  getPublicAbout,
  getPublicFooter,
  getPublicHero,
  getPublicHome,
  getPublicSiteSettings,
} from "@/lib/api/public-content";

export async function generateStaticParams() {
  return [{ locale: "fa" }, { locale: "en" }];
}

type Props = {
  params: Promise<{
    locale: "fa" | "en";
  }>;
};

export default async function Home({ params }: Props) {
  const { locale } = await params;
  const [siteSettings, hero, about, footer, home] = await Promise.all([
    getPublicSiteSettings(),
    getPublicHero(locale),
    getPublicAbout(locale),
    getPublicFooter(locale),
    getPublicHome(locale),
  ]);

  return (
    <>
      <Hero hero={hero} siteName={siteSettings.siteName} />
      <ServicesSection services={home.services} sectionHeadings={home.siteSettings.sectionHeadings} />
      <TechStackSection techIcons={home.techIcons} sectionHeadings={home.siteSettings.sectionHeadings} />
      <PortfolioSection projects={home.projects} sectionHeadings={home.siteSettings.sectionHeadings} />
      <AboutSection about={about} />
      <ContactCTASection contactCta={home.contactCta} socialLinks={home.socialLinks} />
      <Footer footer={footer} />
    </>
  );
}
