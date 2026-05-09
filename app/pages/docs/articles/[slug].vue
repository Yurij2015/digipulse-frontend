<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const config = useRuntimeConfig()
const route = useRoute()
const url = useRequestURL()

const slug = route.params.slug as string

const { data, pending, error } = await useAsyncData(`kb-article-${slug}`, () =>
  $fetch<any>(`${config.public.apiBase}/api/knowledge-base/articles/${slug}`, {
    headers: { 'X-Frontend-Key': config.public.frontendKey as string }
  }), {
  getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key] ?? nuxtApp.static.data[key]
})

const article = computed(() => {
  const raw = data.value
  if (!raw) return null
  return raw.data ?? raw
})

const siteUrl = computed(() => (config.public.siteUrl as string) || url.origin)

useSeoMeta({
  title: () => article.value
    ? `${article.value.title} — ${t('docs.title')} — DigiPulse`
    : `${t('docs.title')} — DigiPulse`,
  description: () => article.value?.excerpt ?? t('docs.subtitle'),
  ogTitle: () => article.value?.title ?? t('docs.title'),
  ogDescription: () => article.value?.excerpt ?? t('docs.subtitle'),
  ogUrl: () => url.href,
  ogImage: () => article.value?.image ? `${siteUrl.value}${article.value.image}` : `${url.origin}/og-image-social.png`,
  ogType: 'article',
  twitterCard: 'summary_large_image',
  twitterTitle: () => article.value?.title ?? t('docs.title'),
  twitterDescription: () => article.value?.excerpt ?? t('docs.subtitle'),
  twitterImage: () => article.value?.image ? `${siteUrl.value}${article.value.image}` : `${url.origin}/og-image-social.png`,
})
useHead({
  link: [{ rel: 'canonical', href: () => `${siteUrl.value}/docs/articles/${slug}` }],
})

useHead(computed(() => ({
  script: article.value ? [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.value.title,
      description: article.value.excerpt ?? '',
      image: article.value.image ? `${siteUrl.value}${article.value.image}` : `${siteUrl.value}/og-image-social.png`,
      datePublished: article.value.created_at,
      dateModified: article.value.updated_at ?? article.value.created_at,
      publisher: {
        '@type': 'Organization',
        name: 'DigiPulse',
        logo: { '@type': 'ImageObject', url: `${siteUrl.value}/favicon.svg` }
      },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: t('docs.title'), item: `${siteUrl.value}/docs` },
          ...(article.value.category ? [{ '@type': 'ListItem', position: 2, name: article.value.category.name, item: `${siteUrl.value}/docs/${article.value.category.slug}` }] : []),
          { '@type': 'ListItem', position: article.value.category ? 3 : 2, name: article.value.title },
        ]
      }
    })
  }] : []
})))

const backTo = computed(() =>
  article.value?.category?.slug
    ? localePath(`/docs/${article.value.category.slug}`)
    : localePath('/docs')
)

const backLabel = computed(() =>
  article.value?.category?.name ?? t('docs.back_to_docs')
)
</script>

<template>
  <div class="relative min-h-screen bg-white dark:bg-neutral-950 mesh-bg flex flex-col pt-20 md:pt-32 pb-24 items-center px-6 md:px-8 overflow-hidden">
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

      <!-- Loading -->
      <div v-if="pending" class="space-y-4">
        <div class="h-10 w-3/4 rounded-xl bg-neutral-100 dark:bg-white/5 animate-pulse" />
        <div class="h-4 w-32 rounded-lg bg-neutral-100 dark:bg-white/5 animate-pulse" />
        <div class="mt-8 space-y-3">
          <div v-for="i in 8" :key="i" class="h-4 rounded-lg bg-neutral-100 dark:bg-white/5 animate-pulse" :class="i % 4 === 0 ? 'w-2/3' : 'w-full'" />
        </div>
      </div>

      <!-- Error -->
      <UAlert v-else-if="error" color="error" variant="subtle" icon="i-heroicons-exclamation-triangle"
        :title="t('common.error')" :description="t('docs.load_error')" />

      <template v-else-if="article">
        <!-- Breadcrumb -->
        <div v-if="article.category" class="mb-5 flex items-center gap-2 text-[12px] text-neutral-400 font-medium">
          <NuxtLink :to="localePath('/docs')" class="hover:text-primary-500 transition-colors">
            {{ t('docs.title') }}
          </NuxtLink>
          <UIcon name="i-heroicons-chevron-right" class="text-xs" />
          <NuxtLink :to="localePath(`/docs/${article.category.slug}`)" class="hover:text-primary-500 transition-colors">
            {{ article.category.name }}
          </NuxtLink>
        </div>

        <!-- Title -->
        <h1 class="text-3xl md:text-4xl font-black text-neutral-900 dark:text-white tracking-tight leading-tight mb-10">
          {{ article.title }}
        </h1>

        <!-- Article card -->
        <div class="rounded-2xl border border-neutral-200/60 dark:border-white/8 bg-white dark:bg-neutral-900 p-8 md:p-10">
          <div
            class="prose prose-neutral dark:prose-invert max-w-none
              prose-headings:font-black prose-headings:tracking-tight
              prose-h2:text-xl prose-h3:text-base
              prose-p:text-neutral-600 dark:prose-p:text-neutral-400 prose-p:leading-relaxed
              prose-a:text-primary-500 prose-a:no-underline hover:prose-a:underline
              prose-code:bg-neutral-100 dark:prose-code:bg-white/8 prose-code:rounded prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[13px] prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
              prose-pre:bg-neutral-950 dark:prose-pre:bg-black/40 prose-pre:rounded-xl prose-pre:border prose-pre:border-neutral-200/60 dark:prose-pre:border-white/8
              prose-blockquote:border-primary-500/40 prose-blockquote:text-neutral-500
              prose-strong:text-neutral-900 dark:prose-strong:text-white
              prose-hr:border-neutral-200 dark:prose-hr:border-white/8"
            v-html="article.content"
          />
        </div>
      </template>
    </div>
  </div>
</template>
