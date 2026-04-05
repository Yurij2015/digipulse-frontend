import { defineNuxtRouteMiddleware, navigateTo, useAuth, useLocalePath } from '#imports';

export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated } = useAuth();
  const localePath = useLocalePath();
  
  // Тепер isAuthenticated працює і на сервері завдяки Cookies
  if (isAuthenticated.value) {
    return navigateTo(localePath('/dashboard'));
  }
});
