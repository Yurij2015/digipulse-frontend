import type { User, AuthResponse } from '~/types/auth';
import { useState, useRuntimeConfig, computed } from '#imports';

export const useAuth = () => {
  const user = useState<User | null>('auth-user', () => null);
  const token = useState<string | null>('auth-token', () => null);

  // Ініціалізація з sessionStorage
  const init = () => {
    if (typeof window === 'undefined') return;
    
    const savedToken = sessionStorage.getItem('token');
    const savedUser = sessionStorage.getItem('user');

    if (savedToken && savedUser) {
      token.value = savedToken;
      try {
        user.value = JSON.parse(savedUser);
      } catch (e) {
        console.error('Failed to parse saved user', e);
        logout();
      }
    }
  };

  const setAuth = (response: AuthResponse) => {
    user.value = response.user;
    token.value = response.token;
    
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('token', response.token);
      sessionStorage.setItem('user', JSON.stringify(response.user));
    }
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
    }
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
