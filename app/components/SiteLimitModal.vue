<script setup lang="ts">
import { computed } from 'vue';
import { useI18n, useLocalePath } from '#i18n';
import { useRouter } from '#imports';

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits(['update:open']);

const { t } = useI18n();
const localePath = useLocalePath();
const router = useRouter();

const isOpen = computed({
  get: () => props.open,
  set: (val) => emit('update:open', val)
});

function goToSupport() {
  isOpen.value = false;
  router.push(localePath('/support'));
}
</script>

<template>
  <UModal v-model:open="isOpen" :title="t('quota.limit_reached')" :description="t('quota.limit_description')">
    <template #body>
      <div class="p-4">
        <div class="flex items-center gap-4 mb-4 text-amber-500">
          <UIcon name="i-heroicons-exclamation-triangle" class="w-10 h-10" />
          <p class="font-bold text-lg">{{ t('quota.free_tier_title') }}</p>
        </div>
        <p class="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
          {{ t('quota.free_tier_description') }}
        </p>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-end gap-3 w-full">
        <UButton color="neutral" variant="ghost" @click="isOpen = false" class="cursor-pointer">
          {{ t('quota.maybe_later') }}
        </UButton>
        <UButton color="primary" @click="goToSupport" class="cursor-pointer">
          {{ t('quota.contact_support') }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>
