<template>
  <div class="relative z-50">
    <button
      @click="open = !open"
      class="flex items-center gap-2 group hover:bg-neutral-100 dark:hover:bg-white/5 transition-all px-3 py-1.5 rounded-lg select-none cursor-pointer"
    >
      <UIcon name="i-heroicons-globe-alt" class="text-lg text-neutral-500 group-hover:text-primary-500 transition-colors" />
      <span class="font-normal uppercase tracking-[0.05em] text-lg text-neutral-500 group-hover:text-primary-500 transition-colors">{{ locale }}</span>
      <UIcon 
        name="i-heroicons-chevron-down-20-solid" 
        class="text-xs opacity-30 shrink-0 transition-transform duration-150" 
        :class="open && 'rotate-180'"
      />
    </button>

    <div 
      v-if="open"
      @click="open = false"
      class="fixed inset-0 z-10"
    />

    <transition name="fade">
      <div 
        v-show="open"
        class="absolute right-0 min-w-[140px] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg z-20 overflow-hidden"
        :class="side === 'top' ? 'top-full mt-2' : 'bottom-full mb-2'"
      >
        <button
          v-for="loc in availableLocales"
          :key="loc.code"
          @click="switchLocale(loc.code)"
          class="w-full flex items-center justify-between px-3 py-1.5 text-left hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-xs cursor-pointer"
          :class="locale === loc.code ? 'text-primary-500 font-medium' : 'text-neutral-700 dark:text-neutral-300'"
        >
          <span>{{ loc.name }}</span>
          <span 
            v-if="locale === loc.code" 
            class="text-primary-500"
          >
            <UIcon name="i-heroicons-check-16-solid" class="w-3.5 h-3.5" />
          </span>
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useI18n } from '#i18n';


const props = defineProps<{
  side?: 'top' | 'bottom'
}>();

const side = computed(() => props.side || 'bottom');

const open = ref(false);

const { locales, locale, setLocale } = useI18n();

const availableLocales = computed(() => {
  return locales.value && locales.value.length > 0 ? (locales.value as any[]) : [
    { code: 'en', name: 'English' },
    { code: 'uk', name: 'Українська' },
    { code: 'pl', name: 'Polski' }
  ];
});

const switchLocale = async (code: string) => {
  open.value = false;
  
  // Миттєве перемикання без повного перезавантаження сторінки
  await setLocale(code as any);
};

// Закривати по кліку зовні
const handleGlobalClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (target && !target.closest('.relative.z-50')) {
    open.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleGlobalClick);
});

onUnmounted(() => {
  document.removeEventListener('click', handleGlobalClick);
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 70ms ease, transform 70ms ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
