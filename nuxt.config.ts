export default defineNuxtConfig({
  devtools: { enabled: true },

  typescript: {
    strict: true
  },

  css: [
    '@/assets/scss/main.scss'
  ],

  modules: [
    '@pinia/nuxt',
  ],

  runtimeConfig: {
    public: {
      apiBase: 'http://localhost:3001'
    }
  },

  compatibilityDate: '2025-02-27'
})