<script setup lang="ts">
import { useAuth } from '#imports'
import { watch, ref } from 'vue'
import { useSitesStore } from '~/stores/sites'

const { init } = useAuth()
const sitesStore = useSitesStore()

// Custom progress bar logic
const progress = ref(0)
const isVisible = ref(false)
let timer: any = null
let finishTimeout: any = null

const head = useLocaleHead()

useHead({
  htmlAttrs: head.value.htmlAttrs,
  link: head.value.link,
  meta: head.value.meta
})

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
    <!-- Custom Progress Bar -->
    <div 
      class="fixed top-0 left-0 h-0.5 z-10002 transition-all duration-300 ease-out"
      :style="{ 
        width: `${progress}%`, 
        opacity: isVisible ? 1 : 0,
        background: 'linear-gradient(to right, #ec4899, #8b5cf6, #06b6d4)',
      }"
    ></div>
    <PublicHeader />
    <NuxtRouteAnnouncer />
    <main id="main-content" role="main">
      <NuxtPage />
    </main>
  </UApp>
</template>
