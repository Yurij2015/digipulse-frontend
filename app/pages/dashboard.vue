<template>
  <div class="flex flex-col lg:flex-row min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white mesh-bg">
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
      <BaseLoader :show="isDeleting" />
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="website in filteredWebsites" 
          :key="website.id" 
          class="group p-6 rounded-2xl bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/10 hover:border-primary-500/50 hover:shadow-xl transition-all duration-300 flex flex-col relative"
          :class="{ 'opacity-70 border-dashed border-neutral-300 dark:border-white/5 bg-neutral-50/50 dark:bg-neutral-900/10 grayscale-[0.3]': !(website.configurations?.length || website.checks?.length) }"
        >
          <div class="flex justify-between items-start mb-6">
            <div class="flex flex-col gap-1">
              <h3 class="text-lg font-semibold text-neutral-900 dark:text-white group-hover:text-primary-600 transition-colors truncate max-w-45">
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
                <button 
                  class="text-neutral-400 hover:text-primary-500 transition-all cursor-pointer p-0.5"
                  @click.stop="copyToClipboard(website.url)"
                >
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
          <div v-if="(website.configurations?.length || website.checks?.length)" class="flex flex-wrap gap-1.5 mb-6 min-h-5.5">
            <UBadge 
              v-for="config in (website.configurations || website.checks)" 
              :key="config.id"
              size="sm"
              variant="subtle"
              :class="[
                'font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md border inline-flex items-center',
                getBadgeClass(config.check_type?.slug || config.type?.slug)
              ]"
            >
              <UIcon 
                :name="getBadgeIcon(config.check_type?.slug || config.type?.slug)" 
                class="mr-1 text-[10px]"
              />
              {{ config.check_type?.name || config.type?.name }}
            </UBadge>
          </div>
          <div v-else class="mb-6 p-2 rounded-lg bg-amber-500/5 border border-amber-500/10 flex items-center gap-2">
            <UIcon name="i-heroicons-exclamation-triangle" class="text-amber-500 w-4 h-4 shrink-0" />
            <div class="text-[9px] font-bold text-amber-600/80 leading-tight">
              {{ t('sites.card_no_monitoring') }}
            </div>
          </div>

          <!-- Infrastructure Details -->
          <div v-if="website.server_info || website.ssl_info" class="mb-6 flex flex-col gap-2.5">
            <!-- Server Info -->
            <div v-if="website.server_info" class="flex items-center gap-2 text-[11px] font-medium text-neutral-500 dark:text-neutral-400 bg-neutral-50 dark:bg-white/2 p-2 rounded-xl border border-neutral-100 dark:border-white/5">
              <UIcon name="i-heroicons-server" class="w-3.5 h-3.5 text-neutral-400" />
              <span class="font-mono text-[10px]">{{ website.server_info.ip }}</span>
              <span v-if="website.server_info.country_code" class="flex items-center gap-2">
                <span class="opacity-30">|</span>
                <span>{{ website.server_info.country_code }}</span>
              </span>
              <span v-if="website.server_info.isp" class="flex items-center gap-2 overflow-hidden">
                <span class="opacity-30">|</span>
                <span class="truncate">{{ website.server_info.isp }}</span>
              </span>
            </div>
            
            <!-- SSL Info -->
            <div v-if="website.ssl_info" class="flex items-center gap-2 text-[11px] font-bold px-1">
              <UIcon 
                :name="website.ssl_info.days_remaining < 7 ? 'i-heroicons-exclamation-triangle' : 'i-heroicons-shield-check'" 
                :class="website.ssl_info.days_remaining < 7 ? 'text-red-500 animate-pulse' : 'text-emerald-500'" 
                class="w-4 h-4"
              />
              <span :class="website.ssl_info.days_remaining < 7 ? 'text-red-500' : 'text-emerald-500'">
                SSL: {{ website.ssl_info.days_remaining }} days remaining
              </span>
            </div>

            <!-- Ping Info -->
            <div v-if="website.ping_info" class="flex items-center gap-2 text-[11px] font-medium px-1">
              <UIcon name="i-heroicons-signal" class="w-3.5 h-3.5" :class="website.ping_info.status === 'up' ? 'text-emerald-500' : 'text-red-500'" />
              <span class="text-neutral-500 dark:text-neutral-400">
                {{ t('dashboard.ping') }}: 
                <span v-if="website.ping_info.status === 'up'" class="font-bold text-neutral-900 dark:text-white">{{ website.ping_info.latency }}ms</span>
                <span v-else class="font-bold text-red-500 uppercase text-[9px]">{{ t('dashboard.offline') }} / Timeout</span>
              </span>
            </div>
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

          <div class="flex justify-between items-center transition-all duration-300">
            <div class="text-neutral-400 text-[10px] font-bold">
              {{ $t('dashboard.checked') }}: {{ formatCheckTime(website.lastCheck) }}
            </div>
            <div class="flex gap-1">
              <UButton 
                icon="i-heroicons-chart-bar" 
                variant="ghost" 
                color="primary" 
                class="hover:bg-primary-500/10" 
                square 
                :to="localePath(`/sites/${website.id}/history`)"
              />
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

    <!-- Limit Reached Modal -->
    <SiteLimitModal v-model:open="isLimitModalOpen" />

    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useI18n, useLocalePath } from '#i18n';
