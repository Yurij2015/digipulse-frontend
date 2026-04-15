<template>
  <div class="relative min-h-screen bg-white dark:bg-neutral-950 mesh-bg flex flex-col items-center justify-center p-6 overflow-hidden transition-colors duration-500">
    <BaseLoader :show="loading" />
    <div class="w-full max-w-md relative z-10 transition-all duration-700 delay-100">
      <!-- Global LanguageSwitcher in app.vue handles this -->
      <div class="text-center mb-12">
        <div class="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full bg-primary-500/5 border border-primary-500/10 text-primary-500 dark:text-primary-400 text-xs font-bold tracking-tight">
          <div class="w-1 h-1 rounded-full bg-primary-500"></div>
          {{ $t('auth.secure_access') }}
        </div>
        <h2 class="text-5xl font-black text-neutral-900 dark:text-white tracking-tighter mb-4">
          {{ isLogin ? $t('auth.welcome_back') : $t('auth.join_pulse') }}
        </h2>
        <p class="text-neutral-500 font-medium">{{ $t('auth.subtitle') }}</p>
      </div>

      <UCard class="glass-card border-neutral-200/50 dark:border-white/10 ring-0 overflow-visible rounded-2xl shadow-2xl relative shadow-primary-500/5">
        <div class="absolute -top-px left-10 right-10 h-px bg-linear-to-r from-transparent via-primary-500/50 to-transparent"></div>
        <UForm :state="state" :schema="schema" @submit="onSubmit" class="flex flex-col gap-5">
          <UFormField v-if="!isLogin" :label="$t('auth.username')" name="name" class="premium-label">
            <UInput 
              v-model="state.name" 
              icon="i-heroicons-user" 
              :placeholder="$t('auth.username_placeholder')"
              size="xl"
              class="w-full"
              :ui="{ 
                root: 'premium-input w-full',
                base: 'py-3 ps-10! px-4 text-neutral-900 dark:text-white bg-transparent border-0 ring-0 hover:bg-transparent focus:ring-0 focus:bg-transparent'
              }"
            />
          </UFormField>

          <div v-if="!isLogin" class="grid grid-cols-2 gap-4">
            <UFormField :label="$t('auth.first_name')" name="first_name" class="premium-label">
              <UInput 
                v-model="state.first_name" 
                icon="i-heroicons-identification" 
                :placeholder="$t('auth.first_name_placeholder')"
                size="xl"
                class="w-full"
                :ui="{ 
                  root: 'premium-input w-full',
                  base: 'py-3 ps-10! px-4 text-neutral-900 dark:text-white bg-transparent border-0 ring-0 hover:bg-transparent focus:ring-0 focus:bg-transparent'
                }"
              />
            </UFormField>
            <UFormField :label="$t('auth.last_name')" name="last_name" class="premium-label">
              <UInput 
                v-model="state.last_name" 
                icon="i-heroicons-identification" 
                :placeholder="$t('auth.last_name_placeholder')"
                size="xl"
                class="w-full"
                :ui="{ 
                  root: 'premium-input w-full',
                  base: 'py-3 ps-10! px-4 text-neutral-900 dark:text-white bg-transparent border-0 ring-0 hover:bg-transparent focus:ring-0 focus:bg-transparent'
                }"
              />
            </UFormField>
          </div>

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

          <UFormField :label="$t('auth.password')" name="password" class="premium-label">
            <UInput 
              v-model="state.password" 
              :type="showPassword ? 'text' : 'password'" 
              icon="i-heroicons-lock-closed" 
              :placeholder="$t('auth.password_placeholder')"
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
            <div v-if="isLogin" class="flex justify-end mt-1">
              <UButton 
                variant="link" 
                color="primary" 
                size="xs" 
                class="p-0 font-bold decoration-none hover:underline"
                :to="localePath('/forgot-password')"
              >
                {{ $t('auth.forgot_password_link') }}
              </UButton>
            </div>
          </UFormField>

          <UFormField v-if="!isLogin" :label="$t('auth.confirm_password')" name="confirmPassword" class="premium-label">
            <UInput 
              v-model="state.confirmPassword" 
              :type="showPassword ? 'text' : 'password'" 
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

          <!-- Cloudflare Turnstile -->
          <div class="flex justify-center mt-1">
            <NuxtTurnstile 
              v-model="token" 
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
            {{ isLogin ? $t('auth.sign_in') : $t('auth.create_account') }}
          </UButton>

          <!-- Google SSO Button -->
          <UButton
            block
            variant="outline"
            size="xl"
            color="neutral"
            class="group py-4 rounded-xl border-neutral-200 dark:border-white/10 dark:hover:bg-white/5 font-bold transition-all transform active:scale-95 mt-1"
            @click="handleGoogleLogin"
          >
            <template #leading>
              <div class="w-5 h-5 flex items-center justify-center">
                <svg viewBox="0 0 24 24" class="w-5 h-5 group-hover:scale-110 transition-transform">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </div>
            </template>
            {{ isLogin ? $t('auth.google_sign_in') : $t('auth.google_sign_up') }}
          </UButton>

        </UForm>

        <template #footer>
          <div class="text-center">
            <p class="text-neutral-500 font-medium">
              {{ isLogin ? $t('auth.no_account') : $t('auth.have_account') }}
              <UButton 
                variant="link" 
                color="primary" 
                class="font-black p-0 ml-1 text-primary-500 hover:text-primary-400 decoration-none hover:underline underline-offset-4 transition-all"
                @click="isLogin = !isLogin"
              >
                {{ isLogin ? $t('auth.sign_up') : $t('auth.log_in') }}
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
import { useRouter, useAuth, useToast } from '#imports';
import type { AuthResponse } from '~/types/auth';

