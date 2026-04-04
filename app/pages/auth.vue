<template>
  <div class="relative min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col items-center justify-center p-6 overflow-hidden transition-colors duration-500">
    <!-- Background Accents -->
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[600px] aspect-square bg-primary-500/10 dark:bg-primary-500/5 blur-[120px] rounded-full pointer-events-none"></div>

    <div class="w-full max-w-md relative z-10">
      <div class="text-center mb-10">
        <div class="inline-flex p-4 rounded-3xl bg-pulse-gradient mb-6 shadow-2xl shadow-primary-500/20">
          <UIcon name="i-heroicons-shield-check" class="text-4xl text-white" />
        </div>
        <h2 class="text-4xl font-black text-neutral-900 dark:text-white tracking-tighter mb-2">
          {{ isLogin ? 'Вітаємо знову' : 'Створити акаунт' }}
        </h2>
        <p class="text-neutral-500 font-medium">Керуйте вашою цифровою швидкістю</p>
      </div>

      <UCard class="glass-card border-white/5 ring-0 overflow-visible rounded-[2.5rem]">
        <UForm :state="state" :schema="schema" @submit="onSubmit" class="space-y-6">
          <UFormGroup label="Ваш Email" name="email" class="premium-label">
            <UInput 
              v-model="state.email" 
              type="email" 
              icon="i-heroicons-envelope" 
              placeholder="name@company.com"
              size="xl"
              class="neon-input"
              :ui="{ base: 'rounded-2xl border-x-0 border-y-0 ring-0 bg-transparent text-white pl-12!' }"
            />
          </UFormGroup>

          <UFormGroup label="Пароль" name="password" class="premium-label">
            <UInput 
              v-model="state.password" 
              :type="showPassword ? 'text' : 'password'" 
              icon="i-heroicons-lock-closed" 
              placeholder="••••••••"
              size="xl"
              class="neon-input"
              :ui="{ base: 'rounded-2xl border-x-0 border-y-0 ring-0 bg-transparent text-white pl-12!' }"
            >
              <template #trailing>
                <UButton
                  variant="ghost"
                  color="neutral"
                  :icon="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
                  @click="showPassword = !showPassword"
                  square
                  class="mr-2"
                />
              </template>
            </UInput>
          </UFormGroup>

          <UFormGroup v-if="!isLogin" label="Підтвердження" name="confirmPassword" class="premium-label">
            <UInput 
              v-model="state.confirmPassword" 
              :type="showPassword ? 'text' : 'password'" 
              icon="i-heroicons-lock-closed-solid" 
              placeholder="••••••••"
              size="xl"
              class="neon-input"
              :ui="{ base: 'rounded-2xl border-x-0 border-y-0 ring-0 bg-transparent text-white pl-12!' }"
            />
          </UFormGroup>

          <UButton 
            type="submit" 
            block 
            size="xl" 
            :loading="loading"
            class="bg-pulse-gradient font-black py-5 rounded-2xl shadow-xl shadow-primary-500/20 hover:scale-[1.02] transition-transform mt-10"
          >
            {{ isLogin ? 'Увійти в систему' : 'Зареєструватися' }}
          </UButton>
        </UForm>

        <template #footer>
          <div class="text-center pt-2">
            <p class="text-neutral-500 font-medium">
              {{ isLogin ? 'Немає облікового запису?' : 'Вже маєте акаунт?' }}
              <UButton 
                variant="link" 
                color="primary" 
                class="font-black p-0 ml-1 text-pink-500 hover:text-pink-400 decoration-2 underline-offset-4"
                @click="isLogin = !isLogin"
              >
                {{ isLogin ? 'Зареєструватися' : 'Увійти' }}
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
