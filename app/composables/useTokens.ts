import type { Ref } from 'vue';
import { ref } from '#imports';

export interface Token {
  id: number
  name: string
  created_at: string
  last_used_at: string | null
}

interface CreateTokenResponse {
  id: number
  name: string
  mcp_url: string
  created_at: string
}

export const useTokens = () => {
  const tokens: Ref<Token[]> = ref([]);
  const loading: Ref<boolean> = ref(false);

  const { token: authToken } = useAuth();
  const config = useRuntimeConfig();

  const authHeaders = () => ({
    Authorization: `Bearer ${authToken.value}`,
    'X-Frontend-Key': config.public.frontendKey as string,
    Accept: 'application/json',
  });

  const fetchTokens = async () => {
    loading.value = true;
    try {
      const response = await $fetch<{ tokens: Token[] }>(`${config.public.apiBase}/api/v1/tokens`, {
        headers: authHeaders()
      });
      tokens.value = response.tokens;
    } finally {
      loading.value = false;
    }
  };

  const createToken = async (name: string): Promise<CreateTokenResponse> => {
    return await $fetch<CreateTokenResponse>(`${config.public.apiBase}/api/v1/tokens`, {
      method: 'POST',
      headers: authHeaders(),
      body: { name }
    });
  };

  const revokeToken = async (id: number) => {
    await $fetch(`${config.public.apiBase}/api/v1/tokens/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    });
    tokens.value = tokens.value.filter(t => t.id !== id);
  };

  return { tokens, loading, fetchTokens, createToken, revokeToken };
};
