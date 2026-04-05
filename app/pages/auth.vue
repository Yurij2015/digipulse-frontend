<template>
  <div class="relative min-h-screen bg-white dark:bg-neutral-950 mesh-bg flex flex-col items-center justify-center p-6 overflow-hidden transition-colors duration-500">
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

          <UButton 
            type="submit" 
            block 
            size="xl" 
            :loading="loading"
            class="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-black py-5 rounded-xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all mt-10 border-0 shimmer-effect"
          >
            {{ isLogin ? $t('auth.sign_in') : $t('auth.create_account') }}
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
const { setAuth } = useAuth();
const toast = useToast();

const isLogin = ref(true);
const showPassword = ref(false);
const loading = ref(false);

const state = ref({
  email: '',
  password: '',
  confirmPassword: '',
});

const schema = computed(() => object({
  email: string().email(t('auth.invalid_email')).required(t('auth.email_required')),
  password: string().min(6, t('auth.password_min')).required(t('auth.password_required')),
  confirmPassword: string().when('password', {
    is: (val: string) => !isLogin.value && val && val.length > 0,
    then: (schema) => schema.oneOf([yupRef('password')], t('auth.passwords_mismatch')).required(t('auth.passwords_mismatch')),
    otherwise: (schema) => schema,
  }),
}));

async function onSubmit() {
  loading.value = true;
  
  try {
    const endpoint = isLogin.value ? 'http://localhost/api/login' : 'http://localhost/api/register';
    const body: any = {
      email: state.value.email,
      password: state.value.password,
    };
    
    if (!isLogin.value) {
      body.password_confirmation = state.value.confirmPassword;
    }

    console.log(`Sending ${isLogin.value ? 'login' : 'register'} request to: ${endpoint}`);
    
    const response = await $fetch<AuthResponse>(endpoint, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Frontend-Key': 'cvdMXAq7pkUEXJAh16ICaf1YjIAg/cvfEbOqndBjyKie1dMXAq7pfEbOqndBjyKie1'
      },
      body
    });

    console.log('API Response received:', response);

    if (response && response.token && response.user) {
      setAuth(response);
      console.log('Auth successful, redirecting to dashboard...');
      const target = localePath('/dashboard');
      await router.push(target);
    } else {
      console.error('Invalid response from API:', response);
      toast.add({
        title: 'Auth Error',
        description: 'Server returned invalid data structure',
        color: 'error'
      });
    }
  } catch (error: any) {
    console.error('Submit Error:', error);
    toast.add({
      title: 'Connection Error',
      description: error.data?.message || 'Failed to connect to server',
      color: 'error'
    });
  } finally {
    loading.value = false;
  }
}
</script>
