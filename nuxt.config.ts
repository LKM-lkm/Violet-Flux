// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxt/ui',
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
          src: '/liquid-glass.js',
          defer: true,
        },
        {
          innerHTML: `
            // Test SVG filter support before liquid-glass runs
            window.svgFilterTest = () => {
              const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
              svg.setAttribute('width', '0');
              svg.setAttribute('height', '0');
              const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
              const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
              filter.setAttribute('id', 'test-filter');
              const flood = document.createElementNS('http://www.w3.org/2000/svg', 'feFlood');
              flood.setAttribute('flood-color', 'red');
              filter.appendChild(flood);
              defs.appendChild(filter);
              svg.appendChild(defs);
              document.body.appendChild(svg);
              
              const el = document.createElement('div');
              el.style.cssText = 'position:fixed;top:-9999px;width:10px;height:10px;background:blue;backdrop-filter:url(#test-filter);';
              document.body.appendChild(el);
              
              const computed = getComputedStyle(el).backdropFilter;
              const works = computed && computed.indexOf('url(') !== -1;
              
              document.body.removeChild(el);
              document.body.removeChild(svg);
              
              console.log('SVG filter support test:', works ? '✅ SUPPORTED' : '❌ NOT SUPPORTED');
              console.log('Computed backdrop-filter:', computed);
              return works;
            };
          `.trim(),
          type: 'text/javascript'
        },
        {
          innerHTML: `
            window.MathJax = {
              loader: { 
                load: ['[tex]/ams', '[tex]/newcommand', '[tex]/configmacros'] 
              },
              tex: {
                packages: ['base', 'ams', 'newcommand', 'configmacros'],
                // 使用标准 LaTeX 定界符，避免与 MDC 语法冲突
                inlineMath: [['\\\\(', '\\\\)']],
                displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']],
                // 处理选项
                processEscapes: true,       // 使用 \\$ 表示字面量美元符号
                processEnvironments: true,  // 处理 \\begin{xxx}...\\end{xxx}
                processRefs: true,          // 处理 \\ref{...} 引用
                // 标签和编号
                tags: 'none',               // 'none', 'ams', 或 'all'
                tagSide: 'right',           // 标签位置
                tagIndent: '0.8em',         // 标签缩进
                useLabelIds: true,          // 使用标签名而非标签号作为 id
                // 样式
                mathStyle: 'TeX',           // TeX, ISO, French, 或 upright
                // 性能限制
                maxBuffer: 5 * 1024,        // 内部 TeX 字符串最大大小 (5K)
                maxTemplateSubtitutions: 10000,
                // 错误处理
                formatError: (jax, err) => jax.formatError(err)
              },
              output: {
                font: 'mathjax-termes'      // 使用 Termes 字体
              },
              startup: {
                typeset: false              // 不自动排版，由页面控制
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
    prerender: {
      crawlLinks: true,
      routes: ['/', '/blog'],
      failOnError: false
    },
    cloudflare: {
      pages: {
        routes: {
          exclude: ['/blog/*', '/_blog_assets/*']
        }
      }
    }
  },

  content: {
    build: {
      markdown: {
        remarkPlugins: {
          'remark-gfm': {},
          'remark-mdc': {},  // 显式启用 MDC 语法
          'remark-wiki-link': {
            hrefTemplate: (permalink: string) => `/blog/${permalink}`,
            aliasDivider: '|'
          }
        },
        highlight: {
          theme: {
            default: 'github-light',
            dark: 'github-dark'
          },
          langs: [
            'javascript',
            'typescript',
            'python',
            'java',
            'c',
            'cpp',
            'bash',
            'shell',
            'json',
            'yaml',
            'markdown',
            'html',
            'css',
            'vue',
            'jsx',
            'tsx'
          ]
        }
      }
    }
  },
  routeRules: {
    '/blog/**': { prerender: true },
  }
})
