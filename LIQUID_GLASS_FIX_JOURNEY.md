# 修复 Liquid Glass 液态玻璃折射效果：从透明到折射的完整排查之路

> 记录 Violet Flux 项目中 Apple 风格液态玻璃效果从"完全透明"到"正确折射"的深度调试过程。

## 问题描述

在 Nuxt 4 静态博客中集成 [liquid-glass](https://github.com/deepika-builds/liquid-glass) 库后，主页三张特色卡片始终呈现**完全透明玻璃状**——背景网格线笔直穿过卡片，无任何弯曲/折射/模糊效果。

该问题在多次修复尝试中反复出现，包括：
- 修复 `defer` 脚本加载时序
- 移除全局 CSS `backdrop-filter` 冲突
- 等待入场动画完成后再应用效果

但效果始终不稳定或完全不生效。

## 技术背景

### liquid-glass 的工作原理

```
Canvas 生成位移贴图 → data URI → SVG feImage 加载
→ feDisplacementMap (×3, RGB 通道分离) → feColorMatrix → feBlend
→ 通过 backdrop-filter: url(#id) blur() saturate() 应用到元素
```

关键点：`backdrop-filter` 从元素**背后**的所有已渲染内容中采样，经过 SVG 滤镜处理后显示。

### 环境

- Chrome/Chromium 148
- Nuxt 4.3.1 + Vue 3.5.27
- Nuxt UI (`<UApp>` 组件)
- liquid-glass.js (原版 GitHub)

## 排查过程

### 第一步：确认 backdrop-filter 基础能力

创建 `position: fixed` 测试元素，应用 `backdrop-filter: blur(20px)`：

**结果**：✅ 磨砂效果清晰可见。backdrop-filter 基础功能正常。

### 第二步：确认 SVG 滤镜在 backdrop-filter 中的支持

创建 SVG `feGaussianBlur` 和 `feTurbulence + feDisplacementMap` 滤镜，通过 `backdrop-filter: url(#id)` 应用：

**结果**：✅ 模糊和扭曲效果均可见。Chrome 148 完全支持 SVG 滤镜引用。

### 第三步：确认 feImage + data URI 的可用性

使用 Canvas 生成与 liquid-glass.js 相同的渐变位移贴图（data URI），通过 `feImage` 加载并应用 `feDisplacementMap`：

**结果**：✅ 所有配置（SVG 0×0、离屏定位、filterUnits 等）均能产生扭曲。feImage + data URI 完全可用。

### 第四步：对比固定元素 vs 页面内卡片

将**相同的 SVG 滤镜**分别应用到：
- A) `position: fixed` 的独立测试元素
- B) 页面内的实际 `.glass-card`

**结果**：
- A) ✅ 产生折射扭曲
- B) ❌ 网格线笔直，无折射

**结论**：问题不在滤镜本身，而在卡片的**祖先环境**。

### 第五步：祖先合成层分析（定位根因）

检查 `.glass-card` 的祖先链中所有创建合成层的属性：

```json
[
  {
    "class": "features-grid animate-fade-in-up",
    "animation": "fade-in-opacity"  // ← 罪魁祸首
  },
  {
    "class": "isolate",
    "isolation": "isolate"  // ← 来自 Nuxt UI <UApp>
  }
]
```

## 根本原因

**CSS `animation` 属性（即使只是 opacity 动画）会让 Chrome 为元素创建持久合成层（compositing layer）。**

当祖先元素处于独立合成层时：
1. 该层内部的内容被单独光栅化
2. 子元素的 `backdrop-filter` 只能从**该合成层内部**采样
3. 页面的实际背景（ambient orbs、网格）在合成层**外部**
4. 结果：`backdrop-filter` 采样到的是空白/透明内容 → 玻璃看起来完全透明

### 为什么 opacity 动画也会触发？

Chrome 的渲染引擎对**任何活跃的 CSS animation** 都会提升元素到独立合成层，这是为了动画性能优化（避免每帧重绘）。即使动画已完成（`animation-fill-mode: forwards`），合成层可能仍然保持。

