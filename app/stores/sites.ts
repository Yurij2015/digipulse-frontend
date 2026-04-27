import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useRuntimeConfig, useAuth } from '#imports';

export const useSitesStore = defineStore('sites', () => {
  const config = useRuntimeConfig();
  const { token } = useAuth();

  const sites = ref<any[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const lastFetched = ref<number | null>(null);

  const CACHE_TTL = 30000; // 30 seconds cache

  const fetchSites = async (force = false) => {
    if (!token.value) return;
    
    // Use cache if not forced and within TTL
    if (!force && lastFetched.value && (Date.now() - lastFetched.value < CACHE_TTL) && sites.value.length > 0) {
      return;
    }

    loading.value = true;
    error.value = null;
    
    try {
      const data = await $fetch<any>(`${config.public.apiBase}/api/sites`, {
        headers: {
          'Accept': 'application/json',
          'X-Frontend-Key': config.public.frontendKey as string,
          'Authorization': `Bearer ${token.value}`
        }
      });
      
      const dataArray = Array.isArray(data) ? data : (data?.data || []);
      
      sites.value = dataArray.map((site: any) => {
        let status = 'Offline';
        const configs = site.configurations || site.checks || [];
        const hasAnyCheckResult = configs.some((c: any) => c.last_checked_at || c.last_status);
        
        if (site.is_active) {
          if (!hasAnyCheckResult) {
            status = 'Pending';
          } else {
            status = 'Online';
            if (configs.some((c: any) => c.last_status === 'Warning')) {
              status = 'Warning';
            }
          }
        }
        
        return {
          ...site,
          status,
          lastCheck: site.last_checked_at || site.last_check || 'Never',
          responseTime: site.responseTime || site.response_time || 0,
          uptime: site.uptime || 0
        };
      });
      
      lastFetched.value = Date.now();
    } catch (err: any) {
      console.error('Store: Failed to load sites:', err);
      error.value = err.message || 'Failed to load sites';
    } finally {
      loading.value = false;
    }
  };

  const getSiteById = (id: number | string) => {
    return computed(() => sites.value.find(s => String(s.id) === String(id)));
  };

  const clearSites = () => {
    sites.value = [];
    loading.value = false;
    error.value = null;
    lastFetched.value = null;
  };

  return {
    sites,
    loading,
    error,
    lastFetched,
    fetchSites,
    getSiteById,
    clearSites
  };
});
