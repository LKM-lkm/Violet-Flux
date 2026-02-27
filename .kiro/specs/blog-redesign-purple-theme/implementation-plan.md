# 博客紫色主题实现计划

## 概述
本文档详细说明如何按阶段实现紫色主题的博客重设计，确保每个步骤都可验证和回滚。

## 实现策略
- **渐进式实现**: 分阶段完成，每个阶段独立可测试
- **向后兼容**: 保持现有功能不受影响
- **性能优先**: 确保每次改动不降低性能
- **可回滚**: 每个阶段完成后提交，便于回滚

---

## Phase 1: 颜色系统更新 (预计 1 小时)

### 目标
更新设计系统中的所有颜色变量，建立紫色调色板基础。

### 文件清单
- `app/assets/design-system.css`
- `tailwind.config.ts`

### 详细步骤

#### 1.1 更新 design-system.css

**需要替换的颜色变量:**

```css
/* 亮色模式 - 主色调 */
--primary: #b497d7;           /* 替换 #701a45 */
--primary-hover: #c2a9e4;     /* 替换 #9d174d */
--primary-glow: rgba(180, 151, 215, 0.3);
--primary-light: rgba(180, 151, 215, 0.1);

--secondary: #a682cf;         /* 新增 */
--accent: #c2a9e4;            /* 替换 #9d174d */

/* 背景色 */
--bg: #faf8fc;                /* 替换 #ffffff */
--bg-primary: #faf8fc;
--bg-secondary: #f3eef8;      /* 替换 #fff5f8 */
--bg-tertiary: #ebe4f2;       /* 替换 #fef0f5 */

/* 文本色 */
--text: #2d1b3d;              /* 替换 #1a0210 */
--text-primary: #2d1b3d;
--text-secondary: #6b5578;    /* 替换 #6b5161 */
--text-tertiary: #a087b4;     /* 替换 #9b8191 */
--text-muted: #6b5578;

/* 边框色 */
--border: rgba(180, 151, 215, 0.2);
--border-light: rgba(180, 151, 215, 0.15);
--border-medium: rgba(180, 151, 215, 0.25);
--border-strong: rgba(180, 151, 215, 0.35);

/* 毛玻璃效果 */
--glass-bg: rgba(250, 248, 252, 0.7);
--glass-border: rgba(180, 151, 215, 0.2);

/* 阴影 */
--card-shadow: 0 20px 50px -12px rgba(180, 151, 215, 0.2);
--shadow-sm: 0 2px 8px rgba(180, 151, 215, 0.08);
--shadow-md: 0 4px 16px rgba(180, 151, 215, 0.12);
--shadow-lg: 0 8px 24px rgba(180, 151, 215, 0.16);
--shadow-xl: 0 12px 32px rgba(180, 151, 215, 0.2);
--shadow-2xl: 0 20px 48px rgba(180, 151, 215, 0.25);

/* 代码块 */
--code-bg: #f3eef8;
--code-text: #2d1b3d;
```

**暗色模式颜色:**

```css
:root.dark {
  --bg: #1a0f21;
  --bg-primary: #1a0f21;
  --bg-secondary: #2d1b3d;
  --bg-tertiary: #3d2a4d;
  
  --text: #e8dff0;
  --text-primary: #e8dff0;
  --text-secondary: #b8a5c9;
  --text-tertiary: #8a7299;
  --text-muted: #b8a5c9;
  
  --primary: #c2a9e4;
  --primary-hover: #d4c0ed;
  --primary-glow: rgba(194, 169, 228, 0.4);
  --primary-light: rgba(194, 169, 228, 0.15);
  
  --secondary: #b497d7;
  --accent: #d4c0ed;
  
  --border: rgba(194, 169, 228, 0.25);
  --border-light: rgba(194, 169, 228, 0.2);
  --border-medium: rgba(194, 169, 228, 0.3);
  --border-strong: rgba(194, 169, 228, 0.4);
  
  --glass-bg: rgba(26, 15, 33, 0.8);
  --glass-border: rgba(194, 169, 228, 0.15);
  
  --card-shadow: 0 20px 50px -12px rgba(0, 0, 0, 0.6);
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.4);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.5);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.6);
  --shadow-xl: 0 12px 32px rgba(0, 0, 0, 0.7);
  --shadow-2xl: 0 20px 48px rgba(0, 0, 0, 0.8);
  
  --code-bg: #2d1b3d;
  --code-text: #e8dff0;
}
```

