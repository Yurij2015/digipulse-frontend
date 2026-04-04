<template>
  <div class="relative min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4 overflow-hidden">
    <!-- Background Gradient Pulse -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary-500/10 blur-[150px] rounded-full pointer-events-none"></div>

    <div class="w-full max-w-xl relative z-10">
      <div class="mb-10 text-center">
        <UButton to="/dashboard" variant="ghost" color="neutral" icon="i-heroicons-arrow-left" label="Назад до дашборду" class="mb-6 hover:bg-white/5" />
        <h1 class="text-4xl font-black text-white tracking-tight mb-2">Новий моніторинг</h1>
        <p class="text-neutral-500 font-medium">Додайте ресурс для миттєвого відстеження стану</p>
      </div>

      <UCard class="glass-card rounded-[2.5rem] border-white/5 ring-0 p-4">
        <UForm :state="state" :schema="schema" @submit="onSubmit" class="space-y-8">
          <div class="space-y-6">
            <UFormGroup label="Назва сайту" name="name" help="Наприклад: Мій Блог або API Gateway">
              <UInput 
                v-model="state.name" 
                placeholder="Введіть зрозумілу назву" 
                size="xl"
                class="bg-white/5 border-white/10 rounded-2xl"
              />
            </UFormGroup>

            <UFormGroup label="URL Адреса" name="url" help="Має починатися з http:// або https://">
              <UInput 
                v-model="state.url" 
                placeholder="https://example.com" 
                size="xl"
                icon="i-heroicons-globe-alt"
                class="bg-white/5 border-white/10 rounded-2xl"
              />
            </UFormGroup>

            <div class="grid grid-cols-2 gap-4">
              <UFormGroup label="Частота перевірки" name="interval">
                <USelect 
                  v-model="state.interval" 
                  :options="intervalOptions" 
                  size="xl"
                  class="bg-white/5 border-white/10 rounded-2xl"
                />
              </UFormGroup>
              <UFormGroup label="Тип запиту" name="method">
                <USelect 
                  v-model="state.method" 
                  :options="['GET', 'POST', 'HEAD']" 
                  size="xl"
                  class="bg-white/5 border-white/10 rounded-2xl"
                />
              </UFormGroup>
            </div>
          </div>

          <UButton 
            type="submit" 
            block 
            size="xl" 
            :loading="loading"
            class="bg-pulse-gradient font-black py-4 rounded-2xl shadow-xl shadow-primary-500/20 hover:scale-[1.02] transition-transform"
          >
            Запустити моніторинг
          </UButton>
        </UForm>
      </UCard>

      <div class="mt-8 grid grid-cols-3 gap-4">
        <div v-for="i in 3" :key="i" class="h-1 bg-white/5 rounded-full overflow-hidden">
          <div :class="`h-full bg-pulse-gradient w-[${i * 33}%]`"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { object, string } from 'yup';

const loading = ref(false);

const state = ref({
  name: '',
  url: '',
  interval: '60s',
  method: 'GET'
});

const intervalOptions = [
  { label: 'Кожну хвилину (60s)', value: '60s' },
  { label: 'Кожні 5 хв', value: '5m' },
  { label: 'Кожні 15 хв', value: '15m' },
  { label: 'Щогодини', value: '1h' },
];

const schema = object({
  name: string().required('Назва обов\'язкова'),
  url: string().url('Введіть коректний URL').required('URL обов\'язковий'),
});

async function onSubmit() {
  loading.value = true;
  console.log('Adding website:', state.value);
  await new Promise(resolve => setTimeout(resolve, 2000));
  loading.value = false;
  navigateTo('/dashboard');
}
</script>
