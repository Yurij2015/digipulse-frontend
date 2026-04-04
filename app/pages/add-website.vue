<template>
  <div class="relative min-h-screen bg-white dark:bg-neutral-950 flex flex-col items-center justify-center p-6 overflow-hidden transition-colors duration-500 mesh-bg">
    <div class="w-full max-w-xl relative z-10">
      <div class="mb-12 text-center">
        <UButton to="/dashboard" variant="ghost" color="neutral" icon="i-heroicons-arrow-left" label="Back to Dashboard" class="mb-8 hover:bg-neutral-200 dark:hover:bg-white/5 font-bold" />
        <h1 class="text-5xl font-black text-neutral-900 dark:text-white tracking-tight mb-4">Monitor Node</h1>
        <p class="text-neutral-500 font-medium">Add a new infrastructure resource for real-time tracking.</p>
      </div>

      <UCard class="glass-card rounded-[3rem] border-neutral-200/50 dark:border-white/5 ring-0 p-8 shadow-2xl">
        <UForm :state="state" :schema="schema" @submit="onSubmit" class="space-y-12">
          <div class="space-y-10">
            <UFormGroup label="Node Name" name="name" class="premium-label" help="e.g.: Google Cloud or API Gateway">
              <UInput 
                v-model="state.name" 
                placeholder="Enter a descriptive name" 
                size="xl"
                class="w-full"
                :ui="{ 
                  root: 'premium-input w-full',
                  base: 'py-5 px-5 text-neutral-900 dark:text-white bg-transparent border-0 ring-0 hover:bg-transparent focus:ring-0 focus:bg-transparent'
                }"
              />
            </UFormGroup>

            <UFormGroup label="Endpoint URL" name="url" class="premium-label" help="Must start with http:// or https://">
              <UInput 
                v-model="state.url" 
                placeholder="https://example.com" 
                size="xl"
                icon="i-heroicons-globe-alt"
                class="w-full"
                :ui="{ 
                  root: 'premium-input w-full',
                  base: 'py-5 ps-12! px-5 text-neutral-900 dark:text-white bg-transparent border-0 ring-0 hover:bg-transparent focus:ring-0 focus:bg-transparent'
                }"
              />
            </UFormGroup>

            <div class="grid grid-cols-2 gap-8">
              <UFormGroup label="Frequency" name="interval" class="premium-label">
                <USelect 
                  v-model="state.interval" 
                  :options="intervalOptions" 
                  size="xl"
                  class="w-full"
                  :ui="{ 
                    root: 'premium-input w-full',
                    base: 'py-5 px-5 text-neutral-900 dark:text-white bg-transparent border-0 ring-0 appearance-none'
                  }"
                />
              </UFormGroup>
               <UFormGroup label="Method" name="method" class="premium-label">
                <USelect 
                  v-model="state.method" 
                  :options="['GET', 'POST', 'HEAD']" 
                  size="xl"
                  class="w-full"
                  :ui="{ 
                    root: 'premium-input w-full',
                    base: 'py-5 px-5 text-neutral-900 dark:text-white bg-transparent border-0 ring-0 appearance-none'
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
            Start Monitoring Node
          </UButton>
        </UForm>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { object, string } from 'yup';
import { navigateTo } from '#imports';

const loading = ref(false);

const state = ref({
  name: '',
  url: '',
  interval: '60s',
  method: 'GET'
});

const intervalOptions = [
  { label: 'Every 60s (Recommended)', value: '60s' },
  { label: 'Every 5m', value: '5m' },
  { label: 'Every 15m', value: '15m' },
  { label: 'Every 1h', value: '1h' },
];

const schema = object({
  name: string().required('Name is required'),
  url: string().url('Enter a valid URL').required('URL is required'),
});

async function onSubmit() {
  loading.value = true;
  console.log('Adding website:', state.value);
  await new Promise(resolve => setTimeout(resolve, 2000));
  loading.value = false;
  navigateTo('/dashboard');
}
</script>
