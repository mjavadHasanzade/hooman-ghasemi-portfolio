import axios from "axios";
import { auth } from "@/api/routes";

type TConfig = {
  apiUrl: string;
  loginURL: string;
  defaultLocale?: string;
  fallbackLocale?: string;
};

const envConfig: TConfig = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "",
  loginURL: "/login",
  defaultLocale: process.env.DEFAULT_LOCALE || "en",
  fallbackLocale: process.env.FALLBACK_LOCALE || "fa",
};

let cachedConfig: TConfig = { ...envConfig };
let lastFetchTime = 0;
const CACHE_DURATION = 3600 * 1000;

export const getAppConfig = async (forceRefresh = false): Promise<TConfig> => {
  const now = Date.now();

  if (
    !forceRefresh &&
    lastFetchTime !== 0 &&
    now - lastFetchTime < CACHE_DURATION
  ) {
    return cachedConfig;
  }

  try {
    // const response = await axios.get(`${envConfig.apiUrl}${auth.authCheck}`, {
    //   timeout: 5000,
    // });
    // if (response.status >= 400) throw new Error("Something went wrong");
    const response = { data: {} };

    cachedConfig = {
      ...envConfig,
      ...response.data,
    };

    lastFetchTime = now;

    return cachedConfig;
  } catch (error) {
    console.error("Config fetch failed, using cached/env config:", error);

    return cachedConfig || envConfig;
  }
};
