import type { User, AuthResponse } from '~/types/auth';
import { useState, computed, useCookie } from '#imports';

export const useAuth = () => {
  // Використовуємо useCookie для SSR-сумісності (працює і на сервері, і на клієнті)
  const tokenCookie = useCookie<string | null>('auth-token', { path: '/', maxAge: 60 * 60 * 24 * 7 }); // 7 днів
  const userCookie = useCookie<User | null>('auth-user', { path: '/', maxAge: 60 * 60 * 24 * 7 });

  // Реактивний стан, який синхронізується з Cookies
  const user = useState<User | null>('auth-user-state', () => userCookie.value || null);
  const token = useState<string | null>('auth-token-state', () => tokenCookie.value || null);

  const init = () => {
    // В Nuxt 4 з useCookie ініціалізація відбувається автоматично
    // Але ми тримаємо цей метод для сумісності з іншими частинами коду
    if (tokenCookie.value) {
      token.value = tokenCookie.value;
    }
    if (userCookie.value) {
      user.value = userCookie.value;
    }
  };

  const setAuth = (response: AuthResponse) => {
    user.value = response.user;
    token.value = response.token;
    
    // Оновлюємо Cookies
    userCookie.value = response.user;
    tokenCookie.value = response.token;
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    
    // Очищуємо Cookies
    userCookie.value = null;
    tokenCookie.value = null;
  };

  const isAuthenticated = computed(() => !!token.value);

  return {
    user,
    token,
    isAuthenticated,
    init,
    setAuth,
    logout
  };
};
