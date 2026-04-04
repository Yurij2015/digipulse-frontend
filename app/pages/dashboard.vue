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
          class="w-full justify-start gap-3 font-bold py-2.5 px-4 rounded-xl transition-all"
        >
          <UIcon :name="link.icon" class="text-lg" />
          {{ link.label }}
        </UButton>
      </nav>

      <div class="mt-auto pt-8 border-t border-neutral-100 dark:border-white/5">
        <div class="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-neutral-50 dark:bg-white/5">
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>
        <UButton 
          icon="i-heroicons-arrow-left-on-rectangle" 
          color="neutral" 
          variant="ghost" 
          :label="$t('dashboard.sign_out')" 
          block 
          class="justify-start gap-3 text-neutral-500 font-bold py-2.5 hover:text-red-500" 
        />
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-6 lg:p-12 overflow-y-auto lg:ml-72 h-screen">
      <header class="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
        <div>
          <h1 class="text-4xl font-black text-neutral-900 dark:text-white mb-3">{{ $t('dashboard.title') }}</h1>
          <p class="text-neutral-500 font-medium">{{ $t('dashboard.subtitle') }}</p>
        </div>
        <UButton size="xl" icon="i-heroicons-plus-circle" class="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold px-8 rounded-2xl hover:scale-105 transition-transform" :to="localePath('/add-website')">
          {{ $t('dashboard.monitor_node') }}
        </UButton>
      </header>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
        <div v-for="stat in summaryStats" :key="stat.label" class="glass-card p-8 rounded-3xl border-neutral-200/50 dark:border-white/5">
          <div class="text-neutral-500 dark:text-neutral-400 text-[10px] font-black uppercase tracking-wider mb-4">{{ stat.label }}</div>
          <div class="text-5xl font-black text-neutral-900 dark:text-white leading-none">{{ stat.value }}</div>
        </div>
      </div>

      <div class="flex flex-col md:flex-row gap-6 mb-12 items-stretch">
        <UInput 
          v-model="searchQuery" 
          :placeholder="$t('dashboard.filter_placeholder')" 
          icon="i-heroicons-magnifying-glass" 
          size="xl" 
          class="flex-1" 
          :ui="{ 
            root: 'premium-input flex-1',
            base: 'py-3 ps-12! px-5 text-neutral-900 dark:text-white bg-transparent border-0 ring-0'
          }" 
        />
        <USelect 
          v-model="filterStatus" 
          :options="statusOptions" 
          size="xl" 
          class="w-full md:w-64" 
          :ui="{ 
            root: 'premium-input w-full md:w-64',
            base: 'py-3 px-5 text-neutral-900 dark:text-white bg-transparent border-0 ring-0 appearance-none'
          }" 
        />
      </div>

      <!-- Websites Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <div v-for="website in filteredWebsites" :key="website.id" class="glass-card rounded-[2.5rem] p-8 hover:translate-y-[-4px] group">
          <div class="flex justify-between items-start mb-10">
            <div class="flex flex-col gap-1.5 max-w-[70%]">
              <h3 class="text-2xl font-black text-neutral-900 dark:text-white truncate">{{ website.name }}</h3>
              <a :href="website.url" target="_blank" class="text-neutral-500 text-xs hover:text-primary-500 transition-colors flex items-center gap-1">
                {{ website.url }} <UIcon name="i-heroicons-arrow-top-right-on-square" size="xs" />
              </a>
            </div>
            <div :class="[
              'px-4 py-1.5 rounded-full text-[10px] font-black uppercase flex items-center gap-2 border transition-colors',
              getStatusClasses(website.status)
            ]">
              <div v-if="website.status === 'Online'" class="w-1.5 h-1.5 rounded-full bg-current"></div>
              {{ website.status }}
            </div>
          </div>

          <div class="grid grid-cols-2 gap-8 mb-10 py-8 border-y border-neutral-100 dark:border-white/5">
            <div>
              <div class="text-[9px] uppercase text-neutral-500 font-black tracking-widest mb-3">{{ $t('dashboard.response_time') }}</div>
              <div class="text-2xl font-black flex items-center gap-1.5" :class="getResponseTimeColor(website.responseTime)">
                {{ website.responseTime }}<span class="text-xs font-medium opacity-50">ms</span>
              </div>
            </div>
            <div>
              <div class="text-[9px] uppercase text-neutral-500 font-black tracking-widest mb-3">{{ $t('dashboard.uptime_30d') }}</div>
              <div class="text-2xl font-black text-neutral-900 dark:text-white">{{ website.uptime }}<span class="text-xs font-medium opacity-50">%</span></div>
            </div>
          </div>

          <div class="flex justify-between items-center sm:opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div class="text-neutral-400 text-[10px] font-bold">{{ $t('dashboard.checked') }}: {{ website.lastCheck }}</div>
            <div class="flex gap-1">
              <UButton icon="i-heroicons-chart-bar" variant="ghost" color="neutral" class="hover:bg-neutral-100 dark:hover:bg-white/5" square />
              <UButton icon="i-heroicons-pencil" variant="ghost" color="neutral" class="hover:bg-neutral-100 dark:hover:bg-white/5" square />
              <UButton icon="i-heroicons-trash" variant="ghost" color="error" class="hover:bg-red-500/10" square />
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useI18n, useLocalePath } from '#imports';
const route = useRoute();
const { t } = useI18n();
const localePath = useLocalePath();
const isSidebarOpen = ref(false);

const links = computed(() => [
  { label: t('dashboard.title'), icon: 'i-heroicons-home', to: localePath('/dashboard') },
  { label: t('dashboard.monitor_node'), icon: 'i-heroicons-plus-circle', to: localePath('/add-website') },
  { label: t('dashboard.settings'), icon: 'i-heroicons-cog-6-tooth', to: localePath('/settings') }
]);

const websites = ref([
  { id: 1, name: 'Google Cloud', url: 'https://google.com', status: 'Online', lastCheck: '2m ago', responseTime: 82, uptime: 99.99 },
  { id: 2, name: 'Facebook App', url: 'https://facebook.com', status: 'Online', lastCheck: '5m ago', responseTime: 145, uptime: 99.95 },
  { id: 3, name: 'Main API', url: 'https://api.example.com', status: 'Offline', lastCheck: '1m ago', responseTime: 0, uptime: 98.50 },
  { id: 4, name: 'Slow DB Store', url: 'https://db.example.com', status: 'Warning', lastCheck: '10m ago', responseTime: 820, uptime: 99.10 },
  { id: 5, name: 'Corporate Blog', url: 'https://blog.com', status: 'Online', lastCheck: '3m ago', responseTime: 112, uptime: 99.98 },
]);

const searchQuery = ref('');
const filterStatus = ref('');

const statusOptions = computed(() => [
  { label: t('dashboard.all_statuses'), value: '' },
  { label: t('dashboard.online_only'), value: 'Online' },
  { label: t('dashboard.offline_only'), value: 'Offline' },
  { label: t('dashboard.warning_only'), value: 'Warning' },
]);

const summaryStats = computed(() => [
  { label: t('dashboard.total_nodes'), value: websites.value.length },
  { label: t('dashboard.active_nodes'), value: websites.value.filter(s => s.status === 'Online').length },
  { label: t('dashboard.issues_detected'), value: websites.value.filter(s => s.status !== 'Online').length },
]);

const filteredWebsites = computed(() => {
  return websites.value.filter(site => {
    const matchesSearch = site.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || site.url.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesStatus = filterStatus.value === '' || site.status === filterStatus.value;
    return matchesSearch && matchesStatus;
  });
});

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
</script>
