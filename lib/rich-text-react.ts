import { parseDocument } from "htmlparser2";
import { createElement, type CSSProperties, type ReactNode } from "react";
import { revealRichText, richTextHtml, richTextTags, richTextWordHtml } from "./rich-text";

type ChildNode = ReturnType<typeof parseDocument>["children"][number];

const allowedTags = new Set(richTextTags);
const styleProps = new Map([
  ["color", "color"],
  ["background-color", "backgroundColor"],
  ["font-size", "fontSize"],
  ["line-height", "lineHeight"],
  ["margin-top", "marginTop"],
  ["margin-bottom", "marginBottom"],
  ["text-align", "textAlign"],
  ["list-style-type", "listStyleType"],
]);

// The sanitizer validates values. Translate only the supported CSS properties.
function toReactStyle(css: string): CSSProperties {
  const style: Record<string, string> = {};
  for (const declaration of css.split(";")) {
    const colon = declaration.indexOf(":");
    if (colon < 0) continue;
    const property = styleProps.get(declaration.slice(0, colon).trim());
    if (property) style[property] = declaration.slice(colon + 1).trim();
  }
  return style;
}

function renderNode(node: ChildNode, key: number): ReactNode {
  if (node.type === "text") return node.data;
  if (node.type !== "tag" || !allowedTags.has(node.name)) return null;

  const attributes = node.attribs;
  const props: Record<string, unknown> = { key };
  if (attributes.style) props.style = toReactStyle(attributes.style);
  if (["ltr", "rtl", "auto"].includes(attributes.dir)) props.dir = attributes.dir;

  if (node.name === "a") {
    props.href = attributes.href;
    props.title = attributes.title;
    props.target = attributes.target;
    props.rel = "noopener noreferrer";
  } else if (node.name === "ol") {
    if (/^-?\d+$/.test(attributes.start ?? "")) props.start = attributes.start;
    if (/^[1aAiI]$/.test(attributes.type ?? "")) props.type = attributes.type;
  } else if (node.name === "span") {
    // These classes are generated after sanitizing CMS content.
    if (attributes.class === "fa-scroll-word") props.className = "fa-scroll-word";
    if (attributes["aria-hidden"] === "true") {
      props["aria-hidden"] = true;
      props.className = "typewriter-cursor ms-0.5 inline-block h-4 w-0.5 translate-y-0.5 bg-teal-400 align-middle";
    }
  }

  if (node.name === "br" || node.name === "hr") return createElement(node.name, props);
  return createElement(node.name, props, node.children.map(renderNode));
}

export function RichTextContent({
  value,
  inline = false,
  revealCount,
  revealWords = false,
}: {
  value: string;
  inline?: boolean;
  revealCount?: number;
  revealWords?: boolean;
}) {
  if (revealCount !== undefined) return parseDocument(revealRichText(value, revealCount, true)).children.map(renderNode);
  if (revealWords) return parseDocument(richTextWordHtml(value)).children.map(renderNode);
  const sanitized = richTextHtml(value);
  const html = inline
    ? sanitized.replace(/<br\s*\/?>/gi, " ").replace(/<\/(p|div|h[1-6])>/gi, "</$1> ")
    : sanitized;
  return parseDocument(html).children.map(renderNode);
}
