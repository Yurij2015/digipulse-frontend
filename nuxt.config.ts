export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  future: {
    compatibilityVersion: 4,
  },
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@nuxtjs/color-mode", "@nuxtjs/i18n"],
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
    lazy: true,
  },
  colorMode: {
    preference: "dark",
    fallback: "dark",
    classSuffix: "",
  },
  css: ["~/assets/css/main.css"],
});