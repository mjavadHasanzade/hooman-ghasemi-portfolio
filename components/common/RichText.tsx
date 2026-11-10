"use client";

import { memo, useMemo } from "react";
import { RichTextContent } from "@/lib/rich-text-react";

// Preserve the animated word nodes when a CMS refresh returns the same text.
const WordRevealText = memo(function WordRevealText({ value, className }: { value: string; className: string }) {
  const content = useMemo(() => <RichTextContent value={value} revealWords />, [value]);
  return <div dir="rtl" className={`cms-rich-text fa-word-reveal ${className}`}>{content}</div>;
});

export default function RichText({ value, className = "", revealWords = false }: { value: string; className?: string; revealWords?: boolean }) {
  if (revealWords) return <WordRevealText value={value} className={className} />;
  return <div className={`cms-rich-text ${className}`}><RichTextContent value={value} /></div>;
}
