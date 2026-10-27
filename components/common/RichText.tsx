import { richTextHtml } from "@/lib/rich-text";

export default function RichText({ value, className = "" }: { value: string; className?: string }) {
  return <div className={`cms-rich-text ${className}`} dangerouslySetInnerHTML={{ __html: richTextHtml(value) }} />;
}
