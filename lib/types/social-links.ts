export type SocialLink = {
  id: string;
  platform: string;
  url: string;
  iconKey: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type SocialLinkInput = {
  platform: string;
  url: string;
  iconKey: string;
  isActive?: boolean;
};

export type UpdateSocialLinkInput = Partial<SocialLinkInput> & {
  order?: number;
};
