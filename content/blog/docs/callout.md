---
title: 提示框 Callout
description: Violet Flux 提示框（::callout）的语法、颜色与图标速查
tags: [文档, 组件]
---

提示框统一用 Nuxt UI 的 MDC 语法 `::callout{...}`：服务端直接渲染成 `ProseCallout`，颜色和图标都能自由指定，内容里可以放完整 Markdown（标题、列表、代码块、表格）。

另有 4 个写死配色的简写：`::note`、`::tip`、`::warning`、`::caution`。

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

## GitHub Alert 转换

`> [!NOTE]`、`> [!WARNING]` 等 GitHub Alert 语法不会自动渲染为提示框。需要批量迁移时运行：

```bash
npm run convert-alerts
```

命令会将 Markdown 正文中的 GitHub Alert 转换成对应的 `::callout{...}`，并跳过 frontmatter 和 fenced code block。运行后请用 `git diff` 检查变更。

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

## 常见问题

**`::callout` 没渲染成提示框？**
先确认 `nuxt.config.ts` 的 `modules` 里有 `@nuxt/ui`，且构建产物里 MDC 映射包含 `"callout": "ProseCallout"`（见 `.nuxt/dev/index.mjs` 或 `.nuxt/components.d.ts` 中的 `ProseCallout`）。本项目没有覆盖 `ProseCallout`，用的是 Nuxt UI 默认实现。

**能改 Callout 的默认样式吗？**
可以，但本项目目前**没有**做任何自定义：`app.config.ts` 是空的，`Callout.vue` 读的是 `appConfig.ui?.prose?.callout`，留空即使用 Nuxt UI 默认主题。

**能嵌套使用吗？**
可以。`::callout` 内部支持完整 Markdown，包括列表、代码块和表格；但**不要**在一个 `::callout` 里再套一个 `::callout`，MDC 的块级嵌套解析容易出错。
