import { getAllPages, reorderPage } from "./reorder";
import { techIconOrderUpdates } from "../tech-icon-order";
import { notifyPublicContentChanged } from "../public-content-sync";
import { apiDelete, apiGet, apiPatch, apiPost } from "./client";
import type { Paginated } from "../types/api";
import type { Project, ProjectInput, TechIcon, TechIconInput } from "../types/projects";

export function getTechIcons(page: number, limit: number) {
  return apiGet<Paginated<TechIcon>>("/admin/tech-icons", { page, limit });
}

export function getAllTechIcons() {
  return getAllPages<TechIcon>("/admin/tech-icons");
}

export function createTechIcon(input: TechIconInput) {
  return apiPost<TechIcon>("/admin/tech-icons", input);
}

export function updateTechIcon(id: string, input: Partial<TechIconInput>) {
  return apiPatch<TechIcon>(`/admin/tech-icons/${id}`, input);
}

export function deleteTechIcon(id: string) {
  return apiDelete<null>(`/admin/tech-icons/${id}`);
}

export async function reorderTechIcons({ sourceId, targetId }: { sourceId: string; targetId: string }) {
  if (sourceId === targetId) return;
  // Fetch all pages: assigning ranks to only the visible page would create ties elsewhere.
  const first = await getTechIcons(1, 100);
  const icons = [...first.items];
  for (let page = 2; page <= first.meta.totalPages; page++) {
    icons.push(...(await getTechIcons(page, 100)).items);
  }
  const updates = techIconOrderUpdates(icons, sourceId, targetId);
  if (!updates.length) return;
  const write = async (id: string, sortOrder: number) => {
    const updated = await apiPatch<TechIcon>(`/admin/tech-icons/${id}`, { sortOrder }, { notifyPublicContent: false });
    if (updated.sortOrder !== sortOrder) {
      throw new Error("بک‌اند هنوز ترتیب جدید را ذخیره نمی‌کند.");
    }
    return updated;
  };
  const results = await Promise.allSettled(updates.map((update) => write(update.id, update.sortOrder)));
  if (results.some((result) => result.status === "rejected")) {
    // The API has per-icon PATCH, so restore completed writes if any update fails.
    const rollback = await Promise.allSettled(updates
      .filter((_, index) => results[index].status === "fulfilled")
      .map((update) => write(update.id, update.previousSortOrder)));
    notifyPublicContentChanged();
    throw new Error(rollback.some((result) => result.status === "rejected")
      ? "ثبت ترتیب کامل نشد؛ فهرست را بررسی و دوباره تلاش کنید."
      : "ترتیب ذخیره نشد؛ تغییرات برگردانده شدند. دوباره تلاش کنید.");
  }
  notifyPublicContentChanged();
}

export function getProjects(page: number, limit: number) {
  return apiGet<Paginated<Project>>("/admin/projects", { page, limit });
}

export function createProject(input: ProjectInput) {
  return apiPost<Project>("/admin/projects", input);
}

export function updateProject(id: string, input: Partial<ProjectInput>) {
  return apiPatch<Project>(`/admin/projects/${id}`, input);
}

export function deleteProject(id: string) {
  return apiDelete<null>(`/admin/projects/${id}`);
}

export function reorderProjects(ids: string[]) {
  return reorderPage<Project>("/admin/projects", ids);
}
