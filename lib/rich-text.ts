import sanitizeHtml from "sanitize-html";
import { decodeHTML } from "entities";

const options: sanitizeHtml.IOptions = {
  allowedTags: ["p", "div", "h1", "h2", "h3", "h4", "h5", "h6", "br", "strong", "b", "em", "i", "u", "s", "strike", "ul", "ol", "li", "blockquote", "pre", "code", "a", "hr", "span"],
  allowedAttributes: {
    "*": ["dir", "style"],
    a: ["href", "title", "target", "rel"],
    ol: ["start", "type"],
  },
  allowedStyles: {
    "*": {
      "text-align": [/^(left|center|right|justify|start|end)$/],
      "list-style-type": [/^(disc|circle|square|decimal|persian|lower-alpha|upper-alpha|lower-roman|upper-roman)$/],
    },
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  transformTags: {
    a: (tagName, attribs) => ({ tagName, attribs: { ...attribs, rel: "noopener noreferrer" } }),
  },
};

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function richTextHtml(value: string): string {
  if (!value) return "";
  const html = /<\/?[a-z][^>]*>/i.test(value)
    ? value
    : `<p>${escapeHtml(value).replace(/\r?\n/g, "<br />")}</p>`;
  return sanitizeHtml(html, options);
}

export function richTextPlainText(value: string, withBreaks = true): string {
  const html = richTextHtml(value);
  const separated = withBreaks ? html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(?:p|li|div|blockquote|pre)>/gi, "\n") : html;
  const text = decodeHTML(sanitizeHtml(separated, { allowedTags: [], allowedAttributes: {} }))
    .replace(/\u00a0/g, " ").replace(/\n{3,}/g, "\n\n");
  return withBreaks ? text.trim() : text;
}

/** Reveal visible characters, never partial HTML tags or encoded entities. */
export function revealRichText(value: string, count: number, showCursor = false): string {
  let remaining = count;
  let cursorPlaced = false;
  const cursor = '<span aria-hidden="true" class="typewriter-cursor ms-0.5 inline-block h-4 w-0.5 translate-y-0.5 bg-teal-400 align-middle"></span>';
  const html = sanitizeHtml(richTextHtml(value), {
    ...options,
    textFilter: (escapedText) => {
      const text = decodeHTML(escapedText);
      const visible = text.slice(0, Math.max(0, remaining));
      const placeCursor = showCursor && !cursorPlaced && remaining >= 0 && remaining <= text.length;
      remaining -= text.length;
      if (placeCursor) cursorPlaced = true;
      return escapeHtml(visible) + (placeCursor ? cursor : "");
    },
  });
  if (!showCursor || cursorPlaced) return html;
  // Empty paragraphs still need a visible cursor without escaping their block layout.
  return /<\/(?:p|div|li)>/.test(html)
    ? html.replace(/<\/(?:p|div|li)>/, (closing) => cursor + closing)
    : html + cursor;
}

/** Equivalent HTML from the controlled form must not reset editor selection/history. */
export function shouldReplaceEditorContent(incoming: string, current: string): boolean {
  return incoming !== current && richTextHtml(incoming) !== richTextHtml(current);
}
