# Violet Flux 设计指南

## 配色方案

### 统一配置位置
所有颜色配置集中在 `app/assets/design-system.css` 文件中。

### 主色调（Pink/Rose）
```css
--primary-500: #ec4899  /* 主要品牌色 */
--primary-600: #db2777  /* 悬停状态 */
--primary-700: #be185d  /* 按下状态 */
```

### 使用方式
```css
/* 推荐：使用语义化变量 */
color: var(--primary);
background: var(--bg-primary);
border: 1px solid var(--border-light);

/* 避免：直接使用颜色值 */
color: #ec4899; /* ❌ */
```

## 响应式断点

```css
/* 移动端优先 */
@media (max-width: 640px)  { /* 手机 */ }
@media (max-width: 768px)  { /* 平板竖屏 */ }
@media (max-width: 1024px) { /* 平板横屏/小笔记本 */ }
@media (max-width: 1280px) { /* 笔记本 */ }
```

## 间距系统

```css
--space-xs:  0.5rem  /* 8px */
--space-sm:  1rem    /* 16px */
--space-md:  1.5rem  /* 24px */
--space-lg:  2rem    /* 32px */
--space-xl:  3rem    /* 48px */
--space-2xl: 4rem    /* 64px */
--space-3xl: 6rem    /* 96px */
```

## 字体系统

### 字体家族
- **正文**: Geist Sans (var(--font-sans))
- **标题**: Bricolage Grotesque (var(--font-display))
- **代码**: Fira Code (var(--font-mono))

### 字体大小
```css
--text-xs:   0.75rem   /* 12px */
--text-sm:   0.875rem  /* 14px */
--text-base: 1rem      /* 16px */
--text-lg:   1.125rem  /* 18px */
--text-xl:   1.25rem   /* 20px */
--text-2xl:  1.5rem    /* 24px */
--text-3xl:  1.875rem  /* 30px */
--text-4xl:  2.25rem   /* 36px */
--text-5xl:  3rem      /* 48px */
--text-6xl:  3.75rem   /* 60px */
```

## 组件样式

### 玻璃态卡片
```vue
<div class="glass-card">
  <!-- 内容 -->
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
<h1 class="text-gradient">渐变文字</h1>
```

## 移动端优化清单

### 1. 导航栏
- [x] 移动端汉堡菜单
- [x] 固定顶部导航
- [x] 触摸友好的按钮尺寸（最小 44x44px）

### 2. 排版
- [x] 响应式字体大小
- [x] 移动端行高调整（1.6 → 1.8）
- [x] 合适的段落间距

### 3. 布局
- [x] 单列布局（移动端）
- [x] 侧边栏自动隐藏
- [x] 响应式间距

### 4. 交互
- [x] 触摸友好的链接区域
- [x] 平滑滚动
- [x] 防止横向滚动

### 5. 性能
- [x] 字体预加载
- [x] 图片懒加载
- [x] 减少动画复杂度

## 暗色模式

### 切换方式
```javascript
import { isDark, toggleDark } from '~/composables/useTheme'

// 切换主题
toggleDark()

// 检查当前主题
if (isDark.value) {
  // 暗色模式
}
```

### 颜色对比
确保暗色模式下的对比度符合 WCAG AA 标准（至少 4.5:1）。

## 最佳实践

### 1. 使用语义化变量
```css
/* ✅ 好 */
color: var(--text-primary);
background: var(--bg-secondary);

/* ❌ 差 */
color: #171717;
background: #fafafa;
```

### 2. 移动端优先
```css
/* ✅ 好 - 移动端优先 */
.element {
  font-size: 1rem;
}

@media (min-width: 768px) {
  .element {
    font-size: 1.25rem;
  }
}

/* ❌ 差 - 桌面端优先 */
.element {
  font-size: 1.25rem;
}

@media (max-width: 768px) {
  .element {
    font-size: 1rem;
  }
}
```

### 3. 避免硬编码
```css
/* ✅ 好 */
padding: var(--space-md);
border-radius: var(--radius-lg);

/* ❌ 差 */
padding: 24px;
border-radius: 16px;
```

## 调整配色方案

如需调整整体配色，只需修改 `app/assets/design-system.css` 中的颜色变量：

```css
:root {
  /* 修改主色调 */
  --primary-500: #your-color;
  --primary-600: #your-darker-color;
  
  /* 其他颜色会自动适配 */
}
```

## 测试清单

- [ ] 在 iPhone SE (375px) 上测试
- [ ] 在 iPad (768px) 上测试
- [ ] 在桌面 (1920px) 上测试
- [ ] 测试暗色模式
- [ ] 测试触摸交互
- [ ] 检查文字可读性
- [ ] 验证颜色对比度
