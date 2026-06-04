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
        {{ $t('terms.title') }}
      </h1>

      <p class="text-sm text-neutral-500 dark:text-neutral-400 mb-12 font-medium">
        {{ $t('terms.last_updated') }}
      </p>

      <article class="w-full space-y-12">
        <section>
          <p class="text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed mb-4">
            {{ $t('terms.intro') }}
          </p>
          <p class="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
            {{ $t('terms.age_notice') }}
          </p>
        </section>

        <section>
          <h2 class="text-2xl md:text-3xl font-black mb-6 text-neutral-900 dark:text-white tracking-tight">{{ $t('terms.acceptance') }}</h2>
          <p class="text-neutral-600 dark:text-neutral-300 leading-relaxed">{{ $t('terms.acceptance_desc') }}</p>
        </section>

        <section>
          <h2 class="text-2xl md:text-3xl font-black mb-6 text-neutral-900 dark:text-white tracking-tight">{{ $t('terms.service') }}</h2>
          <p class="text-neutral-600 dark:text-neutral-300 leading-relaxed">{{ $t('terms.service_desc') }}</p>
        </section>

        <section>
          <h2 class="text-2xl md:text-3xl font-black mb-6 text-neutral-900 dark:text-white tracking-tight">{{ $t('terms.service_rules') }}</h2>
          <p class="text-neutral-600 dark:text-neutral-300 mb-6 leading-relaxed">{{ $t('terms.service_rules_desc') }}</p>
          <ul class="space-y-3 text-neutral-600 dark:text-neutral-300">
            <li class="flex items-start gap-3">
              <div class="w-2 h-2 rounded-full bg-primary-500 mt-2 shrink-0"></div>
              <span>{{ $t('terms.rule_1') }}</span>
            </li>
            <li class="flex items-start gap-3">
              <div class="w-2 h-2 rounded-full bg-primary-500 mt-2 shrink-0"></div>
              <span>{{ $t('terms.rule_2') }}</span>
            </li>
            <li class="flex items-start gap-3">
              <div class="w-2 h-2 rounded-full bg-primary-500 mt-2 shrink-0"></div>
              <span>{{ $t('terms.rule_3') }}</span>
            </li>
            <li class="flex items-start gap-3">
              <div class="w-2 h-2 rounded-full bg-primary-500 mt-2 shrink-0"></div>
              <span>{{ $t('terms.rule_4') }}</span>
            </li>
            <li class="flex items-start gap-3">
              <div class="w-2 h-2 rounded-full bg-primary-500 mt-2 shrink-0"></div>
              <span>{{ $t('terms.rule_5') }}</span>
            </li>
            <li class="flex items-start gap-3">
              <div class="w-2 h-2 rounded-full bg-primary-500 mt-2 shrink-0"></div>
              <span>{{ $t('terms.rule_6') }}</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 class="text-2xl md:text-3xl font-black mb-6 text-neutral-900 dark:text-white tracking-tight">{{ $t('terms.account') }}</h2>
          <p class="text-neutral-600 dark:text-neutral-300 leading-relaxed">{{ $t('terms.account_desc') }}</p>
        </section>

        <section>
          <h2 class="text-2xl md:text-3xl font-black mb-6 text-neutral-900 dark:text-white tracking-tight">{{ $t('terms.payment') }}</h2>
          <p class="text-neutral-600 dark:text-neutral-300 leading-relaxed">{{ $t('terms.payment_desc') }}</p>
        </section>

        <section>
          <h2 class="text-2xl md:text-3xl font-black mb-6 text-neutral-900 dark:text-white tracking-tight">{{ $t('terms.ip') }}</h2>
          <p class="text-neutral-600 dark:text-neutral-300 leading-relaxed">{{ $t('terms.ip_desc') }}</p>
        </section>

        <section>
          <h2 class="text-2xl md:text-3xl font-black mb-6 text-neutral-900 dark:text-white tracking-tight">{{ $t('terms.termination') }}</h2>
          <p class="text-neutral-600 dark:text-neutral-300 leading-relaxed">{{ $t('terms.termination_user') }}</p>
          <p class="text-neutral-600 dark:text-neutral-300 leading-relaxed mt-4">{{ $t('terms.termination_us') }}</p>
        </section>

        <section>
          <h2 class="text-2xl md:text-3xl font-black mb-6 text-neutral-900 dark:text-white tracking-tight">{{ $t('terms.liability') }}</h2>
          <p class="text-neutral-600 dark:text-neutral-300 leading-relaxed">{{ $t('terms.liability_desc') }}</p>
        </section>

        <section>
          <h2 class="text-2xl md:text-3xl font-black mb-6 text-neutral-900 dark:text-white tracking-tight">{{ $t('terms.force_majeure') }}</h2>
          <p class="text-neutral-600 dark:text-neutral-300 leading-relaxed">{{ $t('terms.force_majeure_desc') }}</p>
        </section>

        <section>
          <h2 class="text-2xl md:text-3xl font-black mb-6 text-neutral-900 dark:text-white tracking-tight">{{ $t('terms.governing_law') }}</h2>
          <p class="text-neutral-600 dark:text-neutral-300 leading-relaxed">{{ $t('terms.governing_law_desc') }}</p>
        </section>

        <section>
          <h2 class="text-2xl md:text-3xl font-black mb-6 text-neutral-900 dark:text-white tracking-tight">{{ $t('terms.changes') }}</h2>
          <p class="text-neutral-600 dark:text-neutral-300 leading-relaxed">{{ $t('terms.changes_desc') }}</p>
        </section>

        <section>
          <h2 class="text-2xl md:text-3xl font-black mb-6 text-neutral-900 dark:text-white tracking-tight">{{ $t('terms.general') }}</h2>
          <p class="text-neutral-600 dark:text-neutral-300 leading-relaxed">{{ $t('terms.general_desc') }}</p>
        </section>

        <section>
          <h2 class="text-2xl md:text-3xl font-black mb-6 text-neutral-900 dark:text-white tracking-tight">{{ $t('terms.contact') }}</h2>
          <p class="text-neutral-600 dark:text-neutral-300 mb-4 leading-relaxed" v-html="$t('terms.contact_desc').replace('admin@digipulse.cloud', `<a href='mailto:admin@digipulse.cloud?subject=DigiPulse ToS' class='text-primary-500 hover:underline font-bold'>admin@digipulse.cloud</a>`)"></p>
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
  title: () => `${$t('terms.seo_title')}`,
  description: () => `${$t('terms.seo_description')}`,
  ogTitle: () => `${$t('terms.seo_title')}`,
  ogDescription: () => `${$t('terms.seo_description')}`,
  ogUrl: () => url.href,
  ogImage: () => `${url.origin}/og-image-social.png`,
  twitterCard: 'summary_large_image',
  twitterTitle: () => `${$t('terms.seo_title')}`,
  twitterDescription: () => `${$t('terms.seo_description')}`,
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
