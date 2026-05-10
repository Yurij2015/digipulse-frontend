<script setup lang="ts">
import { resolveLocaleString } from '~/utils/locale-field'

const { t, locale } = useI18n()
const localePath = useLocalePath()
const config = useRuntimeConfig()
const route = useRoute()
const url = useRequestURL()
const apiBase = useApiBase()

const slug = route.params.slug as string

function lt(field: unknown): string {
  return resolveLocaleString(field, locale.value)
}

const { data, pending, error } = await useAsyncData(
  `kb-category-v2-${slug}`,
  () => $fetch<any>(`${apiBase}/api/knowledge-base/categories/${slug}`, {
    headers: { 'X-Frontend-Key': config.public.frontendKey as string },
  }),
  {
    getCachedData: (key, nuxtApp, ctx) => kbGetCachedAsyncData(key, nuxtApp, ctx),
  },
)

const category = computed(() => {
  const raw = data.value
  if (!raw) return null
  return raw.data ?? raw
})

useSeoMeta({
  title: () => category.value
    ? `${lt(category.value.name)} — ${t('docs.title')} — DigiPulse`
    : `${t('docs.title')} — DigiPulse`,
  description: () => lt(category.value?.description) || t('docs.subtitle'),
  ogTitle: () => lt(category.value?.name) || t('docs.title'),
  ogDescription: () => lt(category.value?.description) || t('docs.subtitle'),
  ogUrl: () => url.href,
  ogImage: () => `${url.origin}/og-image-social.png`,
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: () => lt(category.value?.name) || t('docs.title'),
  twitterDescription: () => lt(category.value?.description) || t('docs.subtitle'),
  twitterImage: () => `${url.origin}/og-image-social.png`,
})
useHead({
  link: [{ rel: 'canonical', href: () => `${config.public.siteUrl || url.origin}/knowledge-base/${slug}` }],
})

const articles = computed(() => category.value?.articles ?? [])

const articlesLayout = useCookie<'grid' | 'list'>('kb-articles-layout', {
  default: () => 'grid',
  watch: true,
  sameSite: 'lax',
  maxAge: 60 * 60 * 24 * 365,
})
</script>

