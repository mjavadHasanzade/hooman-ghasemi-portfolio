import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTypewriterPhrase,
  deleteTypewriterPhrase,
  getContactCta,
  reorderTypewriterPhrases,
  updateContactCta,
  updateTypewriterPhrase,
} from "../api/contact-cta";
import { useIsAuthenticated } from "../auth/use-is-authenticated";
import type {
  CreateTypewriterPhraseInput,
  UpdateContactCtaInput,
  UpdateTypewriterPhraseInput,
} from "../types/contact-cta";

export const contactCtaKeys = {
  all: ["content", "contact-cta"] as const,
};

export function useContactCta() {
  const isAuthenticated = useIsAuthenticated();
  return useQuery({
    queryKey: contactCtaKeys.all,
    queryFn: getContactCta,
    enabled: isAuthenticated,
  });
}

export function useUpdateContactCta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateContactCtaInput) => updateContactCta(input),
    onSuccess: (data) => queryClient.setQueryData(contactCtaKeys.all, data),
  });
}

export function useCreateTypewriterPhrase() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateTypewriterPhraseInput) => createTypewriterPhrase(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: contactCtaKeys.all }),
  });
}

export function useUpdateTypewriterPhrase() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateTypewriterPhraseInput }) => updateTypewriterPhrase(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: contactCtaKeys.all }),
  });
}

export function useDeleteTypewriterPhrase() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTypewriterPhrase,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: contactCtaKeys.all }),
  });
}

export function useReorderTypewriterPhrases() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reorderTypewriterPhrases,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: contactCtaKeys.all }),
  });
}
