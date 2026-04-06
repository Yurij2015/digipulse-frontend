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
          class="w-full justify-start gap-4 font-bold py-3 px-5 rounded-lg transition-all"
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

          <!-- Actions Column -->
          <template #actions-cell="{ row }">
            <div class="flex items-center gap-2">
              <UButton 
                icon="i-heroicons-pencil" 
                variant="ghost" 
                color="neutral" 
                size="sm"
                @click="openEditModal(row.original)"
              />
              <UButton 
                icon="i-heroicons-trash" 
                variant="ghost" 
                color="error" 
                size="sm"
                @click="confirmDelete(row.original)"
              />
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
    <SiteFormModal v-model:open="isSiteModalOpen" :site-id="editingSiteId" @success="refreshSites" />

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

const isSidebarOpen = ref(false);
const search = ref('');
const sites = ref<any[]>([]);
const isDeleteModalOpen = ref(false);
const isDeleting = ref(false);
const siteToDelete = ref<any>(null);
const isSiteModalOpen = ref(false);
const editingSiteId = ref<number | null>(null);

const columns = computed(() => [
  { accessorKey: 'name', header: t('sites.table.name') },
  { accessorKey: 'url', header: t('sites.table.url') },
  { accessorKey: 'status', header: t('sites.table.status') },
  { id: 'actions', header: t('sites.table.actions') }
]);

const links = computed(() => [
  { label: t('dashboard.title'), icon: 'i-heroicons-home', to: localePath('/dashboard') },
  { label: t('sites.title'), icon: 'i-heroicons-globe-alt', to: localePath('/sites') },
  { label: t('dashboard.settings'), icon: 'i-heroicons-cog-6-tooth', to: localePath('/settings') }
]);

const userInitials = computed(() => {
  if (!user.value) return '??';
  const u = user.value as any;
  if (!u.first_name || !u.last_name) return u.name?.substring(0, 2).toUpperCase() || '??';
  return (u.first_name[0] + u.last_name[0]).toUpperCase();
});

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
    sites.value = dataArray.map((site: any) => ({
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

function getStatusClasses(status: string) {
  switch (status) {
    case 'Online': return 'bg-green-500/5 text-green-600 dark:text-green-400 border-green-500/10';
    case 'Offline': return 'bg-red-500/5 text-red-600 dark:text-red-500 border-red-500/10';
    case 'Warning': return 'bg-yellow-500/5 text-yellow-600 dark:text-yellow-500 border-yellow-500/10';
    default: return 'bg-neutral-500/5 text-neutral-500 border-neutral-500/10';
  }
}

definePageMeta({
  middleware: 'auth'
});
</script>
