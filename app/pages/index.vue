<template>
  <div class="relative min-h-screen bg-white dark:bg-neutral-950 mesh-bg flex flex-col pt-20 md:pt-32 pb-24 items-center px-4 overflow-hidden">
    <!-- Sophisticated Mesh Background Layer -->
    <div class="absolute inset-0 z-0 pointer-events-none opacity-60 dark:opacity-80 overflow-hidden">
      <!-- Pink Pulse -->
      <div class="absolute top-[5%] left-[5%] w-[50%] h-[50%] bg-primary-500/30 animate-pulse-slow blur-[100px] rounded-full will-change-opacity"></div>
      <!-- Cyan Pulse -->
      <div class="absolute bottom-[5%] right-[5%] w-[50%] h-[50%] bg-accent-500/25 animate-pulse-slow blur-[100px] rounded-full delay-1000 will-change-opacity"></div>
      <!-- Violet/Indigo Pulse for depth -->
      <div class="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-indigo-500/20 animate-pulse-slow blur-[80px] rounded-full delay-2000 will-change-opacity"></div>
    </div>

    <!-- Header Actions are now global in app.vue -->

    <div class="relative z-10 w-full max-w-5xl text-center flex flex-col items-center">
      <!-- Sophisticated Badge -->
      <div class="inline-flex items-center gap-2 px-3 py-1 mb-12 rounded-full bg-primary-500/15 border border-primary-500/30 text-primary-700 dark:text-primary-300 text-[10px] font-black tracking-[0.2em] transition-all hover:bg-primary-500/25">
        <div class="w-1.5 h-1.5 rounded-full bg-primary-700 dark:bg-primary-400 animate-pulse"></div>
        <span>{{ $t('index.premium_monitoring') }}</span>
      </div>

      <h1 class="text-4xl sm:text-6xl md:text-9xl font-black tracking-tight mb-8 leading-[1.1] text-neutral-900 dark:text-white">
        <span class="bg-linear-to-br from-primary-500 to-indigo-500 bg-clip-text text-transparent inline-block py-2">{{ $t('index.title') }}</span>
        <br />
        <span class="opacity-90 leading-tight">{{ $t('index.subtitle') }}</span>
      </h1>
      
      <p class="text-xl text-neutral-600 dark:text-neutral-300 max-w-2xl mb-16 font-medium leading-relaxed">
        {{ $t('index.description') }}
      </p>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-6 w-full px-6">
        <UButton
          :to="localePath('/auth/register')"
          size="xl"
          class="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:scale-105 active:scale-[0.98] transition-all duration-300 px-12 py-5 font-black rounded-xl shadow-2xl shimmer-effect border-0"
        >
          {{ $t('index.get_started') }}
        </UButton>
        
        <UButton
          :to="localePath('/auth/login')"
          size="xl"
          variant="ghost"
          color="neutral"
          class="px-12 py-5 border border-neutral-200 dark:border-white/10 hover:bg-neutral-100 dark:hover:bg-white/5 transition-all font-bold rounded-xl"
        >
          {{ $t('index.login') }}
        </UButton>
      </div>

      <!-- Features Grid -->
      <div class="mt-20 md:mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
        <div v-for="(feat, i) in features" :key="i" 
             class="glass-card p-10 rounded-2xl flex flex-col items-start text-left group hover:-translate-y-1 hover:border-primary-500/30 transition-all cursor-default">
          <div class="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-8 group-hover:bg-primary-500/10 transition-colors">
            <UIcon :name="feat.icon" class="text-2xl text-neutral-600 dark:text-neutral-400 group-hover:text-primary-500 transition-colors" />
          </div>
          <h2 class="text-xl font-black mb-4 text-neutral-900 dark:text-white tracking-tight">{{ feat.title }}</h2>
          <p class="text-neutral-600 dark:text-neutral-300 text-sm leading-[1.6] font-medium">{{ feat.desc }}</p>
        </div>
      </div>

      <!-- How it Works Section -->
      <div class="mt-24 md:mt-48 w-full max-w-4xl text-center">
        <h2 class="text-4xl md:text-5xl font-black mb-16 text-neutral-900 dark:text-white tracking-tight">{{ $t('index.how_it_works_title') }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          <!-- Connector Lines for desktop -->
          <div class="hidden md:block absolute top-1/4 left-1/4 right-1/4 h-px bg-linear-to-r from-transparent via-neutral-200 dark:via-neutral-800 to-transparent z-0"></div>
          
          <div class="relative z-10 flex flex-col items-center">
            <div class="w-16 h-16 rounded-full bg-primary-500 text-white flex items-center justify-center text-xl font-black mb-6 shadow-xl shadow-primary-500/20">1</div>
            <h3 class="text-lg font-bold mb-3 text-neutral-900 dark:text-white">{{ $t('index.step1_title') }}</h3>
            <p class="text-neutral-500 dark:text-neutral-400 text-sm px-4">{{ $t('index.step1_desc') }}</p>
          </div>
          
          <div class="relative z-10 flex flex-col items-center">
            <div class="w-16 h-16 rounded-full bg-primary-500 text-white flex items-center justify-center text-xl font-black mb-6 shadow-xl shadow-primary-500/20">2</div>
            <h3 class="text-lg font-bold mb-3 text-neutral-900 dark:text-white">{{ $t('index.step2_title') }}</h3>
            <p class="text-neutral-500 dark:text-neutral-400 text-sm px-4">{{ $t('index.step2_desc') }}</p>
          </div>
          
          <div class="relative z-10 flex flex-col items-center">
            <div class="w-16 h-16 rounded-full bg-primary-500 text-white flex items-center justify-center text-xl font-black mb-6 shadow-xl shadow-primary-500/20">3</div>
            <h3 class="text-lg font-bold mb-3 text-neutral-900 dark:text-white">{{ $t('index.step3_title') }}</h3>
            <p class="text-neutral-600 dark:text-neutral-300 text-sm px-4">{{ $t('index.step3_desc') }}</p>
          </div>
        </div>
      </div>

      <!-- Final CTA Section -->
      <div class="mt-32 md:mt-56 w-full glass-card p-10 md:p-16 rounded-[40px] text-center max-w-4xl border-primary-500/10 mb-20">
        <h2 class="text-3xl md:text-5xl font-black mb-6 text-neutral-900 dark:text-white leading-tight">
          {{ $t('index.cta_ready_title') }}
        </h2>
        <p class="text-neutral-600 dark:text-neutral-300 text-lg mb-10 max-w-xl mx-auto">
          {{ $t('index.cta_ready_desc') }}
        </p>
        <UButton
          :to="localePath('/auth/register')"
          size="xl"
          class="bg-primary-500 hover:bg-primary-600 text-white hover:scale-105 active:scale-[0.98] transition-all px-10 py-4 font-black rounded-xl shadow-xl shadow-primary-500/20"
        >
          {{ $t('index.get_started') }}
        </UButton>
      </div>

      <LazyAppFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n, useLocalePath } from '#imports';

definePageMeta({
  middleware: 'guest'
});

const { t } = useI18n();
const localePath = useLocalePath();
const url = useRequestURL();

useSeoMeta({
  title: () => t('index.seo_title'),
  ogTitle: () => t('index.seo_title'),
  description: () => t('index.seo_description'),
  ogDescription: () => t('index.seo_description'),
  ogUrl: () => url.href,
  ogImage: () => `${url.origin}/og-image-social.png`,
  twitterImage: () => `${url.origin}/og-image-social.png`,
})

const features = computed(() => [
  { icon: 'i-heroicons-clock', title: t('index.feat1_title'), desc: t('index.feat1_desc') },
  { icon: 'i-heroicons-bell', title: t('index.feat2_title'), desc: t('index.feat2_desc') },
  { icon: 'i-heroicons-chart-bar', title: t('index.feat3_title'), desc: t('index.feat3_desc') },
]);
</script>
