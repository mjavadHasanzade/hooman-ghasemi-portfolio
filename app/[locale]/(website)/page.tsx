import AboutSection from "@/components/organisms/AboutSection";
import ContactCTASection from "@/components/organisms/ContactCTASection";
import Footer from "@/components/organisms/Footer";
import Hero from "@/components/organisms/Hero";
import PortfolioSection from "@/components/organisms/PortfolioSection";
import ServicesSection from "@/components/organisms/ServicesSection";
import TechStackSection from "@/components/organisms/TechStackSection";
import { getPublicHero, getPublicSiteSettings } from "@/lib/api/public-content";

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
  const [siteSettings, hero] = await Promise.all([
    getPublicSiteSettings(),
    getPublicHero(locale),
  ]);

  return (
    <>
      <Hero hero={hero} siteName={siteSettings.siteName} />
      <ServicesSection />
      <TechStackSection />
      <PortfolioSection />
      <AboutSection />
      <ContactCTASection />
      <Footer />
    </>
  );
}
