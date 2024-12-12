export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  debug: true,
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxtjs/google-fonts",
    "@primevue/nuxt-module",
    "@pinia/nuxt",
  ],
  css: ["~/assets/css/main.css"],
  googleFonts: {
    families: {
      Poppins: true,
      Inter: [400, 500, 600, 700],
    },
    display: "swap",
  },
  experimental: {
    renderJsonPayloads: true,
  },
  routeRules: {
    "/login": {
      ssr: false,
    },
    "/admin/**": {
      ssr: false,
    },
    "/posts": {
      ssr: false,
    },
    "/posts/**": {
      ssr: true,
    },
    "/createpost": {
      ssr: false,
    },
    "/editpost/**": {
      ssr: false,
    },
  },
  app: {
    layoutTransition: { name: "layout", mode: "out-in" },
    pageTransition: { name: "page", mode: "out-in" },
  },
});
