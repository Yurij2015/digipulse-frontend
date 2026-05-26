import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useRuntimeConfig, useAuth } from '#imports';
import type { PaginationMeta } from './sites';

export interface Project {
  id: number;
  name: string;
  description: string | null;
  sites_count?: number;
  created_at: string;
  updated_at: string;
}

export const useProjectsStore = defineStore('projects', () => {
  const config = useRuntimeConfig();
  const { token } = useAuth();

  const projects = ref<Project[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const lastFetched = ref<number | null>(null);
  const paginationMeta = ref<PaginationMeta | null>(null);

  const CACHE_TTL = 60000; // 1 minute cache

  const fetchProjects = async (force = false, page = 1, perPage = 50) => {
    if (!token.value) return;

    if (!force && lastFetched.value && (Date.now() - lastFetched.value < CACHE_TTL) && projects.value.length > 0) {
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('per_page', String(perPage));

      const data = await $fetch<any>(`${config.public.apiBase}/api/v1/projects?${params.toString()}`, {
        headers: {
          'Accept': 'application/json',
          'X-Frontend-Key': config.public.frontendKey as string,
          'Authorization': `Bearer ${token.value}`
        }
      });

      projects.value = data?.data || [];

      if (data?.meta) {
        paginationMeta.value = {
          currentPage: data.meta.current_page,
          lastPage: data.meta.last_page,
          perPage: data.meta.per_page,
          total: data.meta.total,
          from: data.meta.from,
          to: data.meta.to,
        };
      }

      lastFetched.value = Date.now();
    } catch (err: any) {
      console.error('Store: Failed to load projects:', err);
      error.value = err.message || 'Failed to load projects';
    } finally {
      loading.value = false;
    }
  };

  const createProject = async (name: string, description?: string) => {
    if (!token.value) return;

    try {
      const data = await $fetch<any>(`${config.public.apiBase}/api/v1/projects`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'X-Frontend-Key': config.public.frontendKey as string,
          'Authorization': `Bearer ${token.value}`
        },
        body: { name, description }
      });

      const newProject = data?.data || data;
      projects.value.unshift(newProject);
      return newProject;
    } catch (err: any) {
      throw err;
    }
  };

  const deleteProject = async (projectId: number) => {
    if (!token.value) return;

    try {
      await $fetch(`${config.public.apiBase}/api/v1/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'X-Frontend-Key': config.public.frontendKey as string,
          'Authorization': `Bearer ${token.value}`
        }
      });

      projects.value = projects.value.filter(p => p.id !== projectId);
    } catch (err: any) {
      throw err;
    }
  };

  const updateProject = async (projectId: number, name: string, description?: string) => {
    if (!token.value) return;

    try {
      const data = await $fetch<any>(`${config.public.apiBase}/api/v1/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'X-Frontend-Key': config.public.frontendKey as string,
          'Authorization': `Bearer ${token.value}`
        },
        body: { name, description }
      });

      const updated = data?.data || data;
      const idx = projects.value.findIndex(p => p.id === projectId);
      if (idx !== -1) {
        projects.value[idx] = { ...projects.value[idx], ...updated };
      }
      return updated;
    } catch (err: any) {
      throw err;
    }
  };

  const clearProjects = () => {
    projects.value = [];
    loading.value = false;
    error.value = null;
    lastFetched.value = null;
    paginationMeta.value = null;
  };

  return {
    projects,
    loading,
    error,
    lastFetched,
    paginationMeta,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    clearProjects
  };
});
