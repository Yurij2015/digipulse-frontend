<template>
  <div class="overflow-hidden">
    <!-- Skeleton Table Header -->
    <div class="flex items-center gap-4 px-6 py-4 border-b border-neutral-100 dark:border-white/5">
      <div v-for="i in columns" :key="i" class="flex-1">
        <USkeleton class="h-3 rounded-full" :class="i === 1 ? 'w-24' : i === columns ? 'w-16' : 'w-20'" />
      </div>
    </div>

    <!-- Skeleton Table Rows -->
    <div v-for="row in rows" :key="row" class="flex items-center gap-4 px-6 py-5 border-b border-neutral-50 dark:border-white/2">
      <!-- Icon + Name -->
      <div class="flex-1 flex items-center gap-3">
        <USkeleton class="w-8 h-8 rounded-lg shrink-0" />
        <USkeleton class="h-3.5 rounded-full" :style="{ width: `${60 + (row * 17) % 40}%` }" />
      </div>

      <!-- Description -->
      <div v-if="columns >= 3" class="flex-1">
        <USkeleton class="h-3 rounded-full" :style="{ width: `${40 + (row * 23) % 35}%` }" />
      </div>

      <!-- Badge -->
      <div v-if="columns >= 4" class="flex-1">
        <USkeleton class="h-5 w-16 rounded-md" />
      </div>

      <!-- Extra columns -->
      <div v-for="col in Math.max(0, columns - 4)" :key="col" class="flex-1">
        <USkeleton class="h-3 rounded-full w-3/4" />
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-2">
        <USkeleton v-for="a in actions" :key="a" class="w-7 h-7 rounded-md" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  rows?: number;
  columns?: number;
  actions?: number;
}>(), {
  rows: 4,
  columns: 4,
  actions: 3,
});
</script>
