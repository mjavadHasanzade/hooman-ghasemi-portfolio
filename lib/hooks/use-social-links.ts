import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createSocialLink,
  deleteSocialLink,
  getSocialLinks,
  reorderSocialLinks,
  updateSocialLink,
} from "../api/social-links";
import { useIsAuthenticated } from "../auth/use-is-authenticated";
import type { SocialLinkInput, UpdateSocialLinkInput } from "../types/social-links";

export const socialLinksKeys = { all: ["social-links"] as const };

export function useSocialLinks() {
  const isAuthenticated = useIsAuthenticated();
  return useQuery({
    queryKey: socialLinksKeys.all,
    queryFn: getSocialLinks,
    enabled: isAuthenticated,
  });
}

export function useCreateSocialLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: SocialLinkInput) => createSocialLink(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: socialLinksKeys.all }),
  });
}

export function useUpdateSocialLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateSocialLinkInput }) => updateSocialLink(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: socialLinksKeys.all }),
  });
}

export function useDeleteSocialLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSocialLink,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: socialLinksKeys.all }),
  });
}

export function useReorderSocialLinks() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reorderSocialLinks,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: socialLinksKeys.all }),
  });
}
