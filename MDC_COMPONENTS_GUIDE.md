# MDC 组件使用指南

## 问题说明

MDC (Markdown Components) 语法需要对应的 Vue 组件才能正确渲染。如果组件不存在，MDC 语法会显示为原始文本。

## 已创建的组件

现在已经创建了以下 MDC 组件：

1. `Note.vue` - 信息提示框（蓝色）
2. `Tip.vue` - 建议提示框（绿色）
3. `Warning.vue` - 警告提示框（橙色）
4. `Caution.vue` - 危险提示框（红色）

所有组件位于：`app/components/content/`

## 使用方法

### 基本语法

```markdown
::note
这是一个信息提示
::

::tip
这是一个建议
::

::warning
这是一个警告
::

::caution
这是一个危险提示
::
```

### 多段落内容

```markdown
::note
第一段内容。

第二段内容。

- 列表项 1
- 列表项 2
::
```

### 包含格式化文本

```markdown
::tip
这是一个包含**粗体**和*斜体*的提示。

还可以包含 `代码` 和 [链接](https://example.com)。
::
```

### 包含代码块

```markdown
::note
安装命令：

\```bash
npm install package-name
\```
::
```

## 组件特性

### 1. Note (信息)
- **颜色**：蓝色
- **图标**：info (ℹ️)
- **用途**：提供额外信息

### 2. Tip (提示)
- **颜色**：绿色
- **图标**：lightbulb (💡)
- **用途**：提供有用的建议

### 3. Warning (警告)
- **颜色**：橙色
- **图标**：alert-triangle (⚠️)
- **用途**：警告用户注意事项

### 4. Caution (危险)
- **颜色**：红色
- **图标**：alert-circle (🚨)
- **用途**：警告危险操作

## 样式特点

- 左侧彩色边框（4px）
- 半透明背景
- 图标和内容分离布局
- 支持亮色/暗色模式
- 响应式设计

## 测试

访问测试页面查看效果：
```
http://localhost:3000/blog/test-mdc
```

## 自定义组件

如果需要创建自定义 MDC 组件：

1. 在 `app/components/content/` 创建 Vue 组件
2. 组件名称首字母大写（如 `MyComponent.vue`）
3. 在 Markdown 中使用小写加连字符（如 `::my-component`）

### 示例：创建自定义组件

**文件**：`app/components/content/CustomBox.vue`

```vue
<template>
  <div class="custom-box">
    <slot />
  </div>
</template>

<style scoped>
.custom-box {
  padding: 1rem;
  border: 2px solid var(--primary);
  border-radius: 0.5rem;
  background: var(--bg-secondary);
}
</style>
```

**使用**：

```markdown
::custom-box
自定义内容
::
```

## 带属性的组件

MDC 支持传递属性：

```markdown
::custom-box{class="my-class" id="my-id"}
内容
::
```

在组件中接收：

```vue
<script setup>
defineProps({
  class: String,
  id: String
})
</script>
```

## 常见问题

### Q: 为什么 MDC 语法显示为原始文本？

A: 可能的原因：
1. 组件文件不存在
2. 组件名称不匹配（检查大小写）
3. 组件位置错误（必须在 `app/components/content/`）
4. 需要重启开发服务器

### Q: 如何调试 MDC 组件？

A: 
1. 检查浏览器控制台是否有错误
2. 使用 Vue DevTools 查看组件树
3. 确认组件文件存在且命名正确
4. 查看 Nuxt Content 的渲染输出

### Q: MDC 组件支持哪些内容？

A: MDC 组件的 slot 支持：
- 纯文本
- Markdown 格式（粗体、斜体、链接等）
- 代码块
- 列表
- 其他 MDC 组件（嵌套）

### Q: 如何修改组件样式？

A: 直接编辑组件文件中的 `<style>` 部分。所有样式都是 scoped 的，不会影响其他组件。

## 与 Nuxt UI Callout 的区别

### MDC 组件（本方案）
```markdown
::note
内容
::
```

优点：
- 简洁的语法
- 自定义程度高
- 完全控制样式

### Nuxt UI Callout
```markdown
::callout{icon="i-lucide-info" color="info"}
内容
::
```

优点：
- 更多配置选项
- 与 Nuxt UI 集成
- 开箱即用的功能

## 迁移指南

### 从 GitHub Alerts 迁移

**旧语法**：
```markdown
> [!NOTE]
> 信息内容
```

**新语法**：
```markdown
::note
信息内容
::
```

### 从 Nuxt UI Callout 迁移

**旧语法**：
```markdown
::callout{icon="i-lucide-info" color="info"}
信息内容
::
```

**新语法**：
```markdown
::note
信息内容
::
```

## 最佳实践

1. **保持简洁**：每个提示框只包含一个主要信息
2. **使用合适的类型**：根据内容重要性选择合适的组件
3. **添加图标**：在内容开头添加 emoji 增强视觉效果
4. **避免嵌套**：尽量不要嵌套多层 MDC 组件
5. **测试渲染**：创建新组件后立即测试

## 扩展阅读

- [Nuxt Content MDC 文档](https://content.nuxt.com/usage/markdown#mdc-components)
- [Vue 组件基础](https://vuejs.org/guide/essentials/component-basics.html)
- [Lucide 图标库](https://lucide.dev/icons/)

---

**创建日期**: 2026-02-24  
**更新日期**: 2026-02-24
