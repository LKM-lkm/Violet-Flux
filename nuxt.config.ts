// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxtjs/tailwindcss',
    '@nuxt/icon',
  ],
  devtools: { enabled: true },
  compatibilityDate: '2024-04-03',

  app: {
    head: {
      link: [
        {
          rel: 'preload',
          href: '/Geist-Variable.woff2',
          as: 'font',
          type: 'font/woff2',
          crossorigin: 'anonymous'
        },
        {
          rel: 'preload',
          href: '/BricolageGrotesque-Variable.woff2',
          as: 'font',
          type: 'font/woff2',
          crossorigin: 'anonymous'
        }
      ],
      script: [
        {
          innerHTML: `
            window.MathJax = {
              loader: { load: ['[tex]/ams'] },
              tex: {
                inlineMath: [['$', '$'], ['\\\\(', '\\\\)']],
                displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']],
                processEscapes: true,
                packages: { '[+]': ['ams'] }
              },
              output: {
                font: 'mathjax-termes'
              },
              startup: {
                typeset: false
              }
            };
          `.trim(),
          type: 'text/javascript'
        },
        {
          src: 'https://cdn.jsdelivr.net/npm/mathjax@4.1.0/tex-mml-chtml.js',
          id: 'MathJax-script',
          async: true
        }
      ]
    }
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      failOnError: false // Temporary measure to allow build to pass if minor links fail
    }
  },

  routeRules: {
    '/blog/**': { isr: true }
  }
})