#### 1.2 更新 tailwind.config.ts

```typescript
colors: {
  primary: {
    DEFAULT: '#b497d7',
    50: '#faf8fc',
    100: '#f3eef8',
    200: '#ebe4f2',
    300: '#d4c0ed',
    400: '#c2a9e4',
    500: '#b497d7',
    600: '#a682cf',
    700: '#9163c0',
    800: '#7743a3',
    900: '#4c2c4f',
    950: '#2d1b3d',
  },
}
```

### 验收标准
- [ ] 所有页面颜色更新为紫色调
- [ ] 亮色模式对比度符合 WCAG AA 标准
- [ ] 暗色模式正常工作
- [ ] 没有遗留的旧颜色（红色/酒红色）

### 测试步骤
1. 启动开发服务器
2. 检查首页、博客列表、文章详情页
3. 切换暗色模式
4. 使用浏览器开发工具检查 CSS 变量

---

## Phase 2: 博客列表页重设计 (预计 2 小时)

### 目标
重新设计博客列表页，应用紫色主题和新的视觉效果。

### 文件清单
- `app/pages/blog/index.vue`

### 详细步骤

#### 2.1 更新流体背景

**替换 blob 颜色:**
```vue
<style scoped>
.blob-1 {
  background: radial-gradient(circle, #b497d7, #a682cf);
  opacity: 0.3;
}

.blob-2 {
  background: radial-gradient(circle, #c2a9e4, #b497d7);
  opacity: 0.25;
}

/* 新增第三个 blob */
.blob-3 {
  width: 450px;
  height: 450px;
  background: radial-gradient(circle, #9163c0, #7743a3);
  top: 40%;
  left: 50%;
  opacity: 0.2;
  animation: blob-float 25s infinite alternate ease-in-out;
  animation-delay: -5s;
}
</style>
```

#### 2.2 优化侧边栏样式

**增强毛玻璃效果:**
```vue
<style scoped>
.sidebar {
  background: var(--glass-bg);
  backdrop-filter: blur(24px) saturate(200%);
  -webkit-backdrop-filter: blur(24px) saturate(200%);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-xl),
              inset 0 1px 0 rgba(255, 255, 255, 0.1),
              0 0 20px rgba(180, 151, 215, 0.15);
}

.section-title {
  color: var(--primary);
  text-shadow: 0 0 10px var(--primary-glow);
}

.tree-root-btn.active {
  background: linear-gradient(135deg, 
    rgba(180, 151, 215, 0.15), 
    rgba(194, 169, 228, 0.1)
  );
  color: var(--primary);
  box-shadow: inset 0 0 12px rgba(180, 151, 215, 0.2);
}
</style>
```

#### 2.3 重新设计文章卡片

**添加渐变边框和光晕:**
```vue
<style scoped>
.blog-card {
  position: relative;
  background: var(--glass-bg);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid transparent;
  border-radius: var(--radius-xl);
  overflow: hidden;
}

.blog-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: var(--radius-xl);
  padding: 1px;
  background: linear-gradient(135deg, 
    rgba(180, 151, 215, 0.3), 
    rgba(194, 169, 228, 0.2),
    rgba(166, 130, 207, 0.3)
  );
  -webkit-mask: 
    linear-gradient(#fff 0 0) content-box, 
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

.blog-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: var(--shadow-2xl),
              0 0 32px rgba(180, 151, 215, 0.4);
}

.blog-card:hover::before {
  background: linear-gradient(135deg, 
    rgba(180, 151, 215, 0.5), 
    rgba(194, 169, 228, 0.4),
    rgba(166, 130, 207, 0.5)
  );
}
</style>
```

#### 2.4 优化标签样式

```vue
<style scoped>
.tag-chip {
  background: linear-gradient(135deg, 
    rgba(180, 151, 215, 0.1), 
    rgba(194, 169, 228, 0.15)
  );
  color: var(--primary);
  border: 1px solid var(--border-light);
  font-weight: 600;
  transition: all var(--duration-normal);
}

.tag-chip:hover {
  background: var(--primary);
  color: white;
  box-shadow: 0 4px 12px rgba(180, 151, 215, 0.4);
  transform: translateY(-2px);
}

.tag-btn.active {
  background: linear-gradient(135deg, #b497d7, #a682cf);
  color: white;
  border-color: transparent;
  box-shadow: 0 8px 20px rgba(180, 151, 215, 0.4);
}
</style>
```

