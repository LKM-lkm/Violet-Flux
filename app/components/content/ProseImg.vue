<template>
  <div class="prose-img-wrapper">
    <div v-if="imageError" class="image-error" role="status">
      <span>图片加载失败</span>
      <button type="button" @click="retryImage">重试</button>
      <a :href="resolvedSrc" target="_blank" rel="noreferrer">打开原图</a>
    </div>
    <img
      v-else
      :src="resolvedSrc"
      :alt="alt"
      :title="title"
      class="prose-img"
      loading="lazy"
      decoding="async"
      @load="imageError = false"
      @error="imageError = true"
      @click="toggleExpand"
    />
    <!-- 只在 alt 不是文件名时显示说明 -->
    <span v-if="alt && !isFileName(alt)" class="image-caption">{{ alt }}</span>

    <!-- 放大查看详情 -->
    <Teleport to="body">
      <Transition name="lightbox-fade">
        <div v-if="isExpanded" class="lightbox-overlay" @click="toggleExpand">
          <div class="lightbox-container" @click.stop>
            <LiquidGlass class="lightbox-glass" preset="lightbox">
              <div class="lightbox-content-wrapper">
                <img :src="resolvedSrc" :alt="alt" class="lightbox-img" />
                <div v-if="alt && !isFileName(alt)" class="lightbox-caption">
                  {{ alt }}
                </div>
              </div>
            </LiquidGlass>
            <LiquidGlass
              as="button"
              type="button"
              class="lightbox-close"
              aria-label="关闭"
              preset="iconButton"
              @click="toggleExpand"
            >
              <Icon name="lucide:x" />
            </LiquidGlass>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { useScrollLock, useEventListener } from '@vueuse/core'
const props = defineProps({
  src: {
    type: String,
    default: ''
  },
  alt: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  }
})

const route = useRoute()
const articleAssetDirectory = inject('articleAssetDirectory', null)
const isExpanded = ref(false)
const imageError = ref(false)

// 响应式锁定滚动
const isLocked = useScrollLock(import.meta.client ? document.body : null)

const toggleExpand = () => {
  if (imageError.value) return
  isExpanded.value = !isExpanded.value
  isLocked.value = isExpanded.value
}

const retryImage = () => {
  imageError.value = false
  const image = new Image()
  image.onload = () => {
    imageError.value = false
  }
  image.onerror = () => {
    imageError.value = true
  }
  image.src = resolvedSrc.value
}

// 监听 ESC 键关闭
if (import.meta.client) {
  useEventListener(window, 'keydown', (e) => {
    if (e.key === 'Escape' && isExpanded.value) {
      toggleExpand()
    }
  })
}

// 检查 alt 是否看起来像文件名
const isFileName = (text) => {
  if (!text) return false
  // 如果包含文件扩展名或者是 "Pasted image" 开头，认为是文件名
  return /\.(png|jpg|jpeg|gif|svg|webp)$/i.test(text) || 
         /^Pasted image \d+$/i.test(text)
}

