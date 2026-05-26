import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useRuntimeConfig, useAuth } from '#imports';

export interface PaginationMeta {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
  from: number | null;
  to: number | null;
}

export const useSitesStore = defineStore('sites', () => {
  const config = useRuntimeConfig();
  const { token } = useAuth();

  interface PageCacheEntry {
    sites: any[];
    meta: PaginationMeta;
    fetchedAt: number;
  }

  const sites = ref<any[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const lastFetched = ref<number | null>(null);
  const statusCountsFetchedAt = ref<number | null>(null);
  const lastProjectId = ref<number | null | undefined>(undefined); // undefined = never fetched
  const pageCache = new Map<string, PageCacheEntry>();
  const paginationMeta = ref<PaginationMeta | null>(null);
  const statusCounts = ref({ total: 0, active: 0, issues: 0 });

  const CACHE_TTL = 30000; // 30 seconds cache
  const REALTIME_SYNC_COOLDOWN = 5000;
  const lastRealtimeSyncAtBySite = ref<Record<number, number>>({});
  const realtimeSyncTimeouts = new Map<number, ReturnType<typeof setTimeout>>();
  const realtimeSyncInFlightBySite = ref<Record<number, boolean>>({});

  const apiStatusToDisplay = (apiStatus: string | null | undefined): string => {
    switch (apiStatus) {
      case 'up': return 'Online'
      case 'down': return 'Offline'
      case 'pending': return 'Pending'
      default: return 'Offline'
    }
  }

  // Used only for optimistic realtime updates before the next API refetch
  const deriveStatusFromConfigs = (site: any): string => {
    const configs = site.configurations || site.checks || [];
    const hasAnyCheckResult = configs.some((c: any) => c.last_checked_at || c.last_status);
    if (!site.is_active) return 'Offline'
    if (!hasAnyCheckResult) return 'Pending'
    if (configs.some((c: any) => c.last_status === 'down')) return 'Offline'
    if (configs.some((c: any) => c.last_status === 'slow' || c.last_status === 'Warning')) return 'Warning'
    return 'Online'
  }

  const normalizeSite = (site: any) => {
    return {
      ...site,
      status: apiStatusToDisplay(site.status),
      lastCheck: site.last_checked_at || site.last_check || 'Never',
      responseTime: site.responseTime || site.response_time || 0,
      uptime: site.uptime || 0
    };
  };

  const fetchSites = async (force = false, projectId?: number | null, page = 1, perPage = 50) => {
    if (!token.value) return;

    // If the project filter context changed, clear stale data and full cache
    const filterChanged = lastProjectId.value !== undefined && lastProjectId.value !== (projectId ?? null);
    if (filterChanged) {
      sites.value = [];
      lastFetched.value = null;
      pageCache.clear();
    }

    const cacheKey = `${projectId ?? 'all'}:${page}:${perPage}`;
    const cached = pageCache.get(cacheKey);

    if (!force && cached && (Date.now() - cached.fetchedAt < CACHE_TTL)) {
      sites.value = cached.sites;
      paginationMeta.value = cached.meta;
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      const params = new URLSearchParams();
      if (projectId) params.set('project_id', String(projectId));
      params.set('page', String(page));
      params.set('per_page', String(perPage));

      const url = `${config.public.apiBase}/api/v1/sites?${params.toString()}`;

      const data = await $fetch<any>(url, {
        headers: {
          'Accept': 'application/json',
          'X-Frontend-Key': config.public.frontendKey as string,
          'Authorization': `Bearer ${token.value}`
        }
      });

      const dataArray = Array.isArray(data) ? data : (data?.data || []);
      const normalized = dataArray.map((site: any) => normalizeSite(site));
      sites.value = normalized;

      if (data?.meta) {
        paginationMeta.value = {
          currentPage: data.meta.current_page,
          lastPage: data.meta.last_page,
          perPage: data.meta.per_page,
          total: data.meta.total,
          from: data.meta.from,
          to: data.meta.to,
        };

        pageCache.set(cacheKey, { sites: normalized, meta: paginationMeta.value, fetchedAt: Date.now() });
      }

      lastFetched.value = Date.now();
      lastProjectId.value = projectId ?? null;
    } catch (err: any) {
      console.error('Store: Failed to load sites:', err);
      error.value = err.message || 'Failed to load sites';
    } finally {
      loading.value = false;
    }
  };

  const recomputeStatusCounts = () => {
    if (!paginationMeta.value || paginationMeta.value.currentPage !== 1) return;
    statusCounts.value = {
      total: paginationMeta.value.total,
      active: sites.value.filter((s: any) => s.status === 'Online' || s.status === 'Pending').length,
      issues: sites.value.filter((s: any) => s.status === 'Offline' || s.status === 'Warning').length,
    };
  };

  const fetchSiteStatusCounts = async (force = false) => {
    if (!token.value) return;
    if (!force && statusCountsFetchedAt.value && (Date.now() - statusCountsFetchedAt.value < CACHE_TTL)) return;

    try {
      const params = new URLSearchParams();
      params.set('page', '1');
      params.set('per_page', '50');
      const data = await $fetch<any>(`${config.public.apiBase}/api/v1/sites?${params.toString()}`, {
        headers: {
          'Accept': 'application/json',
          'X-Frontend-Key': config.public.frontendKey as string,
          'Authorization': `Bearer ${token.value}`
        }
      });
      const dataArray = Array.isArray(data) ? data : (data?.data || []);
      const normalized = dataArray.map((s: any) => normalizeSite(s));
      statusCounts.value = {
        total: data?.meta?.total ?? normalized.length,
        active: normalized.filter((s: any) => s.status === 'Online' || s.status === 'Pending').length,
        issues: normalized.filter((s: any) => s.status === 'Offline' || s.status === 'Warning').length,
      };
      statusCountsFetchedAt.value = Date.now();
    } catch {}
  };

  const fetchSiteById = async (siteId: number) => {
    if (!token.value) return;

    const data = await $fetch<any>(`${config.public.apiBase}/api/v1/sites/${siteId}`, {
      headers: {
        'Accept': 'application/json',
        'X-Frontend-Key': config.public.frontendKey as string,
        'Authorization': `Bearer ${token.value}`
      }
    });

    const siteData = data?.data || data;
    if (!siteData || !siteData.id) {
      return;
    }

    const normalized = normalizeSite(siteData);
    const existingSiteIndex = sites.value.findIndex((site: any) => Number(site.id) === Number(siteId));

    if (existingSiteIndex === -1) {
      // In paginated mode the site belongs to a different page — don't inject it here
      if (paginationMeta.value) return;
      sites.value.unshift(normalized);
    } else {
      sites.value[existingSiteIndex] = normalized;
    }

    recomputeStatusCounts();
    lastFetched.value = Date.now();
  };

  const scheduleRealtimeSiteSync = (siteId: number) => {
    if (!token.value || !siteId) {
      return;
    }

    if (realtimeSyncInFlightBySite.value[siteId]) {
      return;
    }

    const elapsed = Date.now() - (lastRealtimeSyncAtBySite.value[siteId] || 0);
    const delay = Math.max(0, REALTIME_SYNC_COOLDOWN - elapsed);

    const existingTimeout = realtimeSyncTimeouts.get(siteId);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    const timeout = setTimeout(async () => {
      realtimeSyncInFlightBySite.value[siteId] = true;
      try {
        await fetchSiteById(siteId);
        lastRealtimeSyncAtBySite.value[siteId] = Date.now();
      } catch (err: any) {
        console.error(`Store: Failed to sync site ${siteId} from realtime signal:`, err);
      } finally {
        realtimeSyncInFlightBySite.value[siteId] = false;
        realtimeSyncTimeouts.delete(siteId);
      }
    }, delay);

    realtimeSyncTimeouts.set(siteId, timeout);
  };

  const applyRealtimeStatusUpdate = (payload: {
    site_id: number;
    configuration_id: number;
    status: string;
    response_time_ms?: number | null;
    checked_at: string;
  }) => {
    const siteIndex = sites.value.findIndex((s: any) => Number(s.id) === Number(payload.site_id));
    if (siteIndex === -1) return;

    const site = sites.value[siteIndex];
    const configurations = site.configurations || site.checks || [];
    const configIndex = configurations.findIndex((c: any) => Number(c.id) === Number(payload.configuration_id));

    if (configIndex !== -1) {
      configurations[configIndex] = {
        ...configurations[configIndex],
        last_status: payload.status,
        last_checked_at: payload.checked_at
      };
    }

    const updatedSite = {
      ...site,
      configurations,
      last_checked_at: payload.checked_at,
      lastCheck: payload.checked_at,
      status: deriveStatusFromConfigs({ ...site, configurations })
    } as any;

    if (typeof payload.response_time_ms === 'number') {
      updatedSite.response_time = payload.response_time_ms;
      updatedSite.responseTime = payload.response_time_ms;
    }

    sites.value[siteIndex] = updatedSite;
    recomputeStatusCounts();
    lastFetched.value = Date.now();
    scheduleRealtimeSiteSync(payload.site_id);
  };

  const syncSitesFromRealtimeSignal = (siteId: number) => {
    // In paginated mode, only sync sites that are actually visible on the current page
    const isOnCurrentPage = sites.value.some((s: any) => Number(s.id) === Number(siteId));
    if (paginationMeta.value && !isOnCurrentPage) return;
    scheduleRealtimeSiteSync(siteId);
  };

  const getSiteById = (id: number | string) => {
    return computed(() => sites.value.find(s => String(s.id) === String(id)));
  };

  const clearSites = () => {
    sites.value = [];
    loading.value = false;
    error.value = null;
    lastFetched.value = null;
    lastProjectId.value = undefined;
    paginationMeta.value = null;
    pageCache.clear();
    statusCounts.value = { total: 0, active: 0, issues: 0 };
    statusCountsFetchedAt.value = null;
    realtimeSyncTimeouts.forEach((timeout) => clearTimeout(timeout));
    realtimeSyncTimeouts.clear();
    lastRealtimeSyncAtBySite.value = {};
    realtimeSyncInFlightBySite.value = {};
  };

  return {
    sites,
    loading,
    error,
    lastFetched,
    paginationMeta,
    statusCounts,
    fetchSiteStatusCounts,
    fetchSites,
    fetchSiteById,
    applyRealtimeStatusUpdate,
    syncSitesFromRealtimeSignal,
    getSiteById,
    clearSites
  };
});
