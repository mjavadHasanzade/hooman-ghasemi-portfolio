/** Global icon order is independent of each project's association `order`. */
export function sortTechIcons<T extends { sortOrder?: number; label: string }>(icons: readonly T[]): T[] {
  return [...icons].sort((a, b) =>
    (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.label.localeCompare(b.label, "en"),
  );
}

export function moveTechIcon<T extends { id: string }>(icons: readonly T[], sourceId: string, targetId: string): T[] {
  const from = icons.findIndex((icon) => icon.id === sourceId);
  const to = icons.findIndex((icon) => icon.id === targetId);
  if (from < 0 || to < 0) throw new Error("فهرست آیکون‌ها تغییر کرده است؛ دوباره تلاش کنید.");
  const next = [...icons];
  const [icon] = next.splice(from, 1);
  next.splice(to, 0, icon);
  return next;
}

/** Normalize the complete list so ties and page boundaries cannot undo a drag. */
export function techIconOrderUpdates<T extends { id: string; label: string; sortOrder?: number }>(icons: readonly T[], sourceId: string, targetId: string) {
  return moveTechIcon(sortTechIcons(icons), sourceId, targetId)
    .map((icon, sortOrder) => ({ id: icon.id, sortOrder, previousSortOrder: icon.sortOrder ?? 0 }))
    .filter((update) => update.sortOrder !== update.previousSortOrder);
}