### 验收标准
- [ ] 流体背景使用紫色调
- [ ] 侧边栏有明显的毛玻璃效果
- [ ] 文章卡片有渐变边框
- [ ] 悬停效果平滑且有光晕
- [ ] 标签样式统一且美观

---

## Phase 3: 文章详情页优化 (预计 1 小时)

### 目标
更新文章详情页的视觉样式，保持与列表页一致。

### 文件清单
- `app/pages/blog/[...slug].vue`

### 详细步骤

#### 3.1 更新 TOC 样式

```vue
<style scoped>
.toc-wrapper {
  background: var(--glass-bg);
  backdrop-filter: blur(24px) saturate(200%);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-xl),
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.toc-wrapper::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at top right,
    rgba(180, 151, 215, 0.08) 0%,
    rgba(194, 169, 228, 0.05) 35%,
    transparent 65%
  );
  border-radius: var(--radius-xl);
  pointer-events: none;
}

.active-indicator {
  background: linear-gradient(180deg, #b497d7, #9163c0);
  box-shadow: 0 0 12px rgba(180, 151, 215, 0.6);
}

.toc-list li.active .toc-link {
  color: var(--primary);
  font-weight: 600;
  text-shadow: 0 0 8px rgba(180, 151, 215, 0.3);
}
</style>
```

#### 3.2 优化文章标题

```vue
<style scoped>
.article-title {
  background: linear-gradient(135deg, 
    var(--text-primary) 0%,
    #b497d7 50%,
    #9163c0 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.article-title::after {
  background: linear-gradient(90deg, 
    #b497d7 0%,
    #c2a9e4 50%,
    transparent 100%
  );
  box-shadow: 0 0 16px rgba(180, 151, 215, 0.6);
}
</style>
```

#### 3.3 更新标签样式

```vue
<style scoped>
.tag-label {
  background: linear-gradient(135deg, 
    rgba(180, 151, 215, 0.1), 
    rgba(194, 169, 228, 0.15)
  );
  color: var(--primary);
  border: 1px solid var(--border-light);
}

.tag-label:hover {
  background: linear-gradient(135deg, #b497d7, #a682cf);
  color: white;
  box-shadow: 0 4px 16px rgba(180, 151, 215, 0.5);
}
</style>
```

#### 3.4 优化引用块样式

```vue
<style scoped>
.article-body :deep(blockquote) {
  border-left: 4px solid var(--primary);
  background: linear-gradient(135deg,
    rgba(250, 248, 252, 0.9) 0%,
    rgba(243, 238, 248, 0.7) 40%,
    rgba(235, 228, 242, 0.6) 70%,
    rgba(235, 228, 242, 0.5) 100%
  );
  box-shadow: var(--shadow-md),
              inset 4px 0 0 var(--primary);
}

.article-body :deep(blockquote)::before {
  color: var(--primary);
  opacity: 0.1;
}

.article-body :deep(blockquote)::after {
  background: radial-gradient(
    circle at bottom right,
    rgba(180, 151, 215, 0.15),
    transparent 70%
  );
}
</style>
```

### 验收标准
- [ ] TOC 有紫色活动指示器
- [ ] 文章标题有渐变效果
- [ ] 标签悬停有光晕
- [ ] 引用块样式优雅

---

## Phase 4: 组件优化 (预计 1 小时)

### 目标
更新所有相关组件的样式，确保整体一致性。

### 4.1 ContentSearch 组件

**文件**: `app/components/ContentSearch.vue`

```vue
<style scoped>
.search-container {
  background: var(--glass-bg);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-lg),
              0 0 20px rgba(180, 151, 215, 0.15);
}

.search-input:focus {
  outline: 2px solid var(--primary);
  outline-offset: -2px;
}

.search-results {
  background: var(--glass-bg);
  backdrop-filter: blur(24px) saturate(200%);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-xl);
}

.search-result-item:hover {
  background: linear-gradient(135deg, 
    rgba(180, 151, 215, 0.15), 
    rgba(194, 169, 228, 0.1)
  );
}

.search-highlight {
  color: var(--primary);
  font-weight: 700;
  background: rgba(180, 151, 215, 0.2);
  padding: 0 0.2em;
  border-radius: 2px;
}
</style>
```