### `isolation: isolate` 的影响

Nuxt UI 的 `<UApp>` 组件渲染一个 `div.isolate`，设置 `isolation: isolate`。这创建了一个新的堆叠上下文，进一步限制了 backdrop-filter 的采样范围。

## 修复方案

### 核心修复：移除玻璃卡片祖先的动画

```css
/* ❌ 之前：opacity 动画仍然创建合成层 */
.features-grid.animate-fade-in-up {
  animation-name: fade-in-opacity;
}

/* ✅ 修复：完全移除动画 */
.features-grid.animate-fade-in-up {
  animation: none;
  opacity: 1;
}
```

### 辅助修复：移除背景层的 transform/will-change

```css
/* ❌ 之前 */
.ambient-background {
  transform: translateZ(0);
  will-change: transform;
}

/* ✅ 修复：不创建独立合成层 */
.ambient-background {
  position: fixed;
  inset: 0;
  z-index: 0;
  /* 禁止使用 transform / will-change / filter */
}
```

### 组件优化：rAF 确保布局完成

```typescript
// LiquidGlass.vue
function scheduleApply() {
  rafId = requestAnimationFrame(() => {
    applyGlass();
  });
}
```

## 关键教训

### 1. backdrop-filter 的合成层限制

`backdrop-filter` 的采样范围受合成层边界限制。以下属性会在元素上创建合成层，**阻断子元素 backdrop-filter 对外部背景的采样**：

| 属性 | 常见场景 |
|------|----------|
| `transform` (非 none) | 入场动画、居中定位 |
| `will-change: transform/opacity` | 性能优化 |
| `animation` (任何活跃动画) | 入场/循环动画 |
| `filter` (非 none) | 视觉效果 |
| `isolation: isolate` | 堆叠上下文隔离 |
| `contain: paint/layout` | 性能 containment |

### 2. 调试方法论

```
1. 先验证技术本身是否可用（固定定位测试元素）
2. 再对比目标环境是否有差异（页面内 vs 固定定位）
3. 最后检查祖先链的合成层触发器
```

### 3. 不要轻信 getComputedStyle

`getComputedStyle(el).backdropFilter` 返回正确的值 ≠ 效果实际渲染。浏览器会解析并保留 CSS 值，但合成层隔离可能导致实际渲染时无内容可采样。

### 4. 入场动画与 backdrop-filter 不兼容

如果容器需要入场动画且子元素使用 backdrop-filter：
- 方案 A：移除容器动画（本项目采用）
- 方案 B：动画完成后通过 JS 移除 `animation` 属性
- 方案 C：将 backdrop-filter 元素移出动画容器

## 最终效果

修复后，三张卡片在 Chrome/Edge 中呈现：
- ✅ 边缘折射扭曲（网格线在卡片边缘弯曲）
- ✅ 色差棱镜效果（RGB 通道分离）
- ✅ 内部轻微模糊 + 饱和度增强
- ✅ Safari/Firefox 自动降级为磨砂模糊

## 相关文件

| 文件 | 作用 |
|------|------|
| `public/liquid-glass.js` | 原版液态玻璃库（SVG 滤镜生成） |
| `app/components/LiquidGlass.vue` | Vue 包装组件（脚本等待 + rAF） |
| `app/pages/index.vue` | 首页（移除 .features-grid 动画） |
| `app/layouts/default.vue` | 布局（移除背景层 transform） |
| `nuxt.config.ts` | 脚本加载配置（defer） |

## 参考

- [liquid-glass](https://github.com/deepika-builds/liquid-glass) — Apple-style liquid glass for the web
- [Aave: Building glass for the web](https://aave.com/design/building-glass-for-the-web)
- [CSS Compositing and Blending Level 1](https://www.w3.org/TR/compositing-1/)
- [Chrome: GPU Accelerated Compositing](https://chromium.googlesource.com/chromium/src/+/main/docs/gpu/gpu_accelerated_compositing.md)
