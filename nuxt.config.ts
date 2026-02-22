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
          src: 'https://cdn.jsdelivr.net/npm/mathjax@4.1.1/tex-mml-chtml.js',
          id: 'MathJax-script',
          async: true
        }
      ]
    }
  },

  nitro: {
    publicAssets: [
      {
        baseURL: '_blog_assets',
        dir: './content/blog',
        maxAge: 60 * 60 * 24 * 7
      }
    ],
    prerender: {
      crawlLinks: true,
      routes: ['/', '/blog'],
      failOnError: false
    },
    cloudflare: {
      pages: {
        routes: {
          // Prevent Cloudflare from failing due to long Chinese paths in _routes.json
          // We use a wildcard to exclude the blog folder from individual path rules
          exclude: ['/blog/*', '/_blog_assets/*']
        }
      }
    }
  },

  content: {
    markdown: {
      remarkPlugins: {
        'remark-wiki-link': {
          hrefTemplate: (permalink) => `/blog/${permalink}`,
          aliasDivider: '|'
        }
      }
    }
  },
  routeRules: {
    '/blog/**': { prerender: true },
  }
})
