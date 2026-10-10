---
title: 液态玻璃 Liquid Glass
description: Violet Flux 中 Apple 风格液态玻璃折射效果的原理、组件用法、实现要点与排查清单
tags: [文档, 视觉效果]
---

液态玻璃（Liquid Glass）是一种 Apple 风格的界面材质：元素背景被真实地**折射、放大并带上边缘色散**，而不是简单地模糊。本项目通过 `public/liquid-glass.js`（原版库，直接引入）实现，并由 `app/components/LiquidGlass.vue` 封装成 Vue 组件使用。

## 原理

```text
Canvas 生成位移贴图 → data URI → SVG feImage
→ feDisplacementMap（×3，RGB 通道分离）→ 颜色合成
→ 元素 backdrop-filter: url(#lg-filter-N) blur() saturate()
```

库在 `<body>` 中插入一个 0×0 的 SVG（`display: none` 会让 `feImage` 失效，所以用尺寸为 0 而不是隐藏），动态生成每个元素专属的滤镜，再由 `backdrop-filter` 对元素**背后已渲染的内容**采样。位移贴图用红/蓝两个渐变通道分别编码 X/Y 位移，中间一块 50% 灰的内缩圆角矩形把折射限制在边缘带内。

## 组件用法

`app/components/LiquidGlass.vue`（自动导入，无需 import）。渲染标签由 `as` 决定，默认 `div`，内容通过默认插槽传入。

### Props

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `as` | `string` | `'div'` | 渲染的标签名，如 `aside`、`article` |
| `scale` | `number` | `-112` | 折射强度，负数为放大凸起；推荐区间 `-60`（微妙）～ `-180`（强烈） |
| `chroma` | `number` | `6` | 每通道缩放错位量（棱镜边缘），`0` 关闭色差 |
| `border` | `number` | `0.07` | 中性内缩比例，占较短边的比例 |
| `mapBlur` | `number` | `12` | 位移贴图灰边的柔化程度（px），小 = 硬边，大 = 圆顶 |
| `blur` | `number` | `3` | 玻璃内部背景模糊（px） |
| `saturate` | `number` | `1.5` | 背景饱和度增强 |
| `radius` | `number \| null` | `null` | 圆角覆盖（px）；为 `null` 时读取元素的 `border-radius`（支持 px 与百分比） |
| `fallbackBlur` | `number` | `16` | Safari/Firefox 降级为磨砂模糊的模糊半径（px） |

以上默认值与 `liquid-glass.js` 内部默认值一致。组件不做额外包装，只把 props 透传；`radius` 仅在显式传入时才加入选项。

### 使用示例

```vue
<template>
  <LiquidGlass
    v-spotlight
    as="article"
    class="glass-card"
    :scale="-160"
    :chroma="4"
    :border="0.02"
    :mapBlur="8"
    :blur="1"
    :saturate="1.5"
  >
    <div class="card-body">内容</div>
  </LiquidGlass>
</template>

<style scoped>
.glass-card {
  border-radius: 28px;
  /* 轻微色调，不要不透明背景，否则折射被挡住 */
  background: linear-gradient(180deg, rgba(14, 14, 22, 0.18), rgba(14, 14, 22, 0.32));
  box-shadow:
    0 24px 60px rgba(0, 0, 0, 0.45),
    inset 0 1px 1px rgba(255, 255, 255, 0.5),
    inset 0 0 0 1px rgba(255, 255, 255, 0.13);
}
</style>
```

`v-spotlight`（`app/plugins/spotlight.ts`）是可选的鼠标跟随高光，与液态玻璃无关，只是常一起使用。

### 项目中已有的用法

| 位置 | 参数要点 |
|------|----------|
| `app/pages/index.vue` 三张特色卡片 | `scale -160`、`chroma 4`、`mapBlur 8`、`blur 1` |
| `app/components/AiSummary.vue` | `scale -120`、`chroma 5`、`border 0.03`、`mapBlur 10`、`blur 2` |
| `app/pages/about.vue` 作者卡与内容卡 | `as="aside"` / `div`，统一 `scale -160`、`blur 1` |
| `app/pages/blog/index.vue` 侧栏 / 头部 / 卡片 | 侧栏 `scale -80`、`blur 2`；卡片 `as="article"`、`scale -160` |
| `app/pages/blog/[...slug].vue` 目录 | `scale -80`、`chroma 3`、`blur 1` |
| `app/components/content/ProseImg.vue` 灯箱 | `scale -140`、`chroma 6`、`mapBlur 12`、`blur 4`、`saturate 1.8` |

## 实现要点

这几条是"必须这样做才生效"的，不是风格选择。

