---
title: 提示框 Callout
description: Violet Flux 支持的两种提示框写法（::callout MDC 语法与 GitHub Alert 引用块）的语法、颜色图标速查与注意事项
tags: [文档, 组件]
---

本项目的提示框有两条路：**推荐**用 Nuxt UI 的 MDC 语法 `::callout{...}`，服务端直接渲染成 `ProseCallout`，颜色和图标都能自由指定；另一种是 GitHub 风格的 `> [!NOTE]` 引用块，它**没有**对应的 remark 插件，只是靠博客文章页里的一段客户端 JavaScript 在浏览器中转换成提示框，颜色、标题都是写死的。

## 两种写法对比

| | `::callout{...}` | `> [!NOTE]` 引用块 |
| --- | --- | --- |
| 语法 | MDC 块级组件 | Markdown 引用块 + 行首标记 |
| 渲染时机 | 服务端 / 构建期直接渲染 | 浏览器端 JS 转换（水合后） |
| 颜色 | 7 种任选 | 固定，每种标记一个色 |
| 图标 | 任意 Lucide 图标 | 固定 emoji |
| 标题 | 无固定标题，内容自由 | 固定英文标题（Note / Tip / …） |
| 内容 | 完整 Markdown（标题、列表、代码块、表格） | 普通引用块内容 |
| 本项目现状 | 正在使用（文档、笔记） | 代码支持，但没有文章实际使用 |

## 推荐写法：`::callout`

### 基本语法

```markdown
::callout{icon="i-lucide-lightbulb" color="success"}
提示内容
::
```

`icon` 与 `color` 都是可选的：不写 `color` 时默认 `neutral`，不写 `icon` 时不显示图标。

### 常用组合（全部来自本项目的实际用法）

```markdown
::callout{icon="i-lucide-info" color="info"}
📘 一般性说明
::

::callout{icon="i-lucide-lightbulb" color="success"}
💡 技巧或建议
::

::callout{icon="i-lucide-alert-triangle" color="warning"}
⚠️ 需要留意的注意事项
::

::callout{icon="i-lucide-alert-circle" color="error"}
🚨 危险操作或严重错误
::
```

### 内容里的 Markdown

`ProseCallout` 用 `<slot mdc-unwrap="p" />` 渲染内容，所以嵌套标题、列表、代码块都可以：

````markdown
::callout{icon="i-lucide-book-open" color="info"}
## Callout 内的标题

