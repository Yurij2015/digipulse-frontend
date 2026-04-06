<script setup lang="ts">
import { useRoute, useAuth, onMounted } from '#imports'
const route = useRoute()
const { init } = useAuth()

// Auth initialization is now handled automatically by useCookie state
</script>

<template>
  <UApp>
    <div 
      v-if="!route.path.match(/^\/(?:uk|pl)?\/?(?:dashboard|sites|settings)/)"
      class="fixed z-1001 flex items-center gap-4 top-6 right-6"
    >
      <LanguageSwitcher side="top" />
      <ThemeSwitcher />
    </div>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </UApp>
</template>
