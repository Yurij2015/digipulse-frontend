<template>
  <Transition
    enter-active-class="transition duration-700 ease-out"
    enter-from-class="opacity-0 backdrop-blur-0"
    enter-to-class="opacity-100 backdrop-blur-md"
    leave-active-class="transition duration-1000 ease-in-out"
    leave-from-class="opacity-100 backdrop-blur-md"
    leave-to-class="opacity-0 backdrop-blur-0"
  >
    <div v-if="show" class="fixed inset-0 z-1000 flex flex-col items-center justify-center bg-white/60 dark:bg-neutral-950/60 backdrop-blur-md">
      <div class="relative scale-110 transition-transform duration-1000" :class="{ 'scale-100': !show }">
        <!-- Animated Rings -->
        <div class="absolute inset-0 -m-8 rounded-full border border-primary-500/10 animate-[ping_3s_infinite]"></div>
        <div class="absolute inset-0 -m-16 rounded-full border border-primary-500/5 animate-[ping_4s_infinite]"></div>
        
        <!-- Center Logo/Icon -->
        <div class="relative w-24 h-24 flex items-center justify-center bg-white dark:bg-neutral-900 rounded-[32px] border border-neutral-200 dark:border-white/10 shadow-2xl glass-card group">
          <UIcon name="i-heroicons-bolt-solid" class="w-12 h-12 text-primary-500 transition-transform duration-700 group-hover:scale-110" />
          
          <!-- Orbiting Dots -->
          <div class="absolute inset-0 animate-[spin_3s_linear_infinite]">
            <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary-500 shadow-[0_0_10px_#ec4899]"></div>
          </div>
          <div class="absolute inset-0 animate-[spin_4s_linear_infinite_reverse]">
            <div class="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 rounded-full bg-accent-500 shadow-[0_0_8px_#06b6d4]"></div>
          </div>
        </div>
      </div>
      
      <!-- Text Loader -->
      <div class="mt-12 text-center">
        <h3 class="text-xl font-black text-neutral-900 dark:text-white tracking-widest uppercase mb-2 animate-pulse">
          DigiPulse
        </h3>
        <p class="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-[0.3em]">
          Initializing Secure Connection
        </p>
      </div>

      <!-- Progress bar holder (optional) -->
      <div class="w-48 h-1 bg-neutral-100 dark:bg-white/5 rounded-full mt-8 overflow-hidden relative border border-white/5">
        <div class="absolute inset-y-0 bg-linear-to-r from-primary-500 to-violet-500 w-1/3 rounded-full animate-[shimmer_2s_infinite]"></div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
defineProps<{
  show: boolean
}>()
</script>

<style scoped>
@keyframes shimmer {
  0% { transform: translateX(-150%); }
  100% { transform: translateX(300%); }
}
</style>
