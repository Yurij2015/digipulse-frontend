<template>
  <div class="relative min-h-screen bg-white dark:bg-neutral-950 mesh-bg flex flex-col items-center justify-center pt-24 pb-12 px-6 md:pt-32 overflow-hidden transition-colors duration-500">
    <BaseLoader :show="loading" />
    <div class="w-full max-w-md relative z-10 transition-all duration-700 delay-100">
      <div class="mb-4 flex">
        <UButton
          :to="localePath('/')"
          variant="link"
          color="neutral"
          icon="i-heroicons-arrow-left"
          class="font-bold text-neutral-500 hover:text-neutral-900 dark:hover:text-white p-0 cursor-pointer"
        >
          {{ t('auth.back_to_home') }}
        </UButton>
      </div>

      <div class="text-center mb-12">
        <div class="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full bg-primary-500/15 border border-primary-500/30 text-primary-700 dark:text-primary-300 text-[10px] font-black tracking-[0.2em] transition-all hover:bg-primary-500/25">
          <div class="w-1.5 h-1.5 rounded-full bg-primary-700 dark:bg-primary-400 animate-pulse"></div>
          <span>{{ t('index.premium_monitoring') }}</span>
        </div>
        <h2 class="text-5xl font-black text-neutral-900 dark:text-white tracking-tighter mb-4">
          {{ t('auth.join_pulse') }}
        </h2>
        <p class="text-neutral-500 font-medium">{{ t('auth.subtitle') }}</p>
      </div>

      <UAlert
        v-if="errorMessage"
        icon="i-heroicons-exclamation-triangle"
        color="error"
        variant="subtle"
        :title="errorMessage"
        class="mb-6 rounded-xl animate-shake"
      />

      <UCard class="glass-card border-neutral-200/50 dark:border-white/10 ring-0 overflow-visible rounded-2xl shadow-2xl relative shadow-primary-500/5">
        <div class="absolute -top-px left-10 right-10 h-px bg-linear-to-r from-transparent via-primary-500/50 to-transparent"></div>
        <UForm :state="state" :schema="schema" @submit="onSubmit" class="flex flex-col gap-5">
          <UFormField :label="t('auth.username')" name="name" class="premium-label">
            <UInput 
              v-model="state.name" 
              icon="i-heroicons-user" 
              :placeholder="t('auth.username_placeholder')"
              size="xl"
              class="w-full"
              :ui="{ 
                root: 'premium-input w-full',
                base: 'py-3 ps-10! px-4 text-neutral-900 dark:text-white bg-transparent border-0 ring-0 hover:bg-transparent focus:ring-0 focus:bg-transparent'
              }"
            />
          </UFormField>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <UFormField :label="t('auth.first_name')" name="first_name" class="premium-label">
              <UInput 
                v-model="state.first_name" 
                icon="i-heroicons-identification" 
                :placeholder="t('auth.first_name_placeholder')"
                size="xl"
                class="w-full"
                :ui="{ 
                  root: 'premium-input w-full',
                  base: 'py-3 ps-10! px-4 text-neutral-900 dark:text-white bg-transparent border-0 ring-0 hover:bg-transparent focus:ring-0 focus:bg-transparent'
                }"
              />
            </UFormField>
            <UFormField :label="t('auth.last_name')" name="last_name" class="premium-label">
              <UInput 
                v-model="state.last_name" 
                icon="i-heroicons-identification" 
                :placeholder="t('auth.last_name_placeholder')"
                size="xl"
                class="w-full"
                :ui="{ 
                  root: 'premium-input w-full',
                  base: 'py-3 ps-10! px-4 text-neutral-900 dark:text-white bg-transparent border-0 ring-0 hover:bg-transparent focus:ring-0 focus:bg-transparent'
                }"
              />
            </UFormField>
          </div>

          <UFormField :label="t('auth.email')" name="email" class="premium-label">
            <UInput 
              v-model="state.email" 
              type="email" 
              icon="i-heroicons-envelope" 
              :placeholder="t('auth.email_placeholder')"
              size="xl"
              class="w-full"
              :ui="{ 
                root: 'premium-input w-full',
                base: 'py-3 ps-10! px-4 text-neutral-900 dark:text-white bg-transparent border-0 ring-0 hover:bg-transparent focus:ring-0 focus:bg-transparent'
              }"
            />
          </UFormField>

          <UFormField :label="t('auth.password')" name="password" class="premium-label">
            <UInput 
              v-model="state.password" 
              :type="showPassword ? 'text' : 'password'" 
              icon="i-heroicons-lock-closed" 
              :placeholder="t('auth.password_placeholder')"
              size="xl"
              class="w-full"
              :ui="{ 
                root: 'premium-input w-full relative',
                base: 'py-3 ps-10! pe-12! px-4 text-neutral-900 dark:text-white bg-transparent border-0 ring-0 hover:bg-transparent focus:ring-0 focus:bg-transparent'
              }"
            >
              <template #trailing>
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-auto">
                  <UButton
                    variant="ghost"
                    color="neutral"
                    :icon="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
                    @click="showPassword = !showPassword"
                    square
                    class="hover:bg-neutral-100 dark:hover:bg-white/10 rounded-full transition-colors flex items-center justify-center p-2.5"
                  />
                </div>
              </template>
            </UInput>
          </UFormField>

          <UFormField :label="t('auth.confirm_password')" name="confirmPassword" class="premium-label">
            <UInput 
              v-model="state.confirmPassword" 
              :type="showPassword ? 'text' : 'password'" 
              icon="i-heroicons-lock-closed-solid" 
              :placeholder="t('auth.password_placeholder')"
              size="xl"
              class="w-full"
              :ui="{ 
                root: 'premium-input w-full',
                base: 'py-3 ps-10! px-4 text-neutral-900 dark:text-white bg-transparent border-0 ring-0 hover:bg-transparent focus:ring-0 focus:bg-transparent'
              }"
            />
          </UFormField>

          <div class="flex justify-center mt-1">
            <NuxtTurnstile 
              v-model="turnstileToken" 
              :key="turnstileTheme"
              :options="{ appearance: 'execute', theme: turnstileTheme }" 
            />
          </div>

          <UButton 
            type="submit" 
            block 
            size="xl" 
            :loading="loading"
            class="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-black py-5 rounded-xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all mt-4 border-0 shimmer-effect"
          >
            {{ t('auth.create_account') }}
          </UButton>

          <UButton
            block
            variant="outline"
            size="xl"
            color="neutral"
            class="group py-4 rounded-xl border-neutral-200 dark:border-white/10 dark:hover:bg-white/5 font-bold transition-all transform active:scale-95 mt-1 cursor-pointer"
            @click="handleGoogleLogin"
          >
            <template #leading>
              <div class="w-5 h-5 flex items-center justify-center">
                <svg viewBox="0 0 48 48" class="w-5 h-5 group-hover:scale-110 transition-transform">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  <path fill="none" d="M0 0h48v48H0z"/>
                </svg>
              </div>
            </template>
            {{ t('auth.google_sign_up') }}
          </UButton>
        </UForm>

        <template #footer>
          <div class="text-center">
            <p class="text-neutral-500 font-medium">
              {{ t('auth.have_account') }}
              <UButton 
                variant="link" 
                color="primary" 
                class="font-black p-0 ml-1 text-primary-500 hover:text-primary-400 decoration-none hover:underline underline-offset-4 transition-all cursor-pointer"
                :to="localePath('/auth/login')"
              >
                {{ t('auth.log_in') }}
              </UButton>
            </p>
          </div>
        </template>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { object, string, ref as yupRef } from 'yup';
