import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createService, deleteService, getServices, reorderServices, updateService } from "../api/services";
import { useIsAuthenticated } from "../auth/use-is-authenticated";
import type { ServiceInput } from "../types/services";

export const serviceKeys = {
  all: ["services"] as const,
  list: (page: number, limit: number) => ["services", page, limit] as const,
};

export function useServices(page: number, limit = 20) {
  const isAuthenticated = useIsAuthenticated();
  return useQuery({ queryKey: serviceKeys.list(page, limit), queryFn: () => getServices(page, limit), enabled: isAuthenticated });
}

export function useCreateService() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: (input: ServiceInput) => createService(input), onSuccess: () => queryClient.invalidateQueries({ queryKey: serviceKeys.all }) });
}

export function useUpdateService() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: ({ id, input }: { id: string; input: Partial<ServiceInput> }) => updateService(id, input), onSuccess: () => queryClient.invalidateQueries({ queryKey: serviceKeys.all }) });
}

export function useDeleteService() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: deleteService, onSuccess: () => queryClient.invalidateQueries({ queryKey: serviceKeys.all }) });
}

export function useReorderServices() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: reorderServices, onSuccess: () => queryClient.invalidateQueries({ queryKey: serviceKeys.all }) });
}
