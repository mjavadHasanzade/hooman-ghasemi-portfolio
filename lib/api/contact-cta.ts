import { apiDelete, apiGet, apiPatch, apiPost } from "./client";
import type {
  ContactCta,
  CreateTypewriterPhraseInput,
  TypewriterPhrase,
  UpdateContactCtaInput,
  UpdateTypewriterPhraseInput,
} from "../types/contact-cta";

export function getContactCta() {
  return apiGet<ContactCta>("/admin/contact-cta");
}

export function updateContactCta(input: UpdateContactCtaInput) {
  return apiPatch<ContactCta>("/admin/contact-cta", input);
}

export function createTypewriterPhrase(input: CreateTypewriterPhraseInput) {
  return apiPost<TypewriterPhrase>("/admin/contact-cta/phrases", input);
}

export function updateTypewriterPhrase(
  id: string,
  input: UpdateTypewriterPhraseInput,
) {
  return apiPatch<TypewriterPhrase>(`/admin/contact-cta/phrases/${id}`, input);
}

export function deleteTypewriterPhrase(id: string) {
  return apiDelete<TypewriterPhrase>(`/admin/contact-cta/phrases/${id}`);
}

export function reorderTypewriterPhrases(ids: string[]) {
  return apiPatch<TypewriterPhrase[]>("/admin/contact-cta/phrases/reorder", {
    ids,
  });
}