definePageMeta({
  middleware: 'guest'
});

const { t } = useI18n();
const localePath = useLocalePath();
const router = useRouter();
const config = useRuntimeConfig();
const { setAuth } = useAuth();
const toast = useToast();

const isLogin = ref(true);
const showPassword = ref(false);
const loading = ref(false);
const colorMode = useColorMode();
const turnstileTheme = computed(() => colorMode.value === 'dark' ? 'dark' : 'light');

const token = ref('');

const state = ref({
  email: '',
  name: '',
  first_name: '',
  last_name: '',
  password: '',
  confirmPassword: '',
});

const schema = computed(() => object({
  email: string().email(t('auth.invalid_email')).required(t('auth.email_required')),
  name: string().when('isLogin', {
    is: () => !isLogin.value,
    then: (schema) => schema.required(t('auth.username_required')),
    otherwise: (schema) => schema.optional(),
  }),
  first_name: string().when('isLogin', {
    is: () => !isLogin.value,
    then: (schema) => schema.required(t('auth.first_name_required')),
    otherwise: (schema) => schema.optional(),
  }),
  last_name: string().when('isLogin', {
    is: () => !isLogin.value,
    then: (schema) => schema.required(t('auth.last_name_required')),
    otherwise: (schema) => schema.optional(),
  }),
  password: string().min(6, t('auth.password_min')).required(t('auth.password_required')),
  confirmPassword: string().when('password', {
    is: (val: string) => !isLogin.value && val && val.length > 0,
    then: (schema) => schema.oneOf([yupRef('password')], t('auth.passwords_mismatch')).required(t('auth.passwords_mismatch')),
    otherwise: (schema) => schema,
  }),
}));

const handleGoogleLogin = () => {
  // Redirect to backend Google Auth endpoint
  window.location.href = `${config.public.apiBase}/auth/redirect`;
};

async function onSubmit() {
  loading.value = true;
  
  try {
    const endpoint = isLogin.value ? `${config.public.apiBase}/api/login` : `${config.public.apiBase}/api/register`;
    const body: any = {
      email: state.value.email,
      password: state.value.password,
    };
    
    if (!isLogin.value) {
      body.name = state.value.name;
      body.first_name = state.value.first_name;
      body.last_name = state.value.last_name;
      body.password_confirmation = state.value.confirmPassword;
    }

    // Include Turnstile token
    body.cf_turnstile_response = token.value;
    
    const response = await $fetch<AuthResponse>(endpoint, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Frontend-Key': config.public.frontendKey as string
      },
      body
    });

    if (response && response.token && response.user) {
      setAuth(response);
      const target = localePath('/dashboard');
      await router.push(target);
    } else {
      console.error('Invalid response from API:', response);
      toast.add({
        title: 'Auth Error',
        description: 'Server returned invalid data structure',
        color: 'error'
      });
      // Reset Turnstile on error
      token.value = '';
    }
  } catch (error: any) {
    console.error('Submit Error:', error);
    toast.add({
      title: 'Connection Error',
      description: error.data?.message || 'Failed to connect to server',
      color: 'error'
    });
    // Reset Turnstile on error
    token.value = '';
  } finally {
    loading.value = false;
  }
}
</script>
