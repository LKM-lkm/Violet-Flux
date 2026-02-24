---
title: Nuxt UI Callout 示例
description: 展示如何使用 Nuxt UI Callout 组件
tags: [示例, Nuxt UI]
---

# Nuxt UI Callout 示例

这个页面展示了如何在 Markdown 中使用 Nuxt UI 的 Callout 组件。

## 基本用法

### Info (信息)

::callout{icon="i-lucide-info" color="info"}
这是一个信息提示框，用于显示一般性的信息。
::

### Success (成功/提示)

::callout{icon="i-lucide-lightbulb" color="success"}
💡 **提示**：这是一个有用的技巧或建议。
::

### Warning (警告)

::callout{icon="i-lucide-alert-triangle" color="warning"}
⚠️ **警告**：请注意这个重要信息，避免潜在问题。
::

### Error (错误/危险)

::callout{icon="i-lucide-alert-circle" color="error"}
🚨 **危险**：这是一个严重警告，请务必小心！
::

### Primary (主色调)

::callout{icon="i-lucide-star" color="primary"}
⭐ **重要**：这是一个重要的关键信息。
::

## 高级用法

### 包含 Markdown 语法

::callout{icon="i-lucide-book-open" color="info"}
## Callout 内的标题

这个 Callout 包含完整的 Markdown 语法：

- **粗体文本**
- *斜体文本*
- `代码片段`
- [链接](https://nuxt.com)

甚至可以包含代码块：

```javascript
console.log('Hello, Nuxt UI!')
```
::

### 带链接的 Callout

::callout{icon="i-lucide-external-link" color="primary" to="https://ui.nuxt.com"}
点击这个 Callout 可以跳转到 Nuxt UI 官网
::

### 多段落内容

::callout{icon="i-lucide-layers" color="neutral"}
这是第一个段落，包含一些介绍性文字。

这是第二个段落，提供更多详细信息。

最后一个段落，总结要点。
::

## 实际应用场景

### 文档说明

::callout{icon="i-lucide-file-text" color="info"}
📘 **文档说明**：本文档使用 Nuxt Content 和 Nuxt UI 构建，支持完整的 Markdown 语法和 MDC 组件。
::

### 安装步骤

::callout{icon="i-lucide-terminal" color="neutral"}
```bash
npm install @nuxt/ui @nuxt/content
```
::

::callout{icon="i-lucide-lightbulb" color="success"}
💡 **提示**：推荐使用 pnpm 以获得更快的安装速度和更好的依赖管理。
::

### 配置示例

::callout{icon="i-lucide-settings" color="info"}
在 `nuxt.config.ts` 中添加以下配置：

```typescript
export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxt/ui',
  ],
})
```
::

### 注意事项

::callout{icon="i-lucide-alert-triangle" color="warning"}
⚠️ **注意**：在生产环境部署前，请确保已经过充分测试。
::

::callout{icon="i-lucide-shield-alert" color="error"}
🚨 **重要安全提示**：不要在公开仓库中提交敏感信息（如 API 密钥、密码等）。
::

## 不同图标示例

### 常用图标

::callout{icon="i-lucide-check-circle" color="success"}
✅ 任务已完成
::

::callout{icon="i-lucide-x-circle" color="error"}
❌ 操作失败
::

::callout{icon="i-lucide-clock" color="warning"}
⏰ 即将到期
::

::callout{icon="i-lucide-rocket" color="primary"}
🚀 新功能发布
::

::callout{icon="i-lucide-zap" color="warning"}
⚡ 性能优化提示
::

::callout{icon="i-lucide-heart" color="error"}
❤️ 感谢支持
::

## 总结

::callout{icon="i-lucide-check-circle-2" color="success"}
Nuxt UI Callout 组件提供了一种优雅的方式来突出显示重要信息，相比传统的 blockquote 或 GitHub Alerts，它更加灵活、美观且功能强大。
::

::callout{icon="i-lucide-book-open" color="info" to="/docs"}
查看完整文档了解更多详情
::
