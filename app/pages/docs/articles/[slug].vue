<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const config = useRuntimeConfig()
const route = useRoute()

definePageMeta({ middleware: 'auth' })

const slug = route.params.slug as string

const { data, pending, error } = await useAsyncData(`kb-article-${slug}`, () =>
  $fetch<any>(`${config.public.apiBase}/api/knowledge-base/articles/${slug}`, {
    headers: { 'X-Frontend-Key': config.public.frontendKey as string }
  })
)

const article = computed(() => {
  const raw = data.value
  if (!raw) return null
  return raw.data ?? raw
})

useSeoMeta({
  title: () => article.value ? `${article.value.title} — ${t('docs.title')} — DigiPulse` : 'DigiPulse'
})

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
  <div class="p-6 lg:p-10 max-w-3xl mx-auto">
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
    <UAlert
      v-else-if="error"
      color="error"
      variant="subtle"
      icon="i-heroicons-exclamation-triangle"
      :title="t('common.error')"
      :description="t('docs.load_error')"
    />

    <template v-else-if="article">
      <!-- Breadcrumb -->
      <div v-if="article.category" class="mb-4 flex items-center gap-2 text-[12px] text-neutral-400 font-medium">
        <NuxtLink :to="localePath('/docs')" class="hover:text-primary-500 transition-colors">
          {{ t('docs.title') }}
        </NuxtLink>
        <UIcon name="i-heroicons-chevron-right" class="text-xs" />
        <NuxtLink :to="localePath(`/docs/${article.category.slug}`)" class="hover:text-primary-500 transition-colors">
          {{ article.category.name }}
        </NuxtLink>
      </div>

      <!-- Title -->
      <h1 class="text-3xl font-black text-neutral-900 dark:text-white tracking-tight leading-tight mb-8">
        {{ article.title }}
      </h1>

      <!-- Content -->
      <div
        class="prose prose-neutral dark:prose-invert max-w-none
          prose-headings:font-black prose-headings:tracking-tight
          prose-h2:text-xl prose-h3:text-base
          prose-p:text-neutral-600 dark:prose-p:text-neutral-400 prose-p:leading-relaxed
          prose-a:text-primary-500 prose-a:no-underline hover:prose-a:underline
          prose-code:bg-neutral-100 dark:prose-code:bg-white/8 prose-code:rounded prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[13px] prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
          prose-pre:bg-neutral-100 dark:prose-pre:bg-white/5 prose-pre:rounded-xl prose-pre:border prose-pre:border-neutral-200/60 dark:prose-pre:border-white/8
          prose-blockquote:border-primary-500/40 prose-blockquote:text-neutral-500
          prose-ul:text-neutral-600 dark:prose-ul:text-neutral-400
          prose-ol:text-neutral-600 dark:prose-ol:text-neutral-400
          prose-strong:text-neutral-900 dark:prose-strong:text-white
          prose-hr:border-neutral-200 dark:prose-hr:border-white/8"
        v-html="article.content"
      />
    </template>
  </div>
</template>
