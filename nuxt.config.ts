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
      ],
      link: [
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
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
  turnstile: {
    siteKey: "",
  },
  runtimeConfig: {
    public: {
      apiBase: "http://localhost",
      frontendKey: "",
      turnstile: {
        siteKey: "",
      },
    },
    turnstile: {
      secretKey: "",
    },
  },
});
