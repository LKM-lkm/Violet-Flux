---
title: 项目指南
description: Violet Flux 的目录结构、设计系统、开发命令与部署方式
tags: [文档, 指南]
---

# 项目指南

## 技术栈

| 层 | 选型 |
| --- | --- |
| 框架 | Nuxt 4 + Vue 3 |
| 内容 | `@nuxt/content` v3（SQLite 集合，`content.config.ts` 定义） |
| UI | `@nuxt/ui` + 自定义 CSS 变量 |
| 样式 | Tailwind CSS 4 + `app/assets/design-system.css` |
| 代码高亮 | Shiki（`vitesse-light` / `vitesse-dark`） |
| 数学公式 | MathJax 4（CDN 引入，见 [MathJax](/blog/docs/mathjax)） |
| 图标 | `@nuxt/icon`（Lucide） |
| 评论 | `cwd-widget` |
| 视觉 | [liquid-glass](/blog/docs/liquid-glass)（SVG 折射滤镜） |

## 目录结构

```
Violet Flux/
├── app/
│   ├── assets/design-system.css   # 设计变量（颜色/圆角/间距/阴影）与全局样式
│   ├── components/                # 通用组件
│   │   └── content/               # Nuxt Content 的 Prose 覆盖组件
│   │       ├── ProsePre.vue       # 代码块（头部/复制/行号/行高亮）
│   │       └── ProseImg.vue       # 图片（Obsidian 风格路径）
│   ├── composables/useTheme.ts    # 亮色/暗色切换
│   ├── layouts/default.vue
│   ├── pages/                     # 路由页面
│   ├── plugins/                   # mathjax.client.ts、spotlight.ts
│   └── utils/                     # 纯函数（minimark-text.js 等）
├── content/
│   ├── blog/                      # 博客文章（唯一的 content 集合来源）
│   └── index.md / about.md        # 首页与关于页（不在 content 集合内）
├── public/                        # 静态资源（字体、liquid-glass.js）
├── scripts/
│   ├── copy-blog-assets.mjs       # 构建前同步笔记资源
│   ├── convert-to-standard-latex.mjs
│   └── worker-code.js             # Cloudflare Worker 源码副本
├── server/
│   ├── api/                       # Nitro 接口（ai-summary 代理等）
│   └── routes/_blog_assets/       # 笔记图片等资源路由
├── content.config.ts              # content 集合定义
└── nuxt.config.ts
```

## 设计系统

所有颜色、圆角、间距、阴影都定义在 `app/assets/design-system.css` 的 `:root` 与 `:root.dark` 里，组件一律引用变量，不要写死色值。

**主色（紫）**

| 变量 | 亮色 | 说明 |
| --- | --- | --- |
| `--primary` | `#b497d7` | 主色，链接、强调、图标 |
| `--primary-hover` | `#c2a9e4` | 悬停态 |
| `--primary-glow` | `rgba(180,151,215,.3)` | 发光阴影 |
| `--bg-primary` | `#faf8fc` | 页面底色 |
| `--bg-secondary` | `#f3eef8` | 次级底色 |
| `--text-primary` | `#2d1b3d` | 正文 |

**其他约定**

- 圆角用 `--radius-sm/md/lg/xl/2xl`，间距用 `--space-xs…3xl`
- 过渡时长用 `--duration-fast/normal/slow`，缓动用 `--ease-out` 等
- 暗色模式统一由 `:root.dark` 覆盖变量，组件里不要写 `@media (prefers-color-scheme)`
- 字号用 `--text-xs…6xl`

## 开发命令

```bash
npm run dev        # 开发（会先跑 copy-blog-assets 同步笔记资源）
npm run build      # 生产构建
npm run generate   # 生成静态站点
npm run preview    # 预览构建产物
npm run convert-latex   # 批量把旧 LaTeX 语法转成标准语法
```

