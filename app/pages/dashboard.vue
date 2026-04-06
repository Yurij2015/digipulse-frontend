<template>
  <div class="flex flex-col lg:flex-row min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white transition-colors duration-500 mesh-bg">
    <!-- Mobile Header -->
      <header class="lg:hidden flex items-center justify-between p-5 border-b border-neutral-200 dark:border-white/5 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md sticky top-0 z-50">
        <div class="text-xl font-black tracking-tight">DigiPulse</div>
        <div class="flex items-center gap-2">
          <ThemeSwitcher />
          <UButton icon="i-heroicons-bars-3" variant="ghost" color="neutral" @click="isSidebarOpen = !isSidebarOpen" />
        </div>
      </header>

    <!-- Sidebar Overlay for Mobile -->
    <div v-if="isSidebarOpen" class="fixed inset-0 bg-neutral-950/40 backdrop-blur-sm z-51 lg:hidden" @click="isSidebarOpen = false"></div>

    <!-- Sidebar -->
    <aside :class="[
      'fixed inset-y-0 left-0 z-52 w-72 h-screen bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-white/5 p-8 transition-transform lg:fixed lg:translate-x-0 flex flex-col',
      isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
    ]">
      <div class="flex items-center justify-between mb-12">
        <div class="text-2xl font-black tracking-tight">DigiPulse</div>
        <UButton class="lg:hidden" icon="i-heroicons-x-mark" variant="ghost" color="neutral" @click="isSidebarOpen = false" />
      </div>

      <nav class="space-y-1">
        <UButton
          v-for="link in links" :key="link.to"
          :to="link.to"
          :variant="route.path === link.to ? 'soft' : 'ghost'"
          :color="route.path === link.to ? 'primary' : 'neutral'"
          class="w-full justify-start gap-4 font-bold py-3 px-5 rounded-lg transition-all transform active:scale-95"
          :class="route.path === link.to ? 'shadow-sm bg-primary-100/10 dark:bg-primary-500/10 ring-1 ring-primary-500/20' : 'text-neutral-500'"
        >
          <UIcon :name="link.icon" class="text-xl" />
          <span class="text-[13px] tracking-tight">{{ link.label }}</span>
        </UButton>
      </nav>

      <div class="mt-auto pt-8 border-t border-neutral-100 dark:border-white/5 space-y-4">
        <!-- User Profile Block -->
        <NuxtLink :to="localePath('/settings')" class="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-white/5 transition-all group">
          <div class="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-500 font-black text-sm border border-primary-500/20 group-hover:scale-110 transition-transform">
            {{ userInitials }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="text-sm font-black text-neutral-900 dark:text-white truncate uppercase tracking-tight">
              {{ user?.name || 'User' }}
            </div>
            <div class="text-[11px] font-medium text-neutral-500 truncate">
              {{ user?.email }}
            </div>
          </div>
        </NuxtLink>

        <div class="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-neutral-50 dark:bg-white/5">
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>
        <UButton 
          icon="i-heroicons-arrow-left-on-rectangle" 
          color="neutral" 
          variant="ghost" 
          :label="t('dashboard.sign_out')" 
          block 
          @click="handleLogout"
          class="justify-start gap-3 text-neutral-500 font-bold py-2.5 hover:text-error" 
        />
      </div>
    </aside>

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
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
        <div v-for="stat in summaryStats" :key="stat.label" class="glass-card p-8 rounded-2xl border-neutral-200/50 dark:border-white/5 group hover:border-primary-500/30 transition-all cursor-default">
          <div class="flex items-center justify-between mb-4">
            <div class="text-neutral-500 dark:text-neutral-400 text-[10px] font-black uppercase tracking-widest">{{ stat.label }}</div>
            <UIcon :name="stat.icon" class="text-xl text-neutral-400 group-hover:text-primary-500 transition-colors" />
          </div>
          <div class="text-5xl font-black text-neutral-900 dark:text-white leading-none tracking-tighter">{{ stat.value }}</div>
        </div>
      </div>

      <div class="flex flex-col md:flex-row gap-6 mb-12 items-stretch">
        <UInput 
          v-model="searchQuery" 
          :placeholder="t('dashboard.filter_placeholder')" 
          icon="i-heroicons-magnifying-glass" 
          size="xl" 
          class="flex-1" 
          :ui="{ 
            base: 'py-3 ps-12! px-5 text-neutral-900 dark:text-white bg-transparent border-0 ring-0'
          }" 
        />
        <USelectMenu 
          v-model="filterStatus" 
          :options="statusOptions" 
          value-attribute="value"
          option-attribute="label"
          size="xl" 
          class="w-full md:w-64 premium-input" 
          icon="i-heroicons-funnel"
          :ui="{ 
            base: 'py-3 px-5 text-neutral-900 dark:text-white bg-transparent border-0 ring-0 appearance-none w-full text-left flex items-center justify-between'
          }" 
        />
      </div>

      <!-- Websites Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <div v-for="website in filteredWebsites" :key="website.id" class="glass-card rounded-2xl p-8 hover:translate-y-[-4px] group hover:border-primary-500/20 active:scale-[0.99] transition-all duration-300">
          <div class="flex justify-between items-start mb-10">
            <div class="flex flex-col gap-1.5 max-w-[70%]">
              <h3 class="text-2xl font-black text-neutral-900 dark:text-white truncate tracking-tight group-hover:text-primary-500 transition-colors">{{ website.name }}</h3>
              <div class="flex items-center gap-1.5">
                <a :href="website.url" target="_blank" class="text-neutral-500 text-[11px] font-medium hover:text-primary-500 transition-colors flex items-center gap-1">
                  {{ website.url.replace('https://', '') }} <UIcon name="i-heroicons-arrow-top-right-on-square" size="xs" />
                </a>
                <span class="text-neutral-300 dark:text-neutral-800">·</span>
                <button class="text-neutral-400 hover:text-primary-500 transition-colors cursor-pointer">
                  <UIcon name="i-heroicons-clipboard-document" size="xs" />
                </button>
              </div>
            </div>
            <div :class="[
              'px-4 py-1.5 rounded-full text-[10px] font-black uppercase flex items-center gap-2 border transition-all duration-500',
              getStatusClasses(website.status)
            ]">
              <div v-if="website.status === 'Online'" class="w-1.5 h-1.5 rounded-full bg-current pulse-neon shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
              <div v-else-if="website.status === 'Offline'" class="w-1.5 h-1.5 rounded-full bg-current opacity-70"></div>
              <div v-else class="w-1.5 h-1.5 rounded-full bg-current pulse-neon shadow-[0_0_8px_rgba(234,179,8,0.5)]"></div>
              {{ website.status }}
            </div>
          </div>

          <div class="grid grid-cols-2 gap-8 mb-10 py-8 border-y border-neutral-100 dark:border-white/5">
            <div>
              <div class="text-[9px] uppercase text-neutral-500 font-black tracking-widest mb-3">{{ t('dashboard.response_time') }}</div>
              <div class="text-2xl font-black flex items-center gap-1.5" :class="getResponseTimeColor(website.responseTime)">
                {{ website.responseTime }}<span class="text-xs font-medium opacity-50">ms</span>
              </div>
            </div>
            <div>
              <div class="text-[9px] uppercase text-neutral-500 font-black tracking-widest mb-3">{{ t('dashboard.uptime_30d') }}</div>
              <div class="text-2xl font-black text-neutral-900 dark:text-white">{{ website.uptime }}<span class="text-xs font-medium opacity-50">%</span></div>
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
      <SiteFormModal v-model:open="isSiteModalOpen" :site-id="editingSiteId" @success="refreshSites" />

    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useI18n, useLocalePath } from '#i18n';
