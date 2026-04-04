<script setup lang="ts">
import { useRoute } from '#imports'
const route = useRoute()
</script>

<template>
  <UApp>
    <div 
      v-if="!route.path.startsWith('/dashboard')"
      class="fixed z-1001"
      :class="[
        (route.path.startsWith('/auth') || route.path.startsWith('/add-website')) ? 'top-6 right-6' : 'bottom-6 left-6'
      ]"
    >
      <ThemeSwitcher />
    </div>
    <div 
      v-if="route.path.startsWith('/dashboard')"
      class="hidden lg:block fixed bottom-6 left-6 z-1001"
    >
      <ThemeSwitcher />
    </div>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </UApp>
</template>
