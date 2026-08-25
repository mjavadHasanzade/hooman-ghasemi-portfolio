import { getAppConfig } from "@/lib/config";
import { defineRouting } from "next-intl/routing";

const locales = ["en", "fa"] as const;
type Locale = (typeof locales)[number];

const appConfig = await getAppConfig();

const envLocale = appConfig.defaultLocale;

const defaultLocale: Locale = locales.includes(envLocale as Locale)
  ? (envLocale as Locale)
  : "fa";

export const routing = defineRouting({
  localeDetection: false,
  locales,
  defaultLocale,
  localePrefix: 'as-needed'
});
