export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  debug: true,
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxtjs/google-fonts",
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

  runtimeConfig: {
    public: {
      surrealUrl: process.env.CSR_SURREAL_URL || "http://localhost:7435",
      imageUrl: process.env.IMAGE_API || "http://localhost:3000",
    }
  }
});
