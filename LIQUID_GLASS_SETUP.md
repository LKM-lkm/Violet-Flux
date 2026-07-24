# Liquid Glass 液态玻璃效果设置指南

本项目已成功集成 [liquid-glass](https://github.com/deepika-builds/liquid-glass) 库，实现 Apple 风格的液态玻璃折射效果。

## 📁 文件结构

```
Violet Flux/
├── public/
│   └── liquid-glass.js              # 原始 liquid-glass 库（直接从 GitHub 获取）
├── app/
│   ├── components/
│   │   └── LiquidGlass.vue          # Vue 包装组件（可选）
│   ├── composables/
│   │   └── useLiquidGlass.ts        # Vue 组合式函数（可选）
│   ├── types/
│   │   └── liquid-glass.d.ts        # TypeScript 类型定义
│   └── pages/
│       └── index.vue                # 首页，应用液态玻璃效果的示例
└── nuxt.config.ts                   # 已配置加载 liquid-glass.js
```

## ✅ 已完成的配置

### 1. 脚本加载
在 `nuxt.config.ts` 中已添加 liquid-glass.js：

```typescript
app: {
  head: {
    script: [
      {
        src: '/liquid-glass.js',
        type: 'text/javascript'
      },
      // ... MathJax 配置
    ]
  }
}
```

### 2. 首页应用效果
在 `app/pages/index.vue` 中，液态玻璃效果已应用到：
- ✅ 3 张特色卡片（.glass-card）
- ✅ 2 个 CTA 按钮（.premium-btn-primary 和 .premium-btn-secondary）

## 🎨 CSS 样式要求

根据 liquid-glass 库的要求，玻璃元素必须使用**轻微色调背景**而非不透明背景：

### ✅ 正确的 CSS 样式

```css
.glass-card {
  border-radius: 28px;
  
  /* 轻微色调 - 为文本提供对比度，不阻挡折射效果 */
  background: linear-gradient(180deg, 
    rgba(14, 14, 22, 0.18), 
    rgba(14, 14, 22, 0.32)
  );
  
  /* Apple 风格的玻璃阴影 */
  box-shadow: 
    0 24px 60px rgba(0, 0, 0, 0.45),           /* 投影 */
    inset 0 1px 1px rgba(255, 255, 255, 0.5),  /* 顶部高光 */
    inset 0 -8px 20px rgba(255, 255, 255, 0.06),
    inset 0 0 0 1px rgba(255, 255, 255, 0.13); /* 1px 玻璃边框 */
}
```

### ❌ 错误的样式（会阻挡液态玻璃效果）

```css
/* ❌ 不要使用不透明背景 */
background: rgba(255, 255, 255, 0.6);
background-color: var(--primary);

/* ❌ 不要手动添加 backdrop-filter（库会自动添加）*/
backdrop-filter: blur(24px);
```

## 🔧 使用方式

### 方式 1：直接在 Vue 组件中使用（推荐）

```vue
<script setup>
import { ref, onMounted } from 'vue'

const myCard = ref<HTMLElement>()

onMounted(() => {
  if (window.liquidGlass && myCard.value) {
    window.liquidGlass(myCard.value, {
      scale: -120,    // 折射强度：-60（微妙）到 -180（强烈）
      chroma: 6,      // 色差效果（棱镜边缘）
      blur: 4,        // 背景模糊
      saturate: 1.5   // 饱和度增强
    })
  }
})
</script>

<template>
  <div ref="myCard" class="glass">
    你的内容
  </div>
</template>

<style scoped>
.glass {
  border-radius: 28px;
  background: linear-gradient(180deg, 
    rgba(14, 14, 22, 0.18), 
    rgba(14, 14, 22, 0.32)
  );
  box-shadow: 
    0 24px 60px rgba(0, 0, 0, 0.45),
    inset 0 1px 1px rgba(255, 255, 255, 0.5),
    inset 0 -8px 20px rgba(255, 255, 255, 0.06),
    inset 0 0 0 1px rgba(255, 255, 255, 0.13);
}
</style>
```

### 方式 2：使用 Vue 组合式函数

```vue
<script setup>
import { ref } from 'vue'
import { useLiquidGlass } from '~/composables/useLiquidGlass'

const myCard = ref<HTMLElement>()
const glass = useLiquidGlass(myCard, { scale: -120, blur: 4 })
</script>

<template>
  <div ref="myCard" class="glass">
    你的内容
  </div>
</template>
```

### 方式 3：使用 LiquidGlass 组件

```vue
<template>
  <LiquidGlass :scale="-120" :blur="4" as="div">
    <div class="glass-content">
      你的内容
    </div>
  </LiquidGlass>
</template>
```

## ⚙️ 配置选项

| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `scale` | number | -112 | 折射强度（负数 = 放大凸起）。范围：-60（微妙）到 -180（强烈） |
| `chroma` | number | 6 | 每通道缩放错位（棱镜边缘）。设为 0 禁用色差效果 |
| `border` | number | 0.07 | 中性内部插图，占较小边的比例 |
| `mapBlur` | number | 12 | 边缘曲率柔和度（px）。小 = 硬边，大 = 圆顶 |
| `blur` | number | 3 | 玻璃内部的背景模糊（px）。繁忙背景时提高此值 |
| `saturate` | number | 1.5 | 背景饱和度增强 |
| `radius` | number | null | 圆角半径覆盖（px）。默认读取 border-radius |
| `fallbackBlur` | number | 16 | Safari/Firefox 的磨砂模糊后备（px） |

## 🌐 浏览器支持

### ✅ 完整支持（真实折射效果）
- Chrome/Chromium
- Edge
- Arc
- Brave

### ⚠️ 降级支持（磨砂模糊后备）
- Safari（自动应用磨砂模糊）
- Firefox（自动应用磨砂模糊）

**重要提示**：液态玻璃效果永远不应该承载语义信息，仅作为视觉增强。

## 💡 最佳实践

### 1. 保持内部内容可读
如果背后的内容模糊，可以：
- 降低 `scale`/`chroma`
- 提高 `blur`
- 增加 `border`
- **不要使用不透明背景**（会破坏材质效果）

### 2. 性能考虑
- 贴图生成是 O(w×h) 复杂度
- 滤镜在 GPU 上每帧运行
- 适用于卡片、导航栏、按钮
- 避免超过 ~800px 每边的元素
- 仅位置动画不需要新贴图 — 只有尺寸变化才需要

### 3. 紫色主题适配
对于紫色按钮，增加透明度以显示液态玻璃效果：

```css
.purple-button {
  background: linear-gradient(180deg, 
    rgba(145, 99, 192, 0.25),  /* 紫色 + 透明度 */
    rgba(122, 75, 163, 0.35)
  );
  /* ... 其他玻璃样式 */
}
```

## 🔍 调试技巧

如果液态玻璃效果不显示：

1. **检查脚本加载**
   ```js
   console.log(window.liquidGlass) // 应该是一个函数
   ```

2. **检查浏览器支持**
   ```js
   const glass = liquidGlass(el)
   console.log(glass.supported) // Chromium 为 true，Safari/Firefox 为 false
   ```

3. **检查 CSS 背景**
   - 确保使用轻微色调（rgba 值在 0.18-0.38 之间）
   - 确保没有不透明的背景色

4. **检查元素尺寸**
   ```js
   console.log(el.offsetWidth, el.offsetHeight) // 必须有实际尺寸
   ```

5. **手动刷新**
   ```js
   glass.refresh() // 在尺寸变化后手动刷新
   ```

## 📚 参考资源

- [liquid-glass GitHub 仓库](https://github.com/deepika-builds/liquid-glass)
- [Aave: Building glass for the web](https://aave.com/design/building-glass-for-the-web)
- [原始 rizroze/liquid-glass](https://github.com/rizroze/liquid-glass)

## 🎉 已实现的效果

### ✅ 首页（app/pages/index.vue）
1. **三张特色卡片** - 完整液态玻璃效果
2. **两个 CTA 按钮** - 微妙液态玻璃效果

所有元素都使用正确的 CSS 样式（轻微色调 + 玻璃阴影），在 Chrome/Edge 浏览器中可以看到真实的边缘折射效果！
