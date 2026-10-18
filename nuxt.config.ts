// https://nuxt.com/docs/api/configuration/nuxt-config
const mathExpressionsByFile = new Map<string, Map<string, string>>()
let nextMathToken = 0

function protectMathExpressions(markdown: string, expressions: Map<string, string>) {
  const protectText = (text: string) => text.replace(
    /(`+)[\s\S]*?\1|\$\$[\s\S]*?\$\$|\\\\\([\s\S]*?\\\\\)|\\\([\s\S]*?\\\)|\\\\\[[\s\S]*?\\\\\]|\\\[[\s\S]*?\\\]/g,
    (match) => {
      if (match.startsWith('`')) return match

      const token = `VioletFluxMathToken${nextMathToken++}End`
      const normalized = match
        .replace(/^\\\\\(/, '\\(')
        .replace(/\\\\\)$/, '\\)')
        .replace(/^\\\\\[/, '\\[')
        .replace(/\\\\\]$/, '\\]')
      expressions.set(token, normalized)
      return token
    }
  )

  let result = ''
  let text = ''
  let fence: { character: string; length: number } | null = null

  for (const line of markdown.split(/(?<=\n)/)) {
    const lineContent = line.replace(/\r?\n$/, '')

    if (fence) {
      result += line
      const closingFence = lineContent.match(/^ {0,3}(`+|~+)[ \t]*$/)
      if (
        closingFence
        && closingFence[1][0] === fence.character
        && closingFence[1].length >= fence.length
      ) {
        fence = null
      }
      continue
    }

    const openingFence = lineContent.match(/^ {0,3}(`{3,}|~{3,})/)
    if (openingFence) {
      result += protectText(text) + line
      text = ''
      fence = {
        character: openingFence[1][0],
        length: openingFence[1].length,
      }
      continue
    }

    text += line
  }

  return result + protectText(text)
}

function restoreMathExpressions(value: unknown, expressions: Map<string, string>): unknown {
  if (typeof value === 'string') {
    let restored = value
    for (const [token, expression] of expressions) {
      restored = restored.replaceAll(token, expression)
    }
    return restored
  }

  if (Array.isArray(value)) {
    return value.map(child => restoreMathExpressions(child, expressions))
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, child]) => [
        key,
        restoreMathExpressions(child, expressions),
      ])
    )
  }

  return value
}

export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxt/ui',
    '@nuxt/icon',
  ],
  
  devtools: { enabled: true },
  compatibilityDate: '2024-04-03',

  hooks: {
    'content:file:beforeParse': ({ file }) => {
      if (file.extension === 'md' || file.extension === '.md') {
        const expressions = new Map<string, string>()
        file.body = protectMathExpressions(file.body, expressions)
        if (expressions.size > 0) mathExpressionsByFile.set(file.id, expressions)
      }
    },
    'content:file:afterParse': ({ content }) => {
      const expressions = mathExpressionsByFile.get(content.id)
      if (!expressions) return

      content.body = restoreMathExpressions(content.body, expressions)
      mathExpressionsByFile.delete(content.id)
    },
  },

  // 禁用尾部斜杠，防止 /blog 被重定向到 /blog/
  router: {
    trailingSlash: false,
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/favicon.ico'
        },
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
            window.MathJax = {
              loader: { 
                load: ['[tex]/ams', '[tex]/newcommand', '[tex]/configmacros'] 
              },
              tex: {
                packages: ['base', 'ams', 'newcommand', 'configmacros'],
                // 使用标准 LaTeX 定界符，避免与 MDC 语法冲突
                inlineMath: [['\\\\(', '\\\\)']],
                // Markdown may reduce a block formula's delimiters to single dollars; only
                // displayMath accepts the single-dollar form to preserve its block layout.
                displayMath: [['$$', '$$'], ['\\\\[', '\\\\]'], ['$', '$']],
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
          defer: true
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
    experimental: {
      sqliteConnector: 'native'
    },
    search: { enabled: false },
    build: {
      // Nuxt Content 默认用 slugify 生成 item.path，而 slugify 会把中文/emoji 段
      // 整段删掉（"笔记" -> ""），于是路径变成 /blog//mine//ipdb 这种残缺值，
      // 中文目录下的文章既拿不到正确 URL，还会互相撞 path。
      // 显式传 remove 后 slugify 只清理标点，中文、日文、emoji 都保留。
      pathMeta: {
        slugifyOptions: {
          remove: /[*+~.()'"!:@/]/g
        }
      },
      markdown: {
        contentHeading: false,
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
            default: 'vitesse-light',
            dark: 'vitesse-dark'
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
