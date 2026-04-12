<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { object, string } from 'yup';
import { useI18n } from '#i18n';
import { useAuth, useRuntimeConfig } from '#imports';

const props = defineProps<{
  siteId?: number | null;
  siteData?: any | null;
  open: boolean;
}>();

const emit = defineEmits(['update:open', 'success']);

const { t } = useI18n();
const config = useRuntimeConfig();
const { token } = useAuth();

const isOpen = computed({
  get: () => props.open,
  set: (val) => emit('update:open', val)
});

const isEdit = computed(() => !!props.siteId);
const loading = ref(false);
const pageLoading = ref(false);
const formErrors = ref<Record<string, string[]>>({});
const checkTypes = ref<any[]>([]);

const state = ref({
  name: '',
  url: '',
  interval: 300,
  selectedChecks: {} as Record<number, { enabled: boolean; params: any }>
});

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
    const typesResponse = await $fetch<any>(`${config.public.apiBase}/api/check-types`, {
      headers: {
        'Accept': 'application/json',
        'X-Frontend-Key': config.public.frontendKey as string,
        'Authorization': `Bearer ${token.value}`
      }
    });
    
    const typesData = Array.isArray(typesResponse) ? typesResponse : (typesResponse?.data || []);
    checkTypes.value = typesData.filter((c: any) => c.is_active);
    
    // Reset state before populating
    state.value = {
      name: '',
      url: '',
      interval: 300,
      selectedChecks: {}
    };
    
    checkTypes.value.forEach(type => {
      state.value.selectedChecks[type.id] = { enabled: false, params: {} };
    });

    // 2. Populate data if editing
    if (isEdit.value) {
      // Try to use siteData if provided, otherwise fetch
      let site = props.siteData;
      
      // If we don't have enough data (like checks missing in the list object), try fetching
      if (!site || !site.checks) {
        try {
          const siteResponse = await $fetch<any>(`${config.public.apiBase}/api/sites/${props.siteId}`, {
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

        // Support both backend formats: 'configurations' and 'checks'
        const configs = site.configurations || site.checks;
        if (configs && Array.isArray(configs)) {
          configs.forEach((item: any) => {
            const checkTypeId = Number(item.check_type?.id || item.check_type_id);
            if (state.value.selectedChecks[checkTypeId]) {
              state.value.selectedChecks[checkTypeId].enabled = true;
              state.value.selectedChecks[checkTypeId].params = JSON.parse(JSON.stringify(item.params || {}));
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
    const checks = Object.entries(state.value.selectedChecks)
      .filter(([_, val]) => val.enabled)
      .map(([id, val]) => ({
        check_type_id: parseInt(id),
        params: val.params
      }));

    const url = isEdit.value 
      ? `${config.public.apiBase}/api/sites/${props.siteId}`
      : `${config.public.apiBase}/api/sites`;
      
    await $fetch(url, {
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
        checks
      }
    });

    emit('success');
    isOpen.value = false;
  } catch (error: any) {
    if (error.status === 422) {
      formErrors.value = error.data.errors;
    }
    console.error('Submit Error:', error);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <UModal v-model:open="isOpen" :title="isEdit ? 'Edit Node' : t('add_website.title')" :description="isEdit ? 'Update your infrastructure monitoring configuration.' : t('add_website.subtitle')">
    <template #body>
      <div v-if="pageLoading" class="p-10 text-center">
        <UIcon name="i-heroicons-arrow-path" class="text-3xl animate-spin text-primary-500" />
      </div>
      <UForm v-else :state="state" :schema="schema" @submit="onSubmit" class="flex flex-col gap-6">
        <UFormField :label="t('add_website.node_name')" name="name">
          <UInput v-model="state.name" :placeholder="t('add_website.node_name_placeholder')" class="w-full" />
          <div v-if="formErrors.name" class="text-xs text-error mt-1">{{ formErrors.name[0] }}</div>
        </UFormField>

        <UFormField :label="t('add_website.endpoint_url')" name="url">
          <UInput v-model="state.url" :placeholder="t('add_website.endpoint_url_placeholder')" icon="i-heroicons-globe-alt" class="w-full" />
          <div v-if="formErrors.url" class="text-xs text-error mt-1">{{ formErrors.url[0] }}</div>
        </UFormField>

        <UFormField :label="t('add_website.frequency')" name="interval">
          <div class="grid grid-cols-3 sm:grid-cols-5 gap-2">
            <UButton 
              v-for="opt in intervalOptions" 
              :key="opt.value"
              :variant="state.interval === opt.value ? 'soft' : 'outline'"
              :color="state.interval === opt.value ? 'primary' : 'neutral'"
              size="xs"
              class="justify-center px-1"
              @click="state.interval = opt.value"
            >
              {{ opt.label }}
            </UButton>
          </div>
        </UFormField>

        <!-- Monitoring Checks -->
        <div v-if="checkTypes.length > 0" class="flex flex-col gap-3">
          <div class="text-[10px] font-black uppercase tracking-widest text-neutral-400">Monitoring configuration</div>
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
              <USwitch v-model="state.selectedChecks[type.id]!.enabled" size="sm" />
            </div>
            
            <div v-if="state.selectedChecks[type.id]?.enabled && type.slug === 'keyword_search'" class="mt-3 pt-3 border-t border-neutral-100 dark:border-white/5">
              <UFormField label="Keyword" size="sm">
                <UInput v-model="state.selectedChecks[type.id]!.params.keyword" placeholder="e.g. 'Out of stock'" class="w-full" />
              </UFormField>
            </div>
          </div>
        </div>
      </UForm>
    </template>

    <template #footer>
      <div class="flex justify-end gap-3 w-full">
        <UButton color="neutral" variant="ghost" @click="isOpen = false">Cancel</UButton>
        <UButton type="submit" color="primary" :loading="loading" @click="onSubmit">
          {{ isEdit ? 'Save Changes' : t('add_website.submit') }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>
