<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n, useLocalePath } from '#i18n';
import { useProjectsStore } from '~/stores/projects';

const { t } = useI18n();
const localePath = useLocalePath();
const projectsStore = useProjectsStore();

const isCreateModalOpen = ref(false);
const isEditModalOpen = ref(false);
const newProjectName = ref('');
const newProjectDesc = ref('');
const editProjectId = ref<number | null>(null);
const editProjectName = ref('');
const editProjectDesc = ref('');
const creating = ref(false);
const updating = ref(false);
const isDeleteModalOpen = ref(false);
const isDeleting = ref(false);
const projectToDelete = ref<any>(null);
const search = ref('');

onMounted(() => {
  projectsStore.fetchProjects();
});

const columns = computed(() => [
  { accessorKey: 'name', header: t('projects.name') },
  { accessorKey: 'description', header: t('projects.description') },
  { accessorKey: 'sites_count', header: t('sites.title') },
  { id: 'actions', header: t('sites.table.actions') }
]);

const filteredRows = computed(() => {
  const projects = projectsStore.projects || [];
  if (!search.value) return projects;
  return projects.filter((project) => {
    return project.name.toLowerCase().includes(search.value.toLowerCase()) || 
           (project.description && project.description.toLowerCase().includes(search.value.toLowerCase()));
  });
});

async function handleCreateProject() {
  if (!newProjectName.value) return;
  
  creating.value = true;
  try {
    await projectsStore.createProject(newProjectName.value, newProjectDesc.value);
    isCreateModalOpen.value = false;
    newProjectName.value = '';
    newProjectDesc.value = '';
  } catch (err) {
    console.error('Failed to create project:', err);
  } finally {
    creating.value = false;
  }
}

function openCreateModal() {
  newProjectName.value = '';
  newProjectDesc.value = '';
  isCreateModalOpen.value = true;
}

function openEditModal(project: any) {
  editProjectId.value = project.id;
  editProjectName.value = project.name;
  editProjectDesc.value = project.description || '';
  isEditModalOpen.value = true;
}

async function handleEditProject() {
  if (!editProjectId.value || !editProjectName.value) return;
  
  updating.value = true;
  try {
    await projectsStore.updateProject(editProjectId.value, editProjectName.value, editProjectDesc.value);
    isEditModalOpen.value = false;
    editProjectId.value = null;
    editProjectName.value = '';
    editProjectDesc.value = '';
  } catch (err) {
    console.error('Failed to update project:', err);
  } finally {
    updating.value = false;
  }
}

function confirmDeleteProject(project: any) {
  projectToDelete.value = project;
  isDeleteModalOpen.value = true;
}

async function handleDeleteProject() {
  if (!projectToDelete.value) return;

  isDeleting.value = true;
  try {
    await projectsStore.deleteProject(projectToDelete.value.id);
    isDeleteModalOpen.value = false;
  } catch (err) {
    console.error('Failed to delete project:', err);
  } finally {
    isDeleting.value = false;
    projectToDelete.value = null;
  }
}

const showProjectsLoader = computed(() => {
  return (projectsStore.loading && projectsStore.projects.length === 0) || projectsStore.lastFetched === null;
});

definePageMeta({
  middleware: 'auth'
});
</script>

