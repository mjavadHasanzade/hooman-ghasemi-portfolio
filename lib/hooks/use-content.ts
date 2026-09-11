import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAbout,
  getFooter,
  getHero,
  getSiteSettings,
  updateAbout,
  updateFooter,
  updateHero,
  updateSiteSettings,
} from "../api/content";
import { useIsAuthenticated } from "../auth/use-is-authenticated";
import type {
  UpdateAboutInput,
  UpdateFooterInput,
  UpdateHeroInput,
  UpdateSiteSettingsInput,
} from "../types/content";

export const contentKeys = {
  siteSettings: ["content", "site-settings"] as const,
  hero: ["content", "hero"] as const,
  about: ["content", "about"] as const,
  footer: ["content", "footer"] as const,
};

export function useSiteSettings() {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    queryKey: contentKeys.siteSettings,
    queryFn: getSiteSettings,
    enabled: isAuthenticated,
  });
}

export function useUpdateSiteSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateSiteSettingsInput) => updateSiteSettings(input),
    onSuccess: (settings) => {
      queryClient.setQueryData(contentKeys.siteSettings, settings);
    },
  });
}

export function useHero() {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    queryKey: contentKeys.hero,
    queryFn: getHero,
    enabled: isAuthenticated,
  });
}

export function useUpdateHero() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateHeroInput) => updateHero(input),
    onSuccess: (hero) => {
      queryClient.setQueryData(contentKeys.hero, hero);
    },
  });
}

export function useAbout() {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    queryKey: contentKeys.about,
    queryFn: getAbout,
    enabled: isAuthenticated,
  });
}

export function useUpdateAbout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateAboutInput) => updateAbout(input),
    onSuccess: (about) => {
      queryClient.setQueryData(contentKeys.about, about);
    },
  });
}

export function useFooter() {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    queryKey: contentKeys.footer,
    queryFn: getFooter,
    enabled: isAuthenticated,
  });
}

export function useUpdateFooter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateFooterInput) => updateFooter(input),
    onSuccess: (footer) => {
      queryClient.setQueryData(contentKeys.footer, footer);
    },
  });
}
