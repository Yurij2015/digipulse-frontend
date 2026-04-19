<template>
  <div class="relative min-h-screen bg-white dark:bg-neutral-950 mesh-bg flex flex-col items-center justify-center pt-24 pb-12 px-6 md:pt-32 overflow-hidden transition-colors duration-500">
    <BaseLoader :show="loading" />
    
    <div class="w-full max-w-md relative z-10 transition-all duration-700">
      <div class="text-center mb-12">
        <div class="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full bg-primary-500/5 border border-primary-500/10 text-primary-500 dark:text-primary-400 text-xs font-bold tracking-tight">
          <div class="w-1 h-1 rounded-full bg-primary-500 animate-pulse"></div>
          {{ t('auth.verify_email.verifying') }}
        </div>
        <h2 class="text-5xl font-black text-neutral-900 dark:text-white tracking-tighter mb-4">
          {{ t('auth.verify_email.title') }}
        </h2>
        <p class="text-neutral-500 font-medium whitespace-pre-line">{{ subtitle }}</p>
      </div>

      <UCard v-if="status" class="glass-card border-neutral-200/50 dark:border-white/10 ring-0 overflow-visible rounded-2xl shadow-2xl relative shadow-primary-500/5 animate-in fade-in zoom-in duration-500">
        <div class="absolute -top-px left-10 right-10 h-px bg-linear-to-r from-transparent via-primary-500/50 to-transparent"></div>
        
        <div class="text-center py-6">
          <div :class="[
            'w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6',
            status === 'success' ? 'bg-success-500/10 text-success-500' : 'bg-error-500/10 text-error-500'
          ]">
            <UIcon :name="status === 'success' ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'" class="w-12 h-12" />
          </div>
          
          <h3 class="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
            {{ status === 'success' ? t('auth.verify_email.success_title') : t('auth.verify_email.error_title') }}
          </h3>
          <p class="text-neutral-500 font-medium mb-8 px-4">
            {{ status === 'success' ? t('auth.verify_email.success_desc') : t('auth.verify_email.error_desc') }}
          </p>

          <UButton 
            block 
            size="xl" 
            color="primary"
            class="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-black py-4 rounded-xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all border-0"
            :to="localePath('/auth/login')"
          >
            {{ t('auth.verify_email.back_to_login') }}
          </UButton>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useI18n, useLocalePath } from '#i18n';
import { useRoute, useRuntimeConfig, useToast } from '#imports';

const { t } = useI18n();
const localePath = useLocalePath();
const route = useRoute();
const config = useRuntimeConfig();
const toast = useToast();

const loading = ref(true);
const status = ref<'success' | 'error' | null>(null);

const subtitle = computed(() => {
  if (loading.value) return t('auth.verify_email.subtitle');
  return '';
});

onMounted(async () => {
  const { id, hash, signature } = route.query;

  if (!id || !hash || !signature) {
    status.value = 'error';
    loading.value = false;
    return;
  }

  try {
    await $fetch(`${config.public.apiBase}/api/email/verify`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Frontend-Key': config.public.frontendKey as string
      },
      body: {
        id: Number(id),
        hash: hash as string,
        signature: signature as string
      }
    });

    status.value = 'success';
  } catch (error: any) {
    console.error('Verification Error:', error);
    status.value = 'error';
    toast.add({
      title: t('auth.verify_email.error_title'),
      description: error.data?.message || t('auth.verify_email.error_desc'),
      color: 'error'
    });
  } finally {
    loading.value = false;
  }
});
</script>
