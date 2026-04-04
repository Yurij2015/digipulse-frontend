<template>
  <div class="relative min-h-screen bg-white dark:bg-neutral-950 mesh-bg flex flex-col pt-32 md:pt-48 pb-24 items-center px-4 overflow-hidden">
    <!-- Sophisticated Mesh Background Layer -->
    <div class="absolute inset-0 z-0 pointer-events-none opacity-40 dark:opacity-60">
      <div class="absolute top-[10%] left-[10%] w-[40%] h-[40%] bg-primary-500 animate-pulse-slow blur-[120px] rounded-full"></div>
      <div class="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-accent-500 animate-pulse-slow blur-[120px] rounded-full delay-1000"></div>
    </div>

    <div class="relative z-10 w-full max-w-5xl text-center flex flex-col items-center">
      <!-- Sophisticated Badge -->
      <div class="inline-flex items-center gap-2 px-3 py-1 mb-12 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-500 dark:text-primary-400 text-[10px] font-black tracking-[0.2em] transition-all hover:bg-primary-500/20">
        <div class="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"></div>
        <span>PREMIUM MONITORING SYSTEM</span>
      </div>

      <h1 class="text-6xl md:text-9xl font-black tracking-tight mb-8 leading-[1.1] text-neutral-900 dark:text-white">
        <span class="bg-linear-to-br from-primary-500 to-indigo-500 bg-clip-text text-transparent inline-block py-2">DigiPulse</span>
        <br />
        <span class="opacity-90">Precision in Status</span>
      </h1>
      
      <p class="text-xl text-neutral-500 dark:text-neutral-400 max-w-2xl mb-16 font-medium leading-relaxed">
        Next-generation uptime monitoring. Real-time insights for your infrastructure with zero latency and infinite precision.
      </p>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-6 w-full px-6">
        <UButton
          to="/auth"
          size="xl"
          class="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:scale-105 transition-transform duration-300 px-12 py-5 font-black rounded-2xl shadow-2xl"
        >
          Get Started
        </UButton>
        
        <UButton
          to="/auth"
          size="xl"
          variant="ghost"
          color="neutral"
          class="px-12 py-5 border border-neutral-200 dark:border-white/10 hover:bg-neutral-100 dark:hover:bg-white/5 transition-all font-bold rounded-2xl"
        >
          Login
        </UButton>
      </div>

      <!-- Feature highlight -->
      <div class="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
        <div v-for="(feat, i) in features" :key="i" 
             class="glass-card p-8 rounded-4xl flex flex-col items-start text-left group hover:translate-y-[-4px]">
          <div class="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-6 group-hover:bg-primary-500/10 transition-colors">
            <UIcon :name="feat.icon" class="text-xl text-neutral-600 dark:text-neutral-400 group-hover:text-primary-500" />
          </div>
          <h3 class="text-xl font-bold mb-3 text-neutral-900 dark:text-white">{{ feat.title }}</h3>
          <p class="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed">{{ feat.desc }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const features = [
  { icon: 'i-heroicons-clock', title: '60s Frequency', desc: 'Real-time performance checks for your mission-critical applications.' },
  { icon: 'i-heroicons-bell', title: 'Instant Alerts', desc: 'Multi-channel notifications across Telegram, Slack, and email.' },
  { icon: 'i-heroicons-chart-bar', title: 'Advanced Metrics', desc: 'Predictive analytics and deep historical data for smarter uptime.' },
]
</script>
