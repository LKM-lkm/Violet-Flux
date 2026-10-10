# Violet Flux

一个基于 Nuxt 4 的现代静态博客系统，支持 Markdown、数学公式、代码高亮、液态玻璃折射效果和响应式设计。

## 特性

- 📝 **Markdown 支持** - 基于文件的内容管理，支持 MDC 扩展语法
- 🔢 **数学公式** - MathJax v4 渲染，支持标准 LaTeX 语法
- 🔮 **液态玻璃折射** - Apple 风格 SVG 位移滤镜折射效果，边缘色差棱镜
- 🎨 **优雅设计** - 紫色梦幻配色，毛玻璃效果，朦胧神秘风格
- 🌓 **主题切换** - 亮色/暗色模式自动切换
- 💻 **代码高亮** - Shiki 语法高亮，支持多种语言
- 📱 **响应式** - 移动端优化，触摸友好
- 🔍 **全文搜索** - 搜索文章标题和内容
- 💬 **评论系统** - 集成 CWD Comments
- 🤖 **AI 摘要** - 可选的 AI 内容摘要

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:3000

### 构建生产版本

```bash
npm run build
```

### 生成静态站点

```bash
npm run generate
```

## 项目结构

```
Violet Flux/
├── app/                # Nuxt 应用代码
│   ├── assets/        # 全局样式
│   ├── components/    # Vue 组件
│   ├── composables/   # 组合式函数
│   └── pages/         # 页面路由
├── content/           # Markdown 内容
│   └── blog/         # 博客文章
├── public/           # 静态资源
├── scripts/          # 构建脚本
├── server/           # 服务端代码
└── nuxt.config.ts    # Nuxt 配置
```

## 编写内容

### 创建文章

在 `content/blog/` 目录下创建 `.md` 文件：

```markdown
---
title: 文章标题
description: 文章描述
tags: [标签1, 标签2]
---

# 文章标题

文章内容...
```

### 数学公式

使用标准 LaTeX 语法，无需转义花括号：

```markdown
行内公式：\(E = mc^2\)

块级公式：
\[
x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
\]
```

### Alert 提示框

```markdown
[!TIP]
这是一个提示

[!WARNING]
这是一个警告
```

### 代码块

````markdown
```javascript
console.log('Hello, World!')
```
````

## 设计系统

- **主色调**: 紫色梦幻 (#b497d7, #9163c0, #7a4ba3)
- **液态玻璃**: SVG feDisplacementMap 折射 + RGB 色差棱镜边缘
- **毛玻璃效果**: backdrop-filter blur + saturate
- **响应式断点**: 移动端、平板、桌面
- **CSS 变量**: 统一的颜色和间距系统

详见 `app/assets/design-system.css` 和 `LIQUID_GLASS_SETUP.md`

## 技术栈

- **框架**: Nuxt 4 + Vue 3
- **内容**: @nuxt/content
- **样式**: Tailwind CSS + 自定义 CSS
- **数学**: MathJax 4
- **视觉**: liquid-glass（SVG 折射滤镜）
- **代码高亮**: Shiki
- **图标**: @nuxt/icon
- **动画**: GSAP

## 文档

项目文档统一放在 [`content/blog/docs/`](./content/blog/docs/)，合并为 5 篇：

- [文档索引](./content/blog/docs/index.md) - 导航
- [项目指南](./content/blog/docs/project-guide.md) - 目录结构、设计系统、开发命令、部署
- [内容写作](./content/blog/docs/content-authoring.md) - frontmatter、路径规则、代码块、图片
- [MathJax 数学公式](./content/blog/docs/mathjax.md) - 公式渲染配置与排错
- [提示框 Callout](./content/blog/docs/callout.md) - 提示框用法与速查
- [液态玻璃 Liquid Glass](./content/blog/docs/liquid-glass.md) - 折射效果原理、用法与限制

部署与 AI 摘要相关的说明也在文档站内可查；AI 摘要后端见 `content/blog/笔记/Mine/☁CloudFlare/`。

## 🚀 部署

支持多种部署方式：

- **Vercel** - 推荐，零配置
- **Netlify** - 支持
- **Cloudflare Pages** - 需要配置
- **静态托管** - 使用 `npm run generate`

## 致谢

- [Nuxt](https://nuxt.com)
- [Nuxt Content](https://content.nuxt.com)
- [MathJax](https://www.mathjax.org)
- [Tailwind CSS](https://tailwindcss.com)
- [liquid-glass](https://github.com/deepika-builds/liquid-glass) - Apple 风格液态玻璃折射

## 许可证

MIT License

---

**Designed by Likem · Made with ❤️ using Nuxt 4**
