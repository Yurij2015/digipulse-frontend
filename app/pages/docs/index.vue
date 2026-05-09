<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const config = useRuntimeConfig()

definePageMeta({ middleware: 'auth' })

useSeoMeta({ title: () => `${t('docs.title')} — DigiPulse` })

const { data: categories, pending, error } = await useAsyncData('kb-categories', () =>
  $fetch<any>(`${config.public.apiBase}/api/knowledge-base/categories`, {
    headers: { 'X-Frontend-Key': config.public.frontendKey as string }
  })
)

const list = computed(() => {
  const raw = categories.value
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
  <div class="p-6 lg:p-10 max-w-5xl mx-auto">
    <!-- Header -->
    <div class="mb-10">
      <h1 class="text-3xl font-black text-neutral-900 dark:text-white tracking-tight">
        {{ t('docs.title') }}
      </h1>
      <p class="mt-2 text-neutral-500 font-medium">{{ t('docs.subtitle') }}</p>
    </div>

    <!-- Loading -->
    <div v-if="pending" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="i in 6" :key="i"
        class="h-36 rounded-2xl bg-neutral-100 dark:bg-white/5 animate-pulse"
      />
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
        :to="localePath(`/docs/${cat.slug}`)"
        class="group relative overflow-hidden rounded-2xl border border-neutral-200/60 dark:border-white/8 bg-white dark:bg-neutral-900 p-6 transition-all duration-300 hover:border-primary-500/30 hover:shadow-lg hover:shadow-primary-500/5 hover:-translate-y-0.5 cursor-pointer"
      >
        <div class="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-primary-500/5 blur-2xl transition-opacity duration-300 group-hover:opacity-0" />

        <div class="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-500/10 text-primary-500 group-hover:bg-primary-500/15 transition-colors">
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
</template>
