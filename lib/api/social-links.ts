import { apiDelete, apiGet, apiPatch, apiPost } from "./client";
import type {
  SocialLink,
  SocialLinkInput,
  UpdateSocialLinkInput,
} from "../types/social-links";

export function getSocialLinks() {
  return apiGet<SocialLink[]>("/admin/social-links");
}

export function createSocialLink(input: SocialLinkInput) {
  return apiPost<SocialLink>("/admin/social-links", input);
}

export function updateSocialLink(id: string, input: UpdateSocialLinkInput) {
  return apiPatch<SocialLink>(`/admin/social-links/${id}`, input);
}

export function deleteSocialLink(id: string) {
  return apiDelete<SocialLink>(`/admin/social-links/${id}`);
}

export function reorderSocialLinks(ids: string[]) {
  return apiPatch<SocialLink[]>("/admin/social-links/reorder", { ids });
}
