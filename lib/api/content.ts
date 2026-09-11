import { apiGet, apiPatch } from "./client";
import type {
  Hero,
  About,
  Footer,
  SiteSettings,
  UpdateAboutInput,
  UpdateFooterInput,
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

export function getAbout() {
  return apiGet<About>("/admin/about");
}

export function updateAbout(body: UpdateAboutInput) {
  return apiPatch<About>("/admin/about", body);
}

export function getFooter() {
  return apiGet<Footer>("/admin/footer");
}

export function updateFooter(body: UpdateFooterInput) {
  return apiPatch<Footer>("/admin/footer", body);
}
