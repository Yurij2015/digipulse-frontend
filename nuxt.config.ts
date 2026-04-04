export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  future: {
    compatibilityVersion: 4,
  },
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@nuxtjs/color-mode"],
  colorMode: {
    preference: "dark",
    fallback: "dark",
    classSuffix: "",
  },
  css: ["~/assets/css/main.css"],
});
