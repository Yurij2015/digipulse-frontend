<template>
  <div class="flex flex-col lg:flex-row min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white transition-colors duration-500 mesh-bg">
    <AppSidebar />

    <!-- Main Content -->
    <main class="flex-1 p-6 lg:p-12 overflow-y-auto lg:ml-72 h-screen">
      <header class="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
        <div>
          <h1 class="text-4xl font-black text-neutral-900 dark:text-white mb-3">{{ t('sites.title') }}</h1>
          <p class="text-neutral-500 font-medium">{{ t('sites.subtitle') }}</p>
        </div>
        <UButton size="xl" icon="i-heroicons-plus-circle" class="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold px-8 rounded-xl hover:scale-105 transition-transform cursor-pointer" @click="openAddModal">
          {{ t('sites.add_node') }}
        </UButton>
      </header>

      <!-- Management Table -->
      <div class="glass-card rounded-2xl border-neutral-200/50 dark:border-white/5 overflow-hidden">
        <div class="p-6 border-b border-neutral-100 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <UInput 
            v-model="search" 
            icon="i-heroicons-magnifying-glass" 
            :placeholder="t('dashboard.filter_placeholder')" 
            class="w-full md:w-96"
            size="md"
            :ui="{ base: 'bg-neutral-50 dark:bg-white/2 border-0 ring-1 ring-neutral-200 dark:ring-white/10 focus:ring-primary-500' }"
          />
        </div>

        <UTable :data="filteredRows" :columns="columns" class="w-full">
          <!-- Name Column -->
          <template #name-cell="{ row }">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-500">
                <UIcon name="i-heroicons-globe-alt" />
              </div>
              <span class="font-bold text-neutral-900 dark:text-white">{{ row.original.name }}</span>
            </div>
          </template>

          <!-- URL Column -->
          <template #url-cell="{ row }">
            <a :href="row.original.url" target="_blank" class="text-neutral-500 dark:text-neutral-400 hover:text-primary-500 transition-colors flex items-center gap-1 text-sm font-medium cursor-pointer">
              {{ row.original.url }} <UIcon name="i-heroicons-arrow-top-right-on-square" class="text-xs" />
            </a>
          </template>

          <!-- Server & Security Column -->
          <template #server-cell="{ row }">
            <div class="flex flex-col gap-1 py-1">
              <!-- Server Info -->
              <div v-if="row.original.server_info" class="flex items-center gap-1.5 text-[10px] font-medium text-neutral-500 dark:text-neutral-400">
                <UIcon name="i-heroicons-server" class="text-[10px]" />
                <span class="font-mono">{{ row.original.server_info.ip }}</span>
                <span v-if="row.original.server_info.country_code" class="flex items-center gap-1">
                  <span class="text-neutral-300 dark:text-white/10">•</span>
                  <span>{{ row.original.server_info.country_code }}</span>
                </span>
                <span v-if="row.original.server_info.isp" class="flex items-center gap-1">
                  <span class="text-neutral-300 dark:text-white/10">•</span>
                  <span class="truncate max-w-20">{{ row.original.server_info.isp }}</span>
                </span>
              </div>
              
              <!-- SSL Info -->
              <div v-if="row.original.ssl_info" class="flex items-center gap-1.5 text-[10px] font-bold">
                <UIcon 
                  :name="row.original.ssl_info.days_remaining < 7 ? 'i-heroicons-exclamation-triangle' : 'i-heroicons-shield-check'" 
                  :class="row.original.ssl_info.days_remaining < 7 ? 'text-error-500' : 'text-emerald-500'" 
                />
                <span :class="row.original.ssl_info.days_remaining < 7 ? 'text-error-500' : 'text-emerald-500'">
                  SSL: {{ row.original.ssl_info.days_remaining }} days
                </span>
              </div>

              <!-- Ping Info -->
              <div v-if="row.original.ping_info" class="flex items-center gap-1.5 text-[10px] font-medium text-neutral-500 dark:text-neutral-400">
                <UIcon name="i-heroicons-signal" class="text-[10px]" />
                <span>{{ t('dashboard.ping') }}: <span class="font-bold text-neutral-700 dark:text-neutral-300">{{ row.original.ping_info.latency }}ms</span></span>
              </div>

              <div v-if="!row.original.server_info && !row.original.ssl_info && !row.original.ping_info" class="text-[10px] text-neutral-400 font-medium italic">
                Pending check...
              </div>
            </div>
          </template>

          <!-- Status Column -->
          <template #status-cell="{ row }">
            <div :class="[
              'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase border',
              getStatusClasses(row.original.status || 'Offline')
            ]">
              <div class="w-1 h-1 rounded-full bg-current" :class="{ 'pulse-neon': row.original.status === 'Online' }"></div>
              {{ row.original.status || 'Offline' }}
            </div>
          </template>

          <!-- Monitoring Column -->
          <template #monitoring-cell="{ row }">
            <div class="flex flex-col gap-1.5 items-start py-1">
              <template v-if="(row.original.configurations?.length || row.original.checks?.length)">
                <UBadge 
                  v-for="config in (row.original.configurations || row.original.checks)" 
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
              </template>
              <span v-else class="text-[10px] text-neutral-400 font-medium italic">None</span>
            </div>
          </template>

          <!-- Actions Column -->
          <template #actions-cell="{ row }">
            <div class="flex items-center gap-2">
              <UButton icon="i-heroicons-chart-bar" variant="ghost" color="primary" size="sm" :to="localePath(`/sites/${row.original.id}/history`)" class="cursor-pointer" />
              <UButton icon="i-heroicons-pencil" variant="ghost" color="neutral" size="sm" @click="openEditModal(row.original)" class="cursor-pointer" />
              <UButton icon="i-heroicons-trash" variant="ghost" color="error" size="sm" @click="confirmDelete(row.original)" class="cursor-pointer" />
            </div>
          </template>
          <template #actions-data="{ row }">
            <div class="flex items-center gap-2">
              <UButton icon="i-heroicons-chart-bar" variant="ghost" color="primary" size="sm" :to="localePath(`/sites/${row.original.id}/history`)" class="cursor-pointer" />
              <UButton icon="i-heroicons-pencil" variant="ghost" color="neutral" size="sm" @click="openEditModal(row.original)" class="cursor-pointer" />
              <UButton icon="i-heroicons-trash" variant="ghost" color="error" size="sm" @click="confirmDelete(row.original)" class="cursor-pointer" />
            </div>
          </template>
        </UTable>

        <!-- Empty State -->
        <div v-if="filteredRows.length === 0" class="p-20 text-center">
          <div class="w-20 h-20 rounded-3xl bg-neutral-50 dark:bg-white/2 flex items-center justify-center text-neutral-300 dark:text-neutral-700 mx-auto mb-6">
            <UIcon name="i-heroicons-circle-stack" class="text-4xl" />
          </div>
          <h3 class="text-xl font-black text-neutral-900 dark:text-white mb-2">No nodes found</h3>
          <p class="text-neutral-500 max-w-xs mx-auto">Get started by adding your first infrastructure resource.</p>
        </div>
      </div>
    </main>

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
          <UButton color="neutral" variant="ghost" @click="isDeleteModalOpen = false" class="cursor-pointer">
            Cancel
          </UButton>
          <UButton color="error" :loading="isDeleting" @click="handleDelete" class="cursor-pointer">
            {{ t('sites.table.delete') }}
          </UButton>
        </div>
      </template>
    </UModal>

    <!-- Site Form Modal -->
    <SiteFormModal v-model:open="isSiteModalOpen" :site-id="editingSiteId" :site-data="selectedSite" @success="refreshSites" />

  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useI18n, useLocalePath } from '#i18n';
