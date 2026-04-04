<template>
  <div class="flex flex-col lg:flex-row min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white transition-colors duration-500">
    <!-- Mobile Header -->
    <header class="lg:hidden flex items-center justify-between p-4 border-b border-neutral-200 dark:border-white/10 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md sticky top-0 z-50">
      <div class="text-xl font-black bg-pulse-gradient bg-clip-text text-transparent">DigiPulse</div>
      <div class="flex items-center gap-2">
        <ThemeSwitcher />
        <UButton icon="i-heroicons-bars-3" variant="ghost" color="neutral" @click="isSidebarOpen = !isSidebarOpen" />
      </div>
    </header>

    <!-- Sidebar Overlay for Mobile -->
    <div v-if="isSidebarOpen" class="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm z-51 lg:hidden" @click="isSidebarOpen = false"></div>

    <!-- Sidebar -->
    <aside :class="[
      'fixed inset-y-0 left-0 z-52 w-72 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-white/10 p-6 transition-transform lg:relative lg:translate-x-0',
      isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
    ]">
      <div class="flex items-center justify-between mb-10">
        <div class="text-3xl font-black bg-pulse-gradient bg-clip-text text-transparent tracking-tighter">DigiPulse</div>
        <UButton class="lg:hidden" icon="i-heroicons-x-mark" variant="ghost" color="neutral" @click="isSidebarOpen = false" />
      </div>

      <nav class="space-y-2">
        <UButton
          v-for="link in links" :key="link.to"
          :to="link.to"
          :variant="route.path === link.to ? 'solid' : 'ghost'"
          :color="route.path === link.to ? 'primary' : 'neutral'"
          class="w-full justify-start gap-4 font-semibold py-3 transition-all"
          :class="route.path === link.to ? 'bg-pulse-gradient shadow-lg shadow-primary-500/10' : 'hover:bg-white/5'"
        >
          <UIcon :name="link.icon" class="text-xl" />
          {{ link.label }}
        </UButton>
      </nav>

      <div class="mt-auto pt-6 border-t border-white/5 px-2">
        <UButton 
          icon="i-heroicons-arrow-left-on-rectangle" 
          color="neutral" 
          variant="ghost" 
          label="Вийти з системи" 
          block 
          class="justify-start gap-4 text-neutral-500 hover:text-red-500 transition-colors font-semibold py-3" 
        />
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-4 lg:p-10 transition-all duration-500">
      <header class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 class="text-4xl font-black text-neutral-900 dark:text-white mb-2 leading-none">Оперативний стан</h1>
          <p class="text-neutral-500 font-medium">Контроль ресурсів у реальному часі</p>
        </div>
        <UButton size="xl" icon="i-heroicons-plus-circle" class="bg-pulse-gradient shadow-xl shadow-primary-500/20 font-bold px-8 hover:scale-105 transition-transform" to="/add-website">
          Моніторити сайт
        </UButton>
      </header>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        <div v-for="stat in summaryStats" :key="stat.label" class="glass-card p-6 rounded-4xl relative overflow-hidden group hover:scale-[1.02] transition-all">
          <div :class="`absolute top-0 right-0 w-32 h-32 blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity bg-primary-500`"></div>
          <div class="text-neutral-500 dark:text-neutral-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{{ stat.label }}</div>
          <div class="text-5xl font-black text-neutral-900 dark:text-white pr-4">{{ stat.value }}</div>
        </div>
      </div>

      <div class="flex flex-col md:flex-row gap-4 mb-10 items-stretch">
        <UInput 
          v-model="searchQuery" 
          placeholder="Пошук ваших сайтів..." 
          icon="i-heroicons-magnifying-glass" 
          size="xl" 
          class="flex-1 neon-input" 
          :ui="{ base: 'rounded-2xl border-0 ring-0 bg-transparent' }" 
        />
        <USelect 
          v-model="filterStatus" 
          :options="statusOptions" 
          size="xl" 
          class="w-full md:w-64 neon-input" 
          :ui="{ base: 'rounded-2xl border-0 ring-0 bg-transparent' }" 
        />
      </div>

      <!-- Websites Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <div v-for="website in filteredWebsites" :key="website.id" class="glass-card rounded-[2.5rem] p-8 hover:translate-y-[-8px] transition-all duration-500 group border-white/5">
          <div class="flex justify-between items-start mb-8">
            <div class="flex flex-col gap-1 max-w-[70%]">
              <h3 class="text-2xl font-black text-neutral-900 dark:text-white group-hover:text-pink-500 transition-colors truncate">{{ website.name }}</h3>
              <a :href="website.url" target="_blank" class="text-neutral-500 text-xs hover:text-white transition-colors flex items-center gap-1">
                {{ website.url }} <UIcon name="i-heroicons-arrow-top-right-on-square" size="xs" />
              </a>
            </div>
            <div :class="[
              'px-4 py-1.5 rounded-full text-[10px] font-black uppercase flex items-center gap-2 border',
              getStatusClasses(website.status)
            ]">
              <div v-if="website.status === 'Онлайн'" class="w-2 h-2 rounded-full bg-current animate-pulse"></div>
              {{ website.status }}
            </div>
          </div>

          <div class="grid grid-cols-2 gap-8 mb-8 py-6 border-y border-white/5">
            <div>
              <div class="text-[9px] uppercase text-neutral-600 font-black tracking-widest mb-2">Response Time</div>
              <div class="text-2xl font-black flex items-center gap-1.5" :class="getResponseTimeColor(website.responseTime)">
                <UIcon name="i-heroicons-bolt-solid" />
                {{ website.responseTime }}<span class="text-xs font-medium opacity-50">ms</span>
              </div>
            </div>
            <div>
              <div class="text-[9px] uppercase text-neutral-600 font-black tracking-widest mb-2">Uptime 30d</div>
              <div class="text-2xl font-black text-neutral-100">{{ website.uptime }}<span class="text-xs font-medium opacity-50">%</span></div>
            </div>
          </div>

          <div class="flex justify-between items-center sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div class="text-neutral-600 text-[10px] font-bold">Checked: {{ website.lastCheck }}</div>
            <div class="flex gap-2">
              <UButton icon="i-heroicons-chart-bar" variant="ghost" color="neutral" class="hover:bg-white/10" square />
              <UButton icon="i-heroicons-pencil" variant="ghost" color="neutral" class="hover:bg-white/10" square />
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
import { useRoute, navigateTo } from '#imports';
const route = useRoute();
const isSidebarOpen = ref(false);

