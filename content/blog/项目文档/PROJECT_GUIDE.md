# Violet Flux 项目指南

## 📁 项目结构

```
Violet Flux/
├── app/                    # Nuxt 应用代码
│   ├── assets/            # 全局样式（design-system.css）
│   ├── components/        # Vue 组件
│   ├── composables/       # 组合式函数（useTheme.ts）
│   └── pages/             # 页面路由
├── content/               # Markdown 内容
│   └── blog/             # 博客文章
├── public/               # 静态资源
├── scripts/              # 构建脚本
│   ├── copy-blog-assets.mjs          # 复制博客资源
│   └── convert-to-standard-latex.mjs # LaTeX 语法转换
├── server/               # 服务端代码
│   └── routes/          # API 路由
└── nuxt.config.ts       # Nuxt 配置

```

## 🎨 设计系统

### 配色方案

项目使用 Wine/Plum 色调，配置在 `app/assets/design-system.css`：

- **主色调**: `#701a45` (Wine) / `#9d174d` (Plum)
- **强调色**: `#c2185b` (Rose)
- **支持亮色和暗色模式**

### 视觉效果

- **毛玻璃效果**: `backdrop-filter: blur(20px) saturate(180%)`
- **朦胧梦幻**: 渐变背景 + 噪点纹理
- **流畅动画**: 使用 CSS transitions 和 GSAP

## 📝 内容编写

### Markdown 语法

支持标准 Markdown + MDC (MarkDown Components) 扩展：

- **代码高亮**: 使用 Shiki，支持亮色/暗色主题
- **数学公式**: MathJax v4，使用 `\(...\)` 和 `\[...\]`
- **Alert 提示**: GitHub 风格的 `[!TIP]`, `[!WARNING]` 等
- **Wiki 链接**: `[[文章标题]]` 自动链接

### 数学公式

使用标准 LaTeX 语法，无需转义花括号：

```markdown
行内公式：\(E = mc^2\)

块级公式：
\[
x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
\]
```

详见：[MATHJAX_CONFIG.md](./MATHJAX_CONFIG.md) - 官方推荐配置

### Alert 提示框

使用 Nuxt UI Callout 组件：

```markdown
::callout{icon="i-lucide-lightbulb" color="success"}
💡 这是一个提示
::

::callout{icon="i-lucide-alert-triangle" color="warning"}
⚠️ 这是一个警告
::

::callout{icon="i-lucide-info" color="info"}
📘 这是一个注释
::
```

可用颜色：`info`, `success`, `warning`, `error`, `primary`, `neutral`

详见：[NUXT_UI_CALLOUT_GUIDE.md](./NUXT_UI_CALLOUT_GUIDE.md)

## 🛠️ 开发命令

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview

# 生成静态站点
npm run generate

# 转换 LaTeX 语法（如果需要）
npm run convert-latex
```

## 🔧 配置文件

### nuxt.config.ts

主要配置：

- **MathJax**: 数学公式渲染
- **Nuxt Content**: Markdown 解析和渲染
- **代码高亮**: Shiki 主题配置
- **Remark 插件**: GFM, Alerts, Wiki Links

### tailwind.config.ts

Tailwind CSS 配置，扩展了设计系统的颜色和动画。

### content.config.ts

Nuxt Content 的额外配置（如果需要）。

## 📦 关键依赖

- **Nuxt 4**: Vue 3 框架
- **@nuxt/content**: Markdown CMS
- **@nuxt/icon**: 图标系统
- **MathJax 4**: 数学公式渲染
- **Shiki**: 代码语法高亮
- **remark-github-blockquote-alert**: Alert 提示框
- **remark-wiki-link**: Wiki 风格链接

## 🎯 核心功能

### 1. 博客系统

- 基于文件的内容管理
- 自动生成目录（TOC）
- 标签系统
- AI 摘要（可选）
- 评论系统（CWD Comments）

### 2. 主题切换

使用 `useTheme` composable：

```typescript
import { isDark, toggleDark } from '~/composables/useTheme'
```

### 3. 图片处理

- 自定义 `ProseImg` 组件
- 支持 Obsidian 风格的图片路径
- 自动处理中文路径
- 懒加载优化

### 4. 响应式设计

- 移动端优化
- 汉堡菜单
- 自适应布局
- 触摸友好

## 📚 文档

- **MATHJAX_SOLUTION.md** - MathJax 配置和最佳实践
- **LATEX_MIGRATION_GUIDE.md** - LaTeX 语法迁移指南
- **README.md** - 项目介绍

## 🚀 部署

项目支持多种部署方式：

- **Vercel**: 推荐，零配置
- **Netlify**: 支持
- **Cloudflare Pages**: 需要配置 D1 数据库
- **静态托管**: 使用 `npm run generate`

## 💡 最佳实践

### 编写文章

1. 在 `content/blog/` 下创建 `.md` 文件
2. 添加 frontmatter（title, description, tags）
3. 使用标准 Markdown 语法
4. 数学公式使用 `\(...\)` 和 `\[...\]`
5. 图片放在同目录的 `assets/` 文件夹

### 样式定制

1. 全局样式在 `app/assets/design-system.css`
2. 组件样式使用 scoped CSS
3. 使用 CSS 变量保持一致性
4. 遵循现有的命名规范

### 性能优化

1. 图片使用懒加载
2. 代码分割（自动）
3. 预渲染静态页面
4. 使用 CDN 加载外部资源

## 🐛 常见问题

### MathJax 公式不显示

检查：
1. 是否使用了正确的定界符 `\(...\)` 或 `\[...\]`
2. 花括号是否需要转义（新方案不需要）
3. 浏览器控制台是否有错误

### 图片 404

检查：
1. 图片路径是否正确
2. 是否在 `assets/` 文件夹中
3. 文件名是否包含特殊字符

### 代码高亮不工作

检查：
1. 语言是否在 `nuxt.config.ts` 的 `langs` 列表中
2. 代码块是否使用了正确的语法标记

## 🔗 相关链接

- [Nuxt 文档](https://nuxt.com)
- [Nuxt Content 文档](https://content.nuxt.com)
- [MathJax 文档](https://docs.mathjax.org)
- [Tailwind CSS 文档](https://tailwindcss.com)

---

**最后更新**: 2026-02-24
