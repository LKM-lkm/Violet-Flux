// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxtjs/tailwindcss',
    '@nuxt/icon',
  ],
  devtools: { enabled: true },
  compatibilityDate: '2024-04-03',
  content: {
    database: {
      type: 'libsql',
      url: 'file:.data/content/contents.db'
    }
  },
  nitro: {
    publicAssets: [
      {
        baseURL: '/blog',
        dir: 'content/blog',
        maxAge: 60 * 60 * 24 * 365
      }
    ]
  }
})
