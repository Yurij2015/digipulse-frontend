<script setup lang="ts">
import { resolveKnowledgeBaseArticleHtml } from '~/utils/knowledge-base-content'
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
  `kb-article-${slug}`,
  () => $fetch<any>(`${apiBase}/api/knowledge-base/articles/${slug}`, {
    headers: { 'X-Frontend-Key': config.public.frontendKey as string },
  }),
  {
    getCachedData: (key, nuxtApp, ctx) => kbGetCachedAsyncData(key, nuxtApp, ctx),
  },
)

const article = computed(() => {
  const raw = data.value
  if (!raw) return null
  return raw.data ?? raw
})

const siteUrl = computed(() => (config.public.siteUrl as string) || url.origin)

const articleTitle = computed(() => lt(article.value?.meta?.title) || lt(article.value?.title))
const articleDescription = computed(() => lt(article.value?.meta?.description) || lt(article.value?.excerpt))
const articleImage = computed(() =>
  article.value?.meta?.og_image
    ? `${siteUrl.value}${article.value.meta.og_image}`
    : article.value?.cover_image
      ? `${siteUrl.value}${article.value.cover_image}`
      : `${url.origin}/og-image-social.png`
)

const articleBodyHtml = computed((): string => {
  const html = resolveKnowledgeBaseArticleHtml(article.value?.content, locale.value)
  return typeof html === 'string' ? html : ''
})

const publishLocaleTag = computed(() => {
  if (locale.value === 'uk') {
    return 'uk-UA'
  }
  if (locale.value === 'pl') {
    return 'pl-PL'
  }
  return 'en-US'
})

const publishedFormatted = computed((): string | null => {
  const at = article.value?.published_at
  if (!at) {
    return null
  }
  try {
    return new Intl.DateTimeFormat(publishLocaleTag.value, { dateStyle: 'long' }).format(new Date(at))
  } catch {
    return null
  }
})

const articleLead = computed(() => lt(article.value?.excerpt))

useSeoMeta({
  title: () => articleTitle.value
    ? `${articleTitle.value} — ${t('docs.title')} — DigiPulse`
    : `${t('docs.title')} — DigiPulse`,
  description: () => articleDescription.value || t('docs.subtitle'),
  ogTitle: () => articleTitle.value || t('docs.title'),
  ogDescription: () => articleDescription.value || t('docs.subtitle'),
  ogUrl: () => url.href,
  ogImage: () => articleImage.value,
  ogType: 'article',
  twitterCard: 'summary_large_image',
  twitterTitle: () => articleTitle.value || t('docs.title'),
  twitterDescription: () => articleDescription.value || t('docs.subtitle'),
  twitterImage: () => articleImage.value,
})
useHead({
  link: [{ rel: 'canonical', href: () => `${siteUrl.value}/knowledge-base/articles/${slug}` }],
})

useHead(computed(() => ({
  script: article.value ? [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: lt(article.value.title),
      description: lt(article.value.excerpt) ?? '',
      image: articleImage.value,
      datePublished: article.value.published_at,
      dateModified: article.value.updated_at ?? article.value.published_at,
      publisher: {
        '@type': 'Organization',
        name: 'DigiPulse',
        logo: { '@type': 'ImageObject', url: `${siteUrl.value}/favicon.svg` }
      },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: t('docs.title'), item: `${siteUrl.value}/knowledge-base` },
          ...(article.value.category ? [{ '@type': 'ListItem', position: 2, name: lt(article.value.category.name), item: `${siteUrl.value}/knowledge-base/${article.value.category.slug}` }] : []),
          { '@type': 'ListItem', position: article.value.category ? 3 : 2, name: lt(article.value.title) },
        ]
      }
    })
  }] : []
})))

const backTo = computed(() =>
  article.value?.category?.slug
    ? localePath(`/knowledge-base/${article.value.category.slug}`)
    : localePath('/knowledge-base')
)

const backLabel = computed(() =>
  article.value?.category?.name ? lt(article.value.category.name) : t('docs.back_to_docs')
)
</script>

<template>
  <div class="relative min-h-screen bg-white dark:bg-neutral-950 mesh-bg flex flex-col pt-20 md:pt-32 pb-24 items-center px-6 md:px-8 overflow-hidden">
    <BaseLoader :show="pending" />
    <div class="absolute inset-0 z-0 pointer-events-none opacity-40 dark:opacity-60">
      <div class="absolute top-[5%] left-[5%] w-[50%] h-[50%] bg-primary-500/30 blur-[100px] rounded-full animate-pulse"></div>
      <div class="absolute bottom-[5%] right-[5%] w-[40%] h-[40%] bg-indigo-500/20 blur-[100px] rounded-full animate-pulse" style="animation-delay:1s"></div>
    </div>

    <div class="relative z-10 w-full max-w-3xl">
      <!-- Back -->
      <UButton
        :to="backTo"
        variant="ghost"
        color="neutral"
        icon="i-heroicons-arrow-left"
        class="mb-8 font-bold text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
      >
        {{ backLabel }}
      </UButton>

      <!-- Error -->
      <UAlert v-if="error" color="error" variant="subtle" icon="i-heroicons-exclamation-triangle"
        :title="t('common.error')" :description="t('docs.load_error')" />

      <template v-else-if="article">
        <div :key="`${locale}-${slug}`" class="contents">
        <!-- Breadcrumb -->
        <div v-if="article.category" class="mb-5 flex items-center gap-2 text-[12px] text-neutral-400 font-medium">
          <NuxtLink :to="localePath('/knowledge-base')" class="hover:text-primary-500 transition-colors">
            {{ t('docs.title') }}
          </NuxtLink>
          <UIcon name="i-heroicons-chevron-right" class="text-xs" />
          <NuxtLink :to="localePath(`/knowledge-base/${article.category.slug}`)" class="hover:text-primary-500 transition-colors">
            {{ lt(article.category.name) }}
          </NuxtLink>
        </div>

        <!-- Title & meta -->
        <header class="mb-8 md:mb-10">
          <h1 class="text-3xl sm:text-4xl md:text-[2.75rem] font-black text-neutral-900 dark:text-white tracking-tight leading-[1.1] text-balance">
            {{ lt(article.title) }}
          </h1>
          <p
            v-if="articleLead"
            class="mt-5 text-lg md:text-xl text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed max-w-2xl text-pretty"
          >
            {{ articleLead }}
          </p>
          <div
            v-if="publishedFormatted"
            class="mt-6 flex items-center gap-2 text-sm text-neutral-400 dark:text-neutral-500"
          >
            <UIcon name="i-heroicons-calendar-days" class="size-4 shrink-0 text-primary-500/80" />
            <span>{{ t('docs.published_on') }} <time :datetime="article.published_at">{{ publishedFormatted }}</time></span>
          </div>
        </header>

        <!-- Article body -->
        <div class="kb-article-shell p-6 sm:p-8 md:p-10 lg:p-12">
          <div
            class="kb-article-prose"
            v-html="articleBodyHtml"
          />
        </div>
        </div>
      </template>
    </div>
  </div>
</template>
