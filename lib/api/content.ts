import { apiGet, apiPatch } from "./client";
import type {
  Hero,
  SiteSettings,
  UpdateHeroInput,
  UpdateSiteSettingsInput,
} from "../types/content";

export function getSiteSettings() {
  return apiGet<SiteSettings>("/admin/site-settings");
}

export function updateSiteSettings(body: UpdateSiteSettingsInput) {
  return apiPatch<SiteSettings>("/admin/site-settings", body);
}

export function getHero() {
  return apiGet<Hero>("/admin/hero");
}

export function updateHero(body: UpdateHeroInput) {
  return apiPatch<Hero>("/admin/hero", body);
}
