<template>
  <div class="flex flex-col lg:flex-row min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white transition-colors duration-500 mesh-bg">
    <AppSidebar />
    
    <main class="flex-1 p-6 lg:p-12 overflow-y-auto lg:ml-72 h-screen relative">
      <header class="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div class="flex items-center gap-4">
          <UButton :to="localePath('/sites')" variant="ghost" color="neutral" icon="i-heroicons-arrow-left" class="hover:bg-neutral-200 dark:hover:bg-white/5 font-bold p-3 cursor-pointer" />
          <div>
            <h1 class="text-4xl font-black tracking-tight"><span class="text-primary-500">{{ site?.name || 'Site' }}</span> History</h1>
            <p class="text-neutral-500 font-medium">Weekly monitoring performance and downtime incidents.</p>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <div class="flex items-center gap-3 bg-neutral-50 dark:bg-white/5 p-1 rounded-xl border border-neutral-200/50 dark:border-white/10 shadow-xs">
            <UButton icon="i-heroicons-chevron-left" variant="ghost" color="neutral" @click="prevWeek" class="cursor-pointer" />
            <div class="text-sm font-bold min-w-[160px] text-center flex flex-col">
              <span class="text-neutral-900 dark:text-white leading-tight">{{ weekLabel }}</span>
              <span class="text-[10px] text-neutral-500 font-medium uppercase tracking-widest">{{ weekParam }}</span>
            </div>
            <UButton icon="i-heroicons-chevron-right" variant="ghost" color="neutral" @click="nextWeek" :disabled="isCurrentWeek" class="cursor-pointer" />
          </div>
        </div>
      </header>
      
      <!-- Chart Area -->
      <div class="glass-card rounded-2xl border border-neutral-200/50 dark:border-white/10 p-4 md:p-6 mb-8 relative min-h-[500px] shadow-sm">
        <!-- Loading Skeleton -->
        <div v-if="pending" class="absolute inset-0 f                                                                                                                                                                                lex items-center justify-center bg-white/50 dark:bg-neutral-950/50 backdrop-blur-sm z-10 rounded-2xl">
          <div class="w-full max-w-md space-y-4 p-6">
            <div class="space-y-2">
              <div class="h-4 bg-neutral-200 dark:bg-neutral-800 rounded-full animate-pulse"></div>
              <div class="h-4 bg-neutral-200 dark:bg-neutral-800 rounded-full w-3/4 animate-pulse"></div>
            </div>
            <div class="grid grid-cols-7 gap-2">
              <div v-for="i in 7" :key="i" class="h-32 bg-neutral-200 dark:bg-neutral-800 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
        
        <div v-if="!hasData && !pending" class="flex flex-col items-center justify-center h-[400px]">
           <UIcon name="i-heroicons-chart-bar" class="text-5xl text-neutral-300 dark:text-neutral-700 mb-4" />
           <h3 class="text-xl font-black text-neutral-900 dark:text-white mb-2">No Data Available</h3>
           <p class="text-neutral-500 font-medium text-sm">There are no monitoring records for this week.</p>
        </div>
        
        <ClientOnly v-else-if="!pending">
            <div class="h-[500px] w-full relative">
                <LineChart :data="chartData" :options="chartOptions" />
            </div>
            <template #fallback>
               <div class="h-[500px] w-full flex items-center justify-center">
                 <UIcon name="i-heroicons-arrow-path" class="animate-spin text-4xl text-primary-500" />
               </div>
            </template>
        </ClientOnly>
      </div>


      
      <!-- Detailed History Tabs -->
      <div v-if="!pending" class="mt-12">
        <UTabs :items="tabs" class="w-full">
          <template #incidents>
            <div class="glass-card rounded-2xl border border-neutral-200/50 dark:border-white/10 overflow-hidden shadow-sm mt-4">
              <div class="bg-red-500/10 border-b border-red-500/20 p-4 flex items-center gap-2">
                <UIcon name="i-heroicons-exclamation-triangle" class="text-error text-xl" />
                <h3 class="text-lg font-black text-red-900 dark:text-red-400">{{ t('history.incidents.title') }}</h3>
                <UBadge color="error" variant="subtle" size="sm" class="ml-2 font-black rounded-lg">{{ incidents.length }}</UBadge>
              </div>
              
              <div v-if="incidents.length > 0" class="divide-y divide-neutral-100 dark:divide-white/5">
                <div v-for="inc in incidents" :key="inc.checked_at" class="flex items-start gap-4 p-4 lg:p-6 hover:bg-neutral-50 dark:hover:bg-white/2 transition-colors">
                  <div class="w-10 h-10 rounded-full bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                    <UIcon name="i-heroicons-x-mark" class="text-xl" />
                  </div>
                  <div class="flex-1">
                    <div class="font-bold text-neutral-900 dark:text-white text-lg mb-1">{{ formatDateTime(inc.checked_at) }}</div>
                    <div class="text-sm font-medium text-neutral-600 dark:text-neutral-400 font-mono bg-neutral-100 dark:bg-neutral-900 p-2 rounded-lg border border-neutral-200 dark:border-neutral-800">
                      {{ inc.error_message }}
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="p-12 text-center">
                <UIcon name="i-heroicons-check-circle" class="text-5xl text-emerald-500/30 mb-4" />
                <p class="text-neutral-500 font-medium">{{ t('history.incidents.no_incidents') }}</p>
              </div>
            </div>
          </template>

          <template #recent>
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-4">
              <div v-for="item in historyData?.latest_results" :key="item.config_id" class="glass-card rounded-2xl border border-neutral-200/50 dark:border-white/10 overflow-hidden shadow-sm h-full flex flex-col transition-all hover:shadow-md hover:border-primary-500/30">
                <div class="bg-neutral-50 dark:bg-white/5 border-b border-neutral-200/50 dark:border-white/10 p-4 flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <UIcon :name="getConfigIcon(item.type_slug)" class="text-primary-500 text-xl" />
                    <h3 class="font-black text-neutral-900 dark:text-white uppercase tracking-wider text-sm">{{ item.type_name }}</h3>
                  </div>
                  <UBadge :color="item.result.status === 'up' ? 'success' : 'error'" variant="subtle" size="sm" class="font-black rounded-lg uppercase text-[9px]">{{ item.result.status }}</UBadge>
                </div>
                
                <div class="p-4 flex-1 space-y-4">
                  <div class="flex items-center justify-between">
                    <span class="text-[11px] font-bold text-neutral-500">{{ formatDateTime(item.result.checked_at) }}</span>
                    <span class="text-sm font-black text-neutral-900 dark:text-white">{{ item.result.response_time_ms }}ms</span>
                  </div>

                  <!-- SSL Specific Info -->
                  <div v-if="item.type_slug === 'ssl' && item.result.status === 'up'" class="bg-primary-500/5 border border-primary-500/10 rounded-xl p-3 space-y-2">
                    <div class="flex items-center gap-2 mb-1">
                      <UIcon name="i-heroicons-shield-check" class="text-primary-500" />
                      <span class="text-[10px] font-black uppercase text-primary-600 dark:text-primary-400">Certificate Details</span>
                    </div>
                    <div class="grid grid-cols-2 gap-2 text-[10px]">
                      <div>
                        <div class="text-neutral-400 uppercase font-bold text-[8px] mb-0.5">Issuer</div>
                        <div class="font-bold text-neutral-900 dark:text-white truncate">{{ item.result.metadata?.issuer || 'N/A' }}</div>
                      </div>
                      <div>
                        <div class="text-neutral-400 uppercase font-bold text-[8px] mb-0.5">Expires At</div>
                        <div class="font-bold text-neutral-900 dark:text-white">{{ item.result.metadata?.expires_at ? format(parseISO(item.result.metadata.expires_at), 'MMM d, yyyy') : 'N/A' }}</div>
                      </div>
                    </div>
                    <div class="mt-2 flex items-center justify-between">
                      <span class="text-[10px] font-bold text-neutral-500">Validity</span>
                      <UBadge :color="item.result.metadata?.days_remaining > 14 ? 'success' : 'warning'" variant="subtle" size="sm" class="font-black rounded-lg text-[9px]">
                        {{ item.result.metadata?.days_remaining }} days left
                      </UBadge>
                    </div>
                  </div>

                  <div v-if="item.result.status === 'down'" class="text-[10px] text-red-500 font-medium bg-red-50 dark:bg-red-500/10 p-2 rounded-lg border border-red-500/20">
                    {{ item.result.error_message }}
                  </div>

                  <!-- Server Metadata -->
                  <div v-if="item.result.metadata?.ip" class="pt-3 border-t border-neutral-100 dark:border-white/5 space-y-1.5">
                    <div class="flex items-center justify-between text-[10px]">
                      <div class="flex items-center gap-1.5 text-neutral-400 font-bold uppercase tracking-wider">
                        <UIcon name="i-heroicons-computer-desktop" class="w-3 h-3" />
                        IP
                      </div>
                      <span class="font-mono font-bold text-neutral-700 dark:text-neutral-300">{{ item.result.metadata.ip }}</span>
                    </div>
                    
                    <div v-if="item.result.metadata?.country" class="flex items-center justify-between text-[10px]">
                      <div class="flex items-center gap-1.5 text-neutral-400 font-bold uppercase tracking-wider">
                        <UIcon name="i-heroicons-map-pin" class="w-3 h-3" />
                        Location
                      </div>
                      <span class="font-bold text-neutral-700 dark:text-neutral-300">
                        {{ item.result.metadata.country }}{{ item.result.metadata.city ? `, ${item.result.metadata.city}` : '' }}
                      </span>
                    </div>

                    <div v-if="item.result.metadata?.isp" class="flex items-center justify-between text-[10px]">
                      <div class="flex items-center gap-1.5 text-neutral-400 font-bold uppercase tracking-wider">
                        <UIcon name="i-heroicons-building-office" class="w-3 h-3" />
                        Provider
                      </div>
                      <span class="font-bold text-neutral-700 dark:text-neutral-300 truncate max-w-[140px]" :title="item.result.metadata.isp">
                        {{ item.result.metadata.isp }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="!historyData?.latest_results?.length" class="p-12 text-center glass-card rounded-2xl border border-neutral-200/50 dark:border-white/10 mt-4">
               <p class="text-neutral-500">{{ t('history.recent.no_results') }}</p>
            </div>
          </template>
        </UTabs>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue';
import { useRoute, useRouter } from '#app';
import { useRuntimeConfig, useNuxtApp, useAuth } from '#imports';
import { useSitesStore } from '~/stores/sites';
import { useI18n, useLocalePath } from '#i18n';
import AppSidebar from '~/components/AppSidebar.vue';
import { subWeeks, addWeeks, getISOWeekYear, getISOWeek, startOfISOWeek, endOfISOWeek, format, parseISO, isSameWeek } from 'date-fns';
import { Line as LineChart } from 'vue-chartjs';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();
const { token } = useAuth();
const sitesStore = useSitesStore();
const localePath = useLocalePath();
const siteId = route.params.id;

// Initialize current date from URL query or default to today
const getWeekFromQuery = () => {
  const weekQuery = route.query.week as string;
  if (weekQuery && /^\d{4}-W\d{2}$/.test(weekQuery)) {
    const [year, week] = weekQuery.split('-W').map(Number);
    if (!isNaN(year) && !isNaN(week)) {
      const date = new Date(year, 0, 1 + (week - 1) * 7);
      // Adjust to Monday of that week
      const day = date.getDay();
      const diff = date.getDate() - day + (day === 0 ? -6 : 1);
      return new Date(date.setDate(diff));
    }
  }
  return new Date();
};

const currentDate = ref(getWeekFromQuery());

const isCurrentWeek = computed(() => isSameWeek(currentDate.value, new Date(), { weekStartsOn: 1 }));

const weekParam = computed(() => {
  const year = getISOWeekYear(currentDate.value);
  const week = String(getISOWeek(currentDate.value)).padStart(2, '0');
  return `${year}-W${week}`;
});

const weekLabel = computed(() => {
  const start = startOfISOWeek(currentDate.value);
  const end = endOfISOWeek(currentDate.value);
  return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
});

function prevWeek() { 
  currentDate.value = subWeeks(currentDate.value, 1);
  nextTick(() => {
    updateUrlQuery();
  });
}
function nextWeek() { 
  if (!isCurrentWeek.value) {
    currentDate.value = addWeeks(currentDate.value, 1);
    nextTick(() => {
      updateUrlQuery();
    });
  }
}

function updateUrlQuery() {
  const newWeek = weekParam.value;
  const query: any = { 
    ...route.query, 
    week: newWeek
  };
  
  router.push({
    path: route.path,
    query
  });
}

const { t } = useI18n();

const site = ref<any>(null);
const historyData = ref<{ stats: any[], incidents: any[], latest_results?: any[] } | null>(null);
const pending = ref(false);

const getConfigIcon = (slug: string) => {
  switch (slug) {
    case 'http': return 'i-heroicons-globe-alt';
    case 'ping': return 'i-heroicons-signal';
    case 'ssl': return 'i-heroicons-shield-check';
    case 'dns': return 'i-heroicons-server-stack';
    default: return 'i-heroicons-cpu-chip';
  }
};

const tabs = computed(() => [
  {
    label: t('history.tabs.incidents'),
    slot: 'incidents',
    icon: 'i-heroicons-exclamation-triangle'
  },
  {
    label: t('history.tabs.recent'),
    slot: 'recent',
    icon: 'i-heroicons-clock'
  }
]);

const fetchData = async () => {
    pending.value = true;
    try {
        const [siteRes, histRes] = await Promise.all([
          !site.value ? (sitesStore.sites.find((s: any) => String(s.id) === String(siteId)) ? Promise.resolve({ data: sitesStore.sites.find((s: any) => String(s.id) === String(siteId)) }) : $fetch<any>(`${config.public.apiBase}/api/sites/${siteId}`, {
             headers: { 'Accept': 'application/json', 'X-Frontend-Key': config.public.frontendKey as string, 'Authorization': `Bearer ${token.value}` }
          })) : Promise.resolve({ data: site.value }),
          $fetch<any>(`${config.public.apiBase}/api/sites/${siteId}/history`, {
             params: { 
               week: weekParam.value
             },
             headers: { 'Accept': 'application/json', 'X-Frontend-Key': config.public.frontendKey as string, 'Authorization': `Bearer ${token.value}` }
          }).catch(e => {
            console.error("History fetch error:", e);
            return null;
          })
       ]);
       site.value = siteRes.data || siteRes;
       const rawHist = histRes;
       
       // Handle multiple possible response shapes
       if (!rawHist) {
         historyData.value = { stats: [], incidents: [], latest_results: [] };
       } else if (rawHist.data?.stats) {
         historyData.value = rawHist.data;
       } else if (rawHist.stats) {
         historyData.value = rawHist;
       } else {
         historyData.value = { stats: [], incidents: [], latest_results: [] };
       }
    } catch(err) {
       console.error("Failed to fetch data:", err);
       historyData.value = { stats: [], incidents: [], latest_results: [] };
    } finally {
       pending.value = false;
    }
};

// Only fetch data on client side to avoid SSR cookie issues
onMounted(() => {
  fetchData();
});

watch(weekParam, fetchData);

// Watch for route changes to sync date
watch(() => route.query.week, (newWeek) => {
  if (newWeek && newWeek !== weekParam.value) {
    currentDate.value = getWeekFromQuery();
  }
}, { immediate: false });

const incidents = computed(() => historyData.value?.incidents || []);

const hasData = computed(() => {
  const stats = historyData.value?.stats || [];
  return stats.length > 0 && stats.some((s: any) => s.response_time !== null || s.uptime !== null);
});

const formatDateTime = (iso: string) => format(parseISO(iso), 'MMM d, yyyy HH:mm');

// Chart building
const chartData = computed(() => {
    if (!historyData.value || !historyData.value.stats || historyData.value.stats.length === 0) return { labels: [], datasets: [] };
    
    const stats = historyData.value.stats;
    const labels = stats.map((s: any) => format(parseISO(s.timestamp), 'EEE HH:mm'));
    
    const responseTimeData = stats.map((s: any) => s.response_time || null);
    const uptimeData = stats.map((s: any) => s.uptime !== null ? (s.uptime) : null);

    const incidentPoints = stats.map((s: any) => {
       const hourStart = parseISO(s.timestamp);
       const hourEnd = new Date(hourStart.getTime() + 3600000);
       const hasIncident = incidents.value.some((i: any) => parseISO(i.checked_at) >= hourStart && parseISO(i.checked_at) < hourEnd);
       return hasIncident ? 0 : null;
    });

    return {
       labels,
       datasets: [
          {
             label: 'Response Time (ms)',
             data: responseTimeData,
             borderColor: '#10b981', // emerald-500
             backgroundColor: 'rgba(16, 185, 129, 0.1)',
             yAxisID: 'y',
             tension: 0.3,
             borderWidth: 3,
             pointRadius: 0,
             pointHoverRadius: 6,
             pointHitRadius: 10,
             spanGaps: true
          },
          {
             label: 'Uptime (%)',
             data: uptimeData,
             borderColor: '#6366f1', // indigo-500
             backgroundColor: 'rgba(99, 102, 241, 0.15)',
             fill: true,
             yAxisID: 'y1',
             tension: 0.3,
             borderWidth: 2,
             pointRadius: 0,
             pointHoverRadius: 6,
             spanGaps: true
          },
          {
             label: 'Incidents',
             data: incidentPoints,
             borderColor: '#ef4444', // red-500
             backgroundColor: '#ef4444',
             pointRadius: incidentPoints.map(p => p !== null ? 6 : 0),
             pointHoverRadius: 10,
             showLine: false,
             yAxisID: 'y1'
          }
       ]
    };
});

const chartOptions = computed(() => {
    return {
       responsive: true,
       maintainAspectRatio: false,
       interaction: {
          mode: 'index' as const,
          intersect: false,
       },
       plugins: {
          legend: {
             position: 'top' as const,
             labels: {
                 color: '#737373', // neutral-500
                 usePointStyle: true,
                 padding: 20,
                 font: {
                    family: 'inherit',
                    weight: 'bold'
                 }
             }
          },
          tooltip: {
             backgroundColor: 'rgba(23, 23, 23, 0.95)', // neutral-900
             titleColor: '#fff',
             bodyColor: '#e5e5e5',
             borderColor: 'rgba(255,255,255,0.1)',
             borderWidth: 1,
             padding: 12,
             boxPadding: 6,
             callbacks: {
                footer: (tooltipItems: any) => {
                   if(incidents.value.length === 0) return '';
                   const idx = tooltipItems[0].dataIndex;
                   const timestamp = historyData.value?.stats[idx]?.timestamp;
                   if (timestamp) {
                      const hourStart = parseISO(timestamp);
                      const hourEnd = new Date(hourStart.getTime() + 3600000);
                      const currentIncidents = incidents.value.filter((i: any) => parseISO(i.checked_at) >= hourStart && parseISO(i.checked_at) < hourEnd);
                      if (currentIncidents.length > 0) {
                         return '\n⚠️ Incidents in this hour:\n' + currentIncidents.map((i: any) => `• ${i.error_message}`).join('\n');
                      }
                   }
                   return '';
                }
             }
          }
       },
       scales: {
          x: {
             grid: { color: 'rgba(115, 115, 115, 0.1)' }, // neutral-500/10
             ticks: { 
                 maxTicksLimit: 14,
                 color: '#737373',
                 font: { family: 'inherit' }
             }
          },
          y: {
             type: 'linear' as const,
             display: true,
             position: 'left' as const,
             title: { display: true, text: 'Response Time (ms)', color: '#a3a3a3', font: { weight: 'bold' } },
             grid: { color: 'rgba(115, 115, 115, 0.1)' },
             ticks: { color: '#a3a3a3' }
          },
          y1: {
             type: 'linear' as const,
             display: true,
             position: 'right' as const,
             title: { display: true, text: 'Uptime (%)', color: '#a3a3a3', font: { weight: 'bold' } },
             grid: { drawOnChartArea: false },
             min: 0,
             max: 100,
             ticks: { color: '#a3a3a3' }
          }
       }
    };
});

definePageMeta({
  middleware: 'auth'
});
</script>