import { useRoute, useRouter, useAuth, useRuntimeConfig, useNuxtApp } from '#imports';
const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const localePath = useLocalePath();
const config = useRuntimeConfig();
const { logout, token, user } = useAuth();

// --- State ---
const isSidebarOpen = ref(false);
const websites = ref<any[]>([]);
const isDeleteModalOpen = ref(false);
const isDeleting = ref(false);
const siteToDelete = ref<any>(null);
const searchQuery = ref('');
const filterStatus = ref('');
const isSiteModalOpen = ref(false);
const editingSiteId = ref<number | null>(null);

// --- Computed ---
const userInitials = computed(() => {
  if (!user.value) return '??';
  const u = user.value as any;
  if (!u.first_name || !u.last_name) return u.name?.substring(0, 2).toUpperCase() || '??';
  return (u.first_name[0] + u.last_name[0]).toUpperCase();
});

const links = computed(() => [
  { label: t('dashboard.title'), icon: 'i-heroicons-home', to: localePath('/dashboard') },
  { label: t('sites.title'), icon: 'i-heroicons-globe-alt', to: localePath('/sites') },
  { label: t('dashboard.monitor_node'), icon: 'i-heroicons-plus-circle', to: localePath('/add-website') },
  { label: t('dashboard.settings'), icon: 'i-heroicons-cog-6-tooth', to: localePath('/settings') }
]);