1. **脚本以 `defer` 引入，所以组件必须等待。** `nuxt.config.ts` 的 `app.head.script` 中配置 `{ src: '/liquid-glass.js', defer: true }`，脚本执行时机与组件挂载顺序不保证。组件 `onMounted` 时先检查 `window.liquidGlass`，若还不是函数则以 100ms 间隔轮询，最多 50 次（约 5 秒）后放弃。
2. **必须等一帧再应用。** 通过 `requestAnimationFrame` 延后执行，确保元素已经完成布局；`applyGlass()` 还会检查 `offsetWidth`/`offsetHeight`，尺寸为 0 时直接跳过（在位移贴图里 0 尺寸是无意义的）。
3. **容器元素不能有创建合成层的祖先。** `backdrop-filter` 只能从当前合成层内部采样；祖先一旦成为独立合成层（`animation`、`transform`、`will-change`、`filter`、`isolation: isolate`、`contain: paint/layout`），采样到的就是空白内容，玻璃会表现为"完全透明"。**即使只是 opacity 动画也一样**——Chrome 会为任何活跃的 animation 提升合成层，且动画结束后可能仍然保留。
4. **不要手写 `backdrop-filter`。** 库会自行写入 `url(#id) blur() saturate()`；全局样式里再叠一层会冲突（`app/assets/design-system.css` 明确不再为 `.glass-card` 设置全局 `backdrop-filter`）。
5. **背景层本身不能有 `transform`/`will-change`/`filter`。** `app/layouts/default.vue` 的 `.ambient-background` 保持 `position: fixed; inset: 0`，只让子元素（光斑）做动画。
6. **组件销毁要清干净。** `onBeforeUnmount` 依次清理轮询定时器、`requestAnimationFrame` 与 `glassInstance.destroy()`；库的 `destroy()` 会断开 `ResizeObserver`、移除 SVG 滤镜节点并清空 `backdrop-filter` 内联样式。不做这一步会在路由切换后残留滤镜定义。
7. **尺寸变化由库自己处理。** 库内部用 `ResizeObserver` 监听元素，120ms 防抖后重新生成贴图；位置动画不需要新贴图，只有尺寸变化才需要。

## 已知限制 / 避坑

| 限制 | 说明与应对 |
|------|-----------|
| 浏览器支持 | 仅 Chromium 内核（Chrome、Edge、Arc、Brave）有真实折射。脚本对 Safari/Firefox 直接返回 `supported: false`，改用 `blur(fallbackBlur) saturate(...)` 的磨砂降级，并加上 `lg-fallback` 类。检测还包含 `CSS.supports('backdrop-filter', 'url(#lg)')` 与 Canvas `getImageData` 可用性（被阻止时同样降级）。 |
| 合成层隔离 | 最常见的失效原因。见"实现要点"第 3 条。 |
| 入场动画 | `backdrop-filter` 元素与带动画的祖先不兼容。可选：移除容器动画（本项目采用，`.features-grid`/`.cta-group` 直接 `animation: none; opacity: 1`）、动画结束后用 JS 移除 `animation`、或把玻璃元素移出动画容器。 |
| 不承载语义 | 折射只是视觉增强，不要用它表达信息状态。 |
| 可读性 | 背景较花时提高 `blur`、加大 `border`，或降低 `scale`/`chroma`；不要改用不透明背景。 |
| 性能 | 贴图生成是 O(w×h)；滤镜每帧在 GPU 上运行。适合卡片、导航栏、按钮，避免单个元素任一边超过约 800px。 |
| `getComputedStyle` 不可信 | `getComputedStyle(el).backdropFilter` 有正确值 ≠ 实际渲染出效果，采样不到内容时它依然返回合法值，不能作为判断依据。 |

## 排查清单

| 现象 | 可能原因 | 处理 |
|------|----------|------|
| 卡片完全透明、背景线条笔直穿过 | 祖先存在合成层触发器 | 沿祖先链检查 `transform` / `will-change` / `animation-name` / `filter` / `isolation`，逐个移除；重点看入场动画容器 |
| 页面所有玻璃元素都无效果 | 脚本未加载，或 `window.liquidGlass` 不是函数 | 控制台执行 `typeof window.liquidGlass`，应为 `function`；检查 `nuxt.config.ts` 的 head.script |
| 效果时有时无、刷新才出现 | 组件挂载早于 defer 脚本 | 组件已内建轮询；若自定义调用，需自行等待脚本就绪 |
| 元素有滤镜但看不出折射 | 尺寸为 0（未布局、被折叠） | 确认 `offsetWidth`/`offsetHeight` 非 0 |
| 折射被"糊掉"或颜色发闷 | 背景不透明，或重复写了 `backdrop-filter` | 改用 0.18～0.38 的 `rgba` 轻微色调，移除手写 `backdrop-filter` |
| Safari/Firefox 完全没有折射 | 预期行为 | 只会得到磨砂模糊，属正常降级 |
| 路由切换后玻璃失效或样式残留 | 组件销毁未清理 | 确认使用 `LiquidGlass` 组件而非手动调用，让 `onBeforeUnmount` 生效 |

快速隔离测试：在控制台创建一个 `position: fixed` 的测试元素并加上 `backdrop-filter: url(#lg-filter-1) blur(2px)`。如果它有折射而同页面的卡片没有，就可以确认是祖先合成层问题，而不是滤镜或脚本问题。

## 参考

- [liquid-glass](https://github.com/deepika-builds/liquid-glass) — Apple-style liquid glass for the web
- [Aave: Building glass for the web](https://aave.com/design/building-glass-for-the-web)
- [rizroze/liquid-glass](https://github.com/rizroze/liquid-glass)
- [CSS Compositing and Blending Level 1](https://www.w3.org/TR/compositing-1/)
