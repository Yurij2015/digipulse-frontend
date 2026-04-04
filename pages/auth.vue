<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-900 text-white">
    <UCard class="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-lg">
      <template #header>
        <h2 class="text-3xl font-bold text-center text-primary-400">{{ isLogin ? 'Вхід' : 'Реєстрація' }}</h2>
      </template>

      <UForm :state="state" :schema="schema" @submit="onSubmit" class="space-y-6">
        <UFormGroup label="Email" name="email">
          <UInput v-model="state.email" type="email" icon="i-heroicons-envelope" placeholder="you@example.com" />
        </UFormGroup>

        <UFormGroup label="Пароль" name="password">
          <UInput v-model="state.password" :type="showPassword ? 'text' : 'password'" icon="i-heroicons-lock-closed" placeholder="********">
            <template #append>
              <UButton
                variant="link"
                color="gray"
                :icon="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
                @click="showPassword = !showPassword"
              />
            </template>
          </UInput>
        </UFormGroup>

        <UFormGroup v-if="!isLogin" label="Підтвердіть пароль" name="confirmPassword">
          <UInput v-model="state.confirmPassword" :type="showPassword ? 'text' : 'password'" icon="i-heroicons-lock-closed" placeholder="********" />
        </UFormGroup>

        <UButton type="submit" block size="lg" :loading="loading">
          {{ isLogin ? 'Увійти' : 'Зареєструватися' }}
        </UButton>
      </UForm>

      <template #footer>
        <div class="text-center mt-6">
          <p v-if="isLogin" class="text-gray-400">
            Немає облікового запису?
            <UButton variant="link" @click="isLogin = false">Зареєструватися</UButton>
          </p>
          <p v-else class="text-gray-400">
            Вже є обліковий запис?
            <UButton variant="link" @click="isLogin = true">Увійти</UButton>
          </p>
          <UButton v-if="isLogin" variant="link" class="mt-2">Забули пароль?</UButton>
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
  // Тут буде логіка для входу або реєстрації
  console.log('Form submitted:', state.value);
  await new Promise(resolve => setTimeout(resolve, 1500)); // Імітація затримки
  loading.value = false;
  // Після успішного входу/реєстрації можна перенаправити користувача
  // наприклад, navigateTo('/dashboard');
}
</script>

<style scoped>
/* Додаткові стилі, якщо потрібні, але Tailwind CSS та Nuxt UI вже надають багато */
</style>
