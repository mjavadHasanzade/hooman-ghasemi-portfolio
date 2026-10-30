import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createProject, createTechIcon, deleteProject, deleteTechIcon, getProjects, getTechIcons, getAllTechIcons, reorderTechIcons, reorderProjects, updateProject, updateTechIcon } from "../api/projects";
import { useIsAuthenticated } from "../auth/use-is-authenticated";
import type { ProjectInput, TechIconInput } from "../types/projects";

export const projectKeys = {
  projects: ["projects"] as const,
  projectList: (page: number, limit: number) => [...projectKeys.projects, page, limit] as const,
  techIcons: ["tech-icons"] as const,
  techIconList: (page: number, limit: number) => [...projectKeys.techIcons, page, limit] as const,
};

export function useTechIcons(page: number, limit = 20) {
  const isAuthenticated = useIsAuthenticated();
  return useQuery({ queryKey: projectKeys.techIconList(page, limit), queryFn: () => getTechIcons(page, limit), enabled: isAuthenticated });
}

export function useAllTechIcons() {
  const isAuthenticated = useIsAuthenticated();
  return useQuery({ queryKey: [...projectKeys.techIcons, "all"], queryFn: getAllTechIcons, enabled: isAuthenticated });
}

export function useCreateTechIcon() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: (input: TechIconInput) => createTechIcon(input), onSuccess: () => queryClient.invalidateQueries({ queryKey: projectKeys.techIcons }) });
}

export function useUpdateTechIcon() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: ({ id, input }: { id: string; input: Partial<TechIconInput> }) => updateTechIcon(id, input), onSuccess: () => queryClient.invalidateQueries({ queryKey: projectKeys.techIcons }) });
}

export function useDeleteTechIcon() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: deleteTechIcon, onSuccess: () => queryClient.invalidateQueries({ queryKey: projectKeys.techIcons }) });
}

export function useReorderTechIcons() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reorderTechIcons,
    onSettled: () => queryClient.invalidateQueries({ queryKey: projectKeys.techIcons }),
  });
}

export function useProjects(page: number, limit = 20) {
  const isAuthenticated = useIsAuthenticated();
  return useQuery({ queryKey: projectKeys.projectList(page, limit), queryFn: () => getProjects(page, limit), enabled: isAuthenticated });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: (input: ProjectInput) => createProject(input), onSuccess: () => queryClient.invalidateQueries({ queryKey: projectKeys.projects }) });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: ({ id, input }: { id: string; input: Partial<ProjectInput> }) => updateProject(id, input), onSuccess: () => queryClient.invalidateQueries({ queryKey: projectKeys.projects }) });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: deleteProject, onSuccess: () => queryClient.invalidateQueries({ queryKey: projectKeys.projects }) });
}

export function useReorderProjects() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: reorderProjects, onSuccess: () => queryClient.invalidateQueries({ queryKey: projectKeys.projects }) });
}
