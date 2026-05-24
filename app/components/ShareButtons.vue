<template>
  <div class="flex items-center gap-2 flex-wrap">
    <span class="text-xs font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mr-1">{{ t('share.label') }}</span>

    <!-- Telegram -->
    <a
      :href="`https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`"
      target="_blank"
      rel="noopener noreferrer"
      :title="t('share.telegram')"
      class="inline-flex items-center justify-center w-8 h-8 rounded-lg transition-colors cursor-pointer bg-[#229ED9]/10 hover:bg-[#229ED9]/20 text-[#229ED9]"
    >
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
      </svg>
    </a>

    <!-- X / Twitter -->
    <a
      :href="`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`"
      target="_blank"
      rel="noopener noreferrer"
      :title="t('share.twitter')"
      class="inline-flex items-center justify-center w-8 h-8 rounded-lg transition-colors cursor-pointer bg-neutral-900/10 hover:bg-neutral-900/20 text-neutral-900 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white"
    >
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.258 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
      </svg>
    </a>

    <!-- LinkedIn -->
    <a
      :href="`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`"
      target="_blank"
      rel="noopener noreferrer"
      :title="t('share.linkedin')"
      class="inline-flex items-center justify-center w-8 h-8 rounded-lg transition-colors cursor-pointer bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 text-[#0A66C2]"
    >
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    </a>

    <!-- Facebook -->
    <a
      :href="`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`"
      target="_blank"
      rel="noopener noreferrer"
      :title="t('share.facebook')"
      class="inline-flex items-center justify-center w-8 h-8 rounded-lg transition-colors cursor-pointer bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2]"
    >
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    </a>

    <!-- Copy link -->
    <button
      :title="t('share.copy')"
      class="inline-flex items-center justify-center w-8 h-8 rounded-lg transition-colors cursor-pointer"
      :class="copied
        ? 'bg-green-500/10 text-green-600 dark:text-green-400'
        : 'bg-neutral-100 dark:bg-white/5 hover:bg-neutral-200 dark:hover:bg-white/10 text-neutral-500 dark:text-neutral-400'"
      @click="copyLink"
    >
      <UIcon
        :name="copied ? 'i-heroicons-check' : 'i-heroicons-link'"
        class="w-4 h-4"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from '#imports';

const props = defineProps<{
  url?: string
  title?: string
}>();

const { t } = useI18n();
const url = useRequestURL();

const shareUrl = computed(() => props.url || url.href);
const shareTitle = computed(() => props.title || document?.title || 'DigiPulse');

const encodedUrl = computed(() => encodeURIComponent(shareUrl.value));
const encodedTitle = computed(() => encodeURIComponent(shareTitle.value));

const copied = ref(false);

async function copyLink() {
  try {
    await navigator.clipboard.writeText(shareUrl.value);
    copied.value = true;
    setTimeout(() => { copied.value = false; }, 2000);
  } catch {
    // fallback: do nothing
  }
}
</script>