const resolvedSrc = computed(() => {
  if (!props.src) return ''
  
  // If it's already an absolute URL or a direct root path, leave it be
  if (props.src.startsWith('http') || props.src.startsWith('data:')) {
    return props.src
  }
  
  // If it starts with /, it's already a root path
  if (props.src.startsWith('/')) {
    return props.src
  }

  const sourceDirectory = unref(articleAssetDirectory)
  let baseSegments

  if (sourceDirectory) {
    baseSegments = sourceDirectory.split('/').filter(Boolean)
  } else {
    const currentPath = route.path || ''
    const cleanRoutePath = decodeURIComponent(currentPath.replace(/\/$/, ''))
    baseSegments = cleanRoutePath.split('/').filter(Boolean).filter(s => s !== 'blog' && s !== 'content')
    if (baseSegments.length > 0) baseSegments.pop()
  }
  
  // Clean up the src - decode first to handle %20 etc
  let cleanSrc = props.src.replace(/^\.\//, '')
  // Decode if it's already encoded
  try {
    cleanSrc = decodeURIComponent(cleanSrc)
  } catch (e) {
    // If decode fails, use as is
  }
  
  // WIKILINK FIX: If it's just a filename (no slash), assume it's in an 'assets' folder
  if (!cleanSrc.includes('/') && !cleanSrc.startsWith('assets/')) {
    cleanSrc = `assets/${cleanSrc}`
  }
  
  // Join segments for the final path - use public directory path
  // Use a more robust segment encoding approach
  const pathParts = baseSegments.length > 0 
    ? ['_blog_assets', ...baseSegments, cleanSrc]
    : ['_blog_assets', cleanSrc]
  
  // Create final path by joining and then encoding each segment specifically
  // This avoids double encoding while ensuring non-ASCII characters and spaces are handled
  const fullPath = '/' + pathParts
    .filter(Boolean)
    .join('/')
    .replace(/\/+/g, '/')
    .split('/')
    .filter(Boolean)
    .map(segment => {
      // Use NFC normalization to handle Unicode consistently (essential for macOS/Windows/Linux compatibility)
      try {
        const normalized = decodeURIComponent(segment).normalize('NFC')
        return encodeURIComponent(normalized)
      } catch (e) {
        return encodeURIComponent(segment.normalize('NFC'))
      }
    })
    .join('/')
  
  // Debug log - always log in development
  if (import.meta.dev) {
    console.log('ProseImg V3 Debug:', {
      original: props.src,
      fullPath: fullPath,
      segments: pathParts
    })
  }
  
  return fullPath
})
</script>

<style scoped>
.prose-img-wrapper {
  margin: 3.5rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.prose-img {
  max-width: 100%;
  height: auto;
  border-radius: 1.5rem;
  box-shadow: 0 25px 50px -12px var(--shadow-lg);
  border: 1px solid var(--border-light);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: zoom-in;
}

.prose-img:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 35px 60px -12px var(--shadow-xl);
}

.image-caption {
  margin-top: 1.5rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
  letter-spacing: 0.02em;
  text-align: center;
  opacity: 0.8;
}

.image-error {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: min(100%, 36rem);
  padding: 1rem;
  color: var(--text-secondary);
  background: var(--glass-bg);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
}

.image-error button,
.image-error a {
  color: var(--primary);
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 0.2em;
}

/* Lightbox Styles */
.lightbox-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(22, 16, 24, 0.72);
  backdrop-filter: blur(10px) saturate(125%);
  -webkit-backdrop-filter: blur(10px) saturate(125%);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: zoom-out;
  padding: 2rem;
  overflow: auto;
}

.lightbox-container {
  width: min(94vw, 1280px);
  max-height: 92vh;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.lightbox-glass {
  width: 100%;
  max-height: 92vh;
  border-radius: var(--radius-xl);
  overflow: hidden;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.32), rgba(235, 222, 250, 0.12));
  border: 1px solid rgba(255, 255, 255, 0.38);
  box-shadow:
    var(--shadow-2xl),
    inset 0 1px 0 rgba(255, 255, 255, 0.48),
    inset 0 -1px 0 rgba(145, 99, 192, 0.14);
}

:root.dark .lightbox-glass {
  background: linear-gradient(145deg, rgba(48, 36, 61, 0.64), rgba(25, 19, 34, 0.42));
  border-color: rgba(224, 204, 245, 0.18);
  box-shadow:
    var(--shadow-2xl),
    inset 0 1px 0 rgba(255, 255, 255, 0.14),
    inset 0 -1px 0 rgba(180, 151, 215, 0.1);
}

