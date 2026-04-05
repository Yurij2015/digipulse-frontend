<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-4">{{ $t('settings.title') }}</h1>
    <p class="text-neutral-500">Settings page coming soon...</p>
    <UButton :to="localePath('/dashboard')" icon="i-heroicons-arrow-left" class="mt-4">
      Back to Dashboard
    </UButton>
  </div>
</template>

<script setup lang="ts">
import { useLocalePath } from '#i18n';
const localePath = useLocalePath();

definePageMeta({
  middleware: 'auth'
});
</script>
