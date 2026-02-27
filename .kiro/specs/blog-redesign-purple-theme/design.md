# 博客紫色主题设计文档

## 1. 设计概览

### 1.1 设计理念
- **浪漫朦胧**: 使用渐变、模糊和柔和的紫色调营造梦幻氛围
- **精确稳定**: 采用 CSS Grid 和精确的间距系统确保布局稳定
- **神秘优雅**: 通过光晕效果、阴影和透明度创造深度感
- **现代简洁**: 保持界面清爽，避免过度装饰

### 1.2 核心视觉元素
1. 紫色渐变背景（流体动画）
2. 毛玻璃卡片（backdrop-filter）
3. 柔和的阴影和光晕
4. 平滑的过渡动画
5. 精确的网格布局

## 2. 颜色系统设计

### 2.1 主色调映射
```css
/* 主色 - 用于主要 UI 元素 (31.88%) */
--primary: #b497d7;
--primary-hover: #c2a9e4;
--primary-glow: rgba(180, 151, 215, 0.3);

/* 次色 - 用于次要元素 (23.32%) */
--secondary: #a682cf;
--secondary-hover: #b497d7;
--secondary-glow: rgba(166, 130, 207, 0.25);

/* 高亮色 - 用于悬停和强调 (16.4%) */
--accent: #c2a9e4;
--accent-hover: #d4c0ed;

--accent-glow: rgba(194, 169, 228, 0.2);

/* 深紫色 - 用于按钮和链接 (9.93%) */
--deep-purple: #9163c0;
--deep-purple-hover: #a682cf;

/* 灰紫色 - 用于文本和边框 (9.38%) */
--muted-purple: #a087b4;
--border-purple: rgba(160, 135, 180, 0.3);

/* 深色调 - 用于暗色模式 */
--dark-purple-1: #7743a3;  /* 4.55% */
--dark-purple-2: #837081;  /* 3.37% */
--dark-purple-3: #4c2c4f;  /* 1.19% */
```

### 2.2 语义化颜色
```css
/* 亮色模式 */
--bg-primary: #faf8fc;        /* 极浅紫白 */
--bg-secondary: #f3eef8;      /* 浅紫灰 */
--bg-tertiary: #ebe4f2;       /* 紫灰 */

--text-primary: #2d1b3d;      /* 深紫黑 */
--text-secondary: #6b5578;    /* 中紫灰 */
--text-tertiary: #a087b4;     /* 浅紫灰 */

--glass-bg: rgba(250, 248, 252, 0.7);
--glass-border: rgba(180, 151, 215, 0.2);

/* 暗色模式 */
--bg-primary-dark: #1a0f21;   /* 深紫黑 */
--bg-secondary-dark: #2d1b3d; /* 中紫黑 */
--bg-tertiary-dark: #3d2a4d;  /* 浅紫黑 */

--text-primary-dark: #e8dff0;
--text-secondary-dark: #b8a5c9;
--text-tertiary-dark: #8a7299;

--glass-bg-dark: rgba(26, 15, 33, 0.8);
--glass-border-dark: rgba(180, 151, 215, 0.15);
```

## 3. 布局系统设计

### 3.1 间距系统（8px 基准）
```css
--space-1: 4px;   /* 0.25rem */
--space-2: 8px;   /* 0.5rem */
--space-3: 12px;  /* 0.75rem */
--space-4: 16px;  /* 1rem */
--space-6: 24px;  /* 1.5rem */
--space-8: 32px;  /* 2rem */
--space-12: 48px; /* 3rem */
--space-16: 64px; /* 4rem */
--space-24: 96px; /* 6rem */
```

### 3.2 圆角系统
```css
--radius-xs: 4px;
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 16px;
--radius-xl: 20px;
--radius-2xl: 24px;
--radius-full: 9999px;
```

### 3.3 阴影系统
```css
--shadow-sm: 0 2px 8px rgba(180, 151, 215, 0.08);
--shadow-md: 0 4px 16px rgba(180, 151, 215, 0.12);
--shadow-lg: 0 8px 24px rgba(180, 151, 215, 0.16);
--shadow-xl: 0 12px 32px rgba(180, 151, 215, 0.2);
--shadow-2xl: 0 20px 48px rgba(180, 151, 215, 0.25);

/* 光晕效果 */
--glow-sm: 0 0 12px rgba(180, 151, 215, 0.4);
--glow-md: 0 0 20px rgba(180, 151, 215, 0.5);
--glow-lg: 0 0 32px rgba(180, 151, 215, 0.6);
```

### 3.4 响应式断点
```css
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
--breakpoint-2xl: 1536px;
```

## 4. 组件设计规范

### 4.1 博客列表页 (blog/index.vue)

#### 布局结构
```
┌─────────────────────────────────────────┐
│           Header (固定顶部)              │
├─────────────┬───────────────────────────┤
│             │                           │
│  Sidebar    │    Main Content           │
│  (320px)    │    (flex-1)               │
│             │                           │
│  - 导航树   │  - 路径面包屑             │
│  - 标签云   │  - 搜索框 (sticky)        │
│             │  - 文章卡片网格           │
│             │                           │
└─────────────┴───────────────────────────┘
```

