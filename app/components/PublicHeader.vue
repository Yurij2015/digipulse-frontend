<template>
  <header 
    v-if="show"
    class="absolute top-0 left-0 right-0 z-1001 border-b border-neutral-100 dark:border-white/5 h-16 md:h-20"
  >
    <div class="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
      <NuxtLink :to="localePath('/')" class="flex items-center gap-3 group">
        <div class="w-8 h-8 md:w-11 md:h-11 rounded-xl overflow-hidden group-hover:scale-105 transition-transform duration-500 shadow-lg shadow-primary-500/20">
           <svg class="w-full h-full" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="40" height="40" rx="10" fill="url(#header-logo-grad)" />
              <g transform="translate(4, 4)">
                <rect x="2" y="18" width="3" height="10" rx="1" fill="white" />
                <rect x="6" y="12" width="3" height="16" rx="1" fill="white" />
                <rect x="10" y="6" width="3" height="22" rx="1" fill="white" />
                <rect x="14" y="14" width="3" height="14" rx="1" fill="white" />
                <rect x="18" y="20" width="3" height="8" rx="1" fill="white" />
                <rect x="22" y="10" width="3" height="18" rx="1" fill="white" />
                <rect x="26" y="4" width="3" height="24" rx="1" fill="white" />
              </g>
              <defs>
                <linearGradient id="header-logo-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#8b5cf6" />
                  <stop offset="1" stop-color="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>
        </div>
        <span class="text-xl md:text-2xl font-black tracking-tighter text-neutral-900 dark:text-white">DigiPulse</span>
      </NuxtLink>

      <div class="flex items-center gap-2 md:gap-6">
        <NuxtLink 
          v-if="isAuthenticated"
          :to="localePath('/support')" 
          class="hidden md:block text-sm font-black uppercase tracking-widest text-neutral-500 hover:text-primary-500 transition-colors"
        >
          {{ $t('support.title') }}
        </NuxtLink>
        <div class="flex items-center gap-2 md:gap-4">
          <LanguageSwitcher side="top" />
          <ThemeSwitcher />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRoute, useLocalePath, useAuth } from '#imports'
import { computed } from 'vue'

const route = useRoute()
const localePath = useLocalePath()
const { isAuthenticated } = useAuth()

const show = computed(() => {
  return !route.path.match(/^\/(?:uk|pl)?\/?(?:dashboard|sites|settings|support)/)
})
</script>
