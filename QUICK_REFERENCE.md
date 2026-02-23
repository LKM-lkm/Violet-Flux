# 快速参考

## 🎨 常用命令

```bash
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run theme rose   # 切换主题色
npm run fix-latex    # 修复 LaTeX 公式
```

## 🎯 常用变量

### 颜色
```css
var(--primary)           /* 主色 */
var(--bg-primary)        /* 背景 */
var(--text-primary)      /* 文字 */
var(--border-light)      /* 边框 */
```

### 间距
```css
var(--space-sm)   /* 16px */
var(--space-md)   /* 24px */
var(--space-lg)   /* 32px */
var(--space-xl)   /* 48px */
```

### 字体
```css
var(--text-sm)    /* 14px */
var(--text-base)  /* 16px */
var(--text-lg)    /* 18px */
var(--text-xl)    /* 20px */
var(--text-2xl)   /* 24px */
var(--text-3xl)   /* 30px */
var(--text-4xl)   /* 36px */
```

## 🧩 常用组件

### 卡片
```vue
<div class="glass-card">内容</div>
```

### 按钮
```vue
<button class="btn btn-primary">按钮</button>
```

### 渐变文字
```vue
<h1 class="text-gradient">标题</h1>
```

### 容器
```vue
<div class="container">内容</div>
```

## 📱 响应式断点

```css
640px   /* 手机 */
768px   /* 平板竖屏 */
1024px  /* 平板横屏 */
1280px  /* 笔记本 */
```

## 🎨 主题色选项

```bash
npm run theme rose     # 玫瑰粉（默认）
npm run theme purple   # 紫色
npm run theme blue     # 蓝色
npm run theme green    # 绿色
npm run theme orange   # 橙色
```

## 📁 重要文件

```
app/assets/design-system.css  # 设计系统配置
app/app.vue                   # 全局样式
app/pages/blog/[...slug].vue  # 博客文章页
```

## 🔧 调试技巧

### 查看 CSS 变量
```javascript
getComputedStyle(document.documentElement)
  .getPropertyValue('--primary')
```

### 切换暗色模式
```javascript
document.documentElement.classList.toggle('dark')
```

### 查看当前主题
```javascript
localStorage.getItem('theme')
```

## 💡 快速提示

1. ✅ 使用 `var(--variable)` 而不是硬编码
2. ✅ 移动端优先设计
3. ✅ 使用 `transform` 而不是 `top/left`
4. ✅ 保持一致的间距和圆角
5. ✅ 测试暗色模式

## 📚 完整文档

- [设计指南](./DESIGN_GUIDE.md)
- [移动端优化](./MOBILE_OPTIMIZATION.md)
- [优化总结](./OPTIMIZATION_SUMMARY.md)
- [设计系统](./README-DESIGN.md)
