import { defineNuxtRouteMiddleware, navigateTo, useAuth, useLocalePath } from '#imports';

export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated, init } = useAuth();
  const localePath = useLocalePath();
  
  // Якщо ми на клієнті і ще не ініціалізовані - пробуємо ініціалізуватися
  if (typeof window !== 'undefined' && !isAuthenticated.value) {
    init();
  }

  // Якщо користувач вже авторизований - направляємо на дашборд
  if (isAuthenticated.value) {
    return navigateTo(localePath('/dashboard'));
  }
});
