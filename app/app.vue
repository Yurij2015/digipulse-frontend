<script setup lang="ts">
import { useRoute, useAuth, onMounted } from '#imports'
const route = useRoute()
const { init } = useAuth()

onMounted(() => {
  init()
})
</script>

<template>
  <UApp>
    <div 
      v-if="!route.path.match(/^\/(?:uk|pl)?\/?dashboard/)"
      class="fixed z-1001 flex items-center gap-4"
      :class="[
        (route.path.match(/^\/(?:uk|pl)?\/?$/) || route.path.match(/^\/(?:uk|pl)?\/?auth/) || route.path.match(/^\/(?:uk|pl)?\/?add-website/)) ? 'top-6 right-6' : 'bottom-6 left-6'
      ]"
    >
      <LanguageSwitcher :side="(route.path.match(/^\/(?:uk|pl)?\/?$/) || route.path.match(/^\/(?:uk|pl)?\/?auth/) || route.path.match(/^\/(?:uk|pl)?\/?add-website/)) ? 'top' : 'bottom'" />
      <ThemeSwitcher />
    </div>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </UApp>
</template>