#### 侧边栏设计
- 宽度: 320px
- 粘性定位: top: 5rem
- 背景: 毛玻璃效果
- 圆角: var(--radius-xl)
- 内边距: var(--space-8)
- 阴影: var(--shadow-lg) + 内光晕

#### 文章卡片设计
- 网格: `grid-template-columns: repeat(auto-fill, minmax(380px, 1fr))`
- 间距: var(--space-8)
- 背景: 毛玻璃 + 紫色渐变边框
- 悬停效果: 
  - 上移 8px
  - 阴影增强到 var(--shadow-2xl)
  - 添加紫色光晕
  - scale(1.02)
- 内部结构:
  ```
  ┌─────────────────────────┐
  │ Meta (分类标签)         │
  │ Title (大标题)          │
  │ Description (描述)      │
  │ ─────────────────────── │
  │ Tags | Read More →      │
  └─────────────────────────┘
  ```

### 4.2 文章详情页 (blog/[...slug].vue)

#### 布局结构
```
┌─────────────────────────────────────────┐
│           Header (固定顶部)              │
├─────────────┬───────────────────────────┤
│             │                           │
│  TOC        │    Article Content        │
│  (260px)    │    (max-width: 800px)     │
│  (sticky)   │                           │
│             │  - 返回链接               │
│             │  - 文章标题               │
│             │  - 标签                   │
│             │  - AI 摘要                │
│             │  - 正文内容               │
│             │  - 翻页导航               │
│             │  - 相关文章               │
│             │  - 评论区                 │
│             │                           │
└─────────────┴───────────────────────────┘
```

#### 目录 (TOC) 设计
- 毛玻璃卡片
- 活动指示器: 3px 宽紫色渐变条
- 平滑滚动动画
- 层级缩进: 每级 12px

#### 文章标题设计
- 字体: var(--font-display)
- 大小: clamp(2.5rem, 5vw, 4rem)
- 渐变色: 从 text-primary 到 primary
- 下划线: 140px 宽渐变条 + 光晕

### 4.3 搜索组件 (ContentSearch.vue)

#### 设计规范
- 宽度: 320px
- 粘性定位: top: 100px
- 背景: 毛玻璃 + 紫色边框
- 圆角: var(--radius-lg)
- 图标: 左侧 lucide:search
- 输入框: 透明背景，紫色焦点环
- 下拉结果:
  - 毛玻璃背景
  - 每项悬停: 紫色背景
  - 高亮匹配文本: 紫色加粗

### 4.4 翻页组件 (ArticleNavigation.vue)

#### 设计规范
```
┌──────────────────┬──────────────────┐
│  ← Previous      │      Next →      │
│  文章标题        │      文章标题    │
└──────────────────┴──────────────────┘
```
- 网格: 2 列等宽
- 间距: var(--space-6)
- 每个按钮:
  - 毛玻璃背景
  - 紫色边框
  - 圆角: var(--radius-lg)
  - 内边距: var(--space-6)
  - 悬停: 紫色背景 + 光晕

## 5. 动画设计

### 5.1 过渡时长
```css
--duration-fast: 150ms;
--duration-normal: 250ms;
--duration-slow: 400ms;
```

### 5.2 缓动函数
```css
--ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
--ease-elastic: cubic-bezier(0.175, 0.885, 0.32, 1.275);
```

### 5.3 关键动画

#### 流体背景动画
```css
@keyframes blob-float {
  0%, 100% { 
    transform: translate(0, 0) scale(1) rotate(0deg);
  }
  33% { 
    transform: translate(30px, -40px) scale(1.1) rotate(120deg);
  }
  66% { 
    transform: translate(-20px, 20px) scale(0.95) rotate(240deg);
  }
}
```

#### 卡片悬停动画
```css
.card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: var(--shadow-2xl), var(--glow-md);
  transition: all var(--duration-normal) var(--ease-smooth);
}
```

#### 光晕脉动动画
```css
@keyframes glow-pulse {
  0%, 100% { 
    box-shadow: 0 0 20px rgba(180, 151, 215, 0.4);
  }
  50% { 
    box-shadow: 0 0 40px rgba(180, 151, 215, 0.6);
  }
}
```

## 6. 毛玻璃效果规范

### 6.1 标准毛玻璃
```css
.glass-card {
  background: var(--glass-bg);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-lg),
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
}
```

### 6.2 增强毛玻璃（重要元素）
```css
.glass-card-enhanced {
  background: var(--glass-bg);
  backdrop-filter: blur(24px) saturate(200%);
  -webkit-backdrop-filter: blur(24px) saturate(200%);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-xl),
              inset 0 1px 0 rgba(255, 255, 255, 0.15),
              var(--glow-sm);
}
```

