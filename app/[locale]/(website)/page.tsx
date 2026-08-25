import { getTranslations } from "next-intl/server";

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

  const t = await getTranslations({
    locale,
  });

  return <div className="md:mt-12">{t("WebsiteMenu.homepage")}</div>;
}