<template>
  <div class="relative min-h-screen bg-white dark:bg-neutral-950 mesh-bg flex flex-col pt-20 md:pt-32 pb-24 items-center px-6 md:px-8 overflow-hidden">
    <BaseLoader :show="pending" />
    <div class="absolute inset-0 z-0 pointer-events-none opacity-40 dark:opacity-60">
      <div class="absolute top-[5%] left-[5%] w-[50%] h-[50%] bg-primary-500/30 blur-[100px] rounded-full animate-pulse"></div>
      <div class="absolute bottom-[5%] right-[5%] w-[40%] h-[40%] bg-indigo-500/20 blur-[100px] rounded-full animate-pulse" style="animation-delay:1s"></div>
    </div>

    <div class="relative z-10 mx-auto w-full min-w-0 max-w-5xl self-stretch flex flex-col flex-1">
      <!-- Back -->
      <UButton
        :to="localePath('/knowledge-base')"
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
        <div :key="`${locale}-${slug}`" class="w-full min-w-0">
        <!-- Category header -->
        <div class="mb-10 w-full min-w-0">
          <h1 class="text-4xl md:text-5xl font-black text-neutral-900 dark:text-white tracking-tight leading-tight mb-3">
            {{ lt(category.name) }}
          </h1>
          <p v-if="lt(category.description)" class="text-neutral-500 font-medium text-lg">
            {{ lt(category.description) }}
          </p>

          <div
            v-if="articles.length"
            class="mt-8 flex flex-wrap items-center gap-3"
            role="group"
            :aria-label="t('docs.display_as')"
          >
            <span class="text-xs font-bold uppercase tracking-wider text-neutral-400">{{ t('docs.display_as') }}</span>
            <div class="inline-flex rounded-xl border border-neutral-200/70 dark:border-white/10 bg-white/50 dark:bg-neutral-900/50 p-0.5 backdrop-blur-sm">
              <button
                type="button"
                class="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition-colors"
                :class="articlesLayout === 'grid'
                  ? 'bg-primary-500/15 text-primary-600 dark:text-primary-400'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'"
                @click="articlesLayout = 'grid'"
              >
                <UIcon name="i-heroicons-squares-2x2" class="size-4" />
                {{ t('docs.view_cards') }}
              </button>
              <button
                type="button"
                class="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition-colors"
                :class="articlesLayout === 'list'
                  ? 'bg-primary-500/15 text-primary-600 dark:text-primary-400'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'"
                @click="articlesLayout = 'list'"
              >
                <UIcon name="i-heroicons-list-bullet" class="size-4" />
                {{ t('docs.view_list') }}
              </button>
            </div>
          </div>
        </div>

        <!-- Empty -->
        <div v-if="!articles.length" class="py-20 text-center text-neutral-400">
          <UIcon name="i-heroicons-document-text" class="text-5xl mb-3 opacity-30" />
          <p class="font-medium">{{ t('docs.no_articles') }}</p>
        </div>

        <!-- Articles: cards -->
        <div v-else-if="articlesLayout === 'grid'" class="grid w-full min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <NuxtLink
            v-for="article in articles"
            :key="article.slug"
            :to="localePath(`/knowledge-base/articles/${article.slug}`)"
            class="group relative overflow-hidden rounded-2xl border border-neutral-200/60 dark:border-white/8 bg-white dark:bg-neutral-900 p-6 transition-all duration-300 hover:border-primary-500/30 hover:shadow-xl hover:shadow-primary-500/5 hover:-translate-y-0.5 cursor-pointer flex flex-col h-full"
          >
            <div class="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-primary-500/5 blur-2xl group-hover:bg-primary-500/10 transition-colors duration-300" />
            <div class="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-500/10 text-primary-500 group-hover:bg-primary-500/20 transition-colors">
              <UIcon name="i-heroicons-document-text" class="text-xl" />
            </div>
            <div class="font-black text-neutral-900 dark:text-white text-[15px] tracking-tight leading-snug group-hover:text-primary-500 transition-colors">
              {{ lt(article.title) }}
            </div>
            <p v-if="article.excerpt && lt(article.excerpt)" class="mt-1.5 text-[12px] text-neutral-500 leading-relaxed line-clamp-3 flex-1">
              {{ lt(article.excerpt) }}
            </p>
            <div class="mt-4 flex items-center justify-end">
              <UIcon name="i-heroicons-arrow-right" class="text-neutral-400 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all text-sm" />
            </div>
          </NuxtLink>
        </div>

        <!-- Articles: list -->
        <div v-else class="flex w-full min-w-0 flex-col gap-3">
          <NuxtLink
            v-for="article in articles"
            :key="article.slug"
            :to="localePath(`/knowledge-base/articles/${article.slug}`)"
            class="group flex items-center gap-4 rounded-2xl border border-neutral-200/60 dark:border-white/8 bg-white dark:bg-neutral-900 px-4 py-4 sm:px-5 transition-all duration-300 hover:border-primary-500/30 hover:shadow-lg hover:shadow-primary-500/5"
          >
            <div class="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-500/10 text-primary-500 group-hover:bg-primary-500/20 transition-colors">
              <UIcon name="i-heroicons-document-text" class="text-xl" />
            </div>
            <div class="min-w-0 flex-1">
              <div class="font-black text-neutral-900 dark:text-white text-[15px] tracking-tight leading-snug group-hover:text-primary-500 transition-colors">
                {{ lt(article.title) }}
              </div>
              <p v-if="article.excerpt && lt(article.excerpt)" class="mt-0.5 text-[12px] text-neutral-500 leading-relaxed line-clamp-2">
                {{ lt(article.excerpt) }}
              </p>
            </div>
            <UIcon name="i-heroicons-arrow-right" class="size-5 shrink-0 text-neutral-400 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all" />
          </NuxtLink>
        </div>
        </div>
      </template>
      <div class="mt-auto"><AppFooter /></div>
    </div>
  </div>
</template>
