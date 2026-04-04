<script setup lang="ts">
import { useRoute } from '#imports'
const route = useRoute()
</script>

<template>
  <UApp>
    <div 
      v-if="!route.path.match(/^\/(?:uk|pl)?\/?dashboard/)"
      class="fixed z-1001"
      :class="[
        (route.path.match(/^\/(?:uk|pl)?\/?$/) || route.path.match(/^\/(?:uk|pl)?\/?auth/) || route.path.match(/^\/(?:uk|pl)?\/?add-website/)) ? 'top-6 right-6' : 'bottom-6 left-6'
      ]"
    >
      <ThemeSwitcher />
    </div>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </UApp>
</template>
