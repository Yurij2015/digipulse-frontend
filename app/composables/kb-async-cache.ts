import type { NuxtApp } from '#app'

type AsyncDataCause = 'initial' | 'refresh:manual' | 'refresh:hook' | 'watch'

/**
 * Reuse Knowledge Base API payloads when only the i18n prefix in the URL changes.
 * Nuxt 4 default caching after hydration relies on `static.data` unless payload extraction is enabled,
 * so client navigations otherwise refetch the same multilingual JSON.
 */
export function kbGetCachedAsyncData<T = unknown>(
  key: string,
  nuxtApp: NuxtApp,
  ctx?: { cause: AsyncDataCause },
): T | undefined {
  if (ctx?.cause === 'refresh:manual' || ctx?.cause === 'watch') {
    return undefined
  }
  const cached = nuxtApp.payload.data[key] ?? nuxtApp.static.data[key]
  return cached as T | undefined
}
