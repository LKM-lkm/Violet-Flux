# 组件使用指南

## 📚 已集成的增强组件

### 1. ReadingProgress (阅读进度条)

**位置**: 页面顶部固定
**功能**: 显示文章阅读进度

```vue
<ClientOnly>
  <ReadingProgress />
</ClientOnly>
```

**效果**:
- 3px 高的渐变进度条
- 从左到右填充，表示阅读进度
- 发光效果，暗色模式下更明显
- 平滑动画

**无需配置** - 自动工作

---

### 2. ArticleNavigation (文章导航)

**位置**: 文章内容下方
**功能**: 显示上一篇/下一篇文章

```vue
<ArticleNavigation :current-path="article.path" />
```

**Props**:
- `currentPath` (必需): 当前文章路径

**效果**:
- 两列卡片布局
- 左侧: 上一篇 (带左箭头)
- 右侧: 下一篇 (带右箭头)
- 显示文章标题和描述
- 悬停时卡片上浮和发光

**示例**:
```
┌─────────────────────┐  ┌─────────────────────┐
│ ← 上一篇            │  │            下一篇 → │
│ 文章标题            │  │            文章标题 │
│ 文章描述...         │  │         ...文章描述 │
└─────────────────────┘  └─────────────────────┘
```

---

### 3. RelatedArticles (相关文章推荐)

**位置**: 文章导航下方
**功能**: 基于标签推荐相关文章

```vue
<RelatedArticles :article="article" :max-items="3" />
```

**Props**:
- `article` (必需): 当前文章对象
- `maxItems` (可选): 最大显示数量，默认 3

**效果**:
- 三列卡片网格布局
- 显示文章标题、标签、描述
- 智能推荐算法（基于标签重叠度）
- "阅读更多"链接带箭头动画

**示例**:
```
✨ 相关文章推荐
┌──────────┐ ┌──────────┐ ┌──────────┐
│ 标题     │ │ 标题     │ │ 标题     │
│ #tag1    │ │ #tag2    │ │ #tag3    │
│ 描述...  │ │ 描述...  │ │ 描述...  │
│ 阅读更多→│ │ 阅读更多→│ │ 阅读更多→│
└──────────┘ └──────────┘ └──────────┘
```

**要求**:
- 文章需要有 `tags` 字段
- 至少有一个共同标签才会显示

---

### 4. ProsePre (代码块增强)

**位置**: Markdown 代码块自动替换
**功能**: 代码复制、语言标签、文件名显示

**Markdown 语法**:

基础代码块:
````markdown
```javascript
console.log('Hello World')
```
````

带文件名:
````markdown
```javascript [index.js]
console.log('Hello World')
```
````

**效果**:
- 顶部显示语言标签和文件名
- 右上角复制按钮
- 点击复制后显示 ✓ 图标
- 2 秒后恢复

**示例**:
```
┌─────────────────────────────────┐
│ JAVASCRIPT [index.js]  [📋 Copy]│
├─────────────────────────────────┤
│ console.log('Hello World')      │
│                                 │
└─────────────────────────────────┘
```

---

## 🎯 完整集成示例

在 `app/pages/blog/[...slug].vue` 中的使用顺序:

```vue
<template>
  <div class="blog-layout">
    <!-- 1. 阅读进度条 (固定在顶部) -->
    <ClientOnly>
      <ReadingProgress />
    </ClientOnly>

    <article>
      <!-- 文章标题、元信息 -->
      <header class="article-header">
        <h1>{{ article.title }}</h1>
      </header>

      <!-- 2. 文章正文 (自动使用 ProsePre) -->
      <div class="article-body">
        <ContentRenderer :value="article" />
      </div>

      <!-- 3. 文章导航 (上一篇/下一篇) -->
      <ArticleNavigation :current-path="article.path" />

      <!-- 4. 相关文章推荐 -->
      <RelatedArticles :article="article" :max-items="3" />

      <!-- 评论系统 -->
      <ClientOnly>
        <CwdComments :slug="article.path" />
      </ClientOnly>
    </article>
  </div>
</template>
```

---

## 📱 响应式行为

### 桌面端 (> 768px)
- ArticleNavigation: 两列布局
- RelatedArticles: 三列网格
- 所有悬停效果正常

### 移动端 (≤ 768px)
- ArticleNavigation: 单列堆叠
- RelatedArticles: 单列堆叠
- 触摸优化的交互

---

## 🎨 自定义样式

所有组件使用 CSS 变量，可以通过修改设计系统变量来自定义:

```css
:root {
  --primary: #701a45;           /* 主色 */
  --primary-hover: #9d174d;     /* 主色悬停 */
  --primary-glow: rgba(112, 26, 69, 0.3); /* 发光效果 */
  --bg-primary: #ffffff;        /* 背景色 */
  --bg-secondary: #f9fafb;      /* 次要背景 */
  --text-primary: #111827;      /* 主文本 */
  --text-secondary: #6b7280;    /* 次要文本 */
  --border-light: #e5e7eb;      /* 边框 */
  --glass-bg: rgba(255, 255, 255, 0.8); /* 玻璃态背景 */
}
```

---

## ⚡ 性能优化

### ReadingProgress
- 使用 `passive: true` 事件监听
- 节流计算，避免频繁更新

### ArticleNavigation & RelatedArticles
- 使用 `useAsyncData` 缓存查询结果
- 避免重复查询

### ProsePre
- 异步复制操作
- 最小化 DOM 操作

---

## 🐛 故障排除

### 相关文章不显示
**原因**: 文章没有 `tags` 字段或没有共同标签
**解决**: 在 Markdown frontmatter 中添加标签:
```yaml
---
title: 文章标题
tags: [vue, nuxt, javascript]
---
```

### 文章导航不显示
**原因**: 只有一篇文章，或者是第一篇/最后一篇
**解决**: 这是正常行为，添加更多文章即可

### 代码复制不工作
**原因**: 浏览器不支持 Clipboard API 或 HTTPS 未启用
**解决**: 使用 HTTPS 或现代浏览器

### 阅读进度条不显示
**原因**: 页面内容太短，无需滚动
**解决**: 这是正常行为，内容足够长时会自动显示

---

## 📖 相关文档

- [ARTICLE_ENHANCEMENTS_COMPLETE.md](./ARTICLE_ENHANCEMENTS_COMPLETE.md) - 完整功能说明
- [ENHANCE_ARTICLE_PAGE.md](./ENHANCE_ARTICLE_PAGE.md) - 原始需求和参考
- [PROJECT_GUIDE.md](./PROJECT_GUIDE.md) - 项目整体指南

---

**提示**: 所有组件都已集成并测试通过，可以直接使用！✨
