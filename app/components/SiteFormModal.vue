<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { object, string } from 'yup';
import { useI18n } from '#i18n';
import { useAuth, useRuntimeConfig } from '#imports';
import { useProjectsStore } from '~/stores/projects';

const projectsStore = useProjectsStore();

const props = defineProps<{
  siteId?: number | null;
  siteData?: any | null;
  open: boolean;
}>();

const emit = defineEmits<{
  'update:open': [value: boolean];
  'success': [siteId?: number];
}>();

const { t } = useI18n();
const config = useRuntimeConfig();
const { token } = useAuth();

const isOpen = computed({
  get: () => props.open,
  set: (val) => emit('update:open', val)
});

const isEdit = computed(() => !!props.siteId);
const formRef = ref<any>(null);
const loading = ref(false);
const pageLoading = ref(false);
const formErrors = ref<Record<string, string[]>>({});
const checkTypes = ref<any[]>([]);

const state = ref({
  name: '',
  url: '',
  interval: 300,
  project_id: undefined as number | undefined,
  selectedChecks: {} as Record<number, { enabled: boolean; params: any }>
});

const isCreatingNewProject = ref(false);
const newProjectName = ref('');

const projectItems = computed(() =>
  (projectsStore.projects || []).map(p => ({ label: p.name, value: p.id }))
);

const intervalOptions = computed(() => [
  { label: t('add_website.freq_60s'), value: 60 },
  { label: t('add_website.freq_5m'), value: 300 },
  { label: t('add_website.freq_10m'), value: 600 },
  { label: t('add_website.freq_15m'), value: 900 },
  { label: t('add_website.freq_30m'), value: 1800 },
  { label: t('add_website.freq_1h'), value: 3600 },
  { label: t('add_website.freq_3h'), value: 10800 },
  { label: t('add_website.freq_6h'), value: 21600 },
  { label: t('add_website.freq_12h'), value: 43200 },
  { label: t('add_website.freq_24h'), value: 86400 },
]);

const schema = computed(() => object({
  name: string().required(t('add_website.name_required')),
  url: string().url(t('add_website.url_invalid')).required(t('add_website.url_required')),
}));

async function fetchData() {
  if (!isOpen.value) return;
  
  pageLoading.value = true;
  formErrors.value = {};
  
  try {
    // 1. Fetch check types (always needed)
    const typesResponse = await $fetch<any>(`${config.public.apiBase}/api/v1/check-types`, {
      headers: {
        'Accept': 'application/json',
        'X-Frontend-Key': config.public.frontendKey as string,
        'Authorization': `Bearer ${token.value}`
      }
    });
    
    const typesData = Array.isArray(typesResponse) ? typesResponse : (typesResponse?.data || []);
    checkTypes.value = typesData.filter((c: any) => c.is_active);

    // Fetch projects
    await projectsStore.fetchProjects();
    
    // Reset state before populating
    isCreatingNewProject.value = false;
    newProjectName.value = '';
    state.value = {
      name: '',
      url: '',
      interval: 300,
      project_id: undefined,
      selectedChecks: {}
    };
    
    checkTypes.value.forEach(type => {
      state.value.selectedChecks[type.id] = { enabled: !isEdit.value, params: {} };
    });

    // 2. Populate data if editing
    if (isEdit.value) {
      // Try to use siteData if provided, otherwise fetch
      let site = props.siteData;
      
      // If we don't have enough data (like checks missing in the list object), try fetching
      if (!site || !site.checks) {
        try {
          const siteResponse = await $fetch<any>(`${config.public.apiBase}/api/v1/sites/${props.siteId}`, {
            headers: {
              'Accept': 'application/json',
              'X-Frontend-Key': config.public.frontendKey as string,
              'Authorization': `Bearer ${token.value}`
            }
          });
          site = siteResponse?.data || siteResponse;
        } catch (e) {
          console.error('Fetch detail failed, falling back to props data:', e);
          if (!site) site = props.siteData;
        }
      }

      if (site) {
        state.value.name = site.name || '';
        state.value.url = site.url || '';
        state.value.interval = Number(site.update_interval || site.interval || 300);
        state.value.project_id = site.project_id ?? undefined;

        // Support both backend formats: 'configurations' and 'checks'
        const configs = site.configurations || site.checks;
        if (configs && Array.isArray(configs)) {
          configs.forEach((item: any) => {
            const checkTypeId = Number(item.check_type?.id || item.check_type_id);
            const currentCheck = state.value.selectedChecks[checkTypeId];
            if (currentCheck) {
              currentCheck.enabled = true;
              currentCheck.params = JSON.parse(JSON.stringify(item.params || {}));
            }
          });
        }
      }
    }
  } catch (error) {
    console.error('Failed to fetch data for site modal:', error);
  } finally {
    pageLoading.value = false;
  }
}

