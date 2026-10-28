"use client";

import { memo, useMemo } from "react";
import { richTextHtml, richTextWordHtml } from "@/lib/rich-text";

// Preserve the animated word nodes when a CMS refresh returns the same text.
const WordRevealText = memo(function WordRevealText({ value, className }: { value: string; className: string }) {
  const html = useMemo(() => ({ __html: richTextWordHtml(value) }), [value]);
  return <div dir="rtl" className={`cms-rich-text fa-word-reveal ${className}`} dangerouslySetInnerHTML={html} />;
});

export default function RichText({ value, className = "", revealWords = false }: { value: string; className?: string; revealWords?: boolean }) {
  if (revealWords) return <WordRevealText value={value} className={className} />;
  return <div className={`cms-rich-text ${className}`} dangerouslySetInnerHTML={{ __html: richTextHtml(value) }} />;
}
