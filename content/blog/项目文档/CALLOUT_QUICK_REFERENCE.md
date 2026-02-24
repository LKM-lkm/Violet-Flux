# Callout 快速参考

## 基本语法

```markdown
::callout{icon="图标名称" color="颜色"}
内容
::
```

## 常用组合

### 📘 信息
```markdown
::callout{icon="i-lucide-info" color="info"}
信息内容
::
```

### 💡 提示
```markdown
::callout{icon="i-lucide-lightbulb" color="success"}
提示内容
::
```

### ⚠️ 警告
```markdown
::callout{icon="i-lucide-alert-triangle" color="warning"}
警告内容
::
```

### 🚨 危险
```markdown
::callout{icon="i-lucide-alert-circle" color="error"}
危险内容
::
```

### ⭐ 重要
```markdown
::callout{icon="i-lucide-star" color="primary"}
重要内容
::
```

## 颜色选项

- `info` - 蓝色
- `success` - 绿色
- `warning` - 橙色
- `error` - 红色
- `primary` - 主色调
- `neutral` - 灰色

## 常用图标

- `i-lucide-info` - ℹ️
- `i-lucide-lightbulb` - 💡
- `i-lucide-alert-triangle` - ⚠️
- `i-lucide-alert-circle` - 🚨
- `i-lucide-check-circle` - ✅
- `i-lucide-x-circle` - ❌
- `i-lucide-star` - ⭐
- `i-lucide-book-open` - 📖
- `i-lucide-terminal` - 💻
- `i-lucide-rocket` - 🚀

[查看所有图标](https://lucide.dev/icons/)

## 高级用法

### 带链接
```markdown
::callout{icon="i-lucide-external-link" color="info" to="https://example.com"}
点击跳转
::
```

### 包含代码
```markdown
::callout{icon="i-lucide-terminal" color="neutral"}
```bash
npm install package
```
::
```

### 多段落
```markdown
::callout{icon="i-lucide-layers" color="info"}
第一段

第二段
::
```

---

完整文档：[NUXT_UI_CALLOUT_GUIDE.md](./NUXT_UI_CALLOUT_GUIDE.md)
