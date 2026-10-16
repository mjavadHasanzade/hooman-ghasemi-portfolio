export function htmlToPlainTextWithBreaks(html: string): string {
  if (!html) return "";

  // convert block-level boundaries and <br> into newlines before stripping tags
  const withBreaks = html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<\/div>/gi, "\n");

  const text =
    typeof window === "undefined"
      ? withBreaks.replace(/<[^>]*>/g, "")
      : (() => {
          const div = document.createElement("div");
          div.innerHTML = withBreaks;
          return div.textContent ?? div.innerText ?? "";
        })();

  return text
    .replace(/\n{3,}/g, "\n\n") // collapse excessive blank lines
    .trim();
}