::callout{icon="i-lucide-info" color="info"}
改过 `nuxt.config.ts` 里的 `content.build` 配置后，如果发现内容没按预期重新解析，删掉 `.data/content/` 再构建——Nuxt Content 会缓存解析结果。
::

## 配置要点（nuxt.config.ts）

| 配置 | 作用 |
| --- | --- |
| `router.trailingSlash: false` | 不生成尾部斜杠 |
| `content.build.pathMeta.slugifyOptions` | 控制文章 URL 生成，**不要删**，见[内容写作](/blog/docs/content-authoring) |
| `content.build.markdown.highlight` | Shiki 主题与语言白名单 |
| `app.head.script` | MathJax 配置与 CDN 加载 |
| `nitro.prerender` | 预渲染 `/`、`/blog` 并爬取链接 |
| `nitro.cloudflare.pages.routes.exclude` | 排除 `/_blog_assets/*` 等不走 Functions 的路径 |
| `routeRules['/blog/**']` | 博客页预渲染 |

## content 集合

`content.config.ts` 只收录 `blog/**/*.md`：

- `include: 'blog/**/*.md'`
- `exclude: ['**/.*/**', '**/node_modules/**', '**/assets/**', '**/.obsidian/**']`
- schema 额外定义 `tags`（字符串数组，默认空）、`date`、`image`

所以 `content/index.md`、`content/about.md` 不是集合成员，它们由各自的页面直接读取。

## 部署

生产环境跑在 **Cloudflare Pages**：

```bash
npm run build          # 产出 .output/
```

`nitro.cloudflare.pages.routes.exclude` 会把 `/blog/*`、`/_blog_assets/*` 交给静态资源，其余（含 `/api/ai-summary`）走 Pages Functions。

::callout{icon="i-lucide-triangle-alert" color="warning"}
Windows 上构建时注意：**含中文或 emoji 的目录名会导致预渲染 HTML 读写路径编码不一致**（`项目文档` 会变成 `椤圭洰鏂囨。`），预渲染页面会 500。所以项目文档放在 ASCII 的 `content/blog/docs/` 下。发文章时也尽量用 ASCII 目录名。
::

## 文章页组件

`app/pages/blog/[...slug].vue` 自上而下渲染这几个组件：

| 组件 | 位置 | 用法与说明 |
| --- | --- | --- |
| `ReadingProgress` | 顶部固定 | 3px 渐变进度条，包在 `<ClientOnly>` 里，无需配置 |
| `AiSummary` | 标题下方 | AI 摘要卡片，传 `:content="article.body"` 与 `:article-id` |
| `ArticleNavigation` | 正文下方 | 上一篇 / 下一篇卡片，传 `:current-path="article.path"`，内部用 `queryCollectionItemSurroundings` |
| `RelatedArticles` | 导航下方 | 按标签重叠度推荐，传 `:article` 与 `:max-items`（默认 3） |
| `CwdComments` | 页面底部 | CWD 评论，用 `article.path` 作为 slug |
| `ProsePre` / `ProseImg` | 内容渲染时 | Nuxt Content 的 Prose 覆盖组件，写法见[内容写作](/blog/docs/content-authoring) |

常见现象：

| 现象 | 原因 |
| --- | --- |
| 相关文章不显示 | 文章没有 `tags`，或与其它文章没有共同标签 |
| 上一篇 / 下一篇不显示 | 该文章不在 `content` 集合里（集合只收录 `blog/**`），或确实是首/末篇 |
| 阅读进度条不显示 | 文章太短，页面没有可滚动高度 |
| 代码复制无效 | 见[内容写作](/blog/docs/content-authoring)的代码块一节 |

## 约定

1. 组件样式一律 scoped，需要影响内容渲染时用 `:deep()`
2. 不重复定义样式：代码块样式只在 `ProsePre.vue` 里，`[...slug].vue` 只保留原生 `<pre>` 兜底
3. 新增可复用纯函数放 `app/utils/`，组件内不塞长逻辑
4. 动效记得加 `@media (prefers-reduced-motion: reduce)` 兜底
