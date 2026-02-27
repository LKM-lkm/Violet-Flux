# 项目审计报告

根据 Nuxt UI Docs Template 官方文档检查项目配置。

## ✅ 已安装的依赖

### 核心模块
- ✅ `@nuxt/content` (v3.11.0)
- ✅ `@nuxt/ui` (v4.4.0)
- ✅ `@nuxt/icon` (v2.2.1)
- ✅ `nuxt` (v4.3.1)

### 其他依赖
- ✅ `@vueuse/core`
- ✅ `gsap`
- ✅ `markdown-it`
- ✅ `remark-math`
- ✅ `remark-wiki-link`

## ❌ 缺失的推荐模块

根据官方模板，以下模块是推荐的但未安装：

### 1. `nuxt-og-image` (可选)
**用途**: 自动生成社交媒体预览图

**安装**:
```bash
npm install nuxt-og-image
```

**配置**:
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxt/ui',
    '@nuxt/icon',
    'nuxt-og-image'  // 添加这个
  ]
})
```

### 2. `@nuxt/image` (推荐)
**用途**: 图片优化和懒加载

**安装**:
```bash
npm install @nuxt/image
```

**配置**:
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxt/ui',
    '@nuxt/icon',
    '@nuxt/image'  // 添加这个
  ]
})
```

## ⚠️ 配置问题

### 1. `nuxt.config.ts` 配置不完整

**当前配置**:
```typescript
ui: {
  prose: true
}
```

**问题**: 配置过于简单，缺少必要的选项

**建议配置**:
```typescript
export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxt/ui',
    '@nuxt/icon',
  ],
  
  // Nuxt UI 配置
  ui: {
    // 不需要 prose: true，Nuxt UI 会自动启用
  },
  
  // Content 配置
  content: {
    build: {
      markdown: {
        remarkPlugins: {
          'remark-gfm': {},
          'remark-mdc': {},
          'remark-wiki-link': {
            hrefTemplate: (permalink: string) => `/blog/${permalink}`,
            aliasDivider: '|'
          }
        },
        highlight: {
          theme: {
            default: 'github-light',
            dark: 'github-dark'
          }
        }
      }
    }
  },
  
  // CSS 配置
  css: ['~/assets/css/main.css']
})
```

### 2. 缺少 `main.css`

**问题**: 官方模板需要在 CSS 中导入 Nuxt UI

**创建文件**: `app/assets/css/main.css`

```css
@import "tailwindcss";
@import "@nuxt/ui";
```

### 3. `app.config.ts` 配置过于复杂

**问题**: 你的配置覆盖了太多默认样式，可能导致 Prose 组件不正常工作

**建议**: 简化配置，只自定义必要的部分

```typescript
export default defineAppConfig({
  // Header 配置
  header: {
    title: 'Violet Flux',
    to: '/',
    search: true,
    colorMode: true,
    links: [
      {
        icon: 'i-simple-icons-github',
        to: 'https://github.com/your-repo',
        target: '_blank',
        'aria-label': 'GitHub'
      }
    ]
  },
  
  // Footer 配置
  footer: {
    credits: `Built with Nuxt UI • © ${new Date().getFullYear()}`,
    colorMode: false,
    links: []
  },
  
  // TOC 配置
  toc: {
    title: 'Table of Contents',
    bottom: {
      title: 'Community',
      edit: 'https://github.com/your-repo/edit/main/content',
      links: []
    }
  },
  
  // UI 配置 - 只自定义必要的部分
  ui: {
    // 让 Nuxt UI 使用默认的 Prose 样式
    // 不要覆盖太多
  }
})
```

## 🔧 需要修复的问题

### 1. Prose 组件不渲染

**原因**: 
- `app.config.ts` 中的自定义配置可能覆盖了默认行为
- 缺少正确的 CSS 导入

**解决方案**:
1. 简化 `app.config.ts`
2. 创建 `app/assets/css/main.css` 并导入 Nuxt UI
3. 在 `nuxt.config.ts` 中添加 CSS 配置

### 2. 标签布局问题

**原因**: 可能是 Tailwind CSS 配置冲突

