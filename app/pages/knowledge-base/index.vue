<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const config = useRuntimeConfig()
const url = useRequestURL()

useSeoMeta({
  title: `${t('docs.title')} — DigiPulse`,
  description: t('docs.subtitle'),
  ogTitle: t('docs.title'),
  ogDescription: t('docs.subtitle'),
  ogUrl: () => url.href,
  ogImage: () => `${url.origin}/og-image-social.png`,
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: t('docs.title'),
  twitterDescription: t('docs.subtitle'),
  twitterImage: () => `${url.origin}/og-image-social.png`,
})
useHead({
  link: [{ rel: 'canonical', href: () => `${config.public.siteUrl || url.origin}/docs` }],
})

const { data, pending, error } = await useAsyncData('kb-categories', () =>
  $fetch<any>(`${config.public.apiBase}/api/knowledge-base/categories`, {
    headers: { 'X-Frontend-Key': config.public.frontendKey as string }
  }), {
  getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key] ?? nuxtApp.static.data[key]
})

const list = computed(() => {
  const raw = data.value
  if (!raw) return []
  return Array.isArray(raw) ? raw : (raw.data || [])
})

function categoryIcon(icon?: string) {
  if (!icon) return 'i-heroicons-book-open'
  if (icon.startsWith('i-')) return icon
  return icon.replace('heroicon-o-', 'i-heroicons-').replace('heroicon-s-', 'i-heroicons-')
}
</script>

<template>
  <div class="relative min-h-screen bg-white dark:bg-neutral-950 mesh-bg flex flex-col pt-20 md:pt-32 pb-24 items-center px-6 md:px-8 overflow-hidden">
    <div class="absolute inset-0 z-0 pointer-events-none opacity-40 dark:opacity-60">
      <div class="absolute top-[5%] left-[5%] w-[50%] h-[50%] bg-primary-500/30 blur-[100px] rounded-full animate-pulse"></div>
      <div class="absolute bottom-[5%] right-[5%] w-[40%] h-[40%] bg-indigo-500/20 blur-[100px] rounded-full animate-pulse" style="animation-delay:1s"></div>
    </div>

    <div class="relative z-10 w-full max-w-5xl">
      <!-- Header -->
      <div class="mb-12">
        <div class="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-500 dark:text-primary-400 text-[10px] font-black tracking-[0.2em]">
          <div class="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"></div>
          <span>{{ t('docs.badge') }}</span>
        </div>
        <h1 class="text-4xl md:text-6xl font-black text-neutral-900 dark:text-white tracking-tight leading-tight mb-4">
          {{ t('docs.title') }}
        </h1>
        <p class="text-neutral-500 font-medium text-lg max-w-xl">{{ t('docs.subtitle') }}</p>
      </div>

      <!-- Loading -->
      <div v-if="pending" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="i in 6" :key="i" class="h-40 rounded-2xl bg-neutral-100 dark:bg-white/5 animate-pulse" />
      </div>

      <!-- Error -->
      <UAlert v-else-if="error" color="error" variant="subtle" icon="i-heroicons-exclamation-triangle"
        :title="t('common.error')" :description="t('docs.load_error')" />

      <!-- Empty -->
      <div v-else-if="!list.length" class="py-24 text-center text-neutral-400">
        <UIcon name="i-heroicons-book-open" class="text-5xl mb-4 opacity-30" />
        <p class="font-medium">{{ t('docs.no_categories') }}</p>
      </div>

      <!-- Categories grid -->
      <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <NuxtLink
          v-for="cat in list"
          :key="cat.slug"
          :to="localePath(`/knowledge-base/${cat.slug}`)"
          class="group relative overflow-hidden rounded-2xl border border-neutral-200/60 dark:border-white/8 bg-white dark:bg-neutral-900 p-6 transition-all duration-300 hover:border-primary-500/30 hover:shadow-xl hover:shadow-primary-500/5 hover:-translate-y-0.5 cursor-pointer"
        >
          <div class="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-primary-500/5 blur-2xl group-hover:bg-primary-500/10 transition-colors duration-300" />

          <div class="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-500/10 text-primary-500 group-hover:bg-primary-500/20 transition-colors">
            <UIcon :name="categoryIcon(cat.icon)" class="text-xl" />
          </div>

          <div class="font-black text-neutral-900 dark:text-white text-[15px] tracking-tight leading-snug">
            {{ cat.name }}
          </div>

          <p v-if="cat.description" class="mt-1.5 text-[12px] text-neutral-500 leading-relaxed line-clamp-2">
            {{ cat.description }}
          </p>

          <div class="mt-4 flex items-center justify-between">
            <span class="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
              {{ cat.articles_count ?? 0 }} {{ t('docs.articles') }}
            </span>
            <UIcon name="i-heroicons-arrow-right" class="text-neutral-400 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all text-sm" />
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
