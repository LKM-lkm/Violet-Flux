---
title: 液态玻璃 Liquid Glass
description: Violet Flux 液态玻璃的实现原理、组件用法、集中式预设、浏览器差异与排查清单
tags: [文档, 视觉效果]
---

# 液态玻璃 Liquid Glass

液态玻璃是一种 Apple 风格的界面材质：元素背后的内容被真实地**折射、位移并带上边缘高光**，而不是简单糊一层毛玻璃。Violet Flux 的实现分三层，日常使用只接触前两层：

| 层 | 文件 | 职责 |
| --- | --- | --- |
| 组件 | `app/components/LiquidGlass.vue` | Vue 封装：自动导入、生命周期、尺寸观察、卸载清理 |
| 配置 | `app/config/liquid-glass.ts` | 集中参数与语义化预设 |
| 引擎 | `app/lib/vendor/liunian-liquid-glass.ts` | LiuNian 算法：烘焙折射图、构造 SVG 滤镜、浏览器回退 |

核心算法来自 LiuNian 的 LiquidGlass 实现（MIT），原项目许可证随源码保存在 `app/lib/vendor/LICENSE.liunian-filter-demo`。它与早年文档里提到的 `public/liquid-glass.js` 是同一套算法的不同封装：旧版是全局脚本 + 页面手动传参，现在已收拢为组件 + 配置化预设，不再需要在页面里逐个调参。

## 组件用法

`LiquidGlass` 由 Nuxt 自动导入，无需 `import`。内容走默认插槽，样式类写在组件上：

```vue
<LiquidGlass v-spotlight as="article" class="glass-card" preset="card">
  <h2>标题</h2>
  <p>内容</p>
</LiquidGlass>
```

组件只有两个 prop：

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `as` | `string` | `'div'` | 渲染的标签名，需要语义化时用 `aside`、`article`、`nav` 等 |
| `preset` | `LiquidGlassPreset` | `'default'` | 光学预设，决定折射与高光参数 |

`v-spotlight` 是与玻璃**独立**的鼠标跟随高光指令（见 `app/plugins/spotlight.ts`），负责 `::after` 那层随光标移动的亮斑，两者可以同时使用，别混为一谈。

组件在挂载后用 `ResizeObserver` 观察尺寸，等元素有非零宽高才通过 `requestAnimationFrame` 初始化引擎；切换 `preset` 会销毁旧实例再重建；卸载时移除滤镜和观察器。所以把它用在 `v-if` 或条件列表里是安全的。

## 集中调整参数

所有参数集中在 `app/config/liquid-glass.ts`：

- `LIQUID_GLASS_DEFAULTS`：全站共用的基础光学参数。
- `LIQUID_GLASS_PRESETS`：按用途划分的预设。

```ts
// 改全站基础折射
LIQUID_GLASS_DEFAULTS.thickness = 100

// 只改某一类组件
LIQUID_GLASS_PRESETS.menu = { /* ... */ }
```

可选预设共 8 个：`default`、`card`、`panel`、`subtle`、`menu`、`button`、`summary`、`lightbox`。站点里的对应关系：

| 预设 | 用在哪里 |
| --- | --- |
| `card` | 首页特性卡、关于页卡片、文章卡片 |
| `panel` | 博客正文标题区 |
| `subtle` | 目录侧栏、筛选面板 |
| `menu` | 移动端展开菜单 |
| `summary` | AI 摘要面板 |
| `lightbox` | 图片灯箱遮罩 |
| `button` | 胶囊按钮（当前 preset 保留定义，页面尚未直接使用） |

各预设共用同一条物理基线，只在厚度、高光强度等少量参数上做局部微调，因此不会出现"每块玻璃观感都不一样"的情况。当前基线对齐原版 Mixed UI demo：

```
blur = 1        thickness = 90     edgeWidth = 29     ior = 1.3
displacementScale = 1   specularOpacity = 0.4   specularSaturation = 6
backdropSaturation = 1  specularHardness = 2    fallbackBlur = 16
```

主要光学参数：

| 参数 | 效果 |
| --- | --- |
| `thickness` | 模拟玻璃厚度，越大折射位移越强 |
| `edgeWidth` | 参与折射的圆角边缘倒角宽度 |
| `ior` | 折射率；物理玻璃约 `1.52`，项目用原版偏夸张的 `1.3` |
| `displacementScale` | 位移强度倍率，`1` 为算法计算值 |
| `blur` | 玻璃内部背景的磨砂程度（CSS px） |
| `specularOpacity` | 边缘高光强度，`0` 关闭高光 |
| `specularHardness` | 高光锐度，数值越大越集中 |
| `specularSaturation` | 边缘高光的饱和度 |
| `backdropSaturation` | 折射背景的饱和度倍率 |
| `fallbackBlur` | 不支持 SVG 滤镜时的降级模糊半径 |

