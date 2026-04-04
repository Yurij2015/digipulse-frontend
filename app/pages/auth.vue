<template>
  <div class="relative min-h-screen bg-neutral-950 flex items-center justify-center p-4 overflow-hidden">
    <!-- Background Accents -->
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-500/10 blur-[120px] rounded-full"></div>

    <UCard class="glass-card w-full max-w-md relative z-10 border-white/5 ring-0">
      <template #header>
        <div class="text-center py-4">
          <div class="inline-flex p-3 rounded-2xl bg-pulse-gradient mb-4 shadow-lg shadow-primary-500/20">
            <UIcon name="i-heroicons-shield-check" class="text-3xl text-white" />
          </div>
          <h2 class="text-3xl font-black text-white tracking-tight">
            {{ isLogin ? 'Вітаємо знову' : 'Створити акаунт' }}
          </h2>
          <p class="text-neutral-500 mt-2">Введіть свої дані для доступу</p>
        </div>
      </template>

      <UForm :state="state" :schema="schema" @submit="onSubmit" class="space-y-5">
        <UFormGroup label="Ваш Email" name="email">
          <UInput 
            v-model="state.email" 
            type="email" 
            icon="i-heroicons-envelope" 
            placeholder="name@company.com"
            size="lg"
            class="bg-white/5 border-white/10 text-white"
          />
        </UFormGroup>

        <UFormGroup label="Пароль" name="password">
          <UInput 
            v-model="state.password" 
            :type="showPassword ? 'text' : 'password'" 
            icon="i-heroicons-lock-closed" 
            placeholder="••••••••"
            size="lg"
            class="bg-white/5 border-white/10 text-white"
          >
            <template #append>
              <UButton
                variant="ghost"
                color="neutral"
                :icon="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
                @click="showPassword = !showPassword"
                square
              />
            </template>
          </UInput>
        </UFormGroup>

        <UFormGroup v-if="!isLogin" label="Підтвердження" name="confirmPassword">
          <UInput 
            v-model="state.confirmPassword" 
            :type="showPassword ? 'text' : 'password'" 
            icon="i-heroicons-lock-closed-solid" 
            placeholder="••••••••"
            size="lg"
            class="bg-white/5 border-white/10 text-white"
          />
        </UFormGroup>

        <UButton 
          type="submit" 
          block 
          size="xl" 
          :loading="loading"
          class="bg-pulse-gradient font-bold shadow-lg shadow-primary-500/20 hover:opacity-90 transition-opacity mt-8"
        >
          {{ isLogin ? 'Увійти в систему' : 'Зареєструватися' }}
        </UButton>
      </UForm>

      <template #footer>
        <div class="text-center">
          <p class="text-neutral-400">
            {{ isLogin ? 'Немає облікового запису?' : 'Вже маєте акаунт?' }}
            <UButton 
              variant="link" 
              color="primary" 
              class="font-bold p-0 ml-1 text-pink-500 hover:text-pink-400"
              @click="isLogin = !isLogin"
            >
              {{ isLogin ? 'Зареєструватися' : 'Увійти' }}
            </UButton>
          </p>
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { object, string, ref as yupRef } from 'yup';

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
