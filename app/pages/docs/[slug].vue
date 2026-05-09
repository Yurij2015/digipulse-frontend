<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const config = useRuntimeConfig()
const route = useRoute()

const slug = route.params.slug as string

const { data, pending, error } = await useAsyncData(`kb-category-${slug}`, () =>
  $fetch<any>(`${config.public.apiBase}/api/knowledge-base/categories/${slug}`, {
    headers: { 'X-Frontend-Key': config.public.frontendKey as string }
  }), {
  getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key] ?? nuxtApp.static.data[key]
})

const category = computed(() => {
  const raw = data.value
  if (!raw) return null
  return raw.data ?? raw
})

useSeoMeta({
  title: () => category.value
    ? `${category.value.name} — ${t('docs.title')} — DigiPulse`
    : `${t('docs.title')} — DigiPulse`,
  description: () => category.value?.description ?? t('docs.subtitle')
})

const articles = computed(() => category.value?.articles ?? [])
</script>

<template>
  <div class="relative min-h-screen bg-white dark:bg-neutral-950 mesh-bg flex flex-col pt-20 md:pt-32 pb-24 items-center px-6 md:px-8 overflow-hidden">
    <div class="absolute inset-0 z-0 pointer-events-none opacity-40 dark:opacity-60">
      <div class="absolute top-[5%] left-[5%] w-[50%] h-[50%] bg-primary-500/30 blur-[100px] rounded-full animate-pulse"></div>
      <div class="absolute bottom-[5%] right-[5%] w-[40%] h-[40%] bg-indigo-500/20 blur-[100px] rounded-full animate-pulse" style="animation-delay:1s"></div>
    </div>

    <div class="relative z-10 w-full max-w-4xl">
      <!-- Back -->
      <UButton
        :to="localePath('/docs')"
        variant="ghost"
        color="neutral"
        icon="i-heroicons-arrow-left"
        class="mb-8 font-bold text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
      >
        {{ t('docs.back_to_docs') }}
      </UButton>

      <!-- Loading -->
      <div v-if="pending" class="space-y-4">
        <div class="h-10 w-64 rounded-xl bg-neutral-100 dark:bg-white/5 animate-pulse" />
        <div class="h-4 w-96 rounded-lg bg-neutral-100 dark:bg-white/5 animate-pulse" />
        <div class="mt-8 space-y-3">
          <div v-for="i in 4" :key="i" class="h-24 rounded-2xl bg-neutral-100 dark:bg-white/5 animate-pulse" />
        </div>
      </div>

      <!-- Error -->
      <UAlert v-else-if="error" color="error" variant="subtle" icon="i-heroicons-exclamation-triangle"
        :title="t('common.error')" :description="t('docs.load_error')" />

      <template v-else-if="category">
        <!-- Category header -->
        <div class="mb-10">
          <h1 class="text-4xl md:text-5xl font-black text-neutral-900 dark:text-white tracking-tight leading-tight mb-3">
            {{ category.name }}
          </h1>
          <p v-if="category.description" class="text-neutral-500 font-medium text-lg">
            {{ category.description }}
          </p>
        </div>

        <!-- Empty -->
        <div v-if="!articles.length" class="py-20 text-center text-neutral-400">
          <UIcon name="i-heroicons-document-text" class="text-5xl mb-3 opacity-30" />
          <p class="font-medium">{{ t('docs.no_articles') }}</p>
        </div>

        <!-- Articles list -->
        <div v-else class="space-y-3">
          <NuxtLink
            v-for="article in articles"
            :key="article.slug"
            :to="localePath(`/docs/articles/${article.slug}`)"
            class="group flex items-center justify-between gap-4 rounded-2xl border border-neutral-200/60 dark:border-white/8 bg-white dark:bg-neutral-900 p-5 transition-all duration-200 hover:border-primary-500/30 hover:shadow-lg hover:shadow-primary-500/5 cursor-pointer"
          >
            <div class="flex items-start gap-4 min-w-0">
              <div class="mt-0.5 flex-shrink-0 w-9 h-9 rounded-xl bg-primary-500/10 flex items-center justify-center">
                <UIcon name="i-heroicons-document-text" class="text-primary-500 text-sm" />
              </div>
              <div class="min-w-0">
                <div class="font-bold text-neutral-900 dark:text-white text-[14px] leading-snug group-hover:text-primary-500 transition-colors">
                  {{ article.title }}
                </div>
                <p v-if="article.excerpt" class="mt-1 text-[12px] text-neutral-500 line-clamp-2 leading-relaxed">
                  {{ article.excerpt }}
                </p>
              </div>
            </div>
            <UIcon name="i-heroicons-chevron-right" class="flex-shrink-0 text-neutral-400 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all" />
          </NuxtLink>
        </div>
      </template>
    </div>
  </div>
</template>
