<template>
  <div class="flex flex-col lg:flex-row min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white transition-colors duration-500 mesh-bg">
    <AppSidebar />

    <!-- Main Content -->
    <main class="flex-1 p-6 lg:p-12 overflow-y-auto lg:ml-72 h-screen">
      <header class="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
        <div>
          <h1 class="text-4xl font-black text-neutral-900 dark:text-white mb-3">{{ t('dashboard.title') }}</h1>
          <p class="text-neutral-500 font-medium">{{ t('dashboard.subtitle') }}</p>
        </div>
        <UButton size="xl" icon="i-heroicons-plus-circle" class="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold px-8 rounded-xl hover:scale-105 transition-transform" @click="openAddModal">
          {{ t('dashboard.monitor_node') }}
        </UButton>
      </header>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div v-for="(stat, index) in summaryStats" :key="stat.label" class="p-6 rounded-[24px] bg-white dark:bg-white/5 border border-neutral-200/50 dark:border-white/5 hover:border-primary-500/30 transition-all cursor-default flex items-center gap-5 group">
          <div :class="[
            'w-14 h-14 rounded-2xl flex items-center justify-center transition-colors',
            index === 0 ? 'bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400' :
            index === 1 ? 'bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400' :
            (stat.value > 0 ? 'bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400' : 'bg-neutral-50 dark:bg-neutral-900 text-neutral-400')
          ]">
            <UIcon :name="stat.icon" class="w-7 h-7" />
          </div>
          <div class="flex flex-col">
            <div class="text-neutral-400 text-[10px] font-bold uppercase tracking-widest mb-1">{{ stat.label }}</div>
            <div class="text-3xl font-semibold text-neutral-900 dark:text-white leading-none tabular-nums group-hover:scale-105 transition-transform origin-left">{{ stat.value }}</div>
          </div>
        </div>
      </div>

      <div class="flex flex-col md:flex-row gap-4 mb-12 items-stretch h-auto md:h-12">
        <UInput 
          v-model="searchQuery" 
          :placeholder="$t('dashboard.filter_placeholder')" 
          icon="i-heroicons-magnifying-glass" 
          size="xl" 
          class="flex-1"
          :ui="{
            base: 'h-full rounded-xl dark:bg-white/5 border-neutral-200 dark:border-white/10'
          }"
        />
        <div class="relative w-full md:w-64 h-full">
          <select 
            v-model="filterStatus" 
            class="w-full h-full pl-5 pr-10 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/5 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none appearance-none cursor-pointer text-sm font-medium"
          >
            <option value="">All Statuses</option>
            <option value="Online">Online Only</option>
            <option value="Offline">Offline Only</option>
            <option value="Warning">Warning Only</option>
          </select>
          <UIcon name="i-heroicons-funnel" class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400" />
        </div>
      </div>

      <!-- Websites Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="website in filteredWebsites" 
          :key="website.id" 
          class="group p-6 rounded-2xl bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/10 hover:border-primary-500/50 hover:shadow-xl transition-all duration-300 flex flex-col"
        >
          <div class="flex justify-between items-start mb-6">
            <div class="flex flex-col gap-1">
              <h3 class="text-lg font-semibold text-neutral-900 dark:text-white group-hover:text-primary-600 transition-colors truncate max-w-[180px]">
                {{ website.name || 'Unnamed Node' }}
              </h3>
              <div class="flex items-center gap-1.5 flex-wrap">
                <a 
                  v-if="website.url"
                  :href="website.url" 
                  target="_blank" 
                  class="text-neutral-500 text-[11px] font-medium hover:text-primary-500 transition-colors flex items-center gap-1"
                >
                  <UIcon name="i-heroicons-globe-alt" class="w-3.5 h-3.5" />
                  {{ website.url.replace(/^https?:\/\//, '') }}
                </a>
                <span v-else class="text-neutral-400 text-[11px] italic font-normal">No URL</span>
                
                <span class="text-neutral-300 dark:text-neutral-700">·</span>
                <button class="text-neutral-400 hover:text-primary-500 transition-all cursor-pointer p-0.5">
                  <UIcon name="i-heroicons-clipboard-document" class="w-3 h-3" />
                </button>
              </div>
            </div>
            <div :class="[
              'px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase flex items-center gap-2 border transition-all duration-300',
              getStatusClasses(website.status)
            ]">
              <div v-if="website.status === 'Online'" class="w-1.5 h-1.5 rounded-full bg-current pulse-neon shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
              <div v-else-if="website.status === 'Offline'" class="w-1.5 h-1.5 rounded-full bg-current opacity-70"></div>
              <div v-else-if="website.status === 'Pending'" class="w-1.5 h-1.5 rounded-full bg-neutral-400 shadow-[0_0_4px_rgba(163,163,163,0.5)]"></div>
              <div v-else class="w-1.5 h-1.5 rounded-full bg-current pulse-neon shadow-[0_0_8px_rgba(234,179,8,0.5)]"></div>
              {{ website.status }}
            </div>
          </div>

          <!-- Monitoring Badges Section -->
          <div v-if="(website.configurations?.length || website.checks?.length)" class="flex flex-wrap gap-1.5 mb-6 min-h-[22px]">
            <UBadge 
              v-for="config in (website.configurations || website.checks)" 
              :key="config.id"
              size="sm"
              variant="subtle"
              :color="getBadgeColor(config.check_type?.slug || config.type?.slug)"
              class="font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md"
            >
              {{ config.check_type?.name || config.type?.name }}
            </UBadge>
          </div>


          <!-- Stats Grid -->
          <div class="grid grid-cols-2 gap-4 py-4 border-y border-neutral-100 dark:border-white/5 mb-4">
            <div class="flex flex-col gap-1 border-r border-neutral-100 dark:border-white/5">
              <span class="text-[10px] uppercase text-neutral-400 font-bold tracking-widest flex items-center gap-1">
                <UIcon name="i-heroicons-bolt" class="w-3 h-3" />
                {{ t('dashboard.response_time') }}
              </span>
              <div class="text-xl font-semibold tabular-nums flex items-end gap-1" :class="getResponseTimeColor(website.responseTime)">
                {{ website.responseTime }}<span class="text-[10px] font-semibold opacity-50 mb-0.5">ms</span>
              </div>
            </div>
            <div class="flex flex-col gap-1 pl-4">
              <span class="text-[10px] uppercase text-neutral-400 font-bold tracking-widest flex items-center gap-1">
                <UIcon name="i-heroicons-chart-bar-square" class="w-3 h-3" />
                {{ t('dashboard.uptime_30d') }}
              </span>
              <div class="text-xl font-semibold text-neutral-900 dark:text-white tabular-nums flex items-end gap-0.5">
                {{ website.uptime }}<span class="text-[10px] font-semibold opacity-50 mb-0.5">%</span>
              </div>
            </div>
          </div>

          <div class="flex justify-between items-center sm:opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div class="text-neutral-400 text-[10px] font-bold">{{ $t('dashboard.checked') }}: {{ website.lastCheck }}</div>
            <div class="flex gap-1">
              <UButton icon="i-heroicons-chart-bar" variant="ghost" color="neutral" class="hover:bg-neutral-100 dark:hover:bg-white/5" square />
              <UButton 
                icon="i-heroicons-pencil" 
                variant="ghost" 
                color="neutral" 
                class="hover:bg-neutral-100 dark:hover:bg-white/5" 
                square 
                @click="openEditModal(website)"
              />
              <UButton 
                icon="i-heroicons-trash" 
                variant="ghost" 
                color="error" 
                class="hover:bg-red-500/10" 
                square 
                @click="confirmDelete(website)"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <UModal v-model:open="isDeleteModalOpen" :title="t('sites.confirm_delete')" :description="t('sites.delete_question')">
        <template #body>
          <div class="p-2">
            <p class="text-sm text-neutral-500">
              Сайт: <strong class="text-neutral-900 dark:text-white">{{ siteToDelete?.name }}</strong>
            </p>
          </div>
        </template>

        <template #footer>
          <div class="flex justify-end gap-3 w-full">
            <UButton color="neutral" variant="ghost" @click="isDeleteModalOpen = false">
              Cancel
            </UButton>
            <UButton color="error" :loading="isDeleting" @click="handleDelete">
              {{ $t('sites.table.delete') }}
            </UButton>
          </div>
        </template>
      </UModal>

      <!-- Site Form Modal -->
      <SiteFormModal v-model:open="isSiteModalOpen" :site-id="editingSiteId" :site-data="selectedSite" @success="loadSites" />

    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useI18n } from '#i18n';
import { useAuth, useRuntimeConfig } from '#imports';

const { t } = useI18n();
const config = useRuntimeConfig();
const { token } = useAuth();

// --- State ---
const websites = ref<any[]>([]);
const isDeleteModalOpen = ref(false);
const isDeleting = ref(false);
const siteToDelete = ref<any>(null);
const searchQuery = ref('');
const filterStatus = ref<any>(null); // Start with null carefully
const isSiteModalOpen = ref(false);
const editingSiteId = ref<number | null>(null);
const selectedSite = ref<any>(null);

// --- Computed ---
const statusOptions = [
  { label: 'All Statuses', value: '' },
  { label: 'Online Only', value: 'Online' },
  { label: 'Offline Only', value: 'Offline' },
  { label: 'Warning Only', value: 'Warning' },
];

const summaryStats = computed(() => [
  { label: t('dashboard.total_nodes'), value: websites.value.length, icon: 'i-heroicons-server-stack' },
  { label: t('dashboard.active_nodes'), value: websites.value.filter(s => s.status === 'Online').length, icon: 'i-heroicons-check-circle' },
  { label: t('dashboard.issues_detected'), value: websites.value.filter(s => s.status !== 'Online').length, icon: 'i-heroicons-exclamation-triangle' },
]);

const filteredWebsites = computed(() => {
  if (!websites.value) return [];
  
  return websites.value.filter(site => {
    const name = (site.name || '').toLowerCase();
    const url = (site.url || '').toLowerCase();
    const query = (searchQuery.value || '').toLowerCase();
    
    const matchesSearch = name.includes(query) || url.includes(query);
    
    // Status filter: extract value from either string or object
    const rawFilterValue = typeof filterStatus.value === 'object' ? filterStatus.value?.value : filterStatus.value;
    const selectedStatus = (rawFilterValue || '').toLowerCase();
    const siteStatus = (site.status || 'offline').toLowerCase();
    
    const matchesStatus = selectedStatus === '' || siteStatus === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });
});

const isLoading = ref(true);
const fetchError = ref<string | null>(null);

// --- Async Logic ---
async function loadSites() {
  if (!token.value) {
    console.log('Dashboard: waiting for token...');
    return;
  }
  
  isLoading.value = true;
  fetchError.value = null;
  try {
    const data = await $fetch<any>(`${config.public.apiBase}/api/sites`, {
      params: {
        'with[]': ['configurations', 'checks', 'configurations.checkType', 'checks.checkType']
      },
      headers: {
        'Accept': 'application/json',
        'X-Frontend-Key': config.public.frontendKey as string,
        'Authorization': `Bearer ${token.value}`
      }
    });
    
    console.log('Dashboard data received:', data);
    const dataArray = Array.isArray(data) ? data : (data?.data || []);
    
    websites.value = dataArray.map((site: any) => {
      // Determine real status from API data
      let status = 'Offline';
      const configs = site.configurations || site.checks || [];
      
      // Check if any of the monitoring methods has actually run
      const hasAnyCheckResult = configs.some((c: any) => c.last_checked_at || c.last_status);
      
      if (site.is_active) {
        if (!hasAnyCheckResult) {
          status = 'Pending';
        } else {
          status = 'Online';
          // Check if any configuration has a warning
          if (configs.some((c: any) => c.last_status === 'Warning')) {
            status = 'Warning';
          }
        }
      }
      
      return {
        ...site,
        id: site.id,
        name: site.name,
        url: site.url,
        status: status,
        lastCheck: site.last_checked_at || site.last_check || 'Never',
        responseTime: site.responseTime || site.response_time || 0,
        uptime: site.uptime || 0
      };
    });
  } catch (err: any) {
    console.error('Dashboard fetch error:', err);
    fetchError.value = err.message || 'Failed to load sites';
  } finally {
    isLoading.value = false;
  }
}

// Watch token to load data when it becomes available
watch(token, (newToken) => {
  if (newToken && websites.value.length === 0) {
    loadSites();
  }
}, { immediate: true });

onMounted(() => {
  if (token.value) {
    loadSites();
  }
});
// Refresh after action
function handleRefresh() {
  loadSites();
}

function openAddModal() {
  editingSiteId.value = null;
  selectedSite.value = null;
  isSiteModalOpen.value = true;
}

function openEditModal(site: any) {
  editingSiteId.value = site.id;
  selectedSite.value = site;
  isSiteModalOpen.value = true;
}

function confirmDelete(site: any) {
  siteToDelete.value = site;
  isDeleteModalOpen.value = true;
}

async function handleDelete() {
  if (!siteToDelete.value) return;
  
  isDeleting.value = true;
  try {
    await $fetch(`${config.public.apiBase}/api/sites/${siteToDelete.value.id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'X-Frontend-Key': config.public.frontendKey as string,
        'Authorization': `Bearer ${token.value}`
      }
    });
    
    await loadSites();
    isDeleteModalOpen.value = false;
  } catch (error) {
    console.error('Failed to delete site:', error);
  } finally {
    isDeleting.value = false;
    siteToDelete.value = null;
  }
}

function getStatusClasses(status: string) {
  switch (status) {
    case 'Online': return 'bg-green-500/5 text-green-600 dark:text-green-400 border-green-500/10';
    case 'Offline': return 'bg-red-500/5 text-red-600 dark:text-red-500 border-red-500/10';
    case 'Warning': return 'bg-yellow-500/5 text-yellow-600 dark:text-yellow-500 border-yellow-500/10';
    case 'Pending': return 'bg-neutral-500/5 text-neutral-500 dark:text-neutral-400 border-neutral-500/10';
    default: return 'bg-neutral-500/5 text-neutral-500 border-neutral-500/10';
  }
}

function getResponseTimeColor(time: number) {
  if (time === 0) return 'text-neutral-400';
  if (time > 500) return 'text-red-500';
  if (time > 200) return 'text-yellow-500';
  return 'text-green-600 dark:text-green-400';
}

function getBadgeColor(slug: string) {
  switch (slug) {
    case 'ping': return 'success';
    case 'http_status': return 'primary';
    case 'keyword_search': return 'secondary';
    case 'ssl_check': return 'info';
    default: return 'neutral';
  }
}

definePageMeta({
  middleware: 'auth'
});
</script>

