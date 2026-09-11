import { apiDelete, apiGet, apiPatch, apiPost } from "./client";
import type { Paginated } from "../types/api";
import type { Project, ProjectInput, TechIcon, TechIconInput } from "../types/projects";

export function getTechIcons(page: number, limit: number) {
  return apiGet<Paginated<TechIcon>>("/admin/tech-icons", { page, limit });
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