import { useAuth, useRuntimeConfig } from '#imports';
import { useSitesStore } from '~/stores/sites';
import { formatDistanceToNow } from 'date-fns';
import { uk, pl, enUS } from 'date-fns/locale';

const { t, locale } = useI18n();
const toast = useToast();
const localePath = useLocalePath();
const config = useRuntimeConfig();
const { token, user } = useAuth();
const sitesStore = useSitesStore();

const websites = computed(() => sitesStore.sites);
const isLoading = computed(() => sitesStore.loading);
const fetchError = computed(() => sitesStore.error);

const searchQuery = ref('');
const filterStatus = ref('');
const isDeleteModalOpen = ref(false);
const isLimitModalOpen = ref(false);
const isDeleting = ref(false);
const siteToDelete = ref<any>(null);

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
  { label: t('dashboard.active_nodes'), value: websites.value.filter((s: any) => s.status === 'Online').length, icon: 'i-heroicons-check-circle' },
  { label: t('dashboard.issues_detected'), value: websites.value.filter((s: any) => s.status !== 'Online').length, icon: 'i-heroicons-exclamation-triangle' },
]);

const filteredWebsites = computed(() => {
  if (!websites.value) return [];
  
  return websites.value.filter(site => {
    const name = (site.name || '').toLowerCase();
    const url = (site.url || '').toLowerCase();
    const query = (searchQuery.value || '').toLowerCase();
    
    const matchesSearch = name.includes(query) || url.includes(query);
    
    // Status filter: extract value from either string or object
    const rawFilterValue = typeof filterStatus.value === 'object' ? (filterStatus.value as any)?.value : filterStatus.value;
    const selectedStatus = (rawFilterValue || '').toLowerCase();
    const siteStatus = ((site as any).status || 'offline').toLowerCase();
    
    const matchesStatus = selectedStatus === '' || siteStatus === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });
});

// --- Async Logic ---
async function loadSites() {
  await sitesStore.fetchSites();
}

// Watch token to load data when it becomes available
watch(token, (newToken) => {
  if (newToken && websites.value.length === 0) {
    sitesStore.fetchSites();
  }
}, { immediate: true });

onMounted(() => {
  if (token.value) {
    sitesStore.fetchSites();
  }
});
// Refresh after action
function handleRefresh() {
  loadSites();
}

function openAddModal() {
  if (!user.value?.is_admin && websites.value.length >= 3) {
    isLimitModalOpen.value = true;
    return;
  }
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
    
    await sitesStore.fetchSites(true);
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

function getBadgeIcon(slug: string) {
  if (!slug) return 'i-heroicons-question-mark-circle';
  const s = slug.toLowerCase();
  if (s.includes('ping')) return 'i-heroicons-signal';
  if (s.includes('http')) return 'i-heroicons-globe-alt';
  if (s.includes('ssl')) return 'i-heroicons-shield-check';
  if (s.includes('dns')) return 'i-heroicons-server';
  if (s.includes('port')) return 'i-heroicons-bolt';
  return 'i-heroicons-adjustments-horizontal';
}

function getBadgeClass(slug: string) {
  if (!slug) return 'bg-neutral-50 text-neutral-600 border-neutral-200';
  const s = slug.toLowerCase();
  if (s.includes('ping')) return 'bg-emerald-500/10! text-emerald-500! border-emerald-500/20!';
  if (s.includes('http')) return 'bg-blue-500/10! text-blue-500! border-blue-500/20!';
  if (s.includes('ssl')) return 'bg-amber-500/10! text-amber-500! border-amber-500/20!';
  if (s.includes('dns')) return 'bg-pink-500/10! text-pink-500! border-pink-500/20!';
  if (s.includes('port')) return 'bg-violet-500/10! text-violet-500! border-violet-500/20!';
  return 'bg-neutral-500/10! text-neutral-500! border-neutral-500/20!';
}

const locales = { uk, pl, en: enUS };

function formatCheckTime(dateStr: string) {
  if (!dateStr || dateStr === 'Never') return t('dashboard.never');
  
  try {
    const date = new Date(dateStr);
    return formatDistanceToNow(date, { 
      addSuffix: true, 
      locale: locales[locale.value as keyof typeof locales] || enUS 
    });
  } catch (e) {
    return dateStr;
  }
}

async function copyToClipboard(text: string) {
  if (!text) return;
  
  try {
    await navigator.clipboard.writeText(text);
    toast.add({
      title: t('dashboard.copied'),
      color: 'success',
      icon: 'i-heroicons-check-circle',
      description: text
    });
  } catch (err) {
    console.error('Failed to copy text: ', err);
  }
}

definePageMeta({
  middleware: 'auth'
});
</script>

