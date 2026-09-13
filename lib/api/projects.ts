import { apiDelete, apiGet, apiPatch, apiPatchForm, apiPost, apiPostForm } from "./client";
import type { Paginated } from "../types/api";
import type { Project, ProjectInput, TechIcon, TechIconInput } from "../types/projects";

export function getTechIcons(page: number, limit: number) {
  return apiGet<Paginated<TechIcon>>("/admin/tech-icons", { page, limit });
}

export function createTechIcon(input: TechIconInput) {
  const body = new FormData();
  body.append("key", input.key);
  body.append("label", input.label);
  if (input.image) body.append("image", input.image);
  return apiPostForm<TechIcon>("/admin/tech-icons", body);
}

export function updateTechIcon(id: string, input: Partial<TechIconInput>) {
  const body = new FormData();
  if (input.key !== undefined) body.append("key", input.key);
  if (input.label !== undefined) body.append("label", input.label);
  if (input.image) body.append("image", input.image);
  return apiPatchForm<TechIcon>(`/admin/tech-icons/${id}`, body);
}

export function deleteTechIcon(id: string) {
  return apiDelete<null>(`/admin/tech-icons/${id}`);
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
  return apiPatch<Project[]>("/admin/projects/reorder", { ids });
}