引擎还支持 `radius`、`tintColor`、`magnifyingScale`、`specularAngle`、`dpr` 等选项，但组件没有把它们暴露成 prop；需要时用原生 `liquidGlass(el, options)` 调用。

## 折射是怎么算出来的

引擎按斯内尔定律（Snell's Law）计算凸角倒角上每一点的折射位移，再由 Canvas 烘焙成位图，交给 SVG 滤镜作用到元素背后的内容上：

```text
Canvas 逐像素烘焙：位移图 + 高光图
  → 转成 data URI
  → 注入共享 <svg><defs>，每个元素生成一个 <filter id="lg-N">
  → feDisplacementMap 按位移图扭曲 backdrop
  → 高光层做饱和度提升与混合
  → 元素样式 backdrop-filter: url(#lg-N)
```

几个实现要点：

- 位移图用红/绿通道分别编码 X/Y 位移，中间一块 50% 灰的内缩圆角矩形把折射限制在边缘带内，玻璃中央保持平坦，正文不会被扭曲。
- 折射曲线只取决于 `thickness` / `edgeWidth` / `ior`，与元素尺寸无关；尺寸变化时只重新烘焙位图。
- 所有滤镜共用一个 0×0 的 `<svg><defs>` 容器（不能用 `display:none`，会让 `feImage` 失效），每个元素一个独立 `filter`。
- 圆角不是单独传参，而是读取组件根元素计算后的 `border-top-left-radius`（支持 px 与百分比）。所以圆角要写在 `<LiquidGlass>` 的 CSS 上，且不要传入不一致的 `radius` 选项。
- 颜色、背景透明度、描边和阴影仍由组件自己的 CSS 负责；引擎只管折射滤镜。

::callout{icon="i-lucide-alert-triangle" color="warning"}
不要再给玻璃组件手写 `backdrop-filter`。CSS 里再写一次 `blur()` 会覆盖引擎注入的 `url(#lg-N)`，折射和高光就没了，只剩普通毛玻璃。移动菜单曾踩过这个坑：模板里虽然用了 `<LiquidGlass preset="menu">`，但 `.mobile-nav` 的 scoped 样式里留了一行 `backdrop-filter: blur(22px)`，结果一直是旧观感。背景色、描边、阴影可以写，滤镜交给引擎。
::

## 浏览器支持与降级

折射依赖 SVG 滤镜作用于 `backdrop-filter`，这不是所有浏览器都支持：

- **Chromium 内核**（Chrome、Edge 等）：支持 `backdrop-filter: url(#...)`，能看到完整的折射与边缘高光。
- **Safari、Firefox**：不支持这套滤镜，引擎退化为 `blur(fallbackBlur) saturate(backdropSaturation)` 的普通磨砂模糊；高光和折射不会出现。

支持性在模块加载时检测一次（UA + `CSS.supports('backdrop-filter', 'url(...)')` + Canvas 像素读取），运行结果通过实例的 `supported` 字段暴露。降级实例仍提供 `refresh()` / `destroy()` 等空实现，组件无需分支处理。

折射采样的背景来自真实页面，所以内容、布局和浏览器合成方式都会影响观感。颜色叠层要保持轻薄，不透明背景会直接盖住折射。

## 文件与维护

- `app/lib/vendor/liunian-liquid-glass.ts`：核心引擎，无框架依赖。
- `app/lib/vendor/LICENSE.liunian-filter-demo`：原项目 MIT 许可证。
- `app/components/LiquidGlass.vue`：Vue 生命周期、尺寸观察与浏览器回退封装。
- `app/config/liquid-glass.ts`：集中参数与语义化预设。

调整观感优先改配置里的预设，不要动 vendor 里的引擎源码；确实要更新引擎时保留原项目的 MIT 许可证声明，并回归检查 Chromium 折射与 Safari/Firefox 降级两条路径。

## 排查清单

::callout{icon="i-lucide-book-open" color="info"}
玻璃没出现或效果不对，按下面顺序查，多数情况在前三条就能定位。
::

1. **组件有没有包住内容**：`LiquidGlass` 是容器组件，内容要写在默认插槽里。
2. **CSS 有没有覆盖滤镜**：全局搜索 `backdrop-filter`，玻璃元素上只允许引擎注入的 `url(#...)`。
3. **元素有没有尺寸**：初始化需要非零 `offsetWidth` / `offsetHeight`；被 `display:none` 或零宽容器包住时组件会等 `ResizeObserver` 再试。
4. **预设是否用对**：检查 `preset` 拼写，8 个可选值见上文；切预设会重建实例。
5. **浏览器是否支持**：Safari/Firefox 必然是降级观感，这是设计如此，不是 bug。
6. **圆角是否设在根元素**：引擎读的是组件自身的 `border-top-left-radius`，设在内层元素上不会生效。

更多项目结构信息见 [项目指南](/blog/docs/project-guide)。
