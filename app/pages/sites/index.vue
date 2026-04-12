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
        <UButton size="xl" icon="i-heroicons-plus-circle" class="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold px-8 rounded-xl hover:scale-105 transition-transform" @click="openAddModal">
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
            <a :href="row.original.url" target="_blank" class="text-neutral-500 dark:text-neutral-400 hover:text-primary-500 transition-colors flex items-center gap-1 text-sm font-medium">
              {{ row.original.url }} <UIcon name="i-heroicons-arrow-top-right-on-square" class="text-xs" />
            </a>
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
                  size="xs"
                  variant="subtle"
                  :color="getBadgeColor(config.check_type?.slug || config.type?.slug)"
                  class="font-black text-[9px] uppercase tracking-[0.05em] px-1.5 py-0.5 rounded-md inline-flex items-center"
                >
                  <UIcon v-if="(config.check_type?.slug || config.type?.slug) === 'ping'" name="i-heroicons-bolt" class="mr-1 text-[10px]" />
                  <UIcon v-else-if="(config.check_type?.slug || config.type?.slug) === 'http_status'" name="i-heroicons-globe-alt" class="mr-1 text-[10px]" />
                  <UIcon v-else-if="(config.check_type?.slug || config.type?.slug) === 'keyword_search'" name="i-heroicons-magnifying-glass" class="mr-1 text-[10px]" />
                  {{ config.check_type?.name || config.type?.name }}
                </UBadge>
              </template>
              <span v-else class="text-[10px] text-neutral-400 font-medium italic">None</span>
            </div>
          </template>

          <!-- Actions Column -->
          <template #actions-cell="{ row }">
            <div class="flex items-center gap-2">
              <UButton icon="i-heroicons-chart-bar" variant="ghost" color="primary" size="sm" :to="localePath(`/sites/${row.original.id}/history`)" />
              <UButton icon="i-heroicons-pencil" variant="ghost" color="neutral" size="sm" @click="openEditModal(row.original)" />
              <UButton icon="i-heroicons-trash" variant="ghost" color="error" size="sm" @click="confirmDelete(row.original)" />
            </div>
          </template>
          <template #actions-data="{ row }">
            <div class="flex items-center gap-2">
              <UButton icon="i-heroicons-chart-bar" variant="ghost" color="primary" size="sm" :to="localePath(`/sites/${row.original.id}/history`)" />
              <UButton icon="i-heroicons-pencil" variant="ghost" color="neutral" size="sm" @click="openEditModal(row.original)" />
              <UButton icon="i-heroicons-trash" variant="ghost" color="error" size="sm" @click="confirmDelete(row.original)" />
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
          <UButton color="neutral" variant="ghost" @click="isDeleteModalOpen = false">
            Cancel
          </UButton>
          <UButton color="error" :loading="isDeleting" @click="handleDelete">
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
import { ref, computed, watch } from 'vue';
import { useI18n, useLocalePath } from '#i18n';
import { useAuth, useRuntimeConfig } from '#imports';

const { t } = useI18n();
const localePath = useLocalePath();
const config = useRuntimeConfig();
const { token } = useAuth();

// --- State ---
const search = ref('');
const sites = ref<any[]>([]);
const isDeleteModalOpen = ref(false);
const isDeleting = ref(false);
const siteToDelete = ref<any>(null);
const isSiteModalOpen = ref(false);
const editingSiteId = ref<number | null>(null);
const selectedSite = ref<any>(null);

const columns = computed(() => [
  { accessorKey: 'name', header: t('sites.table.name') },
  { accessorKey: 'url', header: t('sites.table.url') },
  { accessorKey: 'status', header: t('sites.table.status') },
  { accessorKey: 'monitoring', header: 'Monitoring' },
  { id: 'actions', header: t('sites.table.actions') }
]);

const filteredRows = computed(() => {
  if (!search.value) return sites.value;
  return sites.value.filter((site) => {
    return site.name.toLowerCase().includes(search.value.toLowerCase()) || 
           site.url.toLowerCase().includes(search.value.toLowerCase());
  });
});

// useAsyncData is much more reliable in Nuxt for initial load
const { data: response, refresh: refreshSites } = await useAsyncData('sites-list', async () => {
    if (!token.value) return null;
    return await $fetch<any>(`${config.public.apiBase}/api/sites`, {
      params: {
        'with[]': ['configurations', 'checks', 'configurations.checkType', 'checks.checkType']
      },
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

// Sync data when response changes
watch(response, (newResponse) => {
    if (!newResponse) return;
    const dataArray = Array.isArray(newResponse) ? newResponse : (newResponse?.data || []);
    
    // Calculate statuses for each site
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
        status: status
      };
    });
}, { immediate: true });

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