watch(() => props.open, (newVal) => {
  if (newVal) fetchData();
});

watch(() => props.siteId, (newVal) => {
  if (isOpen.value && newVal !== undefined) fetchData();
});


const hasChecks = computed(() => {
  return Object.values(state.value.selectedChecks).some(c => (c as any).enabled);
});

function getCheckTypeColor(slug: string) {
  if (!slug) return 'text-neutral-400';
  const s = slug.toLowerCase();
  if (s.includes('ping')) return 'text-emerald-500';
  if (s.includes('http')) return 'text-blue-500';
  if (s.includes('ssl')) return 'text-amber-500';
  if (s.includes('dns')) return 'text-pink-500';
  if (s.includes('port')) return 'text-violet-500';
  return 'text-neutral-400';
}

async function onSubmit() {
  loading.value = true;
  formErrors.value = {};
  
  try {
    if (isCreatingNewProject.value && newProjectName.value) {
      try {
        const newProject = await projectsStore.createProject(newProjectName.value);
        if (newProject?.id) {
          state.value.project_id = newProject.id;
        }
      } catch (e) {
        console.error('Failed to create project inline:', e);
        // Continue if it failed? Or stop? Better stop and show error.
        return;
      }
    }

    const checks = Object.entries(state.value.selectedChecks)
      .filter(([_, val]) => val.enabled)
      .map(([id, val]) => ({
        check_type_id: parseInt(id),
        params: val.params
      }));


    const url = isEdit.value 
      ? `${config.public.apiBase}/api/v1/sites/${props.siteId}`
      : `${config.public.apiBase}/api/v1/sites`;
      
    const response = await $fetch<any>(url, {
      method: isEdit.value ? 'PUT' : 'POST',
      headers: {
        'Accept': 'application/json',
        'X-Frontend-Key': config.public.frontendKey as string,
        'Authorization': `Bearer ${token.value}`
      },
      body: {
        name: state.value.name,
        url: state.value.url,
        update_interval: state.value.interval,
        project_id: state.value.project_id ?? null,
        checks
      }
    });

    const siteId = response?.data?.id ?? response?.id ?? props.siteId ?? undefined;
    emit('success', siteId);
    isOpen.value = false;
  } catch (error: any) {
    if (error.status === 422) {
      formErrors.value = error.data.errors;
      if (formErrors.value.url && formErrors.value.url.includes('ERROR_URL_TAKEN')) {
         formErrors.value.url = [t('add_website.url_unique')];
      }
    }
    console.error('Submit Error:', error);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <UModal v-model:open="isOpen" :title="isEdit ? t('add_website.edit_title') : t('add_website.title')" :description="isEdit ? t('add_website.edit_subtitle') : t('add_website.subtitle')">
    <BaseLoader :show="loading" />
    <template #body>
      <div v-if="pageLoading" class="p-10 text-center">
        <UIcon name="i-heroicons-arrow-path" class="text-3xl animate-spin text-primary-500" />
      </div>
      <UForm ref="formRef" v-else :state="state" :schema="schema" @submit="onSubmit" class="flex flex-col gap-6">
        <UFormField :label="t('add_website.node_name')" name="name">
          <UInput v-model="state.name" :placeholder="t('add_website.node_name_placeholder')" class="w-full" />
          <div v-if="formErrors.name" class="text-xs text-error mt-1">{{ formErrors.name[0] }}</div>
        </UFormField>

        <UFormField :label="t('add_website.endpoint_url')" name="url">
          <UInput v-model="state.url" :placeholder="t('add_website.endpoint_url_placeholder')" icon="i-heroicons-globe-alt" class="w-full" />
          <div v-if="formErrors.url" class="text-xs text-error mt-1" v-html="formErrors.url[0]?.replace('support@digipulse.cloud', `<a href='mailto:support@digipulse.cloud?subject=DigiPulse Support' class='underline font-bold'>support@digipulse.cloud</a>`)"></div>
        </UFormField>

        <UFormField name="project_id">
          <template #label>
            <div class="flex items-center justify-between w-full">
              <span>{{ t('add_website.project_selection') }}</span>
              <UButton 
                variant="ghost" 
                size="xs" 
                color="primary" 
                class="px-1 h-5 text-[10px] cursor-pointer"
                @click="isCreatingNewProject = !isCreatingNewProject"
              >
                {{ isCreatingNewProject ? t('common.cancel') : `+ ${t('projects.add_project')}` }}
              </UButton>
            </div>
          </template>
          
          <div v-if="isCreatingNewProject" class="flex flex-col gap-2">
            <UInput v-model="newProjectName" :placeholder="t('projects.name')" class="w-full" />
            <p class="text-[9px] text-neutral-400 italic">{{ t('projects.subtitle') }}</p>
          </div>
          <USelectMenu
            v-else
            v-model="state.project_id"
            :items="projectItems"
            value-key="value"
            :placeholder="t('projects.no_project')"
            :ui="{ content: 'z-[200]' }"
            clear
            class="w-full"
          />
        </UFormField>

        <UFormField :label="t('add_website.frequency')" name="interval">
          <div class="grid grid-cols-3 sm:grid-cols-5 gap-2">
            <UButton 
              v-for="opt in intervalOptions" 
              :key="opt.value"
              :variant="state.interval === opt.value ? 'soft' : 'outline'"
              :color="state.interval === opt.value ? 'primary' : 'neutral'"
              size="xs"
              class="justify-center px-1 cursor-pointer"
              @click="state.interval = opt.value"
            >
              {{ opt.label }}
            </UButton>
          </div>
        </UFormField>

        <!-- Monitoring Checks -->
        <div v-if="checkTypes.length > 0" class="flex flex-col gap-3">
          <div class="text-[10px] font-black uppercase tracking-widest text-neutral-400">{{ t('add_website.monitoring_config') }}</div>
          <div v-for="type in checkTypes" :key="type.id" class="p-3 rounded-xl border border-neutral-100 dark:border-white/5 bg-neutral-50/50 dark:bg-white/2">
            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <UIcon 
                  :name="(type.icon || 'heroicon-o-bolt').replace('heroicon-o-', 'i-heroicons-').replace('heroicon-s-', 'i-heroicons-')" 
                  class="text-lg" 
                  :class="getCheckTypeColor(type.slug)"
                />
                <div>
                  <div class="text-xs font-bold text-neutral-900 dark:text-white">{{ type.name }}</div>
                  <div class="text-[9px] text-neutral-500 leading-tight">{{ type.description }}</div>
                </div>
              </div>
              <USwitch v-if="state.selectedChecks[type.id]" v-model="state.selectedChecks[type.id]!.enabled" size="sm" class="cursor-pointer" />
            </div>
            
            <div v-if="state.selectedChecks[type.id]?.enabled && type.slug === 'keyword_search'" class="mt-3 pt-3 border-t border-neutral-100 dark:border-white/5">
              <UFormField :label="t('add_website.keyword_label')" size="sm">
                <UInput v-if="state.selectedChecks[type.id]" v-model="state.selectedChecks[type.id]!.params.keyword" :placeholder="t('add_website.keyword_placeholder')" class="w-full" />
              </UFormField>
            </div>
          </div>
          <div v-if="!hasChecks" class="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 text-amber-500 text-[10px] font-bold text-center leading-relaxed">
            <UIcon name="i-heroicons-exclamation-triangle" class="mr-1 text-xs inline-block align-text-top" />
            {{ t('add_website.no_checks_warning') }}
          </div>
        </div>
      </UForm>
    </template>

    <template #footer>
      <div class="flex justify-end gap-3 w-full">
        <UButton color="neutral" variant="ghost" @click="isOpen = false" class="cursor-pointer">{{ t('common.cancel') }}</UButton>
        <UButton color="primary" :loading="loading" @click="onSubmit" class="cursor-pointer">
          {{ isEdit ? t('add_website.save_changes') : t('add_website.submit') }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>
