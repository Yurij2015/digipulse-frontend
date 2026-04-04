<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-900 text-white p-4">
    <UCard class="w-full max-w-2xl p-8 bg-gray-800 rounded-lg shadow-lg">
      <template #header>
        <h2 class="text-3xl font-bold text-center text-primary-400">Додати новий сайт</h2>
      </template>

      <UForm :state="state" :schema="schema" @submit="onSubmit" class="space-y-6">
        <UFormGroup label="URL сайту" name="url" help="Наприклад: https://example.com">
          <UInput v-model="state.url" type="url" icon="i-heroicons-globe-alt" placeholder="https://example.com" />
        </UFormGroup>

        <UFormGroup label="Назва сайту (опціонально)" name="name">
          <UInput v-model="state.name" placeholder="Мій чудовий сайт" />
        </UFormGroup>

        <UFormGroup label="Опис (опціонально)" name="description">
          <UTextarea v-model="state.description" placeholder="Короткий опис сайту" />
        </UFormGroup>

        <UFormGroup label="Інтервал моніторингу" name="interval">
          <USelect v-model="state.interval" :options="intervalOptions" placeholder="Оберіть інтервал" />
        </UFormGroup>

        <UFormGroup label="Тип моніторингу" name="monitorType">
          <URadioGroup v-model="state.monitorType" :options="monitorTypeOptions" />
        </UFormGroup>

        <div class="flex justify-end space-x-4 mt-8">
          <UButton type="button" color="gray" variant="solid" @click="cancel">Скасувати</UButton>
          <UButton type="submit" :loading="loading">Додати сайт</UButton>
        </div>
      </UForm>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { object, string } from 'yup';

const loading = ref(false);

const state = ref({
  url: '',
  name: '',
  description: '',
  interval: '1min',
  monitorType: 'http',
});

const intervalOptions = [
  { label: 'Кожні 1 хвилина', value: '1min' },
  { label: 'Кожні 5 хвилин', value: '5min' },
  { label: 'Кожні 15 хвилин', value: '15min' },
  { label: 'Кожні 30 хвилин', value: '30min' },
  { label: 'Кожну годину', value: '1hour' },
];

const monitorTypeOptions = [
  { label: 'HTTP/HTTPS', value: 'http' },
  { label: 'Ping', value: 'ping' },
  { label: 'Port Check', value: 'port' },
];

const schema = object({
  url: string().url('Будь ласка, введіть дійсний URL').required('URL сайту є обов\'язковим'),
  name: string().max(100, 'Назва сайту занадто довга'),
  description: string().max(500, 'Опис занадто довгий'),
  interval: string().required('Інтервал моніторингу є обов\'язковим'),
  monitorType: string().required('Тип моніторингу є обов\'язковим'),
});

async function onSubmit() {
  loading.value = true;
  // Тут буде логіка для додавання сайту
  console.log('Add website form submitted:', state.value);
  await new Promise(resolve => setTimeout(resolve, 1500)); // Імітація затримки
  loading.value = false;
  // Після успішного додавання можна перенаправити користувача на дашборд
  // navigateTo('/dashboard');
}

function cancel() {
  // Логіка для скасування, наприклад, перехід на попередню сторінку або дашборд
  console.log('Form cancelled');
  // navigateTo('/dashboard');
}
</script>

<style scoped>
/* Додаткові стилі, якщо потрібні */
</style>
