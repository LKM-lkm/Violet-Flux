<template>
  <div class="prose-img-wrapper">
    <img 
      :src="resolvedSrc" 
      :alt="alt" 
      :title="title" 
      class="prose-img"
      loading="lazy"
      @click="toggleExpand"
    />
    <!-- 只在 alt 不是文件名时显示说明 -->
    <span v-if="alt && !isFileName(alt)" class="image-caption">{{ alt }}</span>

    <!-- 放大查看详情 -->
    <Teleport to="body">
      <Transition name="lightbox-fade">
        <div v-if="isExpanded" class="lightbox-overlay" @click="toggleExpand">
          <div class="lightbox-container" @click.stop>
            <div class="lightbox-content-wrapper glass-card">
              <img :src="resolvedSrc" :alt="alt" class="lightbox-img" />
              <div v-if="alt && !isFileName(alt)" class="lightbox-caption">
                {{ alt }}
              </div>
              <button class="lightbox-close" @click="toggleExpand" aria-label="关闭">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
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
const isExpanded = ref(false)

// 响应式锁定滚动
const isLocked = useScrollLock(import.meta.client ? document.body : null)

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
  isLocked.value = isExpanded.value
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

  // Handle Obsidian-style WikiLink images (just a filename, or starts with assets/)
  // We resolve them relative to the current blog post directory
  const currentPath = route.path || ''
  const cleanRoutePath = decodeURIComponent(currentPath.replace(/\/$/, ''))
  const segments = cleanRoutePath.split('/').filter(Boolean)
  
  // Remove ALL occurrences of 'blog' and 'content' to handle malformed routes
  const baseSegments = segments.filter(s => s !== 'blog' && s !== 'content')
  
  // Remove the last segment (the slug/filename of the post) to get the directory
  if (baseSegments.length > 0) {
    baseSegments.pop()
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

/* Lightbox Styles */
.lightbox-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(10, 5, 15, 0.85);
  backdrop-filter: blur(12px) saturate(160%);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: zoom-out;
  padding: 2rem;
}

.lightbox-container {
  max-width: 90vw;
  max-height: 90vh;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.lightbox-content-wrapper {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 2rem;
  overflow: hidden;
  position: relative;
  background: var(--glass-bg);
}

.lightbox-img {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 1rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

.lightbox-caption {
  margin-top: 1.5rem;
  color: var(--text-primary);
  font-size: 1rem;
  font-weight: 500;
  text-align: center;
  padding: 0 1rem;
}

.lightbox-close {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
}

.lightbox-close:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
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

.lightbox-fade-enter-active .lightbox-content-wrapper {
  animation: zoom-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.lightbox-fade-leave-active .lightbox-content-wrapper {
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
