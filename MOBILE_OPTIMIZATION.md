# 移动端优化指南

## 已完成的优化

### ✅ 1. 响应式导航
- 移动端汉堡菜单
- 平滑的菜单动画
- 触摸友好的按钮尺寸（40x40px）
- 固定顶部导航栏

### ✅ 2. 统一配色系统
- 所有颜色集中在 `app/assets/design-system.css`
- 自动适配暗色模式
- 语义化变量命名
- 已迁移 129 处硬编码颜色

### ✅ 3. 响应式排版
```css
/* 移动端 */
--text-6xl: 2rem      /* 标题 */
--text-base: 1rem     /* 正文 */

/* 平板 */
--text-6xl: 2.5rem
--text-base: 1rem

/* 桌面 */
--text-6xl: 3.75rem
--text-base: 1rem
```

### ✅ 4. 布局优化
- 单列布局（移动端）
- 侧边栏自动隐藏
- 响应式间距
- 防止横向滚动

### ✅ 5. 性能优化
- 字体预加载 (font-display: swap)
- 减少动画复杂度
- 优化背景模糊效果

## 配色方案

### 主色调（Pink/Rose）
更现代、更清爽的粉色系：

```css
/* Light Mode */
--primary: #db2777      /* 主色 - Rose 600 */
--primary-hover: #be185d /* 悬停 - Rose 700 */
--primary-light: #fce7f3 /* 浅色背景 - Rose 100 */

/* Dark Mode */
--primary: #ec4899      /* 主色 - Rose 500 */
--primary-hover: #f472b6 /* 悬停 - Rose 400 */
--primary-light: #831843 /* 浅色背景 - Rose 900 */
```

### 中性色
```css
/* Light Mode */
--bg-primary: #ffffff
--bg-secondary: #fafafa
--bg-tertiary: #f5f5f5
--text-primary: #171717
--text-secondary: #525252
--text-tertiary: #a3a3a3

/* Dark Mode */
--bg-primary: #0a0a0a
--bg-secondary: #141414
--bg-tertiary: #1a1a1a
--text-primary: #fafafa
--text-secondary: #a3a3a3
--text-tertiary: #737373
```

## 移动端断点

```css
/* 手机 */
@media (max-width: 640px) {
  .container { padding: 0 1rem; }
  .article-title { font-size: 1.875rem; }
}

/* 平板竖屏 */
@media (max-width: 768px) {
  .nav { display: none; }
  .mobile-menu-btn { display: flex; }
  .sidebar { display: none; }
}

/* 平板横屏 */
@media (max-width: 1024px) {
  .page-container.has-sidebar {
    grid-template-columns: 1fr;
  }
}
```

## 触摸优化

### 最小触摸目标
```css
/* 按钮最小尺寸 44x44px (iOS) / 48x48px (Android) */
.btn {
  min-height: 44px;
  min-width: 44px;
  padding: 0.75rem 1.5rem;
}

.theme-toggle {
  width: 40px;
  height: 40px;
}
```

### 触摸反馈
```css
.btn:active {
  transform: scale(0.95);
}

.nav-link:active {
  opacity: 0.7;
}
```

## 性能优化

### 1. 字体加载
```css
@font-face {
  font-family: 'Geist Sans';
  src: url('/Geist-Variable.woff2') format('woff2-variations');
  font-display: swap; /* 避免 FOIT */
}
```

### 2. 减少重绘
```css
/* 使用 transform 代替 top/left */
.element {
  transform: translateY(-2px); /* ✅ */
  /* top: -2px; ❌ */
}
```

### 3. 优化动画
```css
/* 移动端减少动画 */
@media (max-width: 768px) {
  .blob {
    animation: none; /* 禁用复杂动画 */
  }
  
  * {
    transition-duration: 150ms !important; /* 加快过渡 */
  }
}
```

## 可访问性

### 1. 语义化 HTML
```vue
<header class="header">
  <nav class="nav">
    <NuxtLink to="/">Home</NuxtLink>
  </nav>
</header>
```

### 2. ARIA 标签
```vue
<button 
  @click="toggleDark()" 
  class="theme-toggle"
  aria-label="Toggle theme"
>
  <Icon :name="isDark ? 'lucide:sun' : 'lucide:moon'" />
</button>
```

### 3. 键盘导航
```css
.nav-link:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 4px;
}
```

## 测试清单

### 设备测试
- [ ] iPhone SE (375px)
- [ ] iPhone 12/13/14 (390px)
- [ ] iPhone 14 Pro Max (430px)
- [ ] iPad Mini (768px)
- [ ] iPad Pro (1024px)
- [ ] Desktop (1920px)

### 功能测试
- [ ] 导航菜单展开/收起
- [ ] 主题切换
- [ ] 滚动性能
- [ ] 触摸交互
- [ ] 表单输入
- [ ] 图片加载

### 性能测试
- [ ] Lighthouse 移动端评分 > 90
- [ ] First Contentful Paint < 1.8s
- [ ] Time to Interactive < 3.8s
- [ ] Cumulative Layout Shift < 0.1

## 常见问题

### Q: 如何调整整体配色？
A: 修改 `app/assets/design-system.css` 中的颜色变量即可。

### Q: 如何添加新的断点？
A: 在 `design-system.css` 中添加新的 `@media` 查询。

### Q: 如何优化移动端性能？
A: 
1. 减少动画复杂度
2. 使用 `will-change` 提示浏览器
3. 懒加载图片和组件
4. 压缩字体文件

### Q: 如何测试暗色模式？
A: 
```javascript
// 在浏览器控制台
localStorage.setItem('theme', 'dark')
location.reload()
```

## 下一步优化

- [ ] 添加骨架屏加载
- [ ] 实现虚拟滚动（长列表）
- [ ] 添加 PWA 支持
- [ ] 优化图片格式（WebP/AVIF）
- [ ] 实现代码分割
- [ ] 添加预加载提示
