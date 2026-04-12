import { defineNuxtRouteMiddleware, navigateTo, useAuth } from '#imports';

export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated, token, user } = useAuth();
  
  if (!isAuthenticated.value) {
    return navigateTo('/');
  }
});
