import { getRequestConfig } from "next-intl/server";
import { hasLocale, IntlErrorCode } from "next-intl";
import { routing } from "./routing";
import merge from "deepmerge";
import { getAppConfig } from "@/lib/config";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;

  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const config = await getAppConfig();
  const fallbackLocale = config.fallbackLocale ?? "fa";

  const fallbackMessages = (await import(`./locales/${fallbackLocale}.json`))
    .default;

  const localeMessages =
    locale === fallbackLocale
      ? fallbackMessages
      : (await import(`./locales/${locale}.json`)).default;

  return {
    locale,

    messages: merge(fallbackMessages, localeMessages, {
      arrayMerge: (target, source, options) => {
        const result = [...target];

        source.forEach((item, index) => {
          if (typeof result[index] === "undefined") {
            result[index] = item;
          } else if (
            typeof item === "object" &&
            item !== null &&
            typeof result[index] === "object"
          ) {
            result[index] = merge(result[index], item, options);
          } else {
            result[index] = item;
          }
        });

        return result;
      },
    }),

    onError(error) {
      if (error.code === IntlErrorCode.MISSING_MESSAGE) {
        console.error(error);
      }
    },

    getMessageFallback({ namespace, key, error }) {
      const path = [namespace, key].filter(Boolean).join(".");

      if (error.code === IntlErrorCode.MISSING_MESSAGE) {
        return path;
      }

      return "Translation error: " + path;
    },
  };
});
