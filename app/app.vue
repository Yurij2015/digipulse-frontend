<script setup lang="ts">
import { useRoute, useAuth } from '#imports'
import { watch, ref } from 'vue'
import { useSitesStore } from '~/stores/sites'

const route = useRoute()
const { init } = useAuth()
const sitesStore = useSitesStore()

// Custom progress bar logic
const progress = ref(0)
const isVisible = ref(false)
let timer: any = null
let finishTimeout: any = null

watch(() => sitesStore.loading, (loading) => {
  if (loading) {
    if (finishTimeout) clearTimeout(finishTimeout)
    isVisible.value = true
    if (progress.value === 0) progress.value = 10
    
    if (!timer) {
      timer = setInterval(() => {
        if (progress.value < 90) progress.value += (95 - progress.value) * 0.05
      }, 150)
    }
  } else {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
    
    // Smoothly finish
    progress.value = 100
    finishTimeout = setTimeout(() => {
      isVisible.value = false
      setTimeout(() => { 
        if (!sitesStore.loading) progress.value = 0 
      }, 400)
    }, 300)
  }
}, { immediate: true })
</script>

<template>
  <UApp :toaster="{ position: 'top-center', duration: 3000 }">
    <!-- Custom Premium Progress Bar -->
    <div 
      class="fixed top-0 left-0 h-[2px] z-10002 transition-all duration-300 ease-out"
      :style="{ 
        width: `${progress}%`, 
        opacity: isVisible ? 1 : 0,
        background: 'linear-gradient(to right, #ec4899, #8b5cf6, #06b6d4)',
      }"
    ></div>
    
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
