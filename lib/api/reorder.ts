import { apiGet, apiPatch } from "./client";
import type { Paginated } from "../types/api";

export async function getAllPages<T>(path: string): Promise<T[]> {
  const first = await apiGet<Paginated<T>>(path, { page: 1, limit: 100 });
  const items = [...first.items];
  for (let page = 2; page <= first.meta.totalPages; page++) {
    items.push(...(await apiGet<Paginated<T>>(path, { page, limit: 100 })).items);
  }
  return items;
}

export async function reorderPage<T extends { id: string }>(path: string, ids: string[]) {
  const items = await getAllPages<T>(path);
  const selected = new Set(ids);
  if (selected.size !== ids.length || ids.some((id) => !items.some((item) => item.id === id))) {
    throw new Error("فهرست تغییر کرده است؛ صفحه را تازه‌سازی و دوباره تلاش کنید.");
  }
  // Replace only the visible slots while preserving every other page's positions.
  let index = 0;
  const allIds = items.map((item) => selected.has(item.id) ? ids[index++] : item.id);
  return apiPatch<T[]>(`${path}/reorder`, { ids: allIds });
}
