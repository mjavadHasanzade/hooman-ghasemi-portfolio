import type { Media } from "./media";

export type SocialLink = {
  id: string;
  platform: string;
  url: string;
  iconKey: string;
  image: Media | null;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type SocialLinkInput = {
  platform: string;
  url: string;
  iconKey: string;
  imageMediaId?: string | null;
  isActive?: boolean;
};

export type UpdateSocialLinkInput = Partial<SocialLinkInput> & {
  order?: number;
};
