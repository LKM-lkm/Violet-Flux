<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

interface Props {
  as?: string;
  scale?: number;
  chroma?: number;
  border?: number;
  mapBlur?: number;
  blur?: number;
  saturate?: number;
  radius?: number | null;
  fallbackBlur?: number;
}

const props = withDefaults(defineProps<Props>(), {
  as: 'div',
  scale: -112,
  chroma: 6,
  border: 0.07,
  mapBlur: 12,
  blur: 3,
  saturate: 1.5,
  radius: null,
  fallbackBlur: 16,
});

const containerRef = ref<HTMLElement | null>(null);
let glassInstance: { supported: boolean; refresh: () => void; destroy: () => void } | null = null;
let pollTimer: ReturnType<typeof setInterval> | null = null;
let rafId: number | null = null;

/**
 * 原版库 Framework usage:
 *   useEffect(() => {
 *     const glass = liquidGlass(ref.current);
 *     return () => glass.destroy();
 *   }, []);
 *
 * 关键改进：等待脚本加载 + rAF 确保布局已渲染
 */
onMounted(() => {
  if (typeof window !== 'undefined' && typeof (window as any).liquidGlass === 'function') {
    scheduleApply();
  } else {
    // defer 脚本可能尚未执行，轮询等待
    let attempts = 0;
    pollTimer = setInterval(() => {
      attempts++;
      if (typeof (window as any).liquidGlass === 'function') {
        clearInterval(pollTimer!);
        pollTimer = null;
        scheduleApply();
      } else if (attempts >= 50) {
        clearInterval(pollTimer!);
        pollTimer = null;
      }
    }, 100);
  }
});

/** 等待下一帧渲染完成后再应用，确保元素已有布局尺寸 */
function scheduleApply() {
  rafId = requestAnimationFrame(() => {
    rafId = null;
    applyGlass();
  });
}

function applyGlass() {
  const el = containerRef.value;
  if (!el) return;
  // 确保元素有实际尺寸
  if (!el.offsetWidth || !el.offsetHeight) return;

  glassInstance = (window as any).liquidGlass(el, {
    scale: props.scale,
    chroma: props.chroma,
    border: props.border,
    mapBlur: props.mapBlur,
    blur: props.blur,
    saturate: props.saturate,
    fallbackBlur: props.fallbackBlur,
    ...(props.radius != null ? { radius: props.radius } : {}),
  });
}

onBeforeUnmount(() => {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  if (glassInstance) {
    glassInstance.destroy();
    glassInstance = null;
  }
});
</script>

<template>
  <component :is="as" ref="containerRef">
    <slot />
  </component>
</template>