- **粗体**、*斜体*、`行内代码`
- [链接](https://nuxt.com)

```bash
npm install @nuxt/ui @nuxt/content
```
::
````

### 整块可点击（`to`）

```markdown
::callout{icon="i-lucide-external-link" color="primary" to="https://ui.nuxt.com"}
点击这个提示框跳转到 Nuxt UI 官网
::
```

`to` 以 `http` 开头时会自动加上 `target="_blank"`（在 `Callout.vue` 里计算），站内路径则走 `ULink` 路由跳转。也可以用 `target` 属性显式覆盖。

### 组件 props 一览

来自 `node_modules/@nuxt/ui/dist/runtime/components/prose/Callout.vue`：

| Prop | 类型 | 说明 |
| --- | --- | --- |
| `icon` | `string` | 图标名，如 `i-lucide-info` |
| `color` | `string` | 颜色，默认 `neutral` |
| `to` | `string \| object` | 传入后整块变成链接 |
| `target` | `string \| object \| null` | 链接打开方式，不写时按 `to` 是否外链决定 |
| `class` | `string` | 附加自定义类 |
| `ui` | `object` | 覆盖插槽样式 |

### 可用颜色

`color` 只有 7 个键（定义在 `.nuxt/ui/prose/callout.ts`）：`primary`（主题主色，本项目为紫色 `#b497d7`）、`secondary`、`success`、`info`、`warning`、`error`、`neutral`（默认值）。

### 常用图标

图标走 `@nuxt/icon`，写 Lucide 名称。下面这些都在本项目内容里出现过：

| 图标 | 图标 | 图标 |
| --- | --- | --- |
| `i-lucide-info` | `i-lucide-lightbulb` | `i-lucide-alert-triangle` |
| `i-lucide-alert-circle` | `i-lucide-star` | `i-lucide-book-open` |
| `i-lucide-terminal` | `i-lucide-settings` | `i-lucide-check-circle` |
| `i-lucide-rocket` | `i-lucide-zap` | `i-lucide-external-link` |

完整图标库见 [lucide.dev/icons](https://lucide.dev/icons/)。

### 简写形式

MDC 映射里还注册了 4 个固定配色的简写（`.nuxt/dev/index.mjs` 的 `public.mdc.components.map`），项目里也有实际使用：

| 简写 | 等价 color | 固定图标 |
| --- | --- | --- |
| `::note` | `info` | `i-lucide-info` |
| `::tip` | `success` | `i-lucide-lightbulb` |
| `::warning` | `warning` | `i-lucide-triangle-alert` |
| `::caution` | `error` | `i-lucide-circle-alert` |

注意：这 4 个简写组件内部把颜色和图标写死了，**不接受** `color` / `icon` / `to` 参数，也没有 `::important` 简写。需要自定义时请用完整的 `::callout{...}`。

## 另一种写法：GitHub Alert 引用块

### 语法

```markdown
> [!WARNING]
> 这是警告内容
```

`nuxt.config.ts` 的 `remarkPlugins` 里只有 `remark-gfm`、`remark-mdc`、`remark-wiki-link`，**没有** GitHub Alert 相关的 remark 插件，所以 Markdown 渲染出来的只是一个普通引用块，`[!NOTE]` 是字面文本；真正的转换发生在浏览器里。

### 五种标记

转换逻辑在 `app/pages/blog/[...slug].vue` 的 `onMounted` 中（`alertMap`）：

| 标记 | 转换后的类名 | 标题文本 | 亮色 / 暗色 |
| --- | --- | --- | --- |
| `[!NOTE]` | `.markdown-alert-note` | ℹ️ Note | `#0969da` / `#539bf5` |
| `[!TIP]` | `.markdown-alert-tip` | 💡 Tip | `#1a7f37` / `#3fb950` |
| `[!IMPORTANT]` | `.markdown-alert-important` | ❗ Important | `#8250df` / `#a371f7` |
| `[!WARNING]` | `.markdown-alert-warning` | ⚠️ Warning | `#d97706` / `#f59e0b` |
| `[!CAUTION]` | `.markdown-alert-caution` | 🚨 Caution | `#cf222e` / `#f85149` |

对应的 `:deep(.markdown-alert-*)` 样式就近写在同一个文件里（约 920–1026 行）。

### 注意事项

- **纯客户端转换**：脚本在 `onMounted` 里跑，只作用于 `app/pages/blog/[...slug].vue` 这一个页面。预渲染出的 HTML 里最初仍是普通引用块，水合之后才会变成提示框。
- **标记必须在第一段开头**：脚本取引用块第一个 `<p>` 的 `textContent`，用 `startsWith('[!NOTE]')` 判断。标记前有任何文字都不会被转换。
- **标题不可改**：标题是脚本里硬编码的英文 Note / Tip / Important / Warning / Caution。
- **会保留引用块的部分样式**：转换只做「加类名 + 插入标题」，`.article-body blockquote` 上的斜体和大引号装饰（`font-style: italic`、`::before` 的 `"`）不会被清除。
- 转换靠 `MutationObserver` 兜底，重复处理用 `markdown-alert` 类名做幂等保护。新内容不建议再用这种写法。

## 速查表

| 场景 | 写法 | color | icon |
| --- | --- | --- | --- |
| 一般说明、背景知识 | `::callout` | `info` | `i-lucide-info` 或 `i-lucide-book-open` |
| 技巧、建议、推荐做法 | `::callout` | `success` | `i-lucide-lightbulb` |
| 注意事项、易踩的坑 | `::callout` | `warning` | `i-lucide-alert-triangle` |
| 危险操作、严重错误 | `::callout` | `error` | `i-lucide-alert-circle` |
| 重点结论、关键信息 | `::callout` | `primary` | `i-lucide-star` |
| 命令、安装步骤 | `::callout` | `neutral` | `i-lucide-terminal` |
| 快速插入标准提示 | `::tip` / `::note` / `::warning` / `::caution` | 固定 | 固定 |
| 兼容旧文章的 GitHub Alert | `> [!NOTE]` 等 | 固定 | 固定 emoji |

## 常见问题

**`::callout` 没渲染成提示框？**
先确认 `nuxt.config.ts` 的 `modules` 里有 `@nuxt/ui`，且构建产物里 MDC 映射包含 `"callout": "ProseCallout"`（见 `.nuxt/dev/index.mjs` 或 `.nuxt/components.d.ts` 中的 `ProseCallout`）。本项目没有覆盖 `ProseCallout`，用的是 Nuxt UI 默认实现。

**能改 Callout 的默认样式吗？**
可以，但本项目目前**没有**做任何自定义：`app.config.ts` 是空的，`Callout.vue` 读的是 `appConfig.ui?.prose?.callout`，留空即使用 Nuxt UI 默认主题。

**两种写法能混用吗？**
语法上不冲突，但外观和标题风格不一致，同一篇文章里建议只用一种。