const links = [
  { label: 'Дашборд', icon: 'i-heroicons-home', to: '/dashboard' },
  { label: 'Додати сайт', icon: 'i-heroicons-plus-circle', to: '/add-website' },
  { label: 'Налаштування', icon: 'i-heroicons-cog-6-tooth', to: '/settings' }
];

const websites = ref([
  { id: 1, name: 'Google Cloud', url: 'https://google.com', status: 'Онлайн', lastCheck: '2m ago', responseTime: 82, uptime: 99.99 },
  { id: 2, name: 'Facebook App', url: 'https://facebook.com', status: 'Онлайн', lastCheck: '5m ago', responseTime: 145, uptime: 99.95 },
  { id: 3, name: 'Main API', url: 'https://api.example.com', status: 'Офлайн', lastCheck: '1m ago', responseTime: 0, uptime: 98.50 },
  { id: 4, name: 'Slow DB Store', url: 'https://db.example.com', status: 'Попередження', lastCheck: '10m ago', responseTime: 820, uptime: 99.10 },
  { id: 5, name: 'Corporate Blog', url: 'https://blog.com', status: 'Онлайн', lastCheck: '3m ago', responseTime: 112, uptime: 99.98 },
]);

const searchQuery = ref('');
const filterStatus = ref('');

const statusOptions = [
  { label: 'Усі статуси', value: '' },
  { label: 'Тільки Онлайн', value: 'Онлайн' },
  { label: 'Тільки Офлайн', value: 'Офлайн' },
  { label: 'Тільки Попередження', value: 'Попередження' },
];

const summaryStats = computed(() => [
  { label: 'Всього сайтів', value: websites.value.length },
  { label: 'Активні вузли', value: websites.value.filter(s => s.status === 'Онлайн').length },
  { label: 'Потребують уваги', value: websites.value.filter(s => s.status !== 'Онлайн').length },
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
    case 'Онлайн': return 'bg-green-500/5 text-green-400 border-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.1)]';
    case 'Офлайн': return 'bg-red-500/5 text-red-500 border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)]';
    case 'Попередження': return 'bg-yellow-500/5 text-yellow-500 border-yellow-500/20 shadow-[0_0_20px_rgba(234,179,8,0.1)]';
    default: return 'bg-neutral-500/5 text-neutral-400 border-neutral-500/20';
  }
}

function getResponseTimeColor(time: number) {
  if (time === 0) return 'text-neutral-600';
  if (time > 500) return 'text-red-500';
  if (time > 200) return 'text-yellow-500';
  return 'text-green-400';
}
</script>