import { useAuth, useRuntimeConfig } from '#imports';
import { useSitesStore } from '~/stores/sites';

const { t } = useI18n();
const localePath = useLocalePath();
const config = useRuntimeConfig();
const { token } = useAuth();
const sitesStore = useSitesStore();

// --- State ---
const search = ref('');
const sites = computed(() => sitesStore.sites || []);
const isLoading = computed(() => sitesStore.loading);
const isDeleteModalOpen = ref(false);
const isDeleting = ref(false);
const siteToDelete = ref<any>(null);
const isSiteModalOpen = ref(false);
const editingSiteId = ref<number | null>(null);
const selectedSite = ref<any>(null);

const columns = computed(() => [
  { accessorKey: 'name', header: t('sites.table.name') },
  { accessorKey: 'url', header: t('sites.table.url') },
  { accessorKey: 'server', header: 'Infrastructure' },
  { accessorKey: 'status', header: t('sites.table.status') },
  { accessorKey: 'monitoring', header: 'Monitors' },
  { id: 'actions', header: t('sites.table.actions') }
]);

const filteredRows = computed(() => {
  if (!search.value) return sites.value;
  return sites.value.filter((site) => {
    return site.name.toLowerCase().includes(search.value.toLowerCase()) || 
           site.url.toLowerCase().includes(search.value.toLowerCase());
  });
});

// Initial load
onMounted(async () => {
    if (token.value) {
        await sitesStore.fetchSites();
    }
});

// Refresh function
const refreshSites = async () => {
    await sitesStore.fetchSites(true);
};


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
    case 'Pending': return 'bg-neutral-500/5 text-neutral-500 dark:text-neutral-400 border-neutral-500/10';
    default: return 'bg-neutral-500/5 text-neutral-500 border-neutral-500/10';
  }
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

definePageMeta({
  middleware: 'auth'
});
</script>


