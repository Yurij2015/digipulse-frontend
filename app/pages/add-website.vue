<template>
  <div class="relative min-h-screen bg-white dark:bg-neutral-950 flex flex-col items-center justify-center p-6 overflow-hidden transition-colors duration-500 mesh-bg">
    <div class="w-full max-w-xl relative z-10">
      <div class="mb-12 text-center">
        <UButton :to="localePath('/dashboard')" variant="ghost" color="neutral" icon="i-heroicons-arrow-left" :label="$t('add_website.back')" class="mb-8 hover:bg-neutral-200 dark:hover:bg-white/5 font-bold" />
        <h1 class="text-5xl font-black text-neutral-900 dark:text-white tracking-tight mb-4">{{ $t('add_website.title') }}</h1>
        <p class="text-neutral-500 font-medium">{{ $t('add_website.subtitle') }}</p>
      </div>

      <UCard class="glass-card rounded-2xl border-neutral-200/50 dark:border-white/10 ring-0 p-6 shadow-2xl relative">
        <div class="absolute -top-px left-10 right-10 h-px bg-linear-to-r from-transparent via-primary-500/50 to-transparent"></div>
        <UForm :state="state" :schema="schema" @submit="onSubmit" class="flex flex-col gap-8">
          <div class="flex flex-col gap-6">
            <UFormField :label="$t('add_website.node_name')" name="name" class="premium-label" :help="$t('add_website.node_name_help')">
              <UInput 
                v-model="state.name" 
                :placeholder="$t('add_website.node_name_placeholder')" 
                size="xl"
                class="w-full"
                :ui="{ 
                  base: 'py-3 px-4 text-neutral-900 dark:text-white bg-transparent border-0 ring-0 hover:bg-transparent focus:ring-0 focus:bg-transparent'
                }"
                :error="!!formErrors.name"
              />
              <div v-if="formErrors.name" class="text-xs text-error mt-2 font-medium">{{ formErrors.name[0] }}</div>
            </UFormField>

            <UFormField :label="$t('add_website.endpoint_url')" name="url" class="premium-label" :help="$t('add_website.endpoint_url_help')">
              <UInput 
                v-model="state.url" 
                :placeholder="$t('add_website.endpoint_url_placeholder')" 
                size="xl"
                icon="i-heroicons-globe-alt"
                class="w-full"
                :ui="{ 
                  base: 'py-3 ps-10! px-4 text-neutral-900 dark:text-white bg-transparent border-0 ring-0 hover:bg-transparent focus:ring-0 focus:bg-transparent'
                }"
                :error="!!formErrors.url"
              />
              <div v-if="formErrors.url" class="text-xs text-error mt-2 font-medium">{{ formErrors.url[0] }}</div>
            </UFormField>

            <UFormField :label="$t('add_website.frequency')" name="interval" class="premium-label col-span-2" :error="formErrors.update_interval?.[0]">
              <div class="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-2 w-full">
                <UButton 
                  v-for="opt in intervalOptions" 
                  :key="opt.value"
                  :variant="state.interval === opt.value ? 'soft' : 'outline'"
                  :color="state.interval === opt.value ? 'primary' : 'neutral'"
                  class="justify-center font-black text-[11px] py-3 rounded-lg transition-all active:scale-95 border-neutral-200/50 dark:border-white/5"
                  :class="state.interval === opt.value ? 'ring-1 ring-primary-500/50 scale-[1.02]' : 'text-neutral-500'"
                  @click="state.interval = opt.value"
                >
                  {{ opt.label }}
                </UButton>
              </div>
            </UFormField>

            <!-- Dynamic Monitoring Checks Section -->
            <div v-if="checkTypes.length > 0" class="flex flex-col gap-4 mt-2">
              <div class="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">Monitoring Configuration</div>
              <div v-for="type in checkTypes" :key="type.id" class="glass-card p-4 rounded-xl border-neutral-200/50 dark:border-white/5 group hover:border-primary-500/20 transition-all">
                <div class="flex items-center justify-between gap-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-white/5 flex items-center justify-center text-neutral-500 group-hover:text-primary-500 transition-colors">
                      <UIcon :name="type.icon || 'i-heroicons-bolt'" class="text-xl" />
                    </div>
                    <div>
                      <div class="text-sm font-black text-neutral-900 dark:text-white">{{ type.name }}</div>
                      <div class="text-[10px] text-neutral-500 font-medium leading-tight">{{ type.description }}</div>
                    </div>
                  </div>
                  <USwitch v-model="state.selectedChecks[type.id].enabled" color="primary" size="sm" />
                </div>

                <!-- Parameters for specific check types -->
                <div v-if="state.selectedChecks[type.id].enabled && type.slug === 'keyword_search'" class="mt-2 pt-2 border-t border-neutral-100 dark:border-white/5">
                  <UFormField label="Keyword to search for" class="premium-label">
                    <UInput 
                      v-model="state.selectedChecks[type.id].params.keyword" 
                      placeholder="e.g.: 'Product sold out'" 
                      size="lg"
                      variant="none"
                      class="bg-neutral-50 dark:bg-white/2 rounded-lg"
                    />
                  </UFormField>
                </div>
              </div>
            </div>
          </div>

          <UButton 
            type="submit" 
            block 
            size="xl" 
            :loading="loading"
            class="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-black py-5 rounded-xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all border-0 shimmer-effect"
          >
            {{ $t('add_website.submit') }}
          </UButton>
        </UForm>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { object, string } from 'yup';
import { navigateTo, useRouter } from '#imports';
import { useI18n, useLocalePath } from '#i18n';

interface CheckType {
  id: number;
  name: string;
  slug: string;
  icon: string;
  description: string;
  is_active: boolean;
}

const { t } = useI18n();
const localePath = useLocalePath();
const config = useRuntimeConfig();
const { token } = useAuth();

definePageMeta({
  middleware: 'auth'
});

const loading = ref(false);
const checkTypes = ref<CheckType[]>([]);
const formErrors = ref<Record<string, string[]>>({});

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

onMounted(async () => {
  try {
    const response = await $fetch<{ data: CheckType[] }>(`${config.public.apiBase}/api/check-types`, {
      headers: {
        'Accept': 'application/json',
        'X-Frontend-Key': config.public.frontendKey as string,
        'Authorization': `Bearer ${token.value}`,
        'X-CSRF-TOKEN': ''
      }
    });
    checkTypes.value = response.data.filter(c => c.is_active);
    
    // Initialize selectedChecks state
    checkTypes.value.forEach(type => {
      state.value.selectedChecks[type.id] = { enabled: false, params: {} };
    });
  } catch (error) {
    console.error('Failed to fetch check types:', error);
  }
});

const schema = computed(() => object({
  name: string().required(t('add_website.name_required')),
  url: string().url(t('add_website.url_invalid')).required(t('add_website.url_required')),
}));

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

    await $fetch(`${config.public.apiBase}/api/sites`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'X-Frontend-Key': config.public.frontendKey as string,
        'Authorization': `Bearer ${token.value}`,
        'X-CSRF-TOKEN': ''
      },
      body: {
        name: state.value.name,
        url: state.value.url,
        update_interval: state.value.interval,
        checks
      }
    });

    navigateTo(localePath('/dashboard'));
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