### 4.2 ArticleNavigation 组件

**文件**: `app/components/ArticleNavigation.vue`

```vue
<style scoped>
.nav-link {
  background: var(--glass-bg);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-md);
  transition: all var(--duration-normal);
}

.nav-link:hover {
  background: linear-gradient(135deg, 
    rgba(180, 151, 215, 0.15), 
    rgba(194, 169, 228, 0.1)
  );
  border-color: var(--primary);
  box-shadow: var(--shadow-lg),
              0 0 20px rgba(180, 151, 215, 0.3);
  transform: translateY(-2px);
}

.nav-link-title {
  color: var(--primary);
}
</style>
```

### 4.3 TreeItem 组件

**文件**: `app/components/TreeItem.vue`

```vue
<style scoped>
.tree-item.active {
  background: linear-gradient(135deg, 
    rgba(180, 151, 215, 0.15), 
    rgba(194, 169, 228, 0.1)
  );
  color: var(--primary);
  border-left: 3px solid var(--primary);
  box-shadow: inset 0 0 12px rgba(180, 151, 215, 0.2);
}

.tree-item:hover {
  background: rgba(180, 151, 215, 0.08);
}

.folder-icon {
  color: var(--primary);
}
</style>
```

### 验收标准
- [ ] 搜索框有毛玻璃效果
- [ ] 翻页组件悬停有光晕
- [ ] 树形导航活动状态明显
- [ ] 所有组件风格统一

---

## Phase 5: 测试和调整 (预计 1 小时)

### 5.1 响应式测试

**测试设备尺寸:**
- 手机: 375px, 414px
- 平板: 768px, 1024px
- 桌面: 1280px, 1920px

**检查项:**
- [ ] 布局不破坏
- [ ] 文字可读
- [ ] 触摸目标足够大
- [ ] 图片自适应

### 5.2 暗色模式测试

**检查项:**
- [ ] 所有颜色正确切换
- [ ] 对比度足够
- [ ] 毛玻璃效果正常
- [ ] 阴影可见

### 5.3 性能测试

**使用 Lighthouse 测试:**
- [ ] Performance > 90
- [ ] Accessibility > 90
- [ ] Best Practices > 90
- [ ] SEO > 90

**关键指标:**
- [ ] FCP < 1.5s
- [ ] LCP < 2.5s
- [ ] CLS < 0.1
- [ ] TTI < 3.5s

### 5.4 浏览器兼容性

**测试浏览器:**
- [ ] Chrome (最新版)
- [ ] Firefox (最新版)
- [ ] Safari (最新版)
- [ ] Edge (最新版)

**检查项:**
- [ ] backdrop-filter 正常工作
- [ ] 渐变显示正确
- [ ] 动画流畅
- [ ] 字体加载正常

### 5.5 可访问性测试

**工具:**
- axe DevTools
- WAVE
- 键盘导航

**检查项:**
- [ ] 颜色对比度 WCAG AA
- [ ] 键盘可访问所有功能
- [ ] 焦点状态清晰
- [ ] ARIA 标签正确
- [ ] 屏幕阅读器友好

---

## 回滚计划

### 如果需要回滚

**Phase 1 回滚:**
```bash
git checkout HEAD -- app/assets/design-system.css tailwind.config.ts
```

**Phase 2 回滚:**
```bash
git checkout HEAD -- app/pages/blog/index.vue
```

**Phase 3 回滚:**
```bash
git checkout HEAD -- app/pages/blog/[...slug].vue
```

**Phase 4 回滚:**
```bash
git checkout HEAD -- app/components/ContentSearch.vue app/components/ArticleNavigation.vue app/components/TreeItem.vue
```

---

## 完成标准

### 所有阶段完成后

- [ ] 所有页面使用紫色主题
- [ ] 视觉效果统一且优雅
- [ ] 性能指标达标
- [ ] 可访问性符合标准
- [ ] 响应式设计完善
- [ ] 暗色模式正常工作
- [ ] 浏览器兼容性良好
- [ ] 代码质量高，易维护

### 文档更新

- [ ] 更新 README.md 中的设计说明
- [ ] 创建 CHANGELOG.md 记录变更
- [ ] 更新组件文档
- [ ] 添加设计系统文档

---

**实现版本**: 1.0  
**创建日期**: 2026-02-28  
**预计完成**: 2026-02-28  
**状态**: 待开始
