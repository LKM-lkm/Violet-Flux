import type { LiquidGlassOptions } from '../lib/vendor/liunian-liquid-glass'

// 刘念原版 Mixed UI / Player demo 的基础玻璃参数。
// 这里只保留原版基线；不同组件通过下方 preset 做少量、可读的局部调整。
export const LIQUID_GLASS_DEFAULTS: Partial<LiquidGlassOptions> = {
  // 背景磨砂模糊，原版搜索框与播放器均使用 1 px。
  blur: 1,
  // 模拟玻璃介质厚度；原版播放器使用 90 px，数值越大边缘折射越明显。
  thickness: 90,
  // 四角倒角参与折射的边带宽度；原版播放器使用 29 px。
  edgeWidth: 29,
  // 折射率。普通玻璃约为 1.52，原版 Mixed UI 常用 1.3 的夸张玻璃值。
  ior: 1.3,
  // 位移图强度倍率，1 为原版物理计算值，不再额外放大。
  displacementScale: 1,
  // 原版边缘高光透明度，0 为关闭高光，1 为完全可见。
  specularOpacity: 0.4,
  // 高光区域的饱和度，原版 Mixed UI 基线为 6，范围约 0～50。
  specularSaturation: 6,
  // 是否饱和折射后的背景；原版管线以较自然的 1 值保持原色。
  backdropSaturation: 1,
  // 高光锐度；数值越大高光越集中。当前映射保持原版清晰度。
  specularHardness: 2,
  // Safari、Firefox 等不支持 SVG backdrop-filter 时的普通磨砂模糊。
  fallbackBlur: 16,
}

export const LIQUID_GLASS_PRESETS = {
  // 完全继承 LIQUID_GLASS_DEFAULTS。
  default: {},

  // 大卡片与文章卡片：沿用原版 90 px 厚度、29 px 倒角和 1.3 折射率。
  // 只降低高光，不减少折射位移，因此正文和网格背景仍能通过边缘折射显示。
  card: { blur: 1, thickness: 90, edgeWidth: 29, ior: 1.3, displacementScale: 1, specularOpacity: 0.36, specularSaturation: 6 },

  // 大面板：与文章卡片相近，略弱高光以适合信息密度较高的内容区。
  panel: { blur: 1, thickness: 90, edgeWidth: 29, ior: 1.3, displacementScale: 1, specularOpacity: 0.3, specularSaturation: 6 },

  // 侧栏和目录等小面积面板：保留原版折射强度，只收弱高光。
  subtle: { blur: 1, thickness: 90, edgeWidth: 29, ior: 1.3, displacementScale: 1, specularOpacity: 0.24, specularSaturation: 6 },

  // 下拉菜单：按原版搜索框的厚倒角比例调整，但仍使用相同折射率。
  menu: { blur: 1, thickness: 100, edgeWidth: 18, ior: 1.3, displacementScale: 1, specularOpacity: 0.38, specularSaturation: 6 },

  //胶囊按钮：不再放大位移；恢复和原版播放器一致的物理基线。
  button: { blur: 1, thickness: 90, edgeWidth: 29, ior: 1.3, displacementScale: 1, specularOpacity: 0.36, specularSaturation: 6 },

  // AI 摘要：大面板折射参数，略低高光避免干扰文字。
  summary: { blur: 1, thickness: 90, edgeWidth: 29, ior: 1.3, displacementScale: 1, specularOpacity: 0.34, specularSaturation: 6 },

  // 图片灯箱：稍厚的玻璃和较强高光，用于突出遮罩上的中央图像。
  lightbox: { blur: 1, thickness: 100, edgeWidth: 29, ior: 1.3, displacementScale: 1, specularOpacity: 0.46, specularSaturation: 6, specularHardness: 2.4 },

  // 灯箱关闭按钮这类小圆形图标按钮：直径约 44px、圆角 50%。
  // 通用 button 预设的 edgeWidth=29 会被引擎 clamp 到半径 22，整颗按钮全是边缘带，
  // 没有平坦中心，加上浮在均匀的深色遮罩上（没有可折射的背景），看起来就扁平。
  // 这里收窄边缘带腾出平坦中心，并把白色高光环加亮加锐 —— 在深色背景上，
  // 高光是小按钮唯一撑得起立体玻璃感的部分。
  iconButton: { blur: 1, thickness: 90, edgeWidth: 9, ior: 1.3, displacementScale: 1, specularOpacity: 0.75, specularSaturation: 6, specularHardness: 2.6 },
} satisfies Record<string, Partial<LiquidGlassOptions>>

export type LiquidGlassPreset = keyof typeof LIQUID_GLASS_PRESETS
