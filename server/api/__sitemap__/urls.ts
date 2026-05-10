import { defineEventHandler } from 'h3'

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  const base = (config.apiBase as string) || config.public.apiBase
  const key = config.public.frontendKey as string
  const headers = { 'X-Frontend-Key': key }

  const urls: { loc: string; lastmod?: string; changefreq?: string; priority?: number }[] = []

  try {
    const categoriesRes = await $fetch<any>(`${base}/api/knowledge-base/categories`, { headers })
    const categories: any[] = Array.isArray(categoriesRes)
      ? categoriesRes
      : (categoriesRes?.data ?? [])

    for (const cat of categories) {
      urls.push({
        loc: `/knowledge-base/${cat.slug}`,
        changefreq: 'weekly',
        priority: 0.7,
      })

      try {
        const catRes = await $fetch<any>(`${base}/api/knowledge-base/categories/${cat.slug}`, { headers })
        const catData = catRes?.data ?? catRes
        const articles: any[] = catData?.articles ?? []

        for (const article of articles) {
          urls.push({
            loc: `/knowledge-base/articles/${article.slug}`,
            lastmod: article.updated_at ?? article.created_at,
            changefreq: 'monthly',
            priority: 0.8,
          })
        }
      } catch {
        // skip this category if it fails
      }
    }
  } catch (e) {
    console.error('[sitemap] failed to fetch knowledge base:', e)
  }

  return urls
})
