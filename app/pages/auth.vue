<template>
  <div class="relative min-h-screen bg-white dark:bg-neutral-950 mesh-bg flex flex-col items-center justify-center p-6 overflow-hidden transition-colors duration-500">
    <div class="w-full max-w-md relative z-10 transition-all duration-700 delay-100">
      <div class="text-center mb-12">
        <div class="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full bg-primary-500/5 border border-primary-500/10 text-primary-500 dark:text-primary-400 text-xs font-bold tracking-tight">
          <div class="w-1 h-1 rounded-full bg-primary-500"></div>
          SECURE ACCESS
        </div>
        <h2 class="text-5xl font-black text-neutral-900 dark:text-white tracking-tighter mb-4">
          {{ isLogin ? 'Welcome Back' : 'Join Pulse' }}
        </h2>
        <p class="text-neutral-500 font-medium">Control your digital infrastructure in real-time.</p>
      </div>

      <UCard class="glass-card border-neutral-200/50 dark:border-white/5 ring-0 overflow-visible rounded-[2.5rem] shadow-2xl">
        <UForm :state="state" :schema="schema" @submit="onSubmit" class="space-y-12">
          <UFormGroup label="Email" name="email" class="premium-label">
            <UInput 
              v-model="state.email" 
              type="email" 
              icon="i-heroicons-envelope" 
              placeholder="name@company.com"
              size="xl"
              class="w-full"
              :ui="{ 
                root: 'premium-input w-full',
                base: 'py-5 ps-12! px-5 text-neutral-900 dark:text-white bg-transparent border-0 ring-0 hover:bg-transparent focus:ring-0 focus:bg-transparent'
              }"
            />
          </UFormGroup>

          <UFormGroup label="Password" name="password" class="premium-label">
            <UInput 
              v-model="state.password" 
              :type="showPassword ? 'text' : 'password'" 
              icon="i-heroicons-lock-closed" 
              placeholder="••••••••"
              size="xl"
              class="w-full"
              :ui="{ 
                root: 'premium-input w-full relative',
                base: 'py-5 ps-12! pe-14! px-5 text-neutral-900 dark:text-white bg-transparent border-0 ring-0 hover:bg-transparent focus:ring-0 focus:bg-transparent'
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
          </UFormGroup>

          <UFormGroup v-if="!isLogin" label="Confirm Password" name="confirmPassword" class="premium-label">
            <UInput 
              v-model="state.confirmPassword" 
              :type="showPassword ? 'text' : 'password'" 
              icon="i-heroicons-lock-closed-solid" 
              placeholder="••••••••"
              size="xl"
              class="w-full"
              :ui="{ 
                root: 'premium-input w-full',
                base: 'py-5 ps-12! px-5 text-neutral-900 dark:text-white bg-transparent border-0 ring-0 hover:bg-transparent focus:ring-0 focus:bg-transparent'
              }"
            />
          </UFormGroup>

          <UButton 
            type="submit" 
            block 
            size="xl" 
            :loading="loading"
            class="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-black py-5 rounded-2xl shadow-xl hover:scale-[1.02] transition-transform mt-10 border-0"
          >
            {{ isLogin ? 'Sign In' : 'Create Account' }}
          </UButton>
        </UForm>

        <template #footer>
          <div class="text-center">
            <p class="text-neutral-500 font-medium">
              {{ isLogin ? "Don't have an account?" : "Already have an account?" }}
              <UButton 
                variant="link" 
                color="primary" 
                class="font-black p-0 ml-1 text-primary-500 hover:text-primary-400 decoration-2 underline-offset-4"
                @click="isLogin = !isLogin"
              >
                {{ isLogin ? 'Sign Up' : 'Log In' }}
              </UButton>
            </p>
          </div>
        </template>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { object, string, ref as yupRef } from 'yup';
import { navigateTo } from '#imports';

const isLogin = ref(true);
const showPassword = ref(false);
const loading = ref(false);

const state = ref({
  email: '',
  password: '',
  confirmPassword: '',
});

const schema = object({
  email: string().email('Невірний формат email').required('Email є обов\'язковим'),
  password: string().min(6, 'Пароль має бути не менше 6 символів').required('Пароль є обов\'язковим'),
  confirmPassword: string().when('password', {
    is: (val: string) => !isLogin.value && val && val.length > 0,
    then: (schema) => schema.oneOf([yupRef('password')], 'Паролі не співпадають').required('Підтвердження пароля є обов\'язковим'),
    otherwise: (schema) => schema,
  }),
});

async function onSubmit() {
  loading.value = true;
  console.log('Form submitted:', state.value);
  await new Promise(resolve => setTimeout(resolve, 1500));
  loading.value = false;
  navigateTo('/dashboard');
}
</script>
