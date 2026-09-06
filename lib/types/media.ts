export type Media = {
  id: string;
  filename: string;
  original: string;
  path: string;
  mimeType: string;
  size: number;
  width: number | null;
  height: number | null;
  altText: string | null;
  createdAt: string;
  updatedAt: string;
};

export function mediaUrl(media: Media | null | undefined): string | null {
  if (!media?.path) return null;
  return `${process.env.NEXT_PUBLIC_ASSET_ORIGIN}${media.path}`;
}
