<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useLocalePath, useI18n, useRuntimeConfig } from '#imports'

const { t } = useI18n()
const localePath = useLocalePath()
const config = useRuntimeConfig()
const visible = ref(false)

onMounted(() => {
  if (!config.public.showBetaBanner) return
  visible.value = localStorage.getItem('beta-banner-dismissed') !== '1'
})

function dismiss() {
  visible.value = false
  localStorage.setItem('beta-banner-dismissed', '1')
}
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 translate-y-2"
    leave-active-class="transition-all duration-200 ease-in"
    leave-to-class="opacity-0 translate-y-2"
  >
    <div
      v-if="visible"
      class="relative rounded-xl px-4 py-3 bg-gradient-to-br from-pink-500/10 via-violet-500/10 to-cyan-500/10 border border-violet-500/20 dark:border-violet-500/10"
    >
      <button
        class="absolute top-2 right-2 p-0.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors rounded cursor-pointer"
        :aria-label="t('common.close')"
        @click="dismiss"
      >
        <UIcon name="i-heroicons-x-mark" class="text-sm" />
      </button>

      <div class="flex items-center gap-2 mb-1.5">
        <span class="text-[10px] font-black uppercase tracking-widest text-violet-500 bg-violet-500/10 px-2 py-0.5 rounded-full">
          Beta
        </span>
      </div>

      <p class="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed mb-2">
        {{ t('beta.message') }}
      </p>

      <NuxtLink
        :to="localePath('/support')"
        class="inline-flex items-center gap-1 text-[11px] font-black text-primary-500 hover:text-primary-400 transition-colors"
      >
        {{ t('beta.cta') }}
        <UIcon name="i-heroicons-arrow-right" class="text-xs" />
      </NuxtLink>
    </div>
  </Transition>
</template>