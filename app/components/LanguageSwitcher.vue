<template>
  <UDropdownMenu 
    :items="dropdownItems" 
    :content="{ align: 'end', sideOffset: 8, collisionPadding: 16 }"
    class="z-50"
  >
    <UButton 
      color="neutral" 
      variant="ghost" 
      class="font-black flex items-center gap-2 group hover:bg-neutral-100 dark:hover:bg-white/5 transition-all px-3 py-2 rounded-xl"
    >
      <UIcon name="i-heroicons-globe-alt" class="text-xl text-neutral-500 group-hover:text-primary-500 transition-colors" />
      <span class="uppercase tracking-[0.2em] text-[10px]">{{ locale }}</span>
      <UIcon name="i-heroicons-chevron-down-20-solid" class="text-xs opacity-30 shrink-0" />
    </UButton>
  </UDropdownMenu>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from '#imports';

const { locales, locale, setLocale } = useI18n();

const dropdownItems = computed(() => {
  // Use locales from i18n config, fallback to defaults if needed for robustness
  const list = locales.value && locales.value.length > 0 ? locales.value : [
    { code: 'en', name: 'English' },
    { code: 'uk', name: 'Українська' },
    { code: 'pl', name: 'Polski' }
  ];

  return list.map((loc: any) => ({
    label: loc.name,
    type: 'checkbox' as const,
    checked: locale.value === loc.code,
    onSelect: () => {
      console.log('--- Language Switch Triggered:', loc.code);
      setLocale(loc.code);
    }
  }));
});
</script>