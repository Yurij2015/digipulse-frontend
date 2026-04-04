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
      size="md"
      aria-label="Theme"
      @click="isDark = !isDark"
      class="rounded-lg hover:bg-neutral-100 dark:hover:bg-white/5 text-neutral-500 hover:text-primary-500 transition-all duration-300 select-none px-3"
    />
  </ClientOnly>
</template>
