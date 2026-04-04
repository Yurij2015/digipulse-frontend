<template>
  <div class="relative min-h-screen bg-neutral-950 overflow-hidden flex flex-col justify-center items-center px-4">
    <!-- Background Animated Blobs -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute top-[10%] -left-[10%] w-[50%] h-[50%] bg-primary-500/10 rounded-full mix-blend-screen filter blur-[120px] animate-pulse-fast opacity-50"></div>
      <div class="absolute bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-pink-500/10 rounded-full mix-blend-screen filter blur-[120px] animate-float opacity-30"></div>
    </div>

    <div class="relative z-10 w-full max-w-5xl text-center flex flex-col items-center">
      <!-- Badge / New feature -->
      <div class="inline-flex items-center gap-2 px-4 py-1.5 mb-10 rounded-full bg-white/5 border border-white/10 text-pink-400 text-sm font-bold animate-bounce shadow-lg shadow-pink-500/10">
        <UIcon name="i-heroicons-bolt" />
        <span>Нове покоління моніторингу</span>
      </div>

      <h1 class="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] lg:leading-[1.1]">
        <span class="bg-pulse-gradient bg-clip-text text-transparent text-glow">DigiPulse:</span>
        <br />
        Швидкість твого успіху
      </h1>
      
      <p class="text-xl md:text-2xl text-neutral-400 max-w-2xl mb-14 font-medium px-4">
        Надійний моніторинг сайтів у реальному часі. Отримуй сповіщення швидше, ніж твої користувачі помітять збій.
      </p>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-4 w-full px-6">
        <UButton
          to="/auth"
          size="xl"
          class="bg-pulse-gradient hover:scale-105 transition-transform duration-300 shadow-[0_0_40px_rgba(255,0,85,0.3)] px-10 py-4 font-black w-full sm:w-auto"
        >
          Розпочати зараз
        </UButton>
        
        <UButton
          to="/auth"
          size="xl"
          variant="ghost"
          color="neutral"
          class="px-10 py-4 border border-white/10 hover:bg-white/5 backdrop-blur-md transition-all font-bold w-full sm:w-auto mt-2 sm:mt-0"
        >
          Вхід до кабінету
        </UButton>
      </div>

      <!-- Feature highlight (Mobile specialized) -->
      <div class="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 w-full px-4">
        <div v-for="(feat, i) in features" :key="i" 
             class="glass-card p-6 rounded-2xl flex flex-col items-center group hover:bg-white/10 transition-colors">
          <div class="w-12 h-12 rounded-xl bg-pulse-gradient flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <UIcon :name="feat.icon" class="text-2xl" />
          </div>
          <h3 class="text-lg font-bold mb-2">{{ feat.title }}</h3>
          <p class="text-neutral-500 text-sm">{{ feat.desc }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const features = [
  { icon: 'i-heroicons-clock', title: '60s Перевірка', desc: 'Максимальна частота моніторингу для вашого сервісу.' },
  { icon: 'i-heroicons-bell', title: 'Миттєві сповіщення', desc: 'Telegram, Email або Webhooks за лічені мілісекунди.' },
  { icon: 'i-heroicons-chart-bar', title: 'Аналітика 24/7', desc: 'Детальні графіки аптайму та часу відгуку вашого сайту.' },
]
</script>

<style scoped>
/* Додаткові кастомні ефекти Typography та Layout */
</style>
