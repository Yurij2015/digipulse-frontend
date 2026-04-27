import type { User, AuthResponse } from '~/types/auth';
import { computed, useCookie, useRuntimeConfig } from '#imports';
import { useSitesStore } from '~/stores/sites';

export const useAuth = () => {
  const sitesStore = useSitesStore();
  // В Nuxt useCookie вже є реактивним станом.
  // Використовуємо його як першоджерело (single source of truth).
  const token = useCookie<string | null>('auth-token', { 
    path: '/', 
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax'
  });
  
  const user = useCookie<User | null>('auth-user', { 
    path: '/', 
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax'
  });

  // Ці методи залишаються для сумісності інтерфейсу
  const init = () => {
    // Вже не потрібно нічого робити вручну, Cookies підхоплюються самі
  };

  const setAuth = (response: AuthResponse) => {
    token.value = response.token;
    user.value = response.user;
  };

  const logout = () => {
    token.value = null;
    user.value = null;
    sitesStore.clearSites();
  };

  const isAuthenticated = computed(() => !!token.value);
  const config = useRuntimeConfig();

  const fetchUser = async () => {
    if (!token.value) return;

    try {
      const response = await $fetch<{ user: User }>(`${config.public.apiBase}/api/me`, {
        headers: {
          Authorization: `Bearer ${token.value}`,
          'X-Frontend-Key': config.public.frontendKey as string,
          Accept: 'application/json',
        }
      });

      if (response.user) {
        user.value = response.user;
      }
    } catch (error: any) {
      console.error('Failed to fetch user:', error);
      if (error?.status === 401) {
        logout();
      }
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    init,
    setAuth,
    logout,
    fetchUser
  };
};
