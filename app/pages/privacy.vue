<template>
  <div class="relative min-h-screen bg-white dark:bg-neutral-950 mesh-bg flex flex-col pt-20 md:pt-32 pb-24 items-center px-6 md:px-8 overflow-hidden">
    <!-- Sophisticated Mesh Background Layer -->
    <div class="absolute inset-0 z-0 pointer-events-none opacity-40 dark:opacity-60">
      <div class="absolute top-[10%] left-[10%] w-[40%] h-[40%] bg-primary-500 animate-pulse-slow blur-[120px] rounded-full"></div>
      <div class="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-accent-500 animate-pulse-slow blur-[120px] rounded-full delay-1000"></div>
    </div>

    <!-- Header Actions are now global in app.vue -->

    <div class="relative z-10 w-full max-w-4xl text-left flex flex-col items-start">
      <!-- Sophisticated Badge -->
      <div class="inline-flex items-center gap-2 px-3 py-1 mb-12 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-500 dark:text-primary-400 text-[10px] font-black tracking-[0.2em] transition-all hover:bg-primary-500/20">
        <div class="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"></div>
        <span>{{ $t('index.premium_monitoring') }}</span>
      </div>

      <h1 class="text-4xl md:text-6xl font-black tracking-tight mb-8 leading-[1.1] text-neutral-900 dark:text-white">
        {{ $t('privacy.title') }}
      </h1>

      <p class="text-sm text-neutral-500 dark:text-neutral-400 mb-12 font-medium">
        {{ $t('privacy.last_updated') }}
      </p>

      <article class="w-full space-y-12">
        <section>
          <p class="text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed mb-8">
            {{ $t('privacy.intro') }}
          </p>
        </section>

        <section>
          <h2 class="text-2xl md:text-3xl font-black mb-6 text-neutral-900 dark:text-white tracking-tight">{{ $t('privacy.what_we_collect') }}</h2>
          <p class="text-neutral-600 dark:text-neutral-300 mb-6 leading-relaxed">{{ $t('privacy.what_we_collect_desc') }}</p>
          <ul class="space-y-3 text-neutral-600 dark:text-neutral-300">
            <li class="flex items-start gap-3">
              <div class="w-2 h-2 rounded-full bg-primary-500 mt-2 shrink-0"></div>
              <span>{{ $t('privacy.personal_info') }}</span>
            </li>
            <li class="flex items-start gap-3">
              <div class="w-2 h-2 rounded-full bg-primary-500 mt-2 shrink-0"></div>
              <span>{{ $t('privacy.site_data') }}</span>
            </li>
            <li class="flex items-start gap-3">
              <div class="w-2 h-2 rounded-full bg-primary-500 mt-2 shrink-0"></div>
              <span>{{ $t('privacy.monitoring_data') }}</span>
            </li>
            <li class="flex items-start gap-3">
              <div class="w-2 h-2 rounded-full bg-primary-500 mt-2 shrink-0"></div>
              <span>{{ $t('privacy.technical_info') }}</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 class="text-2xl md:text-3xl font-black mb-6 text-neutral-900 dark:text-white tracking-tight">{{ $t('privacy.how_we_use') }}</h2>
          <p class="text-neutral-600 dark:text-neutral-300 mb-6 leading-relaxed">{{ $t('privacy.how_we_use_desc') }}</p>
          <ul class="space-y-3 text-neutral-600 dark:text-neutral-300">
            <li class="flex items-start gap-3">
              <div class="w-2 h-2 rounded-full bg-primary-500 mt-2 shrink-0"></div>
              <span>{{ $t('privacy.provide_service') }}</span>
            </li>
            <li class="flex items-start gap-3">
              <div class="w-2 h-2 rounded-full bg-primary-500 mt-2 shrink-0"></div>
              <span>{{ $t('privacy.send_notifications') }}</span>
            </li>
            <li class="flex items-start gap-3">
              <div class="w-2 h-2 rounded-full bg-primary-500 mt-2 shrink-0"></div>
              <span>{{ $t('privacy.improve_service') }}</span>
            </li>
            <li class="flex items-start gap-3">
              <div class="w-2 h-2 rounded-full bg-primary-500 mt-2 shrink-0"></div>
              <span>{{ $t('privacy.comply_laws') }}</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 class="text-2xl md:text-3xl font-black mb-6 text-neutral-900 dark:text-white tracking-tight">{{ $t('privacy.sharing') }}</h2>
          <p class="text-neutral-600 dark:text-neutral-300 mb-6 leading-relaxed">{{ $t('privacy.sharing_desc') }}</p>
          <ul class="space-y-3 text-neutral-600 dark:text-neutral-300">
            <li class="flex items-start gap-3">
              <div class="w-2 h-2 rounded-full bg-primary-500 mt-2 shrink-0"></div>
              <span>{{ $t('privacy.service_providers') }}</span>
            </li>
            <li class="flex items-start gap-3">
              <div class="w-2 h-2 rounded-full bg-primary-500 mt-2 shrink-0"></div>
              <span>{{ $t('privacy.legal_requirements') }}</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 class="text-2xl md:text-3xl font-black mb-6 text-neutral-900 dark:text-white tracking-tight">{{ $t('privacy.retention') }}</h2>
          <p class="text-neutral-600 dark:text-neutral-300 leading-relaxed">{{ $t('privacy.retention_desc') }}</p>
        </section>

        <section>
          <h2 class="text-2xl md:text-3xl font-black mb-6 text-neutral-900 dark:text-white tracking-tight">{{ $t('privacy.security') }}</h2>
          <p class="text-neutral-600 dark:text-neutral-300 leading-relaxed">{{ $t('privacy.security_desc') }}</p>
        </section>

        <section>
          <h2 class="text-2xl md:text-3xl font-black mb-6 text-neutral-900 dark:text-white tracking-tight">{{ $t('privacy.your_rights') }}</h2>
          <p class="text-neutral-600 dark:text-neutral-300 mb-6 leading-relaxed">{{ $t('privacy.your_rights_desc') }}</p>
          <ul class="space-y-3 text-neutral-600 dark:text-neutral-300">
            <li class="flex items-start gap-3">
              <div class="w-2 h-2 rounded-full bg-primary-500 mt-2 shrink-0"></div>
              <span>{{ $t('privacy.access_data') }}</span>
            </li>
            <li class="flex items-start gap-3">
              <div class="w-2 h-2 rounded-full bg-primary-500 mt-2 shrink-0"></div>
              <span>{{ $t('privacy.correct_data') }}</span>
            </li>
            <li class="flex items-start gap-3">
              <div class="w-2 h-2 rounded-full bg-primary-500 mt-2 shrink-0"></div>
              <span>{{ $t('privacy.delete_data') }}</span>
            </li>
            <li class="flex items-start gap-3">
              <div class="w-2 h-2 rounded-full bg-primary-500 mt-2 shrink-0"></div>
              <span>{{ $t('privacy.data_portability') }}</span>
            </li>
            <li class="flex items-start gap-3">
              <div class="w-2 h-2 rounded-full bg-primary-500 mt-2 shrink-0"></div>
              <span>{{ $t('privacy.opt_out') }}</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 class="text-2xl md:text-3xl font-black mb-6 text-neutral-900 dark:text-white tracking-tight">{{ $t('privacy.contact') }}</h2>
          <p class="text-neutral-600 dark:text-neutral-300 mb-4 leading-relaxed" v-html="$t('privacy.contact_desc').replace('admin@digispace.pro', `<a href='mailto:admin@digispace.pro?subject=DigiPulse Support' class='text-primary-500 hover:underline font-bold'>admin@digispace.pro</a>`)"></p>
        </section>
      </article>

      <!-- Back to Home -->
      <div class="mt-16 w-full">
        <UButton
          :to="localePath('/')"
          variant="ghost"
          color="neutral"
          class="px-6 py-3 border border-neutral-200 dark:border-white/10 hover:bg-neutral-100 dark:hover:bg-white/5 transition-all font-bold rounded-xl"
        >
          ← {{ $t('auth.back_to_home') }}
        </UButton>
      </div>

      <AppFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
import AppFooter from '~/components/AppFooter.vue'

const route = useRoute()
const localePath = useLocalePath()
const url = useRequestURL()
const config = useRuntimeConfig()

// SEO Meta
useSeoMeta({
  title: () => `${$t('privacy.seo_title')}`,
  description: () => `${$t('privacy.seo_description')}`,
  ogTitle: () => `${$t('privacy.seo_title')}`,
  ogDescription: () => `${$t('privacy.seo_description')}`,
  ogUrl: () => url.href,
  ogImage: () => `${url.origin}/og-image-social.png`,
  twitterCard: 'summary_large_image',
  twitterTitle: () => `${$t('privacy.seo_title')}`,
  twitterDescription: () => `${$t('privacy.seo_description')}`,
  twitterImage: () => `${url.origin}/og-image-social.png`,
})

// Canonical
useHead({
  link: [
    {
      rel: 'canonical',
      href: `${config.public.siteUrl}${route.fullPath}`,
    },
  ],
})
</script>