## 7. 渐变设计

### 7.1 背景渐变
```css
/* 主背景渐变 */
background: linear-gradient(
  135deg,
  #faf8fc 0%,
  #f3eef8 50%,
  #ebe4f2 100%
);

/* 卡片背景渐变 */
background: linear-gradient(
  135deg,
  rgba(250, 248, 252, 0.9) 0%,
  rgba(243, 238, 248, 0.8) 100%
);
```

### 7.2 文字渐变
```css
.text-gradient {
  background: linear-gradient(
    135deg,
    #b497d7 0%,
    #9163c0 50%,
    #7743a3 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

### 7.3 边框渐变
```css
.border-gradient {
  border: 2px solid transparent;
  background: 
    linear-gradient(var(--bg-primary), var(--bg-primary)) padding-box,
    linear-gradient(135deg, #b497d7, #9163c0) border-box;
}
```

## 8. 流体背景设计

### 8.1 Blob 元素
```css
.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.3;
  animation: blob-float 20s infinite alternate ease-in-out;
}

.blob-1 {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, #b497d7, #a682cf);
  top: -10%;
  right: -5%;
}

.blob-2 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, #c2a9e4, #b497d7);
  bottom: -5%;
  left: 5%;
  animation-delay: -10s;
}

.blob-3 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, #9163c0, #7743a3);
  top: 40%;
  left: 50%;
  animation-delay: -5s;
}
```

### 8.2 噪点纹理
```css
.noise-overlay {
  position: absolute;
  inset: 0;
  background-image: url('data:image/svg+xml,...');
  opacity: 0.03;
  mix-blend-mode: overlay;
  pointer-events: none;
}
```

### 8.3 网格背景
```css
.grid-overlay {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(var(--border-purple) 1px, transparent 1px),
    linear-gradient(90deg, var(--border-purple) 1px, transparent 1px);
  background-size: 40px 40px;
  opacity: 0.15;
  pointer-events: none;
}
```

## 9. 可访问性设计

### 9.1 颜色对比度
- 正文文本: 至少 4.5:1 (WCAG AA)
- 大文本: 至少 3:1
- UI 组件: 至少 3:1

### 9.2 焦点状态
```css
:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}
```

### 9.3 键盘导航
- 所有交互元素可通过 Tab 访问
- 焦点顺序符合逻辑
- 提供跳过导航链接

## 10. 性能优化

### 10.1 CSS 优化
- 使用 `will-change` 提示浏览器
- 避免复杂的 box-shadow 和 filter
- 使用 `transform` 和 `opacity` 实现动画
- 合理使用 `contain` 属性

### 10.2 动画优化
```css
.optimized-animation {
  will-change: transform, opacity;
  transform: translateZ(0);
  backface-visibility: hidden;
}
```

## 11. 实现优先级

### Phase 1: 颜色系统 (1 小时)
- [ ] 更新 design-system.css 中的所有颜色变量
- [ ] 更新 tailwind.config.ts 中的紫色调色板
- [ ] 测试亮色和暗色模式

### Phase 2: 博客列表页 (2 小时)
- [ ] 更新侧边栏样式（毛玻璃 + 紫色主题）
- [ ] 重新设计文章卡片（渐变边框 + 光晕效果）
- [ ] 优化标签云样式
- [ ] 更新流体背景（紫色 blob）

### Phase 3: 文章详情页 (1 小时)
- [ ] 更新 TOC 样式（紫色指示器）
- [ ] 优化文章标题（渐变 + 下划线）
- [ ] 更新代码块样式
- [ ] 优化引用块样式

### Phase 4: 组件优化 (1 小时)
- [ ] ContentSearch 组件紫色主题
- [ ] ArticleNavigation 组件紫色主题
- [ ] TreeItem 组件紫色主题
- [ ] 其他小组件

### Phase 5: 测试和调整 (1 小时)
- [ ] 响应式测试（手机、平板、桌面）
- [ ] 暗色模式测试
- [ ] 性能测试（Lighthouse）
- [ ] 可访问性测试
- [ ] 浏览器兼容性测试

## 12. 设计检查清单

### 视觉一致性
- [ ] 所有颜色来自定义的紫色调色板
- [ ] 间距使用 8px 基准系统
- [ ] 圆角统一使用设计令牌
- [ ] 阴影层次清晰

### 交互体验
- [ ] 所有悬停状态平滑过渡
- [ ] 焦点状态清晰可见
- [ ] 加载状态友好
- [ ] 错误状态明确

### 响应式设计
- [ ] 移动端布局合理
- [ ] 触摸目标至少 44x44px
- [ ] 文字大小适中
- [ ] 图片自适应

### 性能指标
- [ ] FCP < 1.5s
- [ ] LCP < 2.5s
- [ ] CLS < 0.1
- [ ] TTI < 3.5s

---

**设计版本**: 1.0  
**创建日期**: 2026-02-28  
**设计师**: Kiro AI  
**状态**: 待实现
