# Nuxt UI Prose 组件使用指南

## 重要说明

`::note`、`::tip`、`::warning`、`::caution` 等组件是 **Nuxt UI v4 自带的免费功能**，不需要付费！

这些是 Nuxt UI 的 **Prose 组件**，专门为文档设计。

## 已启用的配置

在 `nuxt.config.ts` 中已添加：

```typescript
export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxt/ui',
    '@nuxt/icon',
  ],
  
  ui: {
    prose: true  // 启用 Prose 组件
  }
})
```

## 可用的 Prose 组件

### 1. Callout 快捷方式

#### Note (信息)
```markdown
::note
Here's some additional information for you.
::
```

#### Tip (提示)
```markdown
::tip
Here's a helpful suggestion.
::
```

#### Warning (警告)
```markdown
::warning
Be careful with this action as it might have unexpected results.
::
```

#### Caution (危险)
```markdown
::caution
This action cannot be undone.
::
```

### 2. 通用 Callout

```markdown
::callout{icon="i-lucide-info" color="info"}
This is a `callout` with full **markdown** support.
::
```

可用颜色：
- `primary`
- `secondary`
- `success`
- `info`
- `warning`
- `error`
- `neutral`

### 3. Badge

```markdown
::badge
**v3.0.0-alpha.10**
::
```

### 4. Card

```markdown
::card{title="Dashboard" icon="i-simple-icons-github" to="https://github.com"}
A dashboard with multi-column layout.
::
```

使用 YAML 属性：

```markdown
::card
---
title: Dashboard
icon: i-simple-icons-github
to: https://github.com
target: _blank
---
A dashboard with multi-column layout.
::
```

### 5. Card Group

```markdown
::card-group
::card{title="Card 1"}
Content 1
::

::card{title="Card 2"}
Content 2
::
::
```

### 6. Tabs

```markdown
::tabs
:::tabs-item{label="Code" icon="i-lucide-code"}
```javascript
console.log('Hello')
```
:::

:::tabs-item{label="Preview" icon="i-lucide-eye"}
预览内容
:::
::
```

### 7. Accordion

```markdown
::accordion
:::accordion-item{label="Question 1" icon="i-lucide-circle-help"}
Answer 1
:::

:::accordion-item{label="Question 2" icon="i-lucide-circle-help"}
Answer 2
:::
::
```

### 8. Collapsible

```markdown
::collapsible
可折叠的内容
::
```

### 9. Steps

```markdown
::steps{level="4"}
#### Step 1
内容 1

#### Step 2
内容 2
::
```

### 10. Field

```markdown
::field{name="name" type="string" required}
The description can be set as prop or in the default slot.
::
```

### 11. Field Group

```markdown
::field-group
::field{name="analytics" type="boolean"}
Enables analytics for your project.
::

::field{name="database" type="boolean"}
Enables SQL database.
::
::
```

### 12. Icon

```markdown
:icon{name="i-simple-icons-nuxtdotjs"}
```

### 13. Kbd

```markdown
:kbd{value="meta"} :kbd{value="K"}
```

## 完整示例

```markdown
---
title: 示例文档
---

# 文档标题

::note
这是一个信息提示。
::

::tip
💡 这是一个有用的建议。
::

::warning
⚠️ 请注意这个警告。
::

::caution
🚨 这个操作无法撤销！
::

## 代码示例

::tabs
:::tabs-item{label="npm" icon="i-lucide-package"}
```bash
npm install @nuxt/ui
```
:::

:::tabs-item{label="yarn" icon="i-lucide-package"}
```bash
yarn add @nuxt/ui
```
:::

:::tabs-item{label="pnpm" icon="i-lucide-package"}
```bash
pnpm add @nuxt/ui
```
:::
::

## 卡片展示

::card-group
::card{title="功能 1" icon="i-lucide-zap"}
快速启动
::

::card{title="功能 2" icon="i-lucide-shield"}
安全可靠
::

::card{title="功能 3" icon="i-lucide-rocket"}
性能优越
::
::

## 常见问题

::accordion
:::accordion-item{label="如何安装？" icon="i-lucide-circle-help"}
运行 `npm install @nuxt/ui` 即可。
:::

:::accordion-item{label="是否免费？" icon="i-lucide-circle-help"}
是的，完全免费开源！
:::
::
```

## 样式自定义

如果需要自定义 Prose 组件的样式，可以在 `app.config.ts` 中配置：

```typescript
export default defineAppConfig({
  ui: {
    prose: {
      callout: {
        // 自定义 callout 样式
      },
      card: {
        // 自定义 card 样式
      }
    }
  }
})
```

## 测试

重启开发服务器后，访问：
```
http://localhost:3000/blog/test-mdc
```

所有 Prose 组件应该正确渲染。

## 故障排除

### 组件不渲染

1. **检查配置**：
   确认 `nuxt.config.ts` 中有 `ui: { prose: true }`

2. **重启服务器**：
   ```bash
   npm run dev
   ```

3. **清除缓存**：
   ```bash
   rm -rf .nuxt
   npm run dev
   ```

4. **检查语法**：
   确保使用 `::` 开始和结束块组件

### 样式不正确

1. **检查 Nuxt UI 版本**：
   ```bash
   npm list @nuxt/ui
   ```
   应该是 v4.x

2. **检查 CSS 导入**：
   确保在 `assets/css/main.css` 中导入了 Nuxt UI：
   ```css
   @import "tailwindcss";
   @import "@nuxt/ui";
   ```

## 参考资源

- [Nuxt UI 官方文档](https://ui.nuxt.com)
- [Nuxt UI Prose 组件](https://ui.nuxt.com/components/prose)
- [Nuxt Content MDC 语法](https://content.nuxt.com/usage/markdown)
- [Docs Template 示例](https://docs-template.nuxt.dev/)

## 总结

- ✅ 所有 Prose 组件都是免费的
- ✅ 不需要 Nuxt UI Pro
- ✅ 只需要 `@nuxt/ui` 模块
- ✅ 配置简单，开箱即用

---

**创建日期**: 2026-02-24  
**更新日期**: 2026-02-24