**解决方案**: 确保使用 Nuxt UI 的 Tailwind 配置

### 3. MathJax 渲染问题

**原因**: MathJax 配置可能与 MDC 冲突

**解决方案**: 使用客户端插件延迟渲染

## 📋 推荐的项目结构

```
Violet Flux/
├── app/
│   ├── assets/
│   │   └── css/
│   │       └── main.css          # 导入 Tailwind 和 Nuxt UI
│   ├── components/
│   │   └── content/              # 自定义 Prose 组件（可选）
│   ├── pages/
│   └── plugins/
│       └── mathjax.client.ts     # MathJax 插件
├── content/                       # Markdown 内容
├── public/                        # 静态资源
├── app.config.ts                  # App 配置
├── nuxt.config.ts                 # Nuxt 配置
└── package.json
```

## 🚀 修复步骤

### 步骤 1: 创建 main.css

```bash
mkdir -p app/assets/css
```

创建 `app/assets/css/main.css`:
```css
@import "tailwindcss";
@import "@nuxt/ui";
```

### 步骤 2: 更新 nuxt.config.ts

```typescript
export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxt/ui',
    '@nuxt/icon',
  ],
  
  css: ['~/assets/css/main.css'],  // 添加这行
  
  content: {
    build: {
      markdown: {
        remarkPlugins: {
          'remark-gfm': {},
          'remark-wiki-link': {
            hrefTemplate: (permalink: string) => `/blog/${permalink}`,
            aliasDivider: '|'
          }
        },
        highlight: {
          theme: {
            default: 'github-light',
            dark: 'github-dark'
          }
        }
      }
    }
  }
})
```

### 步骤 3: 简化 app.config.ts

备份当前配置，然后简化为：

```typescript
export default defineAppConfig({
  // 只保留必要的配置
  // 让 Nuxt UI 使用默认的 Prose 样式
})
```

### 步骤 4: 重启开发服务器

```bash
rm -rf .nuxt
npm run dev
```

## 📊 组件使用对照表

| 官方语法 | 你的项目 | 状态 |
|---------|---------|------|
| `::note` | ✅ 支持 | 需要修复配置 |
| `::tip` | ✅ 支持 | 需要修复配置 |
| `::warning` | ✅ 支持 | 需要修复配置 |
| `::caution` | ✅ 支持 | 需要修复配置 |
| `::callout` | ✅ 支持 | 需要修复配置 |
| `::card` | ✅ 支持 | 需要修复配置 |
| `::tabs` | ✅ 支持 | 需要修复配置 |
| `::accordion` | ✅ 支持 | 需要修复配置 |
| `::code-group` | ✅ 支持 | 需要修复配置 |
| `::code-tree` | ✅ 支持 | 需要修复配置 |
| `::code-preview` | ✅ 支持 | 需要修复配置 |
| `::code-collapse` | ✅ 支持 | 需要修复配置 |

## ⚠️ 不需要的依赖

以下依赖可能不需要或有冲突：

### 1. `@nuxtjs/tailwindcss`
**问题**: Nuxt UI 已经包含了 Tailwind CSS，不需要单独安装

**建议**: 可以移除
```bash
npm uninstall @nuxtjs/tailwindcss
```

### 2. `markdown-it-github-alerts`
**问题**: Nuxt UI 已经提供了 Callout 组件，不需要这个插件

**建议**: 可以移除
```bash
npm uninstall markdown-it-github-alerts
```

## 📝 总结

### 必须修复
1. ✅ 创建 `app/assets/css/main.css`
2. ✅ 在 `nuxt.config.ts` 中添加 `css: ['~/assets/css/main.css']`
3. ✅ 简化 `app.config.ts`

### 推荐安装
1. `@nuxt/image` - 图片优化
2. `nuxt-og-image` - 社交媒体预览图

### 可选移除
1. `@nuxtjs/tailwindcss` - 与 Nuxt UI 冲突
2. `markdown-it-github-alerts` - 不需要

---

**审计日期**: 2026-02-24  
**审计人员**: Kiro AI Assistant