const statusOptions = computed(() => [
  { label: t('dashboard.all_statuses'), value: '' },
  { label: t('dashboard.online_only'), value: 'Online' },
  { label: t('dashboard.offline_only'), value: 'Offline' },
  { label: t('dashboard.warning_only'), value: 'Warning' },
]);

const summaryStats = computed(() => [
  { label: t('dashboard.total_nodes'), value: websites.value.length, icon: 'i-heroicons-server-stack' },
  { label: t('dashboard.active_nodes'), value: websites.value.filter(s => s.status === 'Online').length, icon: 'i-heroicons-check-circle' },
  { label: t('dashboard.issues_detected'), value: websites.value.filter(s => s.status !== 'Online').length, icon: 'i-heroicons-exclamation-triangle' },
]);

const filteredWebsites = computed(() => {
  return websites.value.filter(site => {
    const matchesSearch = site.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || site.url.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesStatus = filterStatus.value === '' || site.status === filterStatus.value;
    return matchesSearch && matchesStatus;
  });
});

// --- Async Logic ---
const { data: response, refresh: refreshSites } = await useAsyncData('dashboard-sites', async () => {
    if (!token.value) return null;
    return await $fetch<any>(`${config.public.apiBase}/api/sites`, {
      headers: {
        'Accept': 'application/json',
        'X-Frontend-Key': config.public.frontendKey as string,
        'Authorization': `Bearer ${token.value}`
      }
    });
}, {
    server: true,
    watch: [token]
});

watch(response, (newResponse) => {
    if (!newResponse) return;
    const dataArray = Array.isArray(newResponse) ? newResponse : (newResponse?.data || []);
    websites.value = dataArray.map((site: any) => ({
      id: site.id,
      name: site.name,
      url: site.url,
      status: site.status || 'Offline',
      lastCheck: site.last_check || 'Never',
      responseTime: site.response_time || 0,
      uptime: site.uptime || 0
    }));
}, { immediate: true });

async function fetchSites() {
  await refreshSites();
}

// --- Interaction Functions ---
async function handleLogout() {
  try {
    await $fetch(`${config.public.apiBase}/api/logout`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'X-Frontend-Key': config.public.frontendKey as string,
        'Authorization': `Bearer ${token.value}`
      }
    });
  } catch (error) {
    console.error('Logout API Error:', error);
  } finally {
    logout();
    router.push(localePath('/auth'));
  }
}

function openAddModal() {
  editingSiteId.value = null;
  isSiteModalOpen.value = true;
}

function openEditModal(site: any) {
  editingSiteId.value = site.id;
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
    
    await refreshSites();
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
    default: return 'bg-neutral-500/5 text-neutral-500 border-neutral-500/10';
  }
}

function getResponseTimeColor(time: number) {
  if (time === 0) return 'text-neutral-400';
  if (time > 500) return 'text-red-500';
  if (time > 200) return 'text-yellow-500';
  return 'text-green-600 dark:text-green-400';
}

onMounted(() => {
  fetchSites();
});

definePageMeta({
  middleware: 'auth'
});
</script>
