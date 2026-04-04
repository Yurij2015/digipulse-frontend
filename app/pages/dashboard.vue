<template>
  <div class="flex min-h-screen bg-gray-900 text-white">
    <!-- Sidebar -->
    <aside class="w-64 bg-gray-800 p-4 flex flex-col">
      <div class="text-2xl font-bold text-primary-400 mb-8">DigiPulse</div>
      <UVerticalNavigation :links="links" />
      <div class="mt-auto pt-4 border-t border-gray-700">
        <UButton icon="i-heroicons-arrow-left-on-rectangle" color="gray" variant="ghost" label="Вийти" block />
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-8">
      <h1 class="text-4xl font-bold text-primary-400 mb-8">Дашборд моніторингу</h1>

      <!-- Summary Statistics -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <UCard class="bg-gray-800">
          <template #header>
            <h3 class="text-lg font-semibold text-gray-300">Всього сайтів</h3>
          </template>
          <p class="text-4xl font-bold text-center text-primary-300">{{ websites.length }}</p>
        </UCard>
        <UCard class="bg-gray-800">
          <template #header>
            <h3 class="text-lg font-semibold text-gray-300">Онлайн</h3>
          </template>
          <p class="text-4xl font-bold text-center text-green-500">{{ onlineWebsites }}</p>
        </UCard>
        <UCard class="bg-gray-800">
          <template #header>
            <h3 class="text-lg font-semibold text-gray-300">Офлайн</h3>
          </template>
          <p class="text-4xl font-bold text-center text-red-500">{{ offlineWebsites }}</p>
        </UCard>
      </div>

      <!-- Actions and Filters -->
      <div class="flex justify-between items-center mb-6">
        <UButton icon="i-heroicons-plus" size="lg" to="/add-website">Додати новий сайт</UButton>
        <div class="flex space-x-4">
          <UInput v-model="searchQuery" placeholder="Пошук сайтів..." icon="i-heroicons-magnifying-glass" />
          <USelect v-model="filterStatus" :options="statusOptions" placeholder="Фільтр за статусом" />
        </div>
      </div>

      <!-- Websites List -->
      <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <UCard v-for="website in filteredWebsites" :key="website.id" class="bg-gray-800">
          <template #header>
            <div class="flex justify-between items-center">
              <h3 class="text-xl font-semibold text-primary-300">{{ website.name || website.url }}</h3>
              <UBadge :color="getStatusColor(website.status)" variant="subtle">
                <UIcon :name="getStatusIcon(website.status)" class="mr-1" />
                {{ website.status }}
              </UBadge>
            </div>
          </template>

          <div class="space-y-2 text-gray-300">
            <p class="truncate"><strong>URL:</strong> <a :href="website.url" target="_blank" class="text-blue-400 hover:underline">{{ website.url }}</a></p>
            <p><strong>Остання перевірка:</strong> {{ website.lastCheck }}</p>
            <p><strong>Час відгуку:</strong> <span :class="getResponseTimeColor(website.responseTime)">{{ website.responseTime }} ms</span></p>
            <p><strong>Uptime (30 днів):</strong> {{ website.uptime }}%</p>
          </div>

          <template #footer>
            <div class="flex justify-end space-x-2">
              <UButton icon="i-heroicons-chart-bar" color="gray" variant="ghost" size="sm">Деталі</UButton>
              <UButton icon="i-heroicons-pencil" color="gray" variant="ghost" size="sm">Редагувати</UButton>
              <UButton icon="i-heroicons-trash" color="red" variant="ghost" size="sm">Видалити</UButton>
            </div>
          </template>
        </UCard>

        <div v-if="filteredWebsites.length === 0" class="col-span-full text-center text-gray-500 text-lg py-10">
          <p>Сайтів не знайдено. Спробуйте змінити фільтри або додайте новий сайт.</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// Sidebar links
const links = [
  {
    label: 'Дашборд',
    icon: 'i-heroicons-home',
    to: '/dashboard'
  },
  {
    label: 'Додати сайт',
    icon: 'i-heroicons-plus-circle',
    to: '/add-website'
  },
  {
    label: 'Налаштування',
    icon: 'i-heroicons-cog-6-tooth',
    to: '/settings' // Припустимо, що буде сторінка налаштувань
  }
];

// Dummy data for websites
const websites = ref([
  { id: 1, name: 'Google', url: 'https://google.com', status: 'Онлайн', lastCheck: '2 хв тому', responseTime: 80, uptime: 99.99 },
  { id: 2, name: 'Facebook', url: 'https://facebook.com', status: 'Онлайн', lastCheck: '5 хв тому', responseTime: 150, uptime: 99.95 },
  { id: 3, name: 'Broken Site', url: 'https://broken.example.com', status: 'Офлайн', lastCheck: '1 хв тому', responseTime: 0, uptime: 98.50 },
  { id: 4, name: 'Slow API', url: 'https://slowapi.example.com', status: 'Попередження', lastCheck: '10 хв тому', responseTime: 800, uptime: 99.10 },
  { id: 5, name: 'My Blog', url: 'https://myblog.com', status: 'Онлайн', lastCheck: '3 хв тому', responseTime: 120, uptime: 99.98 },
]);

// Search and Filter
const searchQuery = ref('');
const filterStatus = ref('');

const statusOptions = [
  { label: 'Всі', value: '' },
  { label: 'Онлайн', value: 'Онлайн' },
  { label: 'Офлайн', value: 'Офлайн' },
  { label: 'Попередження', value: 'Попередження' },
];

const filteredWebsites = computed(() => {
  let filtered = websites.value;

  if (filterStatus.value) {
    filtered = filtered.filter(site => site.status === filterStatus.value);
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(site =>
      site.name.toLowerCase().includes(query) ||
      site.url.toLowerCase().includes(query)
    );
  }

  return filtered;
});

// Computed properties for summary
const onlineWebsites = computed(() => websites.value.filter(site => site.status === 'Онлайн').length);
const offlineWebsites = computed(() => websites.value.filter(site => site.status === 'Офлайн').length);

// Helper functions for styling
function getStatusColor(status: string) {
  switch (status) {
    case 'Онлайн': return 'green';
    case 'Офлайн': return 'red';
    case 'Попередження': return 'yellow';
    default: return 'gray';
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'Онлайн': return 'i-heroicons-check-circle';
    case 'Офлайн': return 'i-heroicons-x-circle';
    case 'Попередження': return 'i-heroicons-exclamation-triangle';
    default: return 'i-heroicons-question-mark-circle';
  }
}

function getResponseTimeColor(responseTime: number) {
  if (responseTime > 500) return 'text-red-500';
  if (responseTime > 200) return 'text-yellow-500';
  return 'text-green-500';
}
</script>

<style scoped>
/* Додаткові стилі, якщо потрібні, але Tailwind CSS та Nuxt UI вже надають багато */
</style>
