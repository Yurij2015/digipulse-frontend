import { defineNuxtRouteMiddleware, navigateTo, useAuth } from '#imports';

export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated } = useAuth();
  
  // Тепер isAuthenticated працює і на сервері завдяки Cookies
  if (!isAuthenticated.value) {
    return navigateTo('/');
  }
});
