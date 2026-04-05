<template>
  <div class="relative min-h-screen bg-white dark:bg-neutral-950 mesh-bg flex flex-col pt-20 md:pt-32 pb-24 items-center px-4 overflow-hidden">
    <!-- Sophisticated Mesh Background Layer -->
    <div class="absolute inset-0 z-0 pointer-events-none opacity-40 dark:opacity-60">
      <div class="absolute top-[10%] left-[10%] w-[40%] h-[40%] bg-primary-500 animate-pulse-slow blur-[120px] rounded-full"></div>
      <div class="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-accent-500 animate-pulse-slow blur-[120px] rounded-full delay-1000"></div>
    </div>

    <!-- Header Actions are now global in app.vue -->

    <div class="relative z-10 w-full max-w-5xl text-center flex flex-col items-center">
      <!-- Sophisticated Badge -->
      <div class="inline-flex items-center gap-2 px-3 py-1 mb-12 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-500 dark:text-primary-400 text-[10px] font-black tracking-[0.2em] transition-all hover:bg-primary-500/20">
        <div class="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"></div>
        <span>{{ $t('index.premium_monitoring') }}</span>
      </div>

      <h1 class="text-6xl md:text-9xl font-black tracking-tight mb-8 leading-[1.1] text-neutral-900 dark:text-white">
        <span class="bg-linear-to-br from-primary-500 to-indigo-500 bg-clip-text text-transparent inline-block py-2">{{ $t('index.title') }}</span>
        <br />
        <span class="opacity-90">{{ $t('index.subtitle') }}</span>
      </h1>
      
      <p class="text-xl text-neutral-500 dark:text-neutral-400 max-w-2xl mb-16 font-medium leading-relaxed">
        {{ $t('index.description') }}
      </p>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-6 w-full px-6">
        <UButton
          :to="localePath('/auth')"
          size="xl"
          class="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:scale-105 active:scale-[0.98] transition-all duration-300 px-12 py-5 font-black rounded-xl shadow-2xl shimmer-effect border-0"
        >
          {{ $t('index.get_started') }}
        </UButton>
        
        <UButton
          :to="localePath('/auth')"
          size="xl"
          variant="ghost"
          color="neutral"
          class="px-12 py-5 border border-neutral-200 dark:border-white/10 hover:bg-neutral-100 dark:hover:bg-white/5 transition-all font-bold rounded-xl"
        >
          {{ $t('index.login') }}
        </UButton>
      </div>

      <div class="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
        <div v-for="(feat, i) in features" :key="i" 
             class="glass-card p-10 rounded-2xl flex flex-col items-start text-left group hover:translate-y-[-4px] hover:border-primary-500/30 transition-all cursor-default">
          <div class="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-8 group-hover:bg-primary-500/10 transition-colors">
            <UIcon :name="feat.icon" class="text-2xl text-neutral-600 dark:text-neutral-400 group-hover:text-primary-500 transition-colors" />
          </div>
          <h3 class="text-xl font-black mb-4 text-neutral-900 dark:text-white tracking-tight">{{ feat.title }}</h3>
          <p class="text-neutral-500 dark:text-neutral-400 text-sm leading-[1.6] font-medium">{{ feat.desc }}</p>
        </div>
      </div>
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

const features = computed(() => [
  { icon: 'i-heroicons-clock', title: t('index.feat1_title'), desc: t('index.feat1_desc') },
  { icon: 'i-heroicons-bell', title: t('index.feat2_title'), desc: t('index.feat2_desc') },
  { icon: 'i-heroicons-chart-bar', title: t('index.feat3_title'), desc: t('index.feat3_desc') },
]);
</script>