<template>
  <div class="flex flex-col lg:flex-row min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white transition-colors duration-500 mesh-bg">
    <AppSidebar />
    <BaseLoader :show="isDeleting" />

    <!-- Main Content -->
    <main class="flex-1 p-6 lg:p-12 overflow-y-auto lg:ml-72 h-screen">
      <header class="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
        <div>
          <h1 class="text-4xl font-black text-neutral-900 dark:text-white mb-3">{{ t('projects.title') }}</h1>
          <p class="text-neutral-500 font-medium">{{ t('projects.subtitle') }}</p>
        </div>
        <UButton size="xl" icon="i-heroicons-plus-circle" class="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold px-8 rounded-xl hover:scale-105 transition-transform cursor-pointer" @click="openCreateModal">
          {{ t('projects.add_project') }}
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

        <TableSkeleton v-if="showProjectsLoader" :rows="3" :columns="4" :actions="3" />

        <UTable v-else-if="filteredRows.length > 0" :data="filteredRows" :columns="columns" class="w-full">
          <!-- Name Column -->
          <template #name-cell="{ row }">
            <NuxtLink :to="localePath({ path: '/sites', query: { project: row.original.id } })" class="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
              <div class="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-500">
                <UIcon name="i-heroicons-folder" />
              </div>
              <span class="font-bold text-neutral-900 dark:text-white">{{ row.original.name }}</span>
            </NuxtLink>
          </template>

          <!-- Description Column -->
          <template #description-cell="{ row }">
            <span class="text-neutral-500 dark:text-neutral-400 text-sm">
              {{ row.original.description || '-' }}
            </span>
          </template>

          <!-- Sites Count Column -->
          <template #sites_count-cell="{ row }">
            <NuxtLink
              v-if="row.original.sites_count > 0"
              :to="localePath({ path: '/sites', query: { project: row.original.id } })"
              class="inline-block"
            >
              <UBadge variant="subtle" color="primary" class="font-bold text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-md border cursor-pointer hover:opacity-80 transition-opacity">
                {{ t('projects.sites_count', { count: row.original.sites_count || 0 }) }}
              </UBadge>
            </NuxtLink>
            <UBadge v-else variant="subtle" color="neutral" class="font-bold text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-md border">
              {{ t('projects.sites_count', { count: 0 }) }}
            </UBadge>
          </template>

          <!-- Actions Column -->
          <template #actions-cell="{ row }">
            <div class="flex items-center gap-1">
              <UButton
                v-if="row.original.sites_count > 0"
                icon="i-heroicons-eye"
                variant="ghost"
                color="primary"
                size="sm"
                :to="localePath({ path: '/sites', query: { project: row.original.id } })"
                class="cursor-pointer"
                :title="t('projects.view_sites')"
              />
              <UButton
                icon="i-heroicons-pencil-square"
                variant="ghost"
                color="neutral"
                size="sm"
                @click="openEditModal(row.original)"
                class="cursor-pointer"
                :title="t('projects.edit_project')"
              />
              <UButton icon="i-heroicons-trash" variant="ghost" color="error" size="sm" @click="confirmDeleteProject(row.original)" class="cursor-pointer" />
            </div>
          </template>
        </UTable>

        <!-- Empty State -->
        <div v-else-if="filteredRows.length === 0" class="flex flex-col items-center justify-center py-24 px-6">
          <div class="w-20 h-20 rounded-3xl bg-neutral-50 dark:bg-white/5 flex items-center justify-center text-neutral-300 dark:text-neutral-700 mb-6">
            <UIcon name="i-heroicons-folder-open" class="text-4xl" />
          </div>
          <h3 class="text-xl font-black text-neutral-900 dark:text-white mb-2">{{ t('projects.no_projects') }}</h3>
          <p class="text-neutral-500 max-w-xs text-center mb-6">{{ t('projects.subtitle') }}</p>
          <UButton icon="i-heroicons-plus-circle" class="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold px-6 rounded-xl hover:scale-105 transition-transform cursor-pointer" @click="openCreateModal">
            {{ t('projects.add_project') }}
          </UButton>
        </div>
      </div>
    </main>

    <!-- Create Project Modal -->
    <UModal v-model:open="isCreateModalOpen" :title="t('projects.add_project')">
      <template #body>
        <div class="flex flex-col gap-4">
          <UFormField :label="t('projects.name')">
            <UInput v-model="newProjectName" :placeholder="t('projects.name')" class="w-full" />
          </UFormField>
          <UFormField :label="t('projects.description')">
            <UTextarea v-model="newProjectDesc" :placeholder="t('projects.description')" class="w-full" />
          </UFormField>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-3 w-full">
          <UButton color="neutral" variant="ghost" @click="isCreateModalOpen = false" class="cursor-pointer">{{ t('common.cancel') }}</UButton>
          <UButton color="primary" :loading="creating" @click="handleCreateProject" class="cursor-pointer">
            {{ t('common.save') }}
          </UButton>
        </div>
      </template>
    </UModal>

    <!-- Edit Project Modal -->
    <UModal v-model:open="isEditModalOpen" :title="t('projects.edit_project')">
      <template #body>
        <div class="flex flex-col gap-4">
          <UFormField :label="t('projects.name')">
            <UInput v-model="editProjectName" :placeholder="t('projects.name')" class="w-full" />
          </UFormField>
          <UFormField :label="t('projects.description')">
            <UTextarea v-model="editProjectDesc" :placeholder="t('projects.description')" class="w-full" />
          </UFormField>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-3 w-full">
          <UButton color="neutral" variant="ghost" @click="isEditModalOpen = false" class="cursor-pointer">{{ t('common.cancel') }}</UButton>
          <UButton color="primary" :loading="updating" @click="handleEditProject" class="cursor-pointer">
            {{ t('common.save') }}
          </UButton>
        </div>
      </template>
    </UModal>

    <!-- Delete Confirmation Modal -->
    <UModal v-model:open="isDeleteModalOpen" :title="t('projects.delete_confirm')">
      <template #body>
        <div class="p-2">
          <p class="text-sm text-neutral-500">
            {{ t('projects.delete_desc') }}
          </p>
          <p class="text-sm text-neutral-500 mt-2">
            {{ t('projects.name') }}: <strong class="text-neutral-900 dark:text-white">{{ projectToDelete?.name }}</strong>
          </p>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end gap-3 w-full">
          <UButton color="neutral" variant="ghost" @click="isDeleteModalOpen = false" class="cursor-pointer">
            {{ t('common.cancel') }}
          </UButton>
          <UButton color="error" :loading="isDeleting" @click="handleDeleteProject" class="cursor-pointer">
            {{ t('sites.table.delete') }}
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
