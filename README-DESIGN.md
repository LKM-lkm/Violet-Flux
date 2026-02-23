# Violet Flux - 设计系统文档

## 🎨 快速开始

### 更换主题色
```bash
# 使用预设颜色
npm run theme rose     # 玫瑰粉（默认）
npm run theme purple   # 紫色
npm run theme blue     # 蓝色
npm run theme green    # 绿色
npm run theme orange   # 橙色
```

### 自定义颜色
编辑 `app/assets/design-system.css`:
```css
:root {
  --primary: #your-color;
  --primary-hover: #your-darker-color;
  --primary-light: #your-lighter-color;
}
```

## 📐 设计系统

### 颜色变量
```css
/* 主色 */
var(--primary)
var(--primary-hover)
var(--primary-light)

/* 背景 */
var(--bg-primary)
var(--bg-secondary)
var(--bg-tertiary)

/* 文字 */
var(--text-primary)
var(--text-secondary)
var(--text-tertiary)

/* 边框 */
var(--border-light)
var(--border-medium)
var(--border-strong)
```

### 间距
```css
var(--space-xs)   /* 8px */
var(--space-sm)   /* 16px */
var(--space-md)   /* 24px */
var(--space-lg)   /* 32px */
var(--space-xl)   /* 48px */
var(--space-2xl)  /* 64px */
var(--space-3xl)  /* 96px */
```

### 圆角
```css
var(--radius-sm)   /* 8px */
var(--radius-md)   /* 12px */
var(--radius-lg)   /* 16px */
var(--radius-xl)   /* 24px */
var(--radius-2xl)  /* 32px */
```

### 阴影
```css
var(--shadow-sm)
var(--shadow-md)
var(--shadow-lg)
var(--shadow-xl)
var(--shadow-2xl)
```

## 🧩 组件

### 玻璃态卡片
```vue
<div class="glass-card">
  内容
</div>
```

### 按钮
```vue
<button class="btn btn-primary">主要按钮</button>
<button class="btn btn-secondary">次要按钮</button>
<button class="btn btn-ghost">幽灵按钮</button>
```

### 文本渐变
```vue
<h1 class="text-gradient">渐变标题</h1>
```

### 容器
```vue
<div class="container">
  内容会自动居中，最大宽度 1400px
</div>
```

## 📱 响应式

### 断点
```css
@media (max-width: 640px)  { /* 手机 */ }
@media (max-width: 768px)  { /* 平板竖屏 */ }
@media (max-width: 1024px) { /* 平板横屏 */ }
```

### 移动端优先
```css
/* 默认样式（移动端） */
.element {
  font-size: 1rem;
}

/* 大屏幕 */
@media (min-width: 768px) {
  .element {
    font-size: 1.25rem;
  }
}
```

## 🎯 最佳实践

### ✅ 推荐
```css
/* 使用变量 */
color: var(--text-primary);
padding: var(--space-md);
border-radius: var(--radius-lg);

/* 使用 transform */
transform: translateY(-2px);

/* 语义化类名 */
<button class="btn btn-primary">
```

### ❌ 避免
```css
/* 硬编码颜色 */
color: #171717;

/* 硬编码数值 */
padding: 24px;

/* 使用 top/left */
top: -2px;

/* 非语义化类名 */
<button class="blue-button">
```

## 🌓 暗色模式

### 自动切换
```javascript
import { isDark, toggleDark } from '~/composables/useTheme'

// 切换主题
toggleDark()

// 检查当前主题
if (isDark.value) {
  console.log('暗色模式')
}
```

### 手动测试
```javascript
// 浏览器控制台
localStorage.setItem('theme', 'dark')
location.reload()
```

## 🔧 工具

### 颜色迁移
```bash
# 自动替换硬编码颜色
node scripts/migrate-colors.mjs
```

### 主题切换
```bash
# 快速更换主题色
npm run theme <color-name>
```

## 📚 文档

- [完整设计指南](./DESIGN_GUIDE.md)
- [移动端优化](./MOBILE_OPTIMIZATION.md)
- [优化总结](./OPTIMIZATION_SUMMARY.md)

## 🎨 配色预览

### Rose Pink（默认）
- Light: #db2777
- Dark: #ec4899
- 清爽、现代、优雅

### Purple
- Light: #9333ea
- Dark: #a855f7
- 神秘、高贵、创意

### Blue
- Light: #2563eb
- Dark: #3b82f6
- 专业、可靠、冷静

### Green
- Light: #059669
- Dark: #10b981
- 自然、清新、活力

### Orange
- Light: #ea580c
- Dark: #f97316
- 温暖、活泼、友好

## 💡 提示

1. 所有颜色配置都在 `app/assets/design-system.css`
2. 使用语义化变量而不是硬编码值
3. 移动端优先的响应式设计
4. 保持一致的间距和圆角
5. 测试暗色模式下的效果

## 🚀 性能

- 字体预加载（font-display: swap）
- 优化的动画（使用 transform）
- 减少重绘和回流
- 移动端动画简化
- 懒加载图片

## ♿ 可访问性

- 语义化 HTML
- ARIA 标签
- 键盘导航
- 颜色对比度 WCAG AA
- 触摸目标最小 44x44px

---

**享受创作！** 🎉
