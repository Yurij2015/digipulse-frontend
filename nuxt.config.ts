export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  future: {
    compatibilityVersion: 4,
  },
  devtools: { enabled: true },
  app: {
    head: {
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
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
      ],
    },
  },
  modules: [
    "@nuxt/ui",
    "@nuxtjs/color-mode",
    "@nuxtjs/i18n",
    "@pinia/nuxt",
    "@nuxtjs/turnstile",
  ],
  i18n: {
    // @ts-ignore
    baseUrl: process.env.NUXT_PUBLIC_SITE_URL,
    locales: [
      { code: "en", language: "en-US", file: "en.json", name: "English" },
      { code: "uk", language: "uk-UA", file: "uk.json", name: "Українська" },
      { code: "pl", language: "pl-PL", file: "pl.json", name: "Polski" },
    ],
    defaultLocale: "en",
    strategy: "prefix_except_default",
    langDir: "locales",
    restructureDir: "app",
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
    }
  },
  experimental: {
    payloadExtraction: true,
  },
  turnstile: {
    siteKey: "",
  },
  runtimeConfig: {
    public: {
      apiBase: "http://localhost",
      frontendKey: "",
      // @ts-ignore
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL,
      turnstile: {
        siteKey: "",
      },
    },
    turnstile: {
      secretKey: "",
    },
  },
});
