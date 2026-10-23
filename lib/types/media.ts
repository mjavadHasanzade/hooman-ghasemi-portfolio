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

export { mediaUrl } from "../media/media-url";
