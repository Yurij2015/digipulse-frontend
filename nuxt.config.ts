export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL,
  },
  future: {
    compatibilityVersion: 4,
  },
  devtools: { enabled: true },
  app: {
    head: {
      htmlAttrs: {
        lang: "en",
      },
      title: "DigiPulse - Premium Monitoring",
      meta: [
        {
          name: "description",
          content: "Modern digital health monitoring with premium aesthetics.",
        },
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: "DigiPulse" },
        { property: "og:image", content: "/og-image-social.png" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: "/og-image-social.png" },
      ],
      link: [
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      ],
    },
  },
  experimental: {
    viewTransition: true,
  },
  modules: [
    "@nuxt/ui",
    "@nuxtjs/color-mode",
    "@nuxtjs/i18n",
    "@pinia/nuxt",
    "@nuxtjs/turnstile",
    "nuxt-gtag",
    "@nuxtjs/sitemap",
  ],
  features: {
    inlineStyles: true,
  },
  i18n: {
    locales: [
      { code: "en", language: "en-US", file: "en.json", name: "English" },
      { code: "uk", language: "uk-UA", file: "uk.json", name: "Українська" },
      { code: "pl", language: "pl-PL", file: "pl.json", name: "Polski" },
    ],
    defaultLocale: "en",
    strategy: "prefix_except_default",
    langDir: "locales",
    restructureDir: "app",
    baseUrl: process.env.NUXT_PUBLIC_SITE_URL || '',
  },
  colorMode: {
    preference: "dark",
    fallback: "dark",
    classSuffix: "",
  },
  css: ["~/assets/css/main.css"],
  nitro: {
    compressPublicAssets: {
      brotli: true,
      gzip: true,
    },
    /**
     * Dev: memory cache driver avoids ENOTDIR when KB index + dynamic child routes share a path prefix
     * (filesystem payload keys). @see https://github.com/nitrojs/nitro/issues/4142
     *
     * No `routeRules.swr` on KB: Nitro SWR stores a cached *rendered response* (HTML). A full page load can
     * hit that cache until revalidation, so the document may not match the latest deploy/client bundle for
     * a while. KB pages are cheap to render; skipping route SWR avoids that mismatch on refresh.
     */
    devStorage: {
      cache: {
        driver: "memory",
      },
    },
  },
  sitemap: {
    sources: ['/api/__sitemap__/urls'],
    exclude: [
      '/dashboard',
      '/dashboard/**',
      '/sites',
      '/sites/**',
      '/settings',
      '/support',
      '/support/**',
      '/add-website',
      '/auth/**',
      '/uk/dashboard',
      '/uk/sites',
      '/uk/sites/**',
      '/uk/settings',
      '/uk/support',
      '/uk/support/**',
      '/uk/add-website',
      '/uk/auth/**',
      '/pl/dashboard',
      '/pl/sites',
      '/pl/sites/**',
      '/pl/settings',
      '/pl/support',
      '/pl/support/**',
      '/pl/add-website',
      '/pl/auth/**',
    ],
  },
  icon: {
    clientBundle: {
      scan: true,
      includeCustomCollections: true,
    },
    serverBundle: {
      collections: ["heroicons"],
    },
  },
  runtimeConfig: {
    // Server-only internal API base (overridden by NUXT_API_BASE env var)
    apiBase: "",
    public: {
      apiBase: "http://localhost",
      frontendKey: "",
      // @ts-ignore
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL,
      turnstile: {
        siteKey: "",
      },
      reverbAppKey: "",
      reverbHost: "",
      reverbPort: "443",
      reverbScheme: "https",
      showBetaBanner: true,
    },
    turnstile: {
      secretKey: "",
    },
  },
  gtag: {
    id: "",
    initCommands: [
      [
        "consent",
        "default",
        {
          ad_user_data: "denied",
          ad_personalization: "denied",
          ad_storage: "denied",
          analytics_storage: "denied",
          wait_for_update: 500,
        },
      ],
      ["set", "url_passthrough", true],
      ["set", "ads_data_redaction", true],
    ],
  },
});
