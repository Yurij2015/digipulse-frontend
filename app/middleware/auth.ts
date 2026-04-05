import { defineNuxtRouteMiddleware, navigateTo, useAuth } from '#imports';

export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated, init } = useAuth();
  
  // Якщо ми на клієнті і ще не ініціалізовані - пробуємо ініціалізуватися
  if (typeof window !== 'undefined' && !isAuthenticated.value) {
    init();
  }

  // Якщо користувач не авторизований - перенаправляємо на головну
  if (!isAuthenticated.value) {
    return navigateTo('/');
  }
});
