import { richTextPlainText } from "@/lib/rich-text";

export function htmlToPlainTextWithBreaks(html: string): string {
  return richTextPlainText(html);
}
