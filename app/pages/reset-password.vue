<template>
  <div class="relative min-h-screen bg-white dark:bg-neutral-950 mesh-bg flex flex-col items-center justify-center p-6 overflow-hidden transition-colors duration-500">
    <div class="w-full max-w-md relative z-10 transition-all duration-700">
      <div class="text-center mb-12">
        <h2 class="text-5xl font-black text-neutral-900 dark:text-white tracking-tighter mb-4">
          {{ isSuccess ? $t('reset_password.success_title') : $t('reset_password.title') }}
        </h2>
        <p class="text-neutral-500 font-medium">
          {{ isSuccess ? $t('reset_password.success_desc') : $t('reset_password.subtitle') }}
        </p>
      </div>

      <UCard class="glass-card border-neutral-200/50 dark:border-white/10 ring-0 overflow-visible rounded-2xl shadow-2xl relative shadow-primary-500/5">
        <div class="absolute -top-px left-10 right-10 h-px bg-linear-to-r from-transparent via-primary-500/50 to-transparent"></div>
        
        <div v-if="!isSuccess">
          <UForm :state="state" :schema="schema" @submit="onSubmit" class="flex flex-col gap-6">
            <UFormField :label="$t('auth.password')" name="password" class="premium-label">
              <UInput 
                v-model="state.password" 
                type="password" 
                icon="i-heroicons-lock-closed" 
                :placeholder="$t('auth.password_placeholder')"
                size="xl"
                class="w-full"
                :ui="{ 
                  root: 'premium-input w-full',
                  base: 'py-3 ps-10! px-4 text-neutral-900 dark:text-white bg-transparent border-0 ring-0 hover:bg-transparent focus:ring-0 focus:bg-transparent'
                }"
              />
            </UFormField>

            <UFormField :label="$t('auth.confirm_password')" name="password_confirmation" class="premium-label">
              <UInput 
                v-model="state.password_confirmation" 
                type="password" 
                icon="i-heroicons-lock-closed-solid" 
                :placeholder="$t('auth.password_placeholder')"
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
              class="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-black py-5 rounded-xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all mt-4 border-0 shimmer-effect cursor-pointer"
            >
              {{ $t('reset_password.submit') }}
            </UButton>
          </UForm>
        </div>

        <div v-else class="flex flex-col items-center justify-center py-6 text-center">
          <div class="w-20 h-20 rounded-full bg-primary-500/10 flex items-center justify-center mb-6 border border-primary-500/20">
            <UIcon name="i-heroicons-shield-check" class="text-4xl text-primary-500" />
          </div>
          <UButton 
            :to="localePath('/auth')"
            size="xl"
            class="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-black py-4 px-8 rounded-xl cursor-pointer"
          >
            {{ $t('auth.sign_in') }}
          </UButton>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { object, string, ref as yupRef } from 'yup';
import { useI18n, useLocalePath } from '#i18n';
import { useRouter, useRoute, useRuntimeConfig, useToast } from '#imports';

const { t } = useI18n();
const localePath = useLocalePath();
const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();
const toast = useToast();

const state = ref({
  token: '',
  email: '',
  password: '',
  password_confirmation: ''
});

const loading = ref(false);
const isSuccess = ref(false);

onMounted(() => {
  state.value.token = route.query.token as string || '';
  state.value.email = route.query.email as string || '';
  
  if (!state.value.token) {
    toast.add({
      title: 'Invalid Link',
      description: 'Reset token is missing from URL',
      color: 'error'
    });
  }
});

const schema = object({
  password: string().min(6, t('auth.password_min')).required(t('auth.password_required')),
  password_confirmation: string()
    .oneOf([yupRef('password')], t('auth.passwords_mismatch'))
    .required(t('auth.passwords_mismatch')),
});

async function onSubmit() {
  if (!state.value.token) return;

  loading.value = true;
  try {
    await $fetch(`${config.public.apiBase}/api/reset-password`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Frontend-Key': config.public.frontendKey as string
      },
      body: {
        token: state.value.token,
        email: state.value.email,
        password: state.value.password,
        password_confirmation: state.value.password_confirmation
      }
    });

    isSuccess.value = true;
    toast.add({
      title: t('reset_password.success_title'),
      description: t('reset_password.success_desc'),
      color: 'success'
    });
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.data?.message || 'Failed to reset password',
      color: 'error'
    });
  } finally {
    loading.value = false;
  }
}
</script>
