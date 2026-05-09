import { defineEventHandler, setHeader } from 'h3'

export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  const siteUrl = config.public.siteUrl || 'https://digipulse.app'

  setHeader(event, 'Content-Type', 'text/plain')

  return `User-agent: *
Allow: /
Allow: /docs
Allow: /docs/
Allow: /uk/docs
Allow: /pl/docs

Disallow: /dashboard
Disallow: /sites
Disallow: /settings
Disallow: /support
Disallow: /add-website
Disallow: /auth/
Disallow: /uk/dashboard
Disallow: /uk/sites
Disallow: /uk/settings
Disallow: /uk/support
Disallow: /uk/add-website
Disallow: /uk/auth/
Disallow: /pl/dashboard
Disallow: /pl/sites
Disallow: /pl/settings
Disallow: /pl/support
Disallow: /pl/add-website
Disallow: /pl/auth/

Sitemap: ${siteUrl}/sitemap.xml
`
})
