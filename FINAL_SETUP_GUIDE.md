# 最终设置指南

## 已完成的修复 ✅

根据 Nuxt UI Docs Template 官方文档，已完成以下修复：

### 1. 创建 main.css ✓
**文件**: `app/assets/css/main.css`

```css
@import "tailwindcss";
@import "@nuxt/ui";
```

这是 Nuxt UI 正常工作的必要文件。

### 2. 更新 nuxt.config.ts ✓
- 添加了 `css: ['~/assets/css/main.css']`
- 移除了不必要的 `ui: { prose: true }` 配置
- Nuxt UI 会自动启用 Prose 组件

### 3. 简化 app.config.ts ✓
- 移除了过度自定义的 Prose 样式
- 让 Nuxt UI 使用默认样式
- 避免配置冲突

## 现在可以使用的组件

所有 Nuxt UI Prose 组件现在都应该正常工作：

### Callout 快捷方式
```markdown
::note
信息内容
::

::tip
提示内容
::

::warning
警告内容
::

::caution
危险内容
::
```

### 其他 Prose 组件
- `::callout` - 通用提示框
- `::card` - 卡片
- `::card-group` - 卡片组
- `::tabs` - 标签页
- `::accordion` - 手风琴
- `::collapsible` - 可折叠内容
- `::steps` - 步骤指南
- `::field` - 字段说明
- `::field-group` - 字段组
- `::badge` - 徽章
- `::code-group` - 代码组
- `::code-tree` - 代码树
- `::code-preview` - 代码预览
- `::code-collapse` - 可折叠代码
- `:icon` - 图标
- `:kbd` - 键盘按键
- `:img` - 图片

## 测试步骤

### 1. 清除缓存并重启
```bash
rm -rf .nuxt
npm run dev
```

### 2. 测试 Prose 组件
访问: `http://localhost:3000/blog/test-mdc`

应该看到：
- ✅ 蓝色的 note 框（带图标）
- ✅ 绿色的 tip 框（带灯泡图标）
- ✅ 橙色的 warning 框（带警告图标）
- ✅ 红色的 caution 框（带危险图标）

### 3. 测试标签布局
访问: `http://localhost:3000/blog`

标签应该：
- ✅ 在卡片底部左侧
- ✅ 横向排列
- ✅ "Read" 按钮在右侧

### 4. 测试 MathJax
访问包含数学公式的文章

公式应该：
- ✅ 正确渲染为数学符号
- ✅ 不显示 LaTeX 源代码

## 可选的改进

### 1. 安装图片优化模块
```bash
npm install @nuxt/image
```

然后在 `nuxt.config.ts` 中添加：
```typescript
modules: [
  '@nuxt/content',
  '@nuxt/ui',
  '@nuxt/icon',
  '@nuxt/image'  // 添加这个
]
```

### 2. 安装 OG Image 模块
```bash
npm install nuxt-og-image
```

然后在 `nuxt.config.ts` 中添加：
```typescript
modules: [
  '@nuxt/content',
  '@nuxt/ui',
  '@nuxt/icon',
  'nuxt-og-image'  // 添加这个
]
```

### 3. 移除不需要的依赖
```bash
npm uninstall @nuxtjs/tailwindcss markdown-it-github-alerts
```

这些依赖与 Nuxt UI 冲突或不再需要。

## 故障排除

### 如果 Prose 组件仍然不工作

1. **检查 main.css 是否存在**:
   ```bash
   ls app/assets/css/main.css
   ```

2. **检查 nuxt.config.ts 中的 CSS 配置**:
   ```typescript
   css: ['~/assets/css/main.css']
   ```

3. **清除缓存**:
   ```bash
   rm -rf .nuxt node_modules/.cache
   npm run dev
   ```

4. **检查浏览器控制台**:
   - 打开开发者工具
   - 查看是否有 CSS 加载错误
   - 查看是否有 JavaScript 错误

### 如果样式不正确

1. **检查 Tailwind CSS 是否正确加载**:
   - 打开浏览器开发者工具
   - 检查元素的 computed 样式
   - 确认 Tailwind 类名生效

2. **检查 app.config.ts**:
   - 确保没有过度自定义
   - 让 Nuxt UI 使用默认样式

## 项目结构

```
Violet Flux/
├── app/
│   ├── assets/
│   │   └── css/
│   │       ├── main.css          ✅ 新建
│   │       └── design-system.css
│   ├── components/
│   │   ├── content/
│   │   │   ├── ProseCallout.vue  ❌ 可以删除（Nuxt UI 提供）
│   │   │   ├── ProseImg.vue
│   │   │   └── ProsePre.vue
│   │   ├── ArticleNavigation.vue
│   │   ├── ContentSearch.vue
│   │   └── ...
│   ├── pages/
│   └── plugins/
│       └── mathjax.client.ts
├── content/
│   └── blog/
├── public/
├── app.config.ts                  ✅ 已简化
├── nuxt.config.ts                 ✅ 已更新
└── package.json
```

## 配置文件对比

### nuxt.config.ts

**之前**:
```typescript
ui: {
  prose: true  // 不需要
}
```

**现在**:
```typescript
css: ['~/assets/css/main.css']  // 必需
```

### app.config.ts

**之前**:
```typescript
ui: {
  prose: {
    // 大量自定义配置
    callout: { ... },
    h1: { ... },
    // ...
  }
}
```

**现在**:
```typescript
// 使用默认配置
// 只在需要时自定义
```

## 总结

### 关键修复
1. ✅ 创建了 `app/assets/css/main.css`
2. ✅ 在 `nuxt.config.ts` 中添加了 CSS 导入
3. ✅ 简化了 `app.config.ts`

### 现在可以使用
- ✅ 所有 Nuxt UI Prose 组件
- ✅ `::note`, `::tip`, `::warning`, `::caution`
- ✅ `::card`, `::tabs`, `::accordion` 等
- ✅ 完整的 MDC 语法支持

### 不需要
- ❌ 自己创建 Note/Tip/Warning/Caution 组件
- ❌ 购买 Nuxt UI Pro
- ❌ 复杂的配置

一切都是免费和开箱即用的！

---

**设置日期**: 2026-02-24  
**状态**: ✅ 完成
