import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getHero, getSiteSettings, updateHero, updateSiteSettings } from "../api/content";
import { useIsAuthenticated } from "../auth/use-is-authenticated";
import type { UpdateHeroInput, UpdateSiteSettingsInput } from "../types/content";

export const contentKeys = {
  siteSettings: ["content", "site-settings"] as const,
  hero: ["content", "hero"] as const,
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