import { useI18n, useLocalePath } from '#i18n';
import { useRouter, useAuth, useToast, useRuntimeConfig, useColorMode, useRoute } from '#imports';
import type { AuthResponse } from '~/types/auth';

definePageMeta({
  middleware: 'guest'
});

const { t } = useI18n();
const localePath = useLocalePath();
const router = useRouter();
const route = useRoute();
const config = useRuntimeConfig();
const { setAuth } = useAuth();
const toast = useToast();
const colorMode = useColorMode();

const showPassword = ref(false);
const loading = ref(false);
const turnstileToken = ref('');
const turnstileTheme = computed(() => colorMode.value === 'dark' ? 'dark' : 'light');

const errorMessage = computed(() => {
  const error = route.query.error as string;
  if (!error) return null;
  return t(`auth.errors.${error}`) || t('auth.errors.auth_failed');
});

const state = ref({
  email: '',
  name: '',
  first_name: '',
  last_name: '',
  password: '',
  confirmPassword: '',
});

const schema = object({
  email: string().email(t('auth.invalid_email')).required(t('auth.email_required')),
  name: string().required(t('auth.username_required')),
  first_name: string().required(t('auth.first_name_required')),
  last_name: string().required(t('auth.last_name_required')),
  password: string().min(6, t('auth.password_min')).required(t('auth.password_required')),
  confirmPassword: string().oneOf([yupRef('password')], t('auth.passwords_mismatch')).required(t('auth.passwords_mismatch')),
});

const handleGoogleLogin = () => {
  window.location.href = `${config.public.apiBase}/auth/redirect`;
};

async function onSubmit() {
  loading.value = true;
  
  try {
    const response = await $fetch<AuthResponse>(`${config.public.apiBase}/api/register`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Frontend-Key': config.public.frontendKey as string
      },
      body: {
        name: state.value.name,
        email: state.value.email,
        first_name: state.value.first_name,
        last_name: state.value.last_name,
        password: state.value.password,
        password_confirmation: state.value.confirmPassword,
        cf_turnstile_response: turnstileToken.value
      }
    });

    if (response && response.token && response.user) {
      setAuth(response);
      await router.push(localePath('/dashboard'));
    } else {
      toast.add({
        title: 'Auth Error',
        description: 'Server returned invalid data structure',
        color: 'error'
      });
      turnstileToken.value = '';
    }
  } catch (error: any) {
    console.error('Submit Error:', error);
    toast.add({
      title: 'Connection Error',
      description: error.data?.message || 'Failed to connect to server',
      color: 'error'
    });
    turnstileToken.value = '';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.animate-shake {
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
}

@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}
</style>
