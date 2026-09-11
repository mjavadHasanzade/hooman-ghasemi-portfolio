import { apiDelete, apiGet, apiPatch, apiPost } from "./client";
import type { PaginatedServices, Service, ServiceInput } from "../types/services";

export function getServices(page: number, limit: number) {
  return apiGet<PaginatedServices>("/admin/services", { page, limit });
}

export function createService(input: ServiceInput) {
  return apiPost<Service>("/admin/services", input);
}

export function updateService(id: string, input: Partial<ServiceInput>) {
  return apiPatch<Service>(`/admin/services/${id}`, input);
}

export function deleteService(id: string) {
  return apiDelete<Service>(`/admin/services/${id}`);
}

export function reorderServices(ids: string[]) {
  return apiPatch<Service[]>("/admin/services/reorder", { ids });
}
