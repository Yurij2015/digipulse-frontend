/**
 * Returns the API base URL to use for fetch calls.
 * On the server (SSR), prefers the private NUXT_API_BASE env var so the Docker container
 * can reach the backend via an internal URL instead of going through the public domain.
 * On the client, always uses the public apiBase.
 */
export function useApiBase(): string {
  const config = useRuntimeConfig()
  return (config.apiBase as string) || config.public.apiBase
}
