<template>
  <div class="relative min-h-screen bg-white dark:bg-neutral-950 mesh-bg flex flex-col items-center justify-center p-6 overflow-hidden transition-colors duration-500">
    <div class="w-full max-w-md relative z-10 transition-all duration-700">
      <div class="text-center mb-12">
        <h2 class="text-5xl font-black text-neutral-900 dark:text-white tracking-tighter mb-4">
          {{ isSuccess ? $t('forgot_password.success_title') : $t('forgot_password.title') }}
        </h2>
        <p class="text-neutral-500 font-medium">
          {{ isSuccess ? $t('forgot_password.success_desc') : $t('forgot_password.subtitle') }}
        </p>
      </div>

      <UCard class="glass-card border-neutral-200/50 dark:border-white/10 ring-0 overflow-visible rounded-2xl shadow-2xl relative shadow-primary-500/5">
        <div class="absolute -top-px left-10 right-10 h-px bg-linear-to-r from-transparent via-primary-500/50 to-transparent"></div>
        
        <div v-if="!isSuccess">
          <UForm :state="state" :schema="schema" @submit="onSubmit" class="flex flex-col gap-6">
            <UFormField :label="$t('auth.email')" name="email" class="premium-label">
              <UInput 
                v-model="state.email" 
                type="email" 
                icon="i-heroicons-envelope" 
                :placeholder="$t('auth.email_placeholder')"
                size="xl"
                class="w-full"
                :ui="{ 
                  root: 'premium-input w-full',
                  base: 'py-3 ps-10! px-4 text-neutral-900 dark:text-white bg-transparent border-0 ring-0 hover:bg-transparent focus:ring-0 focus:bg-transparent'
                }"
              />
            </UFormField>

            <UButton 
              type="submit" 
              block 
              size="xl" 
              :loading="loading"
              class="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-black py-5 rounded-xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all mt-4 border-0 shimmer-effect"
            >
              {{ $t('forgot_password.send_link') }}
            </UButton>
          </UForm>
        </div>

        <div v-else class="flex flex-col items-center justify-center py-6 text-center">
          <div class="w-20 h-20 rounded-full bg-primary-500/10 flex items-center justify-center mb-6 border border-primary-500/20">
            <UIcon name="i-heroicons-check-circle" class="text-4xl text-primary-500" />
          </div>
          <UButton 
            variant="link" 
            color="primary" 
            class="font-black text-primary-500 hover:text-primary-400 decoration-none hover:underline underline-offset-4"
            @click="isSuccess = false"
          >
            {{ $t('forgot_password.send_link') }} ще раз
          </UButton>
        </div>

        <template #footer>
          <div class="text-center">
            <UButton 
              :to="localePath('/auth')" 
              variant="link" 
              color="neutral" 
              icon="i-heroicons-arrow-left"
              class="font-bold text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            >
              {{ $t('forgot_password.back_to_login') }}
            </UButton>
          </div>
        </template>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { object, string } from 'yup';
import { useI18n, useLocalePath } from '#i18n';
import { useRuntimeConfig, useToast } from '#imports';

const { t } = useI18n();
const localePath = useLocalePath();
const config = useRuntimeConfig();
const toast = useToast();

const state = ref({ email: '' });
const loading = ref(false);
const isSuccess = ref(false);

const schema = object({
  email: string().email(t('auth.invalid_email')).required(t('auth.email_required')),
});

async function onSubmit() {
  loading.value = true;
  try {
    const response = await $fetch(`${config.public.apiBase}/api/forgot-password`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Frontend-Key': config.public.frontendKey as string
      },
      body: { email: state.value.email }
    });

    isSuccess.value = true;
    toast.add({
      title: t('forgot_password.success_title'),
      description: t('forgot_password.success_desc'),
      color: 'success'
    });
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.data?.message || 'Failed to send reset link',
      color: 'error'
    });
  } finally {
    loading.value = false;
  }
}
</script>
