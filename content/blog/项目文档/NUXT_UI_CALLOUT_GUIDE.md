# Nuxt UI Callout 使用指南

## 什么是 Callout？

Callout 是 Nuxt UI 提供的一个组件，用于在内容中突出显示重要信息、提示、警告等。它比 GitHub Alerts 更灵活，样式更现代。

## 在 Markdown 中使用

### MDC 语法

使用 MDC (MarkDown Components) 语法在 Markdown 文件中调用 Callout 组件：

```markdown
::callout{icon="i-lucide-info" color="info"}
这是一个信息提示框
::
```

### 基本示例

#### Info (信息)
```markdown
::callout{icon="i-lucide-info" color="info"}
这是一个有用的信息提示
::
```

#### Success (成功/提示)
```markdown
::callout{icon="i-lucide-lightbulb" color="success"}
💡 这是一个有用的技巧
::
```

#### Warning (警告)
```markdown
::callout{icon="i-lucide-alert-triangle" color="warning"}
⚠️ 请注意这个重要信息
::
```

#### Error (错误/危险)
```markdown
::callout{icon="i-lucide-alert-circle" color="error"}
🚨 这是一个危险警告
::
```

### 支持 Markdown 语法

Callout 内部支持完整的 Markdown 语法：

```markdown
::callout{icon="i-lucide-book-open" color="primary"}
## 标题

这是一个包含 **粗体** 和 *斜体* 的段落。

- 列表项 1
- 列表项 2

[链接文本](https://example.com)

`代码片段`
::
```

### 可用的颜色

- `primary` - 主色调（紫色/品红）
- `secondary` - 次要色
- `success` - 成功/绿色
- `info` - 信息/蓝色
- `warning` - 警告/橙色
- `error` - 错误/红色
- `neutral` - 中性/灰色

### 可用的图标

使用 Lucide 图标（通过 `@nuxt/icon`）：

- `i-lucide-info` - 信息
- `i-lucide-lightbulb` - 灯泡/提示
- `i-lucide-alert-triangle` - 警告三角
- `i-lucide-alert-circle` - 警告圆圈
- `i-lucide-check-circle` - 成功勾选
- `i-lucide-x-circle` - 错误叉号
- `i-lucide-book-open` - 书本
- `i-lucide-rocket` - 火箭
- `i-lucide-zap` - 闪电

查看更多图标：https://lucide.dev/icons/

## 迁移 GitHub Alerts

### 从 GitHub Alerts 迁移

如果你之前使用 GitHub 风格的 Alerts：

**旧语法（GitHub）：**
```markdown
> [!TIP]
> 这是一个提示

> [!WARNING]
> 这是一个警告
```

**新语法（Nuxt UI Callout）：**
```markdown
::callout{icon="i-lucide-lightbulb" color="success"}
这是一个提示
::

::callout{icon="i-lucide-alert-triangle" color="warning"}
这是一个警告
::
```

### 对应关系

| GitHub Alert | Nuxt UI Callout |
|--------------|-----------------|
| `[!NOTE]` | `{icon="i-lucide-info" color="info"}` |
| `[!TIP]` | `{icon="i-lucide-lightbulb" color="success"}` |
| `[!IMPORTANT]` | `{icon="i-lucide-alert-circle" color="primary"}` |
| `[!WARNING]` | `{icon="i-lucide-alert-triangle" color="warning"}` |
| `[!CAUTION]` | `{icon="i-lucide-x-circle" color="error"}` |

## 高级用法

### 添加链接

```markdown
::callout{icon="i-lucide-external-link" color="info" to="https://nuxt.com"}
点击这个 Callout 跳转到 Nuxt 官网
::
```

### 自定义样式

可以通过 `class` 属性添加自定义类：

```markdown
::callout{icon="i-lucide-star" color="primary" class="my-custom-class"}
自定义样式的 Callout
::
```

### 嵌套内容

```markdown
::callout{icon="i-lucide-layers" color="info"}
### 嵌套标题

这是一个包含多个段落的 Callout。

第二个段落。

```javascript
console.log('甚至可以包含代码块')
```
::
```

## 完整示例

创建一个包含多种 Callout 的文档：

```markdown
---
title: 示例文档
---

# 文档标题

正常的段落文本。

::callout{icon="i-lucide-info" color="info"}
📘 **文档说明**：这是一个示例文档，展示如何使用 Callout 组件。
::

## 安装步骤

::callout{icon="i-lucide-terminal" color="neutral"}
```bash
npm install package-name
```
::

::callout{icon="i-lucide-lightbulb" color="success"}
💡 **提示**：建议使用 pnpm 以获得更快的安装速度。
::

## 注意事项

::callout{icon="i-lucide-alert-triangle" color="warning"}
⚠️ **警告**：在生产环境中使用前，请确保已经过充分测试。
::

::callout{icon="i-lucide-alert-circle" color="error"}
🚨 **危险**：不要在没有备份的情况下执行此操作！
::

## 更多信息

::callout{icon="i-lucide-book-open" color="primary" to="/docs"}
查看完整文档了解更多详情
::
```

## 配置

### nuxt.config.ts

确保已经安装并配置了 `@nuxt/ui`：

```typescript
export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxt/ui',
    '@nuxt/icon',
  ],
})
```

### 自定义主题

可以在 `app.config.ts` 中自定义 Callout 的样式：

```typescript
export default defineAppConfig({
  ui: {
    prose: {
      callout: {
        // 自定义配置
      }
    }
  }
})
```

## 优势

相比 GitHub Alerts，Nuxt UI Callout 的优势：

1. ✅ **更灵活** - 可以自定义图标、颜色、链接
2. ✅ **更美观** - 现代化的设计，支持主题切换
3. ✅ **更强大** - 支持完整的 Markdown 语法
4. ✅ **更一致** - 与 Nuxt UI 设计系统完美集成
5. ✅ **更可控** - 可以通过配置自定义样式

## 参考资料

- [Nuxt UI Callout 文档](https://ui.nuxt.com/docs/typography/callout)
- [Nuxt Content MDC 语法](https://content.nuxt.com/docs/files/markdown)
- [Lucide 图标库](https://lucide.dev/icons/)
- [@nuxt/icon 文档](https://nuxt.com/modules/icon)

---

**提示**：如果你需要批量转换现有的 GitHub Alerts 到 Nuxt UI Callout，可以创建一个脚本来自动化这个过程。
