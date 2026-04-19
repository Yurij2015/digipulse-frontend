<template>
  <footer class="mt-12 w-full border-t border-neutral-100 dark:border-neutral-900 pt-12 flex flex-col md:flex-row items-center justify-between gap-6">
    <div class="flex items-center gap-3">
      <svg class="w-10 h-10 shadow-lg shadow-primary-500/20 rounded-xl transition-opacity hover:opacity-100" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="10" fill="url(#footer-grad)" />
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
          <linearGradient id="footer-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stop-color="#8b5cf6" />
            <stop offset="1" stop-color="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>
    </div>
    <div class="flex flex-col md:flex-row items-center gap-4 md:gap-8 w-full md:w-auto">
      <div class="flex items-center gap-6">
        <NuxtLink :to="localePath('/privacy')" class="text-xs text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors font-medium">
          {{ $t('index.privacy_policy') }}
        </NuxtLink>
        <NuxtLink :to="localePath('/terms')" class="text-xs text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors font-medium">
          {{ $t('index.terms_of_service') }}
        </NuxtLink>
      </div>
      <p class="text-xs text-neutral-600 dark:text-neutral-400 font-medium text-center md:text-right">
        {{ $t('index.footer_rights') }}
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
const localePath = useLocalePath()
</script>

