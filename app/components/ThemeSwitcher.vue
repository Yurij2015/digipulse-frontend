<script setup lang="ts">
import { computed } from 'vue'
import { useColorMode } from '#imports'

const colorMode = useColorMode()
const isDark = computed({
  get () {
    return colorMode.value === 'dark'
  },
  set (value: boolean) {
    colorMode.preference = value ? 'dark' : 'light'
  }
})
</script>

<template>
  <ClientOnly v-if="!colorMode?.forced">
    <UButton
      :icon="isDark ? 'i-heroicons-sun-20-solid' : 'i-heroicons-moon-20-solid'"
      color="neutral"
      variant="ghost"
      size="xl"
      aria-label="Theme"
      @click="isDark = !isDark"
      class="rounded-full hover:bg-neutral-200 dark:hover:bg-white/10 text-neutral-600 dark:text-neutral-400 hover:text-primary-500 dark:hover:text-primary-500 transition-all duration-300 shadow-sm dark:shadow-none bg-white/50 dark:bg-transparent backdrop-blur-sm dark:backdrop-blur-none"
    />
  </ClientOnly>
</template>
