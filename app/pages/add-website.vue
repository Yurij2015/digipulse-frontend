<template>
  <div class="relative min-h-screen bg-white dark:bg-neutral-950 flex flex-col items-center justify-center p-6 overflow-hidden transition-colors duration-500 mesh-bg">
    <div class="w-full max-w-xl relative z-10">
      <div class="mb-12 text-center">
        <UButton :to="localePath('/dashboard')" variant="ghost" color="neutral" icon="i-heroicons-arrow-left" :label="$t('add_website.back')" class="mb-8 hover:bg-neutral-200 dark:hover:bg-white/5 font-bold" />
        <h1 class="text-5xl font-black text-neutral-900 dark:text-white tracking-tight mb-4">{{ $t('add_website.title') }}</h1>
        <p class="text-neutral-500 font-medium">{{ $t('add_website.subtitle') }}</p>
      </div>

      <UCard class="glass-card rounded-[3rem] border-neutral-200/50 dark:border-white/5 ring-0 p-8 shadow-2xl">
        <UForm :state="state" :schema="schema" @submit="onSubmit" class="space-y-8">
          <div class="space-y-6">
            <UFormGroup :label="$t('add_website.node_name')" name="name" class="premium-label" :help="$t('add_website.node_name_help')">
              <UInput 
                v-model="state.name" 
                :placeholder="$t('add_website.node_name_placeholder')" 
                size="xl"
                class="w-full"
                :ui="{ 
                  root: 'premium-input w-full',
                  base: 'py-3 px-4 text-neutral-900 dark:text-white bg-transparent border-0 ring-0 hover:bg-transparent focus:ring-0 focus:bg-transparent'
                }"
              />
            </UFormGroup>

            <UFormGroup :label="$t('add_website.endpoint_url')" name="url" class="premium-label" :help="$t('add_website.endpoint_url_help')">
              <UInput 
                v-model="state.url" 
                :placeholder="$t('add_website.endpoint_url_placeholder')" 
                size="xl"
                icon="i-heroicons-globe-alt"
                class="w-full"
                :ui="{ 
                  root: 'premium-input w-full',
                  base: 'py-3 ps-10! px-4 text-neutral-900 dark:text-white bg-transparent border-0 ring-0 hover:bg-transparent focus:ring-0 focus:bg-transparent'
                }"
              />
            </UFormGroup>

            <div class="grid grid-cols-2 gap-6">
              <UFormGroup :label="$t('add_website.frequency')" name="interval" class="premium-label">
                <USelect 
                  v-model="state.interval" 
                  :options="intervalOptions" 
                  size="xl"
                  class="w-full"
                  :ui="{ 
                    root: 'premium-input w-full',
                    base: 'py-3 px-4 text-neutral-900 dark:text-white bg-transparent border-0 ring-0 appearance-none'
                  }"
                />
              </UFormGroup>
               <UFormGroup :label="$t('add_website.method')" name="method" class="premium-label">
                <USelect 
                  v-model="state.method" 
                  :options="['GET', 'POST', 'HEAD']" 
                  size="xl"
                  class="w-full"
                  :ui="{ 
                    root: 'premium-input w-full',
                    base: 'py-6 px-5 text-neutral-900 dark:text-white bg-transparent border-0 ring-0 appearance-none'
                  }"
                />
              </UFormGroup>
            </div>
          </div>

          <UButton 
            type="submit" 
            block 
            size="xl" 
            :loading="loading"
            class="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-black py-5 rounded-2xl shadow-xl hover:scale-[1.02] transition-transform mt-10 border-0"
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
import { navigateTo, useI18n, useLocalePath } from '#imports';

const { t } = useI18n();
const localePath = useLocalePath();
const loading = ref(false);

const state = ref({
  name: '',
  url: '',
  interval: '60s',
  method: 'GET'
});

const intervalOptions = computed(() => [
  { label: t('add_website.freq_60s'), value: '60s' },
  { label: t('add_website.freq_5m'), value: '5m' },
  { label: t('add_website.freq_15m'), value: '15m' },
  { label: t('add_website.freq_1h'), value: '1h' },
]);

const schema = computed(() => object({
  name: string().required(t('add_website.name_required')),
  url: string().url(t('add_website.url_invalid')).required(t('add_website.url_required')),
}));

async function onSubmit() {
  loading.value = true;
  console.log('Adding website:', state.value);
  await new Promise(resolve => setTimeout(resolve, 2000));
  loading.value = false;
  navigateTo(localePath('/dashboard'));
}
</script>