.lightbox-content-wrapper {
  padding: clamp(0.5rem, 1.4vw, 1.25rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  width: 100%;
  max-height: 92vh;
  overflow: auto;
}

.lightbox-img {
  max-width: 100%;
  max-height: calc(92vh - 4rem);
  object-fit: contain;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.lightbox-caption {
  margin-top: 1.5rem;
  color: var(--text-primary);
  font-size: 1rem;
  font-weight: 500;
  text-align: center;
  padding: 0 1rem;
}

:root.dark .lightbox-caption {
  color: #d8d0e0;
}

.lightbox-close {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  /* 只做 material dressing：淡紫渐变让背景透出来，LiquidGlass 注入的
     url(#...) SVG 折射才看得见。不要用 var(--glass-bg) 实色底，也别手写
     backdrop-filter —— 两者都会盖住引擎滤镜，退回旧毛玻璃。 */
  background: linear-gradient(180deg,
    rgba(180, 151, 215, 0.10) 0%,
    rgba(160, 130, 200, 0.18) 100%);
  border: 1px solid rgba(255, 255, 255, 0.28);
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  /* 只过渡颜色与阴影：transition all 会把 transform 一起动画，触发合成层
     阻断玻璃采样背景。旋转交给下面的图标做。 */
  transition: background 0.3s ease, box-shadow 0.3s ease, color 0.3s ease;
  z-index: 10;
  box-shadow: var(--shadow-lg),
    inset 0 1px 0 rgba(255, 255, 255, 0.28),
    inset 0 0 0 1px rgba(255, 255, 255, 0.12);
}

:root.dark .lightbox-close {
  background: linear-gradient(180deg,
    rgba(168, 144, 192, 0.12) 0%,
    rgba(120, 90, 160, 0.2) 100%);
  border-color: rgba(224, 204, 245, 0.18);
  box-shadow: var(--shadow-lg),
    inset 0 1px 0 rgba(255, 255, 255, 0.12),
    inset 0 0 0 1px rgba(255, 255, 255, 0.06);
}

.lightbox-close:hover {
  background: linear-gradient(180deg,
    rgba(180, 151, 215, 0.2) 0%,
    rgba(180, 151, 215, 0.3) 100%);
  box-shadow: var(--shadow-xl),
    inset 0 1px 0 rgba(255, 255, 255, 0.4),
    inset 0 0 0 1px rgba(255, 255, 255, 0.2);
}

/* 旋转放到图标上，按钮本体不 transform，避免合成层阻断折射采样 */
.lightbox-close :deep(svg) {
  transition: transform 0.3s ease;
}

.lightbox-close:hover :deep(svg) {
  transform: rotate(90deg) scale(1.05);
}

/* Animations */
.lightbox-fade-enter-active,
.lightbox-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.lightbox-fade-enter-from,
.lightbox-fade-leave-to {
  opacity: 0;
}

.lightbox-fade-enter-active .lightbox-glass {
  animation: zoom-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.lightbox-fade-leave-active .lightbox-glass {
  animation: zoom-out 0.3s cubic-bezier(0.4, 0, 1, 1);
}

@keyframes zoom-in {
  from { transform: scale(0.9) translateY(20px); opacity: 0; }
  to { transform: scale(1) translateY(0); opacity: 1; }
}

@keyframes zoom-out {
  from { transform: scale(1); opacity: 1; }
  to { transform: scale(0.95); opacity: 0; }
}

@media (max-width: 640px) {
  .lightbox-overlay {
    padding: 0.75rem;
  }

  .lightbox-container,
  .lightbox-glass,
  .lightbox-content-wrapper {
    max-width: 100%;
  }

  .lightbox-content-wrapper {
    padding: 0.65rem;
  }

  .lightbox-close {
    top: 0.45rem;
    right: 0.45rem;
  }
}

/* Dark mode adjustment for excessive brightness */
:root.dark .prose-img {
  opacity: 0.95;
  filter: brightness(0.9) contrast(1.05);
}

:root.dark .prose-img:hover {
  filter: brightness(1) contrast(1);
  opacity: 1;
}
</style>
